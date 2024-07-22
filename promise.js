const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.status = PENDING;

    this.value = undefined; // 成功值
    this.reason = undefined; // 拒因

    this.onFulfilledCallbacks = []; // 成功回调
    this.onRejectedCallbacks = []; // 拒因回调



    function resolve(value) {
      // 状态只能从 PENDING 到 FULFILLED
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        // 执行成功回调
        while (this.onFulfilledCallbacks.length) {
          this.onFulfilledCallbacks.shift()(value); // 发布
        }
      }
    }

    function reject(reason) {
      // 状态只能从 PENDING 到 REJECTED
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.reason = reason;
      }
      // 执行拒因回调
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason); // 发布 emit
      }
    }

    // 创建 Promise 实例时立即执行 executor
    try {
      executor(resolve.bind(this), reject.bind(this));
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled && onFulfilled(this.value);
    } else if (this.status === REJECTED) {
      onRejected && onRejected(this.reason);
    } 
    
    // 异步情况
    if(this.status === PENDING) {
      this.onFulfilledCallbacks.push(() => { // 订阅 on
        onFulfilled(this.value)
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason)
      });
    }

    return this;
  }

  catch(onRejected) {
    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}

module.exports = Promise;
