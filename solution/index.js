'use strict'

// global shorthand for DOM Element I reference through out my code.
const tasksContainer = document.getElementById('tasks-container')

// I initialize a global storage object
let listStorage = {
  todo: [],
  'in-progress': [],
  done: [],
}

getTasksFromLocalStorage()

/* DOM Events */
tasksContainer.onclick = addTask
tasksContainer.ondblclick = editTask
tasksContainer.onmouseover = listELHoveringOver
document.addEventListener('keydown', altKey)
document.addEventListener('keyup', altKey)
search.oninput = searchFilter
btnContainer.onclick = loadOrSave
tasksContainer.addEventListener('click', focusedInputField)
document.addEventListener('keydown', enteringTask)
// tasksContainer.onmousedown = dragAndDropTask

/* API Load and Save Data */
function loadOrSave(event) {
  if (event.target.id === 'load-btn') loadData()
  if (event.target.id === 'save-btn') saveData()
}

async function saveData() {
  const saveResponse = await fetch('https://json-bins.herokuapp.com/bin/614b0f854021ac0e6c080cdc', {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
  },
  body: JSON.stringify({ tasks: listStorage }),
})
}

async function loadData() {
  // created a spinner element and added it to task container
  const spinner = createListElement('div', '', 'loader')
  tasksContainer.append(spinner)

  // fetch the data from the API and update the Local storage
  const load = await fetch(
    'https://json-bins.herokuapp.com/bin/614b0f854021ac0e6c080cdc'
  )
  const { tasks } = await load.json()
  listStorage = tasks
  localStorage.setItem('tasks', JSON.stringify(listStorage))

  // remove all elements from lists and build them according to the loaded data
  let taskLists = document.querySelectorAll(`#tasks-container > section > ul`)
  for (let list of taskLists) {
    ;[...list.children].forEach((elem) => elem.remove())
  }

  spinner.remove()
  getTasksFromLocalStorage()
}

/* Local Storage Building DOM*/
function getTasksFromLocalStorage() {
  const localStorageLists = localStorage.getItem('tasks')

  if (localStorageLists) {
    // I make the storage object equal to local storage if local storage has values
    listStorage = JSON.parse(localStorageLists)

    // I place all the data from local storage into the DOM
    for (const list in listStorage) {
      const currentList = tasksContainer.querySelector(`#${list} > ul`)
      listStorage[list].forEach((listItemText) => {
        currentList.append(createListElement('li', listItemText, 'task'))
      })
    }
  }
}

function addTask(event) {
  // one click event works on all three buttons and only on buttons
  const button = event.target
  if (button.className !== 'bottom-btn') return

  // gets the section and input that are relavent to the button
  const section = button.closest('section')
  const input = document.querySelector(`#${section.id} > .bottom-of-section > .bottom-input`)

  // I don't allow the user to enter an empt input
  if (!input.value) {
    alert(`You can't submit an empty task`)
    return
  }

  // I select the list within the section and append a list element
  const list = document.querySelector(`#${section.id} > ul`)
  list.prepend(createListElement('li', input.value, 'task'))

  // I update the local storage
  listStorage[section.id].unshift(input.value)
  localStorage.setItem('tasks', JSON.stringify(listStorage))

  // I clear the input
  input.value = ''

  // I focus on the input field so the user can continuously type more tasks
  input.focus()
}

function editTask(event) {
  // function only effects list elements
  const listEl = event.target
  if (listEl.tagName !== 'LI') return
  // const positionInList = listStorage[listEl.closest('section').id].indexOf(listEl.textContent)

  // I switch the list element with a input
  const temporaryInput = createListElement('input', listEl.textContent, 'task')
  listEl.parentNode.replaceChild(temporaryInput, listEl)
  temporaryInput.focus()

  // When I leave the input it changes back to the list Element
  temporaryInput.onblur = () => {
    // update the text content of the list element (can't be left empty)
    listEl.textContent = temporaryInput.value
      ? temporaryInput.value
      : listEl.textContent

    // switch the input for the listelement
    temporaryInput.parentNode.replaceChild(listEl, temporaryInput)

    // update the local storage
    // I find the index of listEl in the Dom, and use it to find where it is in my listStorage
    const positionInList = [...listEl.parentNode.children].indexOf(listEl)
    listStorage[listEl.closest('section').id][positionInList] =
      listEl.textContent
    localStorage.setItem('tasks', JSON.stringify(listStorage))
  }
}

// This function saves the list element I'm hovering over to the DOM
function listELHoveringOver(event) {
  if (event.target.tagName !== 'LI') return

  // The event target is saved in the DOM
  tasksContainer.hoveringOver = event.target

  event.target.onmouseout = () => {
    // The event target is no longer saved
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

  // change the DOM
  hoveringOver.remove()
  list.prepend(hoveringOver)
}

function searchFilter() {
  let taskLists = document.querySelectorAll(`#tasks-container > section > ul`)

  // I unhide all the elements so they do stay hidden from the search before
  for (let list of taskLists) {
    [...list.children].forEach((elem) => (elem.hidden = false))
  }

  // I hide all the elements that do not contain the text in the search bar
  for (let list of taskLists) {
    [...list.children].forEach((elem) => {
      if (!elem.textContent.includes(search.value.toLowerCase())) {
        elem.hidden = true
      }
    })
  }
}

// The two functions bellow are so the use can continously enter tasks pressing the enter
function focusedInputField(event) {
  if (event.target.className !== 'bottom-input') return

  // I get the input elem and it's adjacent button elem.
  tasksContainer.enteringInput = event.target
  const containerOfButton = event.target.closest('.bottom-of-section')
  tasksContainer.enteringBtn = containerOfButton.querySelector('.bottom-btn')
}

function enteringTask(event) {
  // This function won't run unless the user is currently focused on an input field and you press enter.
  if (event.code !== 'Enter' || tasksContainer.enteringInput !== document.activeElement) return

  // I click the add button adjacent to the focused input field.
  tasksContainer.enteringBtn.click()
}

function createListElement(tagname, text, cls) {
  const newListItem = document.createElement(tagname)
  if (tagname === 'input') {
    newListItem.value = text
  } else {
    newListItem.append(text)
    //   newListItem.textContent = text
  }
  newListItem.classList.add(cls)
  return newListItem
}

function setLocalStorage(element, to) {
  // finds the position in list using its placement in the DOM
  const positionInList = [...element.parentNode.children].indexOf(element)

  listStorage[element.closest('section').id].splice(positionInList, 1)
  listStorage[to].unshift(element.textContent)
  localStorage.setItem('tasks', JSON.stringify(listStorage))
}
