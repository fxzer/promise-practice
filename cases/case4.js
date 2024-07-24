const Promise = require('.../src/index.js');
/* 案例 4 : then 中抛出异常 */
const promise_throw = new Promise((resolve, reject) => {
  resolve('4:Success');
}).then((value) => {
  throw new Error('Error');
}).catch((error) => {
  console.log('throw:', error)
})

