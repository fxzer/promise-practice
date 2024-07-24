
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


