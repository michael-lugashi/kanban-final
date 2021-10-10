'use strict'

// global shorthand for DOM Elements I reference through out my code.
const tasksContainer = document.getElementById('tasks-container')
const spinner = createElem('div', [], 'loader')

// I initialize a global storage object
let listStorage = {
  todo: [],
  'in-progress': [],
  done: [],
}

buildingDOMFromLocalStorage(localStorage.getItem('tasks'))

/* DOM Events- this page layout is in the order of the DOM events listed below*/
tasksContainer.onclick = addOrDeleteTask

tasksContainer.ondblclick = editTask

// These three events are for the Alt Commands
tasksContainer.onmouseover = listELHoveringOver
document.addEventListener('keydown', altKey)
document.addEventListener('keyup', altKey)

search.oninput = searchFilter
btnContainer.onclick = loadOrSave
tasksContainer.addEventListener('click', focusedInputField)

// For Adding a task by pressing enter instead of clicking the Add button
document.addEventListener('keydown', enteringTask)


/* Local Storage Building DOM*/
function buildingDOMFromLocalStorage(localStorageLists) {
  
  if (localStorageLists) {
    // I make the storage object equal to local storage if local storage has values
    listStorage = JSON.parse(localStorageLists)
    
    // I place all the data from local storage into the DOM
    for (const list in listStorage) {
      const currentList = tasksContainer.querySelector(`#${list} > ul`)
      listStorage[list].forEach((listItemText) => {
        currentList.append(createListElement('li', listItemText, ['task'], {}))
      })
    }
  }
}

function addOrDeleteTask(event) {
  // delegates wether you add or delete a task
  const button = event.target
  if (button.className === 'remove-task') taskRemover(button)
  if (button.className === 'bottom-btn') addTask(button)
}

function taskRemover(remover){
  const taskRemoved = remover.closest('.task')
  taskRemoverLocalStorage([...taskRemoved.parentNode.children].indexOf(taskRemoved))
  taskRemoved.remove()
}

function taskRemoverLocalStorage(positionInList) {
  listStorage[taskRemoved.closest('section').id].splice(positionInList, 1)
  localStorage.setItem('tasks', JSON.stringify(listStorage))
}

function addTask(button){
  // gets the section and input that are relavent to the button
  const section = button.closest('section')
  const input = document.querySelector(`#${section.id} > .bottom-of-section > .bottom-input`)
  
  // I don't allow the user to enter an empt input
  if (!input.value) {
    alert(`You can't submit an empty task`)
    return
  }
  
  // I select the list within the section and append a list element
  addTaskDOM(document.querySelector(`#${section.id} > ul`), input.value)

  addTaskLocalStorage(section.id, input.value)
  
  // I clear the input
  input.value = ''
  
  // I focus on the input field so the user can continuously type more tasks
  input.focus()
}

function addTaskDOM(list, text) {
  list.prepend(createListElement('li', text, ['task'], {}))
}

function addTaskLocalStorage(list, text) {
  listStorage[list].unshift(text)
  localStorage.setItem('tasks', JSON.stringify(listStorage))
}

function editTask(event) {
  // function only effects list elements
  const listEl = event.target
  if (listEl.tagName !== 'LI') return
  
  // I get the list text
  const listElText = listEl.childNodes[1].nodeValue
  
  // I switch the list element with a input
  const input = temperaryInput(listEl, listElText)

  
  // When I leave the input it changes back to the list Element
  input.onblur = () => {
    // update the text content of the list element (can't be left empty)
    listEl.childNodes[1].nodeValue = input.value
    ? input.value
    : listEl.childNodes[1].nodeValue
    
    input.parentNode.replaceChild(listEl, input)
    
    // update the local storage
    // I find the index of listEl in the Dom, and use it to find where it is in my listStorage
    editTaskSetLocalStorage(listEl)
  }
}
function editTaskSetLocalStorage(listEl) {
  const positionInList = [...listEl.parentNode.children].indexOf(listEl)
  listStorage[listEl.closest('section').id][positionInList] =
  listEl.childNodes[1].nodeValue
  localStorage.setItem('tasks', JSON.stringify(listStorage))
}

function temperaryInput(listEl, listElText) {
  const input = createElem('input', [listElText], 'task')
  listEl.parentNode.replaceChild(input, listEl)
  input.focus()
  return input
}

// This function saves the list element I'm hovering over to the DOM
function listELHoveringOver(event) {
  if (!event.target.closest('.task')) return
  tasksContainer.hoveringOver = event.target
  
  event.target.onmouseout = () => {
    tasksContainer.hoveringOver = null
  }
}

function altKey(event) {
  if (event.key !== 'Alt') return
  if (event.type === 'keydown') {
    event.preventDefault()
    document.addEventListener('keydown', taskLocationChange)
  }
  if (event.type === 'keyup') {
    document.removeEventListener('keydown', taskLocationChange)
  }
}

