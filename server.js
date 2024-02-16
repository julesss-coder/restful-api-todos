const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
const database = require('./database');

// Middleware
app.use(morgan('dev'));
app.use(express.json());

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

    // Add case for non-existent ID
  });
  
});

app.post("/new-todo", (request, response) => {
  const { name, description, created, updated } = request.body;

  // Collect errors
  let errors = [];
  if (!name) {
    errors.push("No name specified.");
  }

  if (!description) {
    errors.push("No description specified.");
  }

  if (errors.length) {
    response.status(400).send({
      message: "Status code 400 Bad request",
    });
  }

  const query = 'INSERT INTO todos (name, description, created, updated) VALUES (?,?,?,?)';
  const params = [name, description];

  database.run(query, params, function (error) {
    if (error) {
      console.log("error: ", error);
      return;
    }

    response.status(201).send({
      message: "Status Code 201 Created",
      data: {
        name: name,
        description: description,
        created: Date.now(),
        updated: Date.now()
      },
      id: ++this.lastID
    });
  })
});

app.patch("/update-todo/:id", (request, response) => {
  const id = request.params.id;
  const updates = request.body;
  const params = [];
  const data = {};

  let query = `UPDATE todos SET `;

  for (const key in updates) {
    query += `${key} = ?, `;
    params.push(updates[key]);
    data[key] = updates[key];
  }

  // Remove the trailing comma and space
  query = query.slice(0, -2);

  data.updated = Date.now();
  params.push(id);
  query += ` WHERE id = ?`;

  database.run(query, params, function (error) {
    if (error) {
      console.log("error: ", error);
      return;
    }

    response.status(200).send({
      message: "Status Code 201 Updated",
      data: data
    });
  })
});

app.delete("/delete-todo/:id", (request, response) => {
  const query = 'DELETE FROM todos WHERE id = ?';
  const params = [request.params.id];

  database.run(query, params, (error) => {
    if (error) {
      console.log("error: ", error);
      response.status(400).send({
        message: "Status Code 400: Bad request"
      });
      return;
    }

    response.status(200).send({
      message: "Status code 200 OK"
    });
  });
});

app.use((request, response) => {
  response.status(404).json({
    message: "404 not found"
  })
})