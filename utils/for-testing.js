function palindrome(string) {
  return string.split("").reverse().join("");
}

function average(array) {
  if (array.length === 0) {
    return 0;
  }
  return array.reduce((sum, cur) => sum + cur, 0) / array.length;
}

module.exports = { palindrome, average };