function taskLocationChange(event) {
  const hoveringOver = tasksContainer.hoveringOver
  
  // the event only performs a task for keys 1, 2, 3.
  // And only if the mouse is hovering over a list element.
  if (['1', '2', '3'].indexOf(event.key) === -1 || !hoveringOver) return
  
  // chooses a DOM list to transfer to based on the key that was pressed
  const lists = ['todo', 'in-progress', 'done']
  const list = tasksContainer.querySelector(`#${lists[event.key - 1]} > ul`)
  
  // if the element is already inside the list the function does nothing.
  if (list.contains(hoveringOver)) return
  
  setLocalStorage(hoveringOver, lists[event.key - 1])
  
  taskLocationChangeDOM(hoveringOver, list)
}

function taskLocationChangeDOM(hoveringOver, list){
  hoveringOver.remove()
  list.prepend(hoveringOver)
}

function searchFilter() {
  let taskLists = document.querySelectorAll(`#tasks-container > section > ul`)
  
  // I unhide all the elements so they do stay hidden from the search before
  showAllTasks(taskLists)
  
  // I hide all the elements that do not contain the text in the search bar
  hideTasks(taskLists)
}
function showAllTasks(taskLists) {
  for (let list of taskLists) {
    [...list.children].forEach((elem) => (elem.hidden = false))
  }
}
function hideTasks(taskLists) {
  for (let list of taskLists) {
    ;[...list.children].forEach((elem) => {
      if (!elem.childNodes[1].nodeValue.toLowerCase().includes(search.value.toLowerCase())) {
        elem.hidden = true
      }
    })
  }
}
/* API Load and Save Data */
function loadOrSave(event) {
  if (event.target.id === 'load-btn') loadData()
  if (event.target.id === 'save-btn') saveData()
}

async function saveData() {
  // Added spiner so the user sees that API is currently saving their data.
  tasksContainer.append(spinner)
  checkNetworkResponse(await save())
  spinner.remove()
}

async function save() {
  return (
    await fetch('https://json-bins.herokuapp.com/bin/614b0f854021ac0e6c080cdc',
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks: listStorage }),
    })
  )
}

function checkNetworkResponse(response) {
  if (!response.ok) {
    alert(`Your information could not be saved Network Response: ${response.status}`)
  }
}

async function loadData() {
  // created a spinner element and added it to task container
  tasksContainer.append(spinner)

  const loadResponse = await load()
  if (!loadResponse.ok) {
    alert(
      `Your information could not be loaded. Network Response: ${loadResponse.status}`
    )
    return
  }

  loadSetLocalStorage(await loadResponse.json())

  // remove all elements from lists and build them according to the loaded data
  clearDOMLists()
  buildingDOMFromLocalStorage(localStorage.getItem('tasks'))
  spinner.remove()
}

async function load() {
  return await fetch('https://json-bins.herokuapp.com/bin/614b0f854021ac0e6c080cdc')
}

function loadSetLocalStorage({tasks}) {
  listStorage = tasks
  localStorage.setItem('tasks', JSON.stringify(listStorage))
}

function clearDOMLists() {
  let taskLists = document.querySelectorAll(`#tasks-container > section > ul`)
  for (let list of taskLists) {
    ;[...list.children].forEach((elem) => elem.remove())
  }
}
// The two functions bellow are so the use can continously enter tasks pressing the enter
function focusedInputField(event) {
  if (event.target.className !== 'bottom-input') return

  // I get the input elem and it's adjacent button elem and store them in hte DOM.
  tasksContainer.enteringInput = event.target
  const containerOfButton = event.target.closest('.bottom-of-section')
  tasksContainer.enteringBtn = containerOfButton.querySelector('.bottom-btn')
}

function enteringTask(event) {
  // This function won't run unless the user is currently focused on an input field and you press enter.
  if (
    event.code !== 'Enter' ||
    tasksContainer.enteringInput !== document.activeElement
  )
    return

  // I click the add button adjacent to the focused input field.
  tasksContainer.enteringBtn.click()
}

function createElem(tagname, contents, cls) {
  const newElem = document.createElement(tagname)
  if (tagname === 'input') {
    newElem.value = contents
  } else {
    for (const content of contents) {
      newElem.append(content)
    }
  }
    
  newElem.classList.add(cls)

  return newElem
}

function createListElement(tagname, contents, cls) {
  const removeTask = createElem('span', ['X'], 'remove-task')
  return createElem(tagname, [removeTask, contents], cls)
}

function setLocalStorage(element, to) {
  // finds the position in list using its placement in the DOM
  const positionInList = [...element.parentNode.children].indexOf(element)

  listStorage[element.closest('section').id].splice(positionInList, 1)
  listStorage[to].unshift(element.childNodes[1].nodeValue)
  localStorage.setItem('tasks', JSON.stringify(listStorage))
}
