
  // /* 案例 3 */
  const promise_timer = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Success');
    }, 1000);
  });

  promise_timer.then((value) => {
    console.log('timer:', value)
  });

  console.log('This is the first log');
