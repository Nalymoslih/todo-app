const express = require('express');
const router = express.Router();
const Todo = require('../schema/Todo');

// Get all todos
router.get('/', async (req, res) => {
  const todos = await Todo.find();
  console.log('here');
  res.json({
    data: 'aa',
  });
});

// Add a new todo
router.post('/', async (req, res) => {
  const {task} = req.body;
  if (!task) return res.status(400).send('Task is required');
  const todo = new Todo({
    task,
    completed: false,
  });
  const newTodo = await todo.save();
  if (!newTodo) return res.status(500).send('The todo cannot be created');
  res.json(newTodo);
});

// update todo
router.put('/:id', async (req, res) => {
  const {id} = req.params;
  const {task, completed} = req.body;
  if (!id) return res.status(400).send('ID is required');

  const todo = await Todo.findById(id);
  if (!todo) return res.status(404).send('Todo not found');
  const updated = await todo.updateOne({
    task,
    completed,
  });
  if (!updated) return res.status(500).send('The todo cannot be updated');

  res.json({message: 'Todo marked updated'});
});

// Delete a todo
router.delete('/:id', async (req, res) => {
  const {id} = req.params;
  if (!id) return res.status(400).send('ID is required');
  const todo = await Todo.findByIdAndDelete(id);
  if (!todo) return res.status(404).send('Todo not found');

  res.json({message: 'Todo deleted'});
});

module.exports = router;
