const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const MONGO_URL = require('./config.js')
const Todo = require('./models/Todos')

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json());
app.use(cors())

  
mongoose.connect(MONGO_URL)

app.get('/todos/:docId', async (req, res) => {
  try {
    const documentId = req.params.docId;
    const todos = (await Todo.find({user: documentId}))[0].items;
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/todos/:docId', async (req, res) => {
  try {
    const documentId = req.params.docId;
    // const newTodo = new Todo({items: req.body});
    const newItems = req.body; 
    
    const updatedDocument = await Todo.findOneAndUpdate(
      { user: documentId },
      { items: newItems },
      { upsert: true}
    );

    // console.log(req.body, '\n', newTodo)
    res.status(201).json(newItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.listen(PORT, () => {
  console.log("Server has been started...", `on port http://localhost:${PORT}`)
})
  
  
  


