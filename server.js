const express = require('express');
const app = express();
const port = 3000;

app.listen(port, () => {
  console.log('App is listening on port ', port);
});

app.get("/", (request, response) => {
  response.send("Request received");
});

app.get("/todos", (request, response) => {
  response.send({
    id: 1,
    todo: "shower"
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