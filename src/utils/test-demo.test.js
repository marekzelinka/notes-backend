import assert from 'node:assert'
import { describe, test } from 'node:test'
import { average, reverse } from './test-demo.js'

describe('reverse', () => {
  test('reverse of a', () => {
    const actual = reverse('a')
    const expected = 'a'
    assert.strictEqual(actual, expected)
  })

  test('reverse of react', () => {
    const actual = reverse('react')
    const expected = 'tcaer'
    assert.strictEqual(actual, expected)
  })

  test('reverse of saippuakauppias', () => {
    const actual = reverse('saippuakauppias')
    const expected = 'saippuakauppias'
    assert.strictEqual(actual, expected)
  })
})

describe('average', () => {
  test('of one value is the value itself', () => {
    assert.strictEqual(average([1]), 1)
  })

  test('of many items is calculated right', () => {
    assert.strictEqual(average([1, 2, 3, 4, 5, 6]), 3.5)
  })

  test('of empty array is zero', () => {
    assert.strictEqual(average([]), 0)
  })
})
