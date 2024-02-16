const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
const database = require('./database');

// Middleware
app.use(morgan('dev'));

app.listen(port, () => {
  console.log('App is listening on port ', port);
});

// -------- Create rotues -----

// Home page route
app.get("/", (request, response) => {
  response.send("Request received");
});

// Route to get all todos
app.get("/todos", (request, response) => {
  database.all(`SELECT * FROM todos`, params = [], (error, rows) => {
    if (error) {
      response.status(404).send({
        message: 'Status code 404 Resource not found'
      });
      return;
    }
    
    response.status(200).send({
      message: "Status code 200 OK", 
      data: rows
    });
  });
});

// Route to get a single todo by id
app.get("/todos/:id", (request, response) => {
  console.log("request.params: ", request.params);
  database.get('SELECT * FROM todos WHERE ID = ?', [request.params.id], (error, row) => {
    if (error) {
      response.status(404).send({
        message: 'status code 404 not found'
      });
      return;
    }

    response.status(200).send({
      message: 'status code 200',
      data: row
    });
  });
  
});

app.post("/new-todo", (request, response, next) => {
  console.log(response);
  next();
});

app.patch("/update-todo/:id", (request, response) => {
  console.log(response);
});

app.delete("/delete-todo", (request, response) => {
  console.log(response);
});

app.use((request, response) => {
  response.status(404).json({
    message: "404 not found"
  })
})