const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const {username} = request.headers;

  const userfind = users.find((user)=>user.username === username);
  
  if(!userfind){
    return response.status(404).json({error:"User No exist"});
  }

  request.user = userfind;

  return next();
  
}

app.post('/users', (request, response) => {
    const {name,username} = request.body;

    const userExist = users.some((user)=>user.username === username);

    if(userExist){
      return response.status(400).json({error:"User exist !!"})
    }
    const id = uuidv4();

    users.push({
      id,
      name,
      username,
      todos:[]

    })

    const user=users.find((user)=>user.username===username);

    return response.status(201).send(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {

    const{user} = request;

    return response.status(201).send(user.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {
    const {user} = request;
    const{title,deadline} = request.body;

     
    const id = uuidv4();
    const user1 = {
      id,
      title,
      done :false,
      deadline: new Date(deadline),
      created_at : new Date()
      
    }
    user.todos.push(user1);

    return response.status(201).send(user1);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
    const{id} = request.params;
    const {user} = request;
    const {title,deadline}= request.body;

    console.log(id)
    const alter =user.todos.find((todo)=>todo.id === id);

    if (!alter){
      return response.status(404).json({error:"Id not found"});
    }

    alter.title = title;
    alter.deadline = new Date(deadline);

    return response.status(201).send(alter)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const{id} = request.params;
  const {user} = request;
  

  console.log(id)
  const alter =user.todos.find((todo)=>todo.id === id);

  if (!alter){
    return response.status(404).json({error:"Id not found"});
  }

  alter.done = true;
  
  return response.status(201).send(alter);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const{id} = request.params;
  const {user} = request;
  

  console.log(id)
  const deleteTD =user.todos.find((todo)=>todo.id === id);

  if (!deleteTD){
    return response.status(404).json({error:"Id not found"});
  }

  user.todos.splice(deleteTD,1);

  return response.status(204).send();
});

module.exports = app;