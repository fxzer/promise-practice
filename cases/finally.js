/** 
 * finally 中的回调无论成功/失败都会执行，使用 finally 且可以 .then
 * 上个 then 成功结果会透传到下一个 then的成功回调参数中
 * 把 上一个结果往下传 
 */

const Promise = require('../src/index.js')

let p = new Promise((resolve, reject) => {
  resolve('success')
  // reject('error')
})

Promise.prototype.finally = function (cb) {
  console.log('[ cb ]-8',)
  return p.then(
    // Promise.resolve : 等待 cb 中的异步执行完成
    value => Promise.resolve(cb()).then(() => value),
    reason => Promise.resolve(cb()).then(() => { throw reason })
  )

}

// p.then(data => {
//   console.log('[ data ]-7', data)
//   return '100'
  
// }).finally(
//   () =>  {
//     console.log('finally')
//     return 'abc'
//   }
  
// ).then(data => {
//   console.log('[ data ]-9', data)
// }).catch(error => {
//   console.log('[ error ]-12', error)
// })

 // finally 返回异步 promise : 会等待 finally 异步执行完后才执行后面对应的 then/catch
p.then(data => {
  console.log('[ data ]-7', data)
  
}).finally(
  () =>  {
    console.log('finally')
    return new Promise((resolve,reject) =>{
      setTimeout(() => {
        resolve(2000) 
      }, 2000);
    })
  }
  
).then(data => {
  console.log('[ data ]-9', data)
}).catch(error => {
  console.log('[ error ]-12', error)
})
