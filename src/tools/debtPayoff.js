/**
 * Client-side snowball / avalanche payoff estimate.
 *
 * The month loop follows the public PayoffEngine.calculate path: interest is
 * added, each minimum is applied, then any extra payment goes to the first
 * debt still open in strategy order. No amounts are sent or stored here.
 */

export const MAX_MONTHS = 720
const EPS = 0.005

function roundCents(value) {
  return Math.round(value * 100) / 100
}

export function monthlyInterest(balance, apr) {
  return balance * (apr / 100 / 12)
}

export function formatMoney(value) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(value)
}

function addMonths(date, months) {
  const next = new Date(date.getTime())
  next.setMonth(next.getMonth() + months)
  return next
}

function orderDebts(debts, strategy) {
  const ordered = debts.map((debt) => ({ ...debt }))
  if (strategy === 'snowball') {
    ordered.sort((a, b) => a.balance - b.balance || b.apr - a.apr)
  } else {
    ordered.sort((a, b) => b.apr - a.apr || a.balance - b.balance)
  }
  return ordered
}

export function calculatePayoff(input) {
  if (!input || !Array.isArray(input.debts)) {
    throw new Error('calculatePayoff: debts array required')
  }

  const strategy = input.strategy === 'avalanche' ? 'avalanche' : 'snowball'
  const extra = Math.max(0, Number(input.extra) || 0)
  const asOf = input.asOf instanceof Date ? input.asOf : new Date()
  const debts = orderDebts(
    input.debts
      .map((debt) => ({
        name: (debt.name && String(debt.name).trim()) || 'Debt',
        balance: Math.max(0, Number(debt.balance) || 0),
        apr: Math.max(0, Number(debt.apr) || 0),
        minPayment: Math.max(0, Number(debt.minPayment) || 0),
        paidOffMonth: null,
      }))
      .filter((debt) => debt.balance > 0),
    strategy,
  )

  const startingTotal = debts.reduce((sum, debt) => sum + debt.balance, 0)
  if (startingTotal <= 0) {
    return {
      months: 0,
      totalInterest: 0,
      history: [],
      payoffOrder: [],
      debtFreeDate: asOf,
      strategy,
      startingTotal: 0,
      hitCap: false,
      unpaidBalance: 0,
    }
  }

  let month = 0
  let totalInterest = 0
  const history = []
  const payoffOrder = []

  while (debts.some((debt) => debt.balance > EPS) && month < MAX_MONTHS) {
    month += 1
    let remainingExtra = extra
    let monthInterest = 0

    debts.forEach((debt) => {
      if (debt.balance > 0) {
        const interest = monthlyInterest(debt.balance, debt.apr)
        debt.balance += interest
        monthInterest += interest
        totalInterest += interest
      }
    })

    debts.forEach((debt) => {
      if (debt.balance > 0) debt.balance -= Math.min(debt.minPayment, debt.balance)
    })

    for (const debt of debts) {
      if (debt.balance > EPS && remainingExtra > 0) {
        const payment = Math.min(remainingExtra, debt.balance)
        debt.balance -= payment
        remainingExtra -= payment
      }
    }

    debts.forEach((debt) => {
      if (debt.balance < EPS) {
        if (debt.paidOffMonth === null) {
          debt.paidOffMonth = month
          payoffOrder.push({ name: debt.name, month, minPayment: debt.minPayment })
        }
        debt.balance = 0
      }
    })

    const totalBalance = debts.reduce((sum, debt) => sum + debt.balance, 0)
    history.push({
      month,
      totalBalance: roundCents(totalBalance),
      interest: roundCents(monthInterest),
    })
    if (totalBalance < 0.01) break
  }

  const unpaidBalance = roundCents(debts.reduce((sum, debt) => sum + debt.balance, 0))
  const hitCap = month >= MAX_MONTHS && debts.some((debt) => debt.balance > EPS)

  return {
    months: month,
    totalInterest: roundCents(totalInterest),
    history,
    payoffOrder,
    debtFreeDate: hitCap ? null : addMonths(asOf, month),
    strategy,
    startingTotal: roundCents(startingTotal),
    hitCap,
    unpaidBalance,
  }
}

function fieldText(value) {
  if (value == null) return ''
  return String(value).trim()
}

function error(index, field, message) {
  return { index, field, message }
}

function readAmount(raw, { index, field, label, blankMessage, article = 'A' }) {
  const text = fieldText(raw)
  if (text === '') return { error: error(index, field, blankMessage) }
  const value = Number(text)
  if (!Number.isFinite(value)) {
    return { error: error(index, field, `Enter ${article.toLowerCase()} ${label} using digits.`) }
  }
  if (value < 0) {
    return { error: error(index, field, `${article} ${label} cannot be negative.`) }
  }
  return { value }
}

export function validatePayoffInput(input) {
  const debts = Array.isArray(input?.debts) ? input.debts : []
  if (debts.length === 0) return { ok: false, empty: true, errors: [] }

  const errors = []
  const cleaned = []

  debts.forEach((debt, index) => {
    const name = fieldText(debt?.name) || `Debt ${index + 1}`
    const balance = readAmount(debt?.balance, {
      index,
      field: 'balance',
      label: 'balance',
      blankMessage: 'Enter a balance above zero.',
    })
    const apr = readAmount(debt?.apr, {
      index,
      field: 'apr',
      label: 'interest rate',
      blankMessage: 'Enter an interest rate above 0%.',
      article: 'An',
    })
    const minPayment = readAmount(debt?.minPayment, {
      index,
      field: 'minPayment',
      label: 'minimum payment',
      blankMessage: 'Enter a minimum payment above zero.',
    })

    if (balance.error) errors.push(balance.error)
    else if (balance.value === 0) {
      errors.push(error(index, 'balance', 'Enter a balance above zero.'))
    }

    if (apr.error) errors.push(apr.error)
    else if (apr.value === 0) {
      errors.push(error(index, 'apr', 'Enter an interest rate above 0%.'))
    }

    if (minPayment.error) errors.push(minPayment.error)
    else if (minPayment.value === 0) {
      errors.push(error(index, 'minPayment', 'Enter a minimum payment above zero.'))
    }

    if (!balance.error && !apr.error && !minPayment.error && balance.value > 0 && apr.value > 0 && minPayment.value > 0) {
      const interest = monthlyInterest(balance.value, apr.value)
      if (minPayment.value <= interest + 0.004) {
        errors.push(error(
          index,
          'minPayment',
          `This minimum does not cover the monthly interest of ${formatMoney(interest)}. Enter a payment above that amount so the balance can fall.`,
        ))
      }
      cleaned.push({
        name,
        balance: balance.value,
        apr: apr.value,
        minPayment: minPayment.value,
      })
    }
  })

  const extraText = fieldText(input?.extra)
  let extra = 0
  if (extraText !== '') {
    const parsed = Number(extraText)
    if (!Number.isFinite(parsed)) {
      errors.push(error(null, 'extra', 'Enter an extra payment using digits, or leave it blank.'))
    } else if (parsed < 0) {
      errors.push(error(null, 'extra', 'An extra payment cannot be negative.'))
    } else {
      extra = parsed
    }
  }

  if (errors.length) return { ok: false, empty: false, errors }
  return { ok: true, empty: false, errors: [], debts: cleaned, extra }
}
