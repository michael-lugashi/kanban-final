'use strict'
const tasksContainer = document.getElementById('tasks-container')
tasksContainer.onclick = chooseButton

function chooseButton(event){
    // one click event works on all three buttons and only buttons
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
    list.append(createListElement('li', input.value, 'listItem'))

    // I clear the input
    input.value = ''

}

function createListElement(tagname, text, cls) {
    const newListItem = document.createElement(tagname)
    newListItem.textContent = text
    newListItem.classList.add(cls)
    return newListItem
}