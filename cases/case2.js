
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
