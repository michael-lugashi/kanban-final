# Cyber4s 3rd Pre-Course Final Project
# Michael Lugashi


# JS Features

In this project I completed all the tests, including the bonuses. All the standard alt commands and searching work flawlessly. You can add tasks, and everthing is updated in the local storage. The load and save features are coupled with a loader animation. You can save and load data through the use of the API.

I added two extra features. The first was that instead of pressing the "Add" button to add a task, you coud simply press the enter key. This also brings your cursor back into the input field. This way you never have to take your hand off the key board to add lots tasks. After you initialy click on an input field you can just add the task by clicking enter, and continue typing to add another.

The second extra feature I added was a remove button. When you hover over a task the remove feature appears at the upper right hand corner of the task. Instead of using JavaScript to make the remove feature appeare as an X when my mouse was over the task element I did it very elegantly in css. In two lines of code in css I made it so when I hovered over the parent element the child element would appear. In JavaScript I simply used delegation on my already existing click event and changed the name of my addTask function to addOrRemove task. If the event.target had the classname of my X I removed the task from the DOM and updated the local storage. Unfortanetly, because I added a span element into the li element for each task it interfeared with the tests. Instead of recieving "Task #1" The test woudld recieve my "X Task #1". Although it would not pass the tests with this feature for all practical purposes It does pass the tests. That is why I decided I'm going to shocase this feature in the video but submit it without this feature. If you guys want to see the is feature for yourselfs here are the intructions below:

intructions: 
1. Go to line 296 in index.js and replace "[contents]" with "[remove Task, contents]"
2. replace all ".textContent" with ".childNodes[1].nodeValue", There are six in the document not including the commments.


# CSS

I gave my document a wood theme. I went into great detail altering the design of the scroll bar and changing the selection color of my page. My header and bottom inputs and buttons are 'sticky' so they never are out of site of the user. The user does not have to scroll to use the page features wether it be to search for a task or add one. When I hover over tasks or buttons they change color. I designed my spinner to go with the theme of the page. I alterd the cursor shape to only change on elements on the page you can interact with. My sizing adjust to look good on any computer screen. Overall I gave the webpage a very imersive feel.

Picture:






Link to GitHub Pages: