
const fs = require('node:fs');

/* 案例 4 */
function read(url) {
  return new Promise(function (resolve, reject) {
    fs.readFile(url, 'utf8', function (err, data) {
      if (err) reject(err);
      resolve(data);
    })
  })
}
/* 
  then  1. 如果返回一个普通值，会作为下一次 then 的成功回调的参数
       2. 如果返回一个 promise，会执行这个 promise，会采用这个 promise 的状态
       3. 如果抛出一个异常，会走到下一次 then 的失败回调中

       

*/
read('./name.txt').then(data => {
  console.log('data1:', data)
  return read(data);
  // return 'hello'
}, error => {
  console.log('error1:', error)
}).catch(error => {
  // 只有两种情况：1. 上一个返回的是一个 失败的 promise 或者 抛出了异常
  console.log('error2:', error)
  // throw new Error('error')
}).then(data => { 
  // promise 透传：上一个返回的是一个成功的 promise，则会跳过 catch，直接执行 then
  console.log('then after catch:', data)
  // 终止 promise 链：返回一个 pending 状态的 promise
  // return new Promise(() => { })
}).catch(error => {
    // promise 透传：上一个返回的是一个失败的 promise，则会跳过 then，直接执行 catch
  console.log('error3:', error)
}).finally(() => {
  console.log('finally')
})
