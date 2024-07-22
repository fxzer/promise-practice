 /*  Promise
    优点： 
    1. 链式调用，可以解决异步嵌套造成的回调地狱问题
    2. 可以解决异步并发问题
    缺点：
    1. 是基于回调的，无法终止异步，一旦创建，Promise 将开始执行，且无法中途取消
    2. 状态不可逆，一旦状态改变，就不会再变，限制灵活性 */

    const Promise = require('./promise');
 /* 案例 1 */
  const promise_normal = new Promise((resolve, reject) => {
    // resolve('Success');
    reject('Error'); // 状态已经改变，不会执行
  //  reject(new Error('Error')); // 状态已经改变，不会执行
  });
  promise_normal.then((value) => {
    console.log('normal value:', value)
  })
  promise_normal.then((value) => {
    console.log('normal value:', value)
  }, (reason) => {
    console.log('normal reason:', reason)
  })

  // 一个 promise 多次调用 then
  promise_normal.then((value) => {
    console.log('normal1 value:', value)
  })
  .then((value) => {
    console.log('normal2 value:', value)
  })

  /* 案例 2 */
  const promise_error = new Promise((resolve, reject) => {
    // reject('Error');
       reject(new Error('Error')); 
  });
  promise_error.then((value) => {
    console.log('error value:', value)
  },).catch((error) => {
    console.log('error catch:', error)
  })

  // /* 案例 3 */
  // const promise_timer = new Promise((resolve, reject) => {
  //   setTimeout(() => {
  //     resolve('Success');
  //   }, 1000);
  // });

  // promise_timer.then((value) => {
  //   console.log('timer:', value)
  // });

  // console.log('This is the first log');
