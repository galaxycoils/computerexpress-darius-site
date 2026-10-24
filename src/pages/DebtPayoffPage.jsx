import { useId, useRef, useState } from 'react'
import Seo, { BASE_URL } from '../components/Seo'
import NewsletterPanel from '../components/news/NewsletterPanel'
import { calculatePayoff, formatMoney, validatePayoffInput } from '../tools/debtPayoff'
import './debt-payoff.css'

const STRATEGY_LABEL = {
  snowball: 'Snowball',
  avalanche: 'Avalanche',
}

function formatMonths(months) {
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (!years) return `${months} months`
  const yearsLabel = years === 1 ? '1 year' : `${years} years`
  if (!rest) return `${months} months (${yearsLabel})`
  const restLabel = rest === 1 ? '1 month' : `${rest} months`
  return `${months} months (${yearsLabel} and ${restLabel})`
}

function formatDate(date) {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

function fieldLabel(field) {
  if (field === 'balance') return 'balance'
  if (field === 'apr') return 'interest rate'
  if (field === 'minPayment') return 'minimum payment'
  return 'extra monthly payment'
}

function BalanceChart({ series, titleId, tableId }) {
  const width = 640
  const height = 220
  const pad = 28
  const max = Math.max(...series.map((point) => point.totalBalance), 1)
  const innerWidth = width - pad * 2
  const innerHeight = height - pad * 2
  const points = series.map((point, index) => {
    const x = pad + (series.length === 1 ? innerWidth / 2 : (index / (series.length - 1)) * innerWidth)
    const y = pad + (1 - point.totalBalance / max) * innerHeight
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')

  return (
    <svg
      className="debt-payoff-chart"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Balance remaining by month"
      aria-describedby={tableId}
    >
      <title id={titleId}>Balance remaining by month</title>
      <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} />
      <polyline points={points} />
      <text x={pad} y={18}>{formatMoney(series[0].totalBalance)}</text>
      <text x={width - pad} y={height - 8} textAnchor="end">{formatMoney(series.at(-1).totalBalance)}</text>
    </svg>
  )
}

export default function DebtPayoffPage() {
  const extraId = useId()
  const chartTitleId = useId()
  const tableId = useId()
  const nextId = useRef(1)
  const [debts, setDebts] = useState(() => [{ id: 1, name: '', balance: '', apr: '', minPayment: '' }])
  const [extra, setExtra] = useState('')
  const [strategy, setStrategy] = useState('snowball')
  const [errors, setErrors] = useState([])
  const [result, setResult] = useState(null)
  const [comparison, setComparison] = useState(null)

  function addDebt() {
    nextId.current += 1
    setDebts((current) => [
      ...current,
      { id: nextId.current, name: '', balance: '', apr: '', minPayment: '' },
    ])
  }

  function updateDebt(id, field, value) {
    setDebts((current) => current.map((debt) => (debt.id === id ? { ...debt, [field]: value } : debt)))
  }

  function removeDebt(id) {
    setDebts((current) => current.filter((debt) => debt.id !== id))
    setErrors([])
    setResult(null)
    setComparison(null)
  }

  function errorFor(index, field) {
    return errors.find((item) => item.index === index && item.field === field)
  }

  function errorElementId(item) {
    if (item.field === 'extra') return `${extraId}-error`
    return `debt-${debts[item.index].id}-${item.field}-error`
  }

  function inputId(debt, field) {
    return `debt-${debt.id}-${field}`
  }

  function onSubmit(event) {
    event.preventDefault()
    const validation = validatePayoffInput({
      debts: debts.map(({ name, balance, apr, minPayment }) => ({ name, balance, apr, minPayment })),
      extra,
    })
    if (!validation.ok) {
      setErrors(validation.errors)
      setResult(null)
      setComparison(null)
      const first = validation.errors[0]
      if (first) {
        const targetId = first.field === 'extra' ? extraId : inputId(debts[first.index], first.field)
        document.getElementById(targetId)?.focus()
      }
      return
    }

    const asOf = new Date()
    const plan = calculatePayoff({
      debts: validation.debts,
      extra: validation.extra,
      strategy,
      asOf,
    })
    const otherStrategy = strategy === 'snowball' ? 'avalanche' : 'snowball'
    setErrors([])
    setResult(plan)
    setComparison(calculatePayoff({
      debts: validation.debts,
      extra: validation.extra,
      strategy: otherStrategy,
      asOf,
    }))
  }

  const hasEntry = extra.trim() !== '' || debts.some((debt) =>
    debt.name.trim() || debt.balance.trim() || debt.apr.trim() || debt.minPayment.trim()
  )
  const series = result
    ? [{ month: 0, totalBalance: result.startingTotal, interest: 0 }, ...result.history]
    : []

  return (
    <>
      <Seo
        title="Debt payoff calculator | St. Catharines Digital"
        description="A free snowball and avalanche payoff estimate for Niagara households. The amounts stay in your browser. An educational estimate, not financial advice."
        path="/tools/debt-payoff"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Debt payoff calculator',
          description: 'A free educational debt payoff estimate for Niagara households. Calculations stay in the browser.',
          url: `${BASE_URL}/tools/debt-payoff/`,
          isAccessibleForFree: true,
        }}
      />
      <div className="scd-page journal-page debt-payoff">
        <header className="journal-page-heading">
          <p className="journal-kicker">Reader tools</p>
          <h1>Debt payoff calculator</h1>
          <p>
            A worksheet for Niagara households. Compare snowball, which clears the smallest balance first, with avalanche, which puts any extra money on the highest interest rate first.
          </p>
        </header>

        <p className="debt-payoff-privacy">
          This estimate runs in your browser. The amounts you enter are not sent anywhere, not stored on our servers, and not logged in analytics.
        </p>
        <p className="debt-payoff-note">
          This is an educational estimate, not financial advice. For a conversation with a non-profit credit counsellor, see{' '}
          <a href="https://creditcounsellingcanada.ca/">Credit Counselling Canada</a>.
        </p>

        <form className="debt-payoff-form" onSubmit={onSubmit} noValidate autoComplete="off">
          <div className="debt-payoff-rows">
            {debts.map((debt, index) => {
              const balanceError = errorFor(index, 'balance')
              const aprError = errorFor(index, 'apr')
              const paymentError = errorFor(index, 'minPayment')
              return (
                <fieldset key={debt.id} className="debt-payoff-row">
                  <legend>Debt {index + 1}</legend>
                  <div className="debt-payoff-field">
                    <label htmlFor={inputId(debt, 'name')}>Name</label>
                    <input
                      id={inputId(debt, 'name')}
                      type="text"
                      aria-label={`Debt ${index + 1} name`}
                      value={debt.name}
                      onChange={(event) => updateDebt(debt.id, 'name', event.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  <div className="debt-payoff-field">
                    <label htmlFor={inputId(debt, 'balance')}>Balance</label>
                    <input
                      id={inputId(debt, 'balance')}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      aria-label={`Debt ${index + 1} balance`}
                      value={debt.balance}
                      onChange={(event) => updateDebt(debt.id, 'balance', event.target.value)}
                      aria-invalid={balanceError ? 'true' : undefined}
                      aria-describedby={balanceError ? errorElementId(balanceError) : undefined}
                      autoComplete="off"
                    />
                  </div>
                  <div className="debt-payoff-field">
                    <label htmlFor={inputId(debt, 'apr')}>Interest rate</label>
                    <input
                      id={inputId(debt, 'apr')}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      aria-label={`Debt ${index + 1} interest rate`}
                      value={debt.apr}
                      onChange={(event) => updateDebt(debt.id, 'apr', event.target.value)}
                      aria-invalid={aprError ? 'true' : undefined}
                      aria-describedby={aprError ? errorElementId(aprError) : undefined}
                      autoComplete="off"
                    />
                  </div>
                  <div className="debt-payoff-field">
                    <label htmlFor={inputId(debt, 'minPayment')}>Minimum payment</label>
                    <input
                      id={inputId(debt, 'minPayment')}
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      aria-label={`Debt ${index + 1} minimum payment`}
                      value={debt.minPayment}
                      onChange={(event) => updateDebt(debt.id, 'minPayment', event.target.value)}
                      aria-invalid={paymentError ? 'true' : undefined}
                      aria-describedby={paymentError ? errorElementId(paymentError) : undefined}
                      autoComplete="off"
                    />
                  </div>
                  <button type="button" className="debt-payoff-text-button" onClick={() => removeDebt(debt.id)}>
                    Remove<span className="visually-hidden"> {debt.name.trim() || `debt ${index + 1}`}</span>
                  </button>
                </fieldset>
              )
            })}
          </div>

          <button type="button" className="debt-payoff-text-button" onClick={addDebt}>Add a debt</button>

          <div className="debt-payoff-controls">
            <label htmlFor={extraId}>
              Extra monthly payment
              <input
                id={extraId}
                type="number"
                inputMode="decimal"
                step="0.01"
                value={extra}
                onChange={(event) => setExtra(event.target.value)}
                aria-invalid={errorFor(null, 'extra') ? 'true' : undefined}
                aria-describedby={errorFor(null, 'extra') ? `${extraId}-error` : `${extraId}-hint`}
                autoComplete="off"
              />
            </label>
            <p id={`${extraId}-hint`}>Optional. It is applied to one debt at a time, in the order below.</p>
            <fieldset className="debt-payoff-strategy">
              <legend>Which debt gets extra money first</legend>
              <label>
                <input
                  type="radio"
                  name="strategy"
                  value="snowball"
                  checked={strategy === 'snowball'}
                  onChange={() => setStrategy('snowball')}
                />
                Snowball, smallest balance first
              </label>
              <label>
                <input
                  type="radio"
                  name="strategy"
                  value="avalanche"
                  checked={strategy === 'avalanche'}
                  onChange={() => setStrategy('avalanche')}
                />
                Avalanche, highest interest rate first
              </label>
            </fieldset>
            <button type="submit" className="journal-button">Calculate payoff</button>
          </div>

          {errors.length > 0 && (
            <div className="debt-payoff-alert" role="alert">
              <p>Fix these entries, then calculate again.</p>
              <ul>
                {errors.map((item) => (
                  <li key={`${item.index}-${item.field}`} id={errorElementId(item)}>
                    {item.index == null ? 'Extra monthly payment' : `Debt ${item.index + 1} ${fieldLabel(item.field)}`}: {item.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </form>

        {(!result && errors.length === 0 && !hasEntry) && (
          <p className="debt-payoff-empty" role="status">
            No debts entered yet. Add a name, balance, interest rate, and minimum payment to estimate a payoff.
          </p>
        )}

        {result?.hitCap && (
          <div className="debt-payoff-unpaid" role="status">
            <h2>These payments do not pay the debt off</h2>
            <p>
              After 60 years of this estimate, {formatMoney(result.unpaidBalance)} is still unpaid.
              Raise a minimum payment above the monthly interest, or add an extra monthly amount, and calculate again.
            </p>
          </div>
        )}

        {result && !result.hitCap && (
          <section className="debt-payoff-results" aria-live="polite" aria-label="Payoff estimate">
            <h2>{STRATEGY_LABEL[result.strategy]} estimate</h2>
            <dl className="debt-payoff-stats">
              <div>
                <dt>Time</dt>
                <dd>{formatMonths(result.months)}</dd>
              </div>
              <div>
                <dt>Interest</dt>
                <dd>{formatMoney(result.totalInterest)}</dd>
              </div>
              <div>
                <dt>Debt-free date</dt>
                <dd>{formatDate(result.debtFreeDate)}</dd>
              </div>
            </dl>
            {comparison && (
              <p className="debt-payoff-compare">
                {comparison.hitCap
                  ? `${STRATEGY_LABEL[comparison.strategy]} does not pay these debts off within 60 years at the same payments.`
                  : `${STRATEGY_LABEL[comparison.strategy]}, with the same payments, comes to ${formatMonths(comparison.months)} and ${formatMoney(comparison.totalInterest)} of interest.`}
              </p>
            )}
            <h3>Payoff order</h3>
            <ol aria-label="Payoff order">
              {result.payoffOrder.map((item) => (
                <li key={`${item.name}-${item.month}`}>{item.name}, month {item.month}</li>
              ))}
            </ol>
            <figure className="debt-payoff-figure">
              <BalanceChart series={series} titleId={chartTitleId} tableId={tableId} />
              <figcaption>Balance remaining each month. The table lists the same figures.</figcaption>
            </figure>
            <div className="debt-payoff-table-wrap">
              <table id={tableId}>
                <caption>Monthly balances for this {STRATEGY_LABEL[result.strategy].toLowerCase()} estimate</caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Balance remaining</th>
                    <th scope="col">Interest this month</th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((point) => (
                    <tr key={point.month}>
                      <th scope="row">{point.month === 0 ? 'Start' : point.month}</th>
                      <td>{formatMoney(point.totalBalance)}</td>
                      <td>{formatMoney(point.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {result?.hitCap && (
          <div className="debt-payoff-results">
            <figure className="debt-payoff-figure">
              <BalanceChart series={series} titleId={chartTitleId} tableId={tableId} />
              <figcaption>Balance remaining each month. The table lists the same figures.</figcaption>
            </figure>
            <div className="debt-payoff-table-wrap">
              <table id={tableId}>
                <caption>Monthly balances for this estimate. The balance does not reach zero.</caption>
                <thead>
                  <tr>
                    <th scope="col">Month</th>
                    <th scope="col">Balance remaining</th>
                    <th scope="col">Interest this month</th>
                  </tr>
                </thead>
                <tbody>
                  {series.map((point) => (
                    <tr key={point.month}>
                      <th scope="row">{point.month === 0 ? 'Start' : point.month}</th>
                      <td>{formatMoney(point.totalBalance)}</td>
                      <td>{formatMoney(point.interest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <section className="journal-newsletter" aria-label="Newsletter signup">
          <div>
            <p className="journal-kicker">From the newsroom</p>
            <h2>Local notes, when we send them.</h2>
            <p>This signup is separate from the calculator. Confirm your email to hear from the newsroom. A regular schedule has not been announced.</p>
          </div>
          <NewsletterPanel placement="debt_payoff_tool" />
        </section>

        <p className="debt-payoff-credit">Payoff math adapted from a public calculator. Credit: Darius T.</p>
      </div>
    </>
  )
}
