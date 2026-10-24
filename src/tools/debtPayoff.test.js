import { describe, expect, it } from 'vitest'
import { calculatePayoff, validatePayoffInput } from './debtPayoff.js'

const asOf = new Date(2026, 0, 15)

describe('calculatePayoff snowball and avalanche ordering', () => {
  const household = [
    { name: 'Tiny', balance: 300, apr: 5, minPayment: 30 },
    { name: 'Costly', balance: 2500, apr: 26, minPayment: 50 },
    { name: 'Mid', balance: 1200, apr: 12, minPayment: 40 },
  ]

  it('pays the smallest balance first on the snowball plan', () => {
    const result = calculatePayoff({ debts: household, extra: 80, strategy: 'snowball', asOf })

    expect(result.payoffOrder.map((debt) => debt.name)).toEqual(['Tiny', 'Mid', 'Costly'])
    expect(result.payoffOrder.map((debt) => debt.month)).toEqual([3, 13, 39])
    expect(result.months).toBe(39)
    expect(result.totalInterest).toBe(1582.44)
    expect(result.hitCap).toBe(false)
  })

  it('puts extra money on the highest rate first on the avalanche plan', () => {
    const result = calculatePayoff({
      debts: [...household].reverse(),
      extra: 80,
      strategy: 'avalanche',
      asOf,
    })

    expect(result.payoffOrder.map((debt) => debt.name)).toEqual(['Tiny', 'Costly', 'Mid'])
    expect(result.payoffOrder.map((debt) => debt.month)).toEqual([11, 26, 29])
    expect(result.months).toBe(29)
    expect(result.totalInterest).toBe(994.7)
    expect(result.hitCap).toBe(false)
  })

  it('matches the original engine on a zero-interest snowball', () => {
    const result = calculatePayoff({
      debts: [
        { name: 'Big', balance: 1000, apr: 0, minPayment: 50 },
        { name: 'Small', balance: 200, apr: 0, minPayment: 50 },
      ],
      extra: 50,
      strategy: 'snowball',
      asOf,
    })

    expect(result.payoffOrder.map((debt) => [debt.name, debt.month])).toEqual([
      ['Small', 2],
      ['Big', 11],
    ])
    expect(result.months).toBe(11)
    expect(result.totalInterest).toBe(0)
    expect(result.history[0]).toEqual({ month: 1, totalBalance: 1050, interest: 0 })
    expect(result.history.at(-1).totalBalance).toBe(0)
  })

  it('matches the original engine when two balances tie and avalanche prefers the higher rate', () => {
    const result = calculatePayoff({
      debts: [
        { name: 'LowAPR', balance: 1000, apr: 6, minPayment: 40 },
        { name: 'HighAPR', balance: 1000, apr: 24, minPayment: 40 },
      ],
      extra: 100,
      strategy: 'avalanche',
      asOf,
    })

    expect(result.payoffOrder.map((debt) => [debt.name, debt.month])).toEqual([
      ['HighAPR', 8],
      ['LowAPR', 13],
    ])
    expect(result.months).toBe(13)
    expect(result.totalInterest).toBe(135.36)
  })
})

describe('calculatePayoff when a debt never pays off', () => {
  it('stops at 60 years when the payment is below interest and the balance grows', () => {
    const result = calculatePayoff({
      debts: [{ name: 'Card', balance: 5000, apr: 24, minPayment: 50 }],
      extra: 0,
      strategy: 'snowball',
      asOf,
    })

    expect(result.hitCap).toBe(true)
    expect(result.months).toBe(720)
    expect(result.payoffOrder).toEqual([])
    expect(result.totalInterest).toBe(3891055418.68)
    expect(result.unpaidBalance).toBeGreaterThan(result.startingTotal)
  })

  it('stops at 60 years when payments cover interest but the balance is still unpaid', () => {
    const result = calculatePayoff({
      debts: [{ name: 'Loan', balance: 100000, apr: 2, minPayment: 170 }],
      extra: 0,
      strategy: 'avalanche',
      asOf,
    })

    expect(result.hitCap).toBe(true)
    expect(result.months).toBe(720)
    expect(result.payoffOrder).toEqual([])
    expect(result.totalInterest).toBe(117766.4)
    expect(result.unpaidBalance).toBe(95366.4)
  })
})

describe('validatePayoffInput', () => {
  const validDebt = { name: 'Visa', balance: '2400', apr: '19.99', minPayment: '75' }

  it('treats no rows as an empty estimate', () => {
    expect(validatePayoffInput({ debts: [], extra: '' })).toEqual({
      ok: false,
      empty: true,
      errors: [],
    })
  })

  it('rejects a blank balance, rate, or minimum payment', () => {
    const result = validatePayoffInput({
      debts: [{ name: 'Visa', balance: '', apr: ' ', minPayment: '' }],
      extra: '',
    })

    expect(result.ok).toBe(false)
    expect(result.errors.map((error) => error.field)).toEqual(['balance', 'apr', 'minPayment'])
    expect(result.errors.every((error) => /enter/i.test(error.message))).toBe(true)
  })

  it('rejects negative amounts and a negative extra payment', () => {
    const result = validatePayoffInput({
      debts: [{ name: 'Visa', balance: '-20', apr: '-1', minPayment: '-5' }],
      extra: '-10',
    })

    expect(result.ok).toBe(false)
    expect(result.errors.map((error) => [error.field, error.index])).toEqual([
      ['balance', 0],
      ['apr', 0],
      ['minPayment', 0],
      ['extra', null],
    ])
    expect(result.errors.every((error) => /cannot be negative/i.test(error.message))).toBe(true)
  })

  it('rejects a zero interest rate', () => {
    const result = validatePayoffInput({
      debts: [{ ...validDebt, apr: '0' }],
      extra: '0',
    })

    expect(result.ok).toBe(false)
    expect(result.errors).toEqual([
      expect.objectContaining({
        index: 0,
        field: 'apr',
        message: expect.stringMatching(/above 0%/i),
      }),
    ])
  })

  it('rejects a minimum payment that does not cover monthly interest', () => {
    const result = validatePayoffInput({
      debts: [{ name: 'Card', balance: '5000', apr: '24', minPayment: '50' }],
      extra: '0',
    })

    expect(result.ok).toBe(false)
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].field).toBe('minPayment')
    expect(result.errors[0].message).toMatch(/\$100\.00/)
    expect(result.errors[0].message).toMatch(/above/i)
  })

  it('accepts a payment above interest and returns numbers the calculator can use', () => {
    const result = validatePayoffInput({
      debts: [validDebt, { name: '', balance: '650', apr: '24.99', minPayment: '35' }],
      extra: '150',
    })

    expect(result.ok).toBe(true)
    expect(result.debts[0]).toEqual({ name: 'Visa', balance: 2400, apr: 19.99, minPayment: 75 })
    expect(result.debts[1].name).toBe('Debt 2')
    expect(result.extra).toBe(150)
  })

  it('clears a zero-rate error once the rate is raised', () => {
    const zero = validatePayoffInput({ debts: [{ ...validDebt, apr: '0' }], extra: '' })
    const fixed = validatePayoffInput({ debts: [{ ...validDebt, apr: '19.99' }], extra: '' })

    expect(zero.ok).toBe(false)
    expect(fixed.ok).toBe(true)
    expect(fixed.errors).toEqual([])
  })
})
