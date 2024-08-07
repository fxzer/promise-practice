const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

const isFunction = (x) => {
  return typeof x === "function";
}

const isPromise = (x) => {
  return (x !== null && (typeof x === "object" || isFunction(x))) && isFunction(x.then);
}

const resolvePromise = (promise2, x, resolve, reject) => {
  // x 与 promise2 相等，抛出异常 : 防止循环引用
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  let called = false; // 防止多次调用，保证只调用一次，例：失败了再调用成功
  // 判断 x 的值是否 promise，若 x 是 Promise，执行 x.then，并递归调用 resolvePromise
  if (x !== null && (typeof x === "object" || isFunction(x))) {
    try {
      let then = x.then;
      if (isFunction(then)) {
        then.call( // 省去再次读取 x.then 的过程，避免可能的再次报错
          x,
          (y) => { // y: onFulfilled 的返回值
            if (called) return; // 防止多次调用成功和失败
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => { // r: onRejected 的返回值
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else { // { then: 123 }
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else { // x 是普通值
    resolve(x);
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING;

    this.value = undefined; // 终值
    this.reason = undefined; // 拒因

    this.onFulfilledCallbacks = []; // 成功回调
    this.onRejectedCallbacks = []; // 拒因回调



    function resolve(value) {
      // 状态只能从 PENDING 到 FULFILLED
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 执行成功回调
        this.onFulfilledCallbacks.forEach(fn => fn());
        // while (this.onFulfilledCallbacks.length) {
        //   this.onFulfilledCallbacks.shift()(value); // 发布
        // }
      }
    }

    function reject(reason) {
      // 状态只能从 PENDING 到 REJECTED
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
      // 执行拒因回调
      this.onRejectedCallbacks.forEach(fn => fn());
      // while (this.onRejectedCallbacks.length) {
      //   this.onRejectedCallbacks.shift()(reason); // 发布 emit
      // }
    }
    // 创建 Promise 实例时立即执行 executor
    try {
      executor(resolve.bind(this), reject.bind(this));
    } catch (error) {
      reject(error);
    }
  }
  static resolve(value) {
    if (isPromise(value)) {
      return value
    }
    return new Promise((resolve, reject) => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  then(onFulfilled, onRejected) {
    // 参数可选情况
    onFulfilled = isFunction(onFulfilled) ? onFulfilled : (value) => value;
    onRejected = isFunction(onRejected) ? onRejected : (reason) => { throw reason };

    // 创建一个新的 promise，为了实现链式调用，可以在 resolvePromise 中拿到 resolve 和 reject
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => { // 宏任务, 在 new Promise后执行，保证 promise2 存在
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          }
          catch (error) { // 捕获 then 中的异常
            reject(error);
          }
        });
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          }
          catch (error) {
            reject(error);
          }
        });
      }

      // 异步情况
      if (this.status === PENDING) {
        this.onFulfilledCallbacks.push(() => { // 订阅 on
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          })
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          });
        });
      }
    })

    return promise2;
  }

  catch(onRejected) {
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }

  static race(values) {
    return new Promise((resolve, reject) => {
      if(!Array.isArray(values)){
        return reject(new TypeError(`${values} is not iterable`))
      }
      if(values.length === 0){
        return
      }
      for (let i = 0; i < values.length; i++) {
        let current = values[i];
        if (isPromise(current.then)) {
          current.then(resolve, reject)
        } else {
          resolve(current)
        }
      }
    })
  }

  static all(values) {
    return new Promise((resolve, reject) => {
      const result = []
      let index = 0 // 解决多个异步并发问题

      function processData(i, data) {
        result[i] = data;
        // 放 2 个同步，index:2  length: 8 ，全部执行完毕才 resolve
        if (++index === values.length) { // ?
          resolve(result);
        }
      }

      for (let i = 0; i < values.length; i++) {
        let current = values[i];
        if (isPromise(current)) {
          current.then((data) => {
            processData(i, data)
          }, reject);
        } else {
          processData(i, current)
        }
      }
    })
  }

  static allSettled(values) {
    return new Promise((resolve, reject) => {
      const result = []
      let index = 0 // 解决多个异步并发问题

      function processData(i, value, status) {
        result[i] = {
          status,
          value
        };
        // 放 2 个同步，index:2  length: 8 ，全部执行完毕才 resolve
        if (++index === values.length) { // ?
          resolve(result);
        }
      }

      for (let i = 0; i < values.length; i++) {
        let current = values[i];
        if (isPromise(current)) {
          current.then((data) => {
            processData(i, data, 'fulfilled')
          }, (reason) => {
            processData(i, reason, 'rejected')
          });
        } else {
          processData(i, current, 'fulfilled')
        }
      }
    })
  }

}



// 测试 
Promise.defer = Promise.deferred = function () {
  const dfd = {};
  dfd.promise = new Promise((resolve, reject) => {
    dfd.resolve = resolve;
    dfd.reject = reject;
  });
  return dfd;
}

module.exports = Promise;
