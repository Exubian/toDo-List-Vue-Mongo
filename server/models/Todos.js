const { Schema, model } = require('mongoose')

const todoSchema = new Schema( {items: Array, user: String}, {strict: false});
const Todo = model('Todo', todoSchema)
module.exports = Todo;
