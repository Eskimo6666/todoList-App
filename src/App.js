import React, { Component } from 'react';
import 'normalize.css'
import './reset.css'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import UserDialog from './UserDialog'
import { getCurrentUser, signOut, TodoModel } from './leanCloud'





class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: getCurrentUser() || {},
      newTodo: '',
      todoList: []
    }
    let user = getCurrentUser()
    if (user) {
      TodoModel.getByUser(user,(todos)=>{
        console.log(todos)
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.todoList = todos
        this.setState(stateCopy)
      })
    }
  }

  componentDidUpdate() {

  }
  addTodo(event){
    let newTodo = {
      title: event.target.value,
      status: {complated:false},
      deleted: false
    }
    TodoModel.create(newTodo, (id) => {
      newTodo.id = id
      this.state.todoList.push(newTodo)
      this.setState({
        newTodo: '',
        todoList: this.state.todoList
      })
    }, (error) => {
      console.log(error)
    })
  }

  changeTitle(event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })

  }
  toggle(e, todo){
    let oldStatus = todo.status
    console.log(todo)
    todo.status.complated = todo.status.complated ===true  ? false : true
    TodoModel.update(todo, () => {
      this.setState(this.state)
    }, (error) => {
      console.log(error)
      todo.status = oldStatus
      this.setState(this.state)
    })
  }
  delete(e, todo) {
    TodoModel.destory(todo.id,()=>{
      todo.deleted = true
      this.setState(this.state)
    })
  }

  onSignUpOrSingnIn(user) {
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
  }
  signOut() {
    signOut()
    console.log('out')
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    stateCopy.todoList = []
    console.log(33)
    this.setState(stateCopy)
  }

  render() {
    let todos = this.state.todoList
      .filter((item => !item.deleted))
      .map((item, index) => {
        return (
          <li key={item.id}>
            <TodoItem todo={item}
              onToggle={this.toggle.bind(this)}
              onDelete={this.delete.bind(this)} />
          </li>
        )
      })
    return (
      <div className="App">
        <h1>{this.state.user.username || '我'}的待办
          {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
        </h1>
        <div className="inputWrapper">
          <h3>New Task</h3>
          <TodoInput content={this.state.newTodo}
            onSubmit={this.addTodo.bind(this)}
            onChange={this.changeTitle.bind(this)} />
        </div>
        <div className="itemWrapper">
          <ol className="todolist">
            {todos}
          </ol>
          {this.state.user.id ?
            null :
            <UserDialog
              onSignUp={this.onSignUpOrSingnIn.bind(this)}
              onSignIn={this.onSignUpOrSingnIn.bind(this)} />}
        </div>

      </div>
    )
  }
}



export default App;
