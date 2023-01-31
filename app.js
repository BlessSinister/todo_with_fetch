;(function () {
  //Globals
  const todoList = document.getElementById('todo-list')
  const userSelect = document.getElementById('user-todo')
  const form = document.querySelector('form')
  let todos = []
  let users = []

  //Attah Events
  document.addEventListener('DOMContentLoaded', initApp)
  form.addEventListener('submit', handleSubmit)

  //Basic Logic
  function getUserName(userId) {
    const user = users.find((u) => u.id === userId)
    return user.name
  }
  function printToDo({ id, userId, title, completed }) {
    const li = document.createElement('li')
    li.className = 'todo-item'
    li.dataset.id = id
    li.innerHTML = `<span>${title} <i>by</i> <b>${getUserName(
      userId
    )}</b> </span>`

    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox'
    checkbox.checked = completed
    checkbox.addEventListener('change', handleToDoChange)

    const close = document.createElement('span')
    close.innerHTML = '&times' //спецсимвол крестик
    close.className = 'close'
    close.addEventListener('click', handleClose)

    todoList.prepend(li)
    li.prepend(checkbox)
    li.append(close)
  }

  function createUserOption(user) {
    const option = document.createElement('option')
    option.value = user.id
    option.innerText = user.name
    userSelect.append(option)
  }

  function removeToDo(todoId) {
    todos = todos.filter((todo) => todo.id !== todoId)

    const todo = todoList.querySelector(`[data-id = '${todoId}']`)
    todo.querySelector('input').removeEventListener('change', handleToDoChange)
    todo.querySelector('.close').removeEventListener('click', handleClose)
    todo.remove()
  }

  function alertError(error) {
    alert(error.message)
  }
  //Event Logic

  function initApp() {
    Promise.all([getAllToDos(), getAllUsers()]).then((value) => {
      ;[todos, users] = value
      todos.forEach((todo) => printToDo(todo))
      users.forEach((user) => createUserOption(user))
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    createToDo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
    })
  }

  function handleToDoChange() {
    const todoId = this.parentElement.dataset.id
    const completed = this.checked

    toggleToDoComplete(todoId, completed)
  }

  function handleClose() {
    const todoId = this.parentElement.dataset.id

    deleteToDo(todoId)
  }
  //Async Logic
  async function getAllToDos() {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos?_limit=15'
      )
      const data = response.json()

      return data
    } catch (error) {
      alertError(error)
    }
  }
  async function getAllUsers() {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = response.json()

      return data
    } catch (error) {
      alertError(error)
    }
  }
  async function createToDo(todo) {
    try {
      const response = await fetch(
        'https://jsonplaceholder.typicode.com/todos',
        {
          method: 'POST',
          body: JSON.stringify(todo),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const newToDo = await response.json()
      printToDo(newToDo)
    } catch (error) {
      alertError(error)
    }
  }
  async function toggleToDoComplete(todoId, completed) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ completed }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      alertError(error)
    }
  }

  async function deleteToDo(todoId) {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todoId}`,
        {
          method: 'DELETE',

          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.ok) {
        removeToDo(todoId)
      }
    } catch (error) {
      alertError(error)
    }
  }
})()
