import { render, screen, fireEvent, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it, vi } from 'vitest'
import DebtPayoffPage from './DebtPayoffPage'

function renderPage() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <DebtPayoffPage />
      </MemoryRouter>
    </HelmetProvider>,
  )
}

function typeDebt(index, values) {
  const name = screen.getByRole('textbox', { name: `Debt ${index} name` })
  const balance = screen.getByRole('spinbutton', { name: `Debt ${index} balance` })
  const apr = screen.getByRole('spinbutton', { name: `Debt ${index} interest rate` })
  const payment = screen.getByRole('spinbutton', { name: `Debt ${index} minimum payment` })
  if (values.name != null) fireEvent.change(name, { target: { value: values.name } })
  if (values.balance != null) fireEvent.change(balance, { target: { value: values.balance } })
  if (values.apr != null) fireEvent.change(apr, { target: { value: values.apr } })
  if (values.minPayment != null) fireEvent.change(payment, { target: { value: values.minPayment } })
}

describe('DebtPayoffPage', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    HelmetProvider.canUseDOM = true
  })

  it('starts empty, with a private-calculation note and no result', () => {
    renderPage()

    expect(screen.getByRole('heading', { level: 1, name: 'Debt payoff calculator' })).toBeInTheDocument()
    expect(screen.getByText(/Niagara households/i)).toBeInTheDocument()
    expect(screen.getByRole('status').textContent).toMatch(/no debts entered/i)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
    expect(screen.getByText(/not sent anywhere/i)).toBeInTheDocument()
    expect(screen.getByText(/not stored on our servers/i)).toBeInTheDocument()
    expect(screen.getByText(/not logged in analytics/i)).toBeInTheDocument()
    expect(screen.getByText(/not financial advice/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Credit Counselling Canada' })).toHaveAttribute('href', 'https://creditcounsellingcanada.ca/')
    expect(screen.getByText(/Darius T/)).toBeInTheDocument()
    expect(screen.getByRole('textbox', { name: /email address/i })).toBeInTheDocument()
    expect(document.body.textContent).not.toMatch(/adsense|affiliate|lender|consolidation loan/i)
  })

  it('explains blank, negative, zero-rate, and below-interest entries, then recovers', () => {
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))

    const alert = screen.getByRole('alert')
    expect(alert.textContent).toMatch(/balance/i)
    expect(alert.textContent).toMatch(/interest rate/i)
    expect(alert.textContent).toMatch(/minimum payment/i)
    expect(screen.queryByText(/no debts entered/i)).not.toBeInTheDocument()

    fireEvent.change(screen.getByRole('spinbutton', { name: 'Debt 1 balance' }), { target: { value: '-20' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Debt 1 interest rate' }), { target: { value: '-1' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Debt 1 minimum payment' }), { target: { value: '-5' } })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Extra monthly payment' }), { target: { value: '-10' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))
    expect(screen.getByRole('alert').textContent).toMatch(/cannot be negative/i)

    typeDebt(1, { name: 'Card', balance: '5000', apr: '0', minPayment: '80' })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Extra monthly payment' }), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))
    expect(screen.getByRole('alert').textContent).toMatch(/above 0%/i)

    typeDebt(1, { apr: '24', minPayment: '50' })
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))
    expect(screen.getByRole('alert').textContent).toMatch(/\$100\.00/)
    expect(screen.getByRole('alert').textContent).toMatch(/above/i)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()

    typeDebt(1, { minPayment: '120' })
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /snowball estimate/i })).toBeInTheDocument()
  })

  it('shows a snowball result with a chart and the same figures in a table', () => {
    const fetchMock = vi.fn()
    const gtag = vi.fn()
    vi.stubGlobal('fetch', fetchMock)
    vi.stubGlobal('gtag', gtag)
    renderPage()

    typeDebt(1, { name: 'Tiny', balance: '300', apr: '5', minPayment: '30' })
    fireEvent.click(screen.getByRole('button', { name: 'Add a debt' }))
    typeDebt(2, { name: 'Costly', balance: '2500', apr: '26', minPayment: '55' })
    fireEvent.click(screen.getByRole('button', { name: 'Add a debt' }))
    typeDebt(3, { name: 'Mid', balance: '1200', apr: '12', minPayment: '40' })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Extra monthly payment' }), { target: { value: '80' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))

    expect(screen.getByText(/37 months/)).toBeInTheDocument()
    expect(screen.getByText(/\$1,484\.03/)).toBeInTheDocument()
    const order = screen.getByRole('list', { name: /payoff order/i })
    expect(within(order).getAllByRole('listitem').map((item) => item.textContent).join(' ')).toMatch(/Tiny.*Mid.*Costly/)
    const chart = screen.getByRole('img', { name: /balance remaining/i })
    const table = document.getElementById(chart.getAttribute('aria-describedby'))
    expect(table).toHaveTextContent('$4,000.00')
    expect(table).toHaveTextContent('$0.00')
    expect(within(table).getByRole('columnheader', { name: /balance/i })).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(gtag).not.toHaveBeenCalled()
  })

  it('switches the order when avalanche is selected', () => {
    renderPage()
    typeDebt(1, { name: 'Tiny', balance: '300', apr: '5', minPayment: '30' })
    fireEvent.click(screen.getByRole('button', { name: 'Add a debt' }))
    typeDebt(2, { name: 'Costly', balance: '2500', apr: '26', minPayment: '55' })
    fireEvent.click(screen.getByRole('button', { name: 'Add a debt' }))
    typeDebt(3, { name: 'Mid', balance: '1200', apr: '12', minPayment: '40' })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Extra monthly payment' }), { target: { value: '80' } })
    fireEvent.click(screen.getByRole('radio', { name: /avalanche/i }))
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))

    expect(screen.getByText(/28 months/)).toBeInTheDocument()
    expect(screen.getByText(/\$952\.50/)).toBeInTheDocument()
    const order = screen.getByRole('list', { name: /payoff order/i })
    expect(within(order).getAllByRole('listitem').map((item) => item.textContent).join(' ')).toMatch(/Tiny.*Costly.*Mid/)
  })

  it('says when the payments never clear the balance', () => {
    renderPage()
    typeDebt(1, { name: 'Loan', balance: '100000', apr: '2', minPayment: '170' })
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Extra monthly payment' }), { target: { value: '0' } })
    fireEvent.click(screen.getByRole('button', { name: 'Calculate payoff' }))

    const status = screen.getByRole('status')
    expect(status.textContent).toMatch(/do not pay the debt off/i)
    expect(status.textContent).toMatch(/\$95,366\.40/)
    expect(screen.queryByText(/debt-free date/i)).not.toBeInTheDocument()
  })

  it('publishes a title, description, and canonical URL', () => {
    HelmetProvider.canUseDOM = false
    const context = {}
    renderToString(
      <HelmetProvider context={context}>
        <MemoryRouter>
          <DebtPayoffPage />
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(context.helmet.title.toString()).toContain('Debt payoff calculator | St. Catharines Digital')
    expect(context.helmet.meta.toString()).toContain('name="description"')
    expect(context.helmet.meta.toString()).toMatch(/Niagara households/)
    expect(context.helmet.link.toString()).toContain('href="https://stcatharinesdigital.ca/tools/debt-payoff/"')
  })
})
