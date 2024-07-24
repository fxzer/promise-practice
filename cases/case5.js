// 可选参数

const Promise = require('../src/index.js');

const p = new Promise((resolve, reject) => {
  resolve('Success');
})
p.then().then().then().then().then((value) => {
  console.log('value:', value)
})

/* p.then((value) => {
  return value
}).then((value) => {
  return value
}
).then((value) => {
  console.log('value:', value)
})
  */
p.then((value) => {
  throw new Error('Error')
}).then((value) => {
  return value
} ).then((value) => {
  console.log('value:', value)
}).catch((error) => {
  console.log('error:', error)
})
