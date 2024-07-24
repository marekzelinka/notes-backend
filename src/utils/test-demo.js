export function reverse(string) {
  return string.split('').reverse().join('')
}

export function average(array) {
  if (!array.length) {
    return 0
  }

  return array.reduce((sum, item) => sum + item, 0) / array.length
}
