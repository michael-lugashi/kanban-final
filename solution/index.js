'use strict'

/* DOM Events */
const tasksContainer = document.getElementById('tasks-container') //global variable that never changes
tasksContainer.onclick = chooseButton

// I initialize a storage object
let listStorage = {
  todo: [],
  'in-progress': [],
  done: [],
}

/* Local Storage */
getTasksFromLocalStorage()

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

function chooseButton(event) {
  // one click event works on all three buttons and only on buttons
  const button = event.target
  if (button.tagName !== 'BUTTON') return

  // gets the section and input that are relavent to the button
  const section = button.closest('section')
  const input = document.querySelector(`#${section.id} > input`)

  // I don't allow the user to enter an empt input
  if (!input.value) {
    alert(`You can't submit an empty task`)
    return
  }

  // I select the list within the section and append a list element
  const list = document.querySelector(`#${section.id} > ul`)
  list.append(createListElement('li', input.value, 'task'))

  
  // I update the local storage
  listStorage[section.id].push(input.value)
  localStorage.setItem('tasks', JSON.stringify(listStorage))

  // I clear the input
  input.value = ''
}

function createListElement(tagname, text, cls) {
  const newListItem = document.createElement(tagname)
  newListItem.textContent = text
  newListItem.classList.add(cls)
  return newListItem
}
