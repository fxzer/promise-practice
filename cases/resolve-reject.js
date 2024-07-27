
const Promise = require('../src/index.js');
const p1 = Promise.resolve(1);
console.log('[ p1 ]-3', p1)


const p2 = Promise.reject(2);
console.log('[ p2 ]-3', p2)
