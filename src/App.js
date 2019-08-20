import React, { Component } from 'react';
import 'normalize.css'
import './reset.css'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import * as localStore from './localStore'



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newTodo: '',
      todoList: localStore.load('todoList') || []
    }
  }
  componentDidUpdate(){
    localStore.save('todoList',this.state.todoList)
  }
  addTodo(event) {
    this.state.todoList.push({
      id: idMaker(),
      title: event.target.value,
      status: null,
      deleted: false
    })
    this.setState({
      newTodo: '',
      todoList: this.state.todoList
    })
   
  }
  changeTitle(event) {
    this.setState({
      newTodo: event.target.value,
      todoList: this.state.todoList
    })
    
  }
  toggle(e,todo){
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)
    
  }
  delete(e,todo){
    todo.deleted = true
    this.setState(this.state)
   
  }
  render() {
    let todos = this.state.todoList
    .filter((item=>!item.deleted))
    .map((item, index) => {
      return (
        <li key={item.id}>
          <TodoItem todo={item}    
            onToggle = {this.toggle.bind(this)}
            onDelete = {this.delete.bind(this)}/>
        </li>
      )
    })
    return (
      <div className="App">
        <h1>我的待办</h1>
        <div className="inputWrapper">
          <h3>New Task</h3>
          <TodoInput content={this.state.newTodo}
            onSubmit={this.addTodo.bind(this)} 
            onChange = {this.changeTitle.bind(this)}/>
        </div>
        <div className="itemWrapper">
          <ol className="todolist">
            {todos}
          </ol>
        </div>

      </div>
    )
  }
}

let id = 0
function idMaker() {
  id += 1
  return id
}

export default App;
