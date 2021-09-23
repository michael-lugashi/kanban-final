'use strict'

/* DOM Events */
const tasksContainer = document.getElementById('tasks-container') //global variable that never changes
tasksContainer.onclick = addTask
tasksContainer.ondblclick = editText

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

function addTask(event) {
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

function editText(event){
    // function only effects list elements
    const listEl = event.target;
    if (listEl.tagName !== 'LI') return
    // const positionInList = listStorage[listEl.closest('section').id].indexOf(listEl.textContent)

    // I switch the list element with a input
    const temporaryInput = createListElement('input', listEl.textContent, 'task')
    listEl.parentNode.replaceChild(temporaryInput, listEl);
    temporaryInput.focus()

    // When I leave the input it changes back to the list Element
    temporaryInput.onblur = () => {
        // update the text content of the list element (can't be left empty)
        listEl.textContent = temporaryInput.value ? temporaryInput.value:listEl.textContent

        // switch the input for the listelement
        temporaryInput.parentNode.replaceChild(listEl, temporaryInput);
        
        // update the local storage
        // I find the index of listEl in the Dom, and use it to find where it is in my listStorage
        const positionInList = [...listEl.parentNode.children].indexOf(listEl);
        listStorage[listEl.closest('section').id][positionInList] = listEl.textContent
        localStorage.setItem('tasks', JSON.stringify(listStorage))
    }

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
