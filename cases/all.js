
const Promise = require('../src/index.js')
const resolvePromise =  new Promise((resolve, reject) => { resolve(4) })
const rejectPromise =   new Promise((resolve, reject) => { reject('error') })
const values1 = [1, 2, 3, resolvePromise, 5, 6]
const values2 = [1, 2, 3, rejectPromise, 5, 6]
const values3 = [1, 2, 3, resolvePromise,rejectPromise, 5, 6]

// Promise.all(values1).then(data => {
//   console.log('data:', data)
// }, error => {
//   console.log('error:', error)
// })
// Promise.all(values2).then(data => {
//   console.log('data:', data)
// }, error => {
//   console.log('error:', error)
// })
// Promise.all(values3).then(data => {
//   console.log('data:', data)
// }, error => {
//   console.log('error:', error)
// })

/* allSettled */
Promise.allSettled(values1).then(data => {
  console.log('data:', data)
}
)
Promise.allSettled(values2).then(data => {
  console.log('data:', data)
}, error => {
  console.log('error:', error)
})
Promise.allSettled(values3).then(data => {
  console.log('data:', data)
}, error => {
  console.log('error:', error)
})
