const express = require('express');
const app = express();
const todosRouter = require('./routes/todo');
const mongoose = require('mongoose');
const morgan = require('morgan');

// Load environment variables
require('dotenv').config();

// Parse JSON request bodies
app.use(express.json());

app.use(morgan('dev'));

// Mount the todos route
app.use('/api/todos', todosRouter);
app.use('/', (req, res) => {
  res.status(200).json({
    test: 'Server is Working',
    msg: 'General',
  });
});
mongoose
  .connect('mongodb://127.0.0.1:27017/todoApp')
  .catch(error => console.log(error));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
