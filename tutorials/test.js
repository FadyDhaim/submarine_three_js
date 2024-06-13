const h = Symbol('hello')
const h2 = Symbol.for('hello')
console.log(Symbol.keyFor(h2))