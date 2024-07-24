
// const Promise = require('../src/index.js')

Promise.all([1, 2, 3, new Promise((resolve, reject) => { resolve(4) }),  5, 6]).then(data => {
  console.log('data:', data)
}, error => {
  console.log('error:', error)
})
Promise.all([1, 2, 3, new Promise((resolve, reject) => { reject('error') }),  5, 6]).then(data => {
  console.log('data:', data)
}, error => {
  console.log('error:', error)
})
