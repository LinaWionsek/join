const msgTodo = 'To Do';
const msgProgress = 'In Progress';
const msgFeedback = 'Await Feedback';
const msgDone = 'Done';

let currentDraggedElement;
let taskPriority;
let subtaskHeadline;
let inProgress;
let finished;
let searching = false;
let progressbar;
let showUserDiff;

/**
 * This function to initializes the active user on the board, the shown tasks for the user and the html for board 
 * 
 */
async function initBoard() {
    loadActiveUser();
    userCircle();
    await currentUserTaskLoad();
    await currentUserIdLoad();
    updateBoardHTML();
}

/**
 * This eventlistener starts the rotation of a dragged card
 * 
 */
document.addEventListener('dragstart', function (e) {
    if (e.target.classList.contains('task')) {
        e.target.classList.add('rotating');
    }
});

/**
 * This eventlistener stops the rotation of a dragged card
 * 
 */
document.addEventListener('dragend', function (e) {
    if (e.target.classList.contains('task')) {
        e.target.classList.remove('rotating');
    }
});

/**
 * This function is used to clear all values of the tasks array
 * 
 */
async function clearArray() {
    tasks.splice(0, tasks.length);
    currentId = "";
    await currentUserTaskSave();
    await currentUserIdSave();
}

/**
 * This functions clears the searchinput and switchs the x symbol of it back to searchsymbol
 * 
 */
function clearSearchInput() {
    document.getElementById('searchInput').value = '';
    document.getElementById('searchLogo').classList.remove('d-none');
    document.getElementById('searchClose').classList.add('d-none');
}

/** 
 * This eventlistener is fired when the textbox is focused
 *  
 */
document.getElementById('searchInput').addEventListener("focus", changeDivColor);

/**
 * This function changes the bordercolor of the searchbar
 * 
 */
function changeDivColor() {
    document.getElementById('fake-searchbar').style.borderColor = "#29ABE2";
}

/**
 * This eventlistener removes the focus of the searchbar
 * 
 */
document.getElementById('searchInput').addEventListener("blur", revertDivColor);

/**
 * This function changes the border color of the searchbar back to default
 * 
 */
function revertDivColor() {
    document.getElementById('fake-searchbar').style.borderColor = "#A8A8A8";
}

/**
 * It prevents the default behavior of the browser (which blocks dragging by default)
 * 
 * @param {DragEvent} ev - The drag event object
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * This function sets the new status of the element when it's dropped and updates the BoardHtml
 * 
 * @param {string} status - The status of the selected element
 */
async function moveTo(status) {
    tasks[currentDraggedElement]['status'] = status;
    await currentUserTaskSave();
    updateBoardHTML();
    removeHighlight(status);
    clearSearchInput();
}

/**
 * This function highlights the area which the selected element is dragged at or over
 * 
 * @param {string} id - The id of the element to be highlighted
 */
function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

/**
 * This function removes highlight from selected element
 * 
 * @param {string} id - The id of the element to be highlighted 
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}

/**
 * This function filters the tasks array for title and description  
 * This function displays the results of the search
 * 
 */
function renderSearchResults() {
    document.getElementById('searchLogo').classList.add('d-none');
    document.getElementById('searchClose').classList.remove('d-none')
    // x d-none weg lupe d-none hin x onclick = reset function to normal board view
    let text = document.getElementById('searchInput').value;
    renderBoard('toDo', msgTodo, text);
    renderBoard('in-progress', msgProgress, text);
    renderBoard('awaiting-feedback', msgFeedback, text);
    renderBoard('done', msgDone, text);
}

/**
 * This function updates the board
 * 
 */
function updateBoardHTML() {
    renderBoard('toDo', msgTodo);
    renderBoard('in-progress', msgProgress);
    renderBoard('awaiting-feedback', msgFeedback);
    renderBoard('done', msgDone);
}

/**
 * This function renders tasks with their respective status
 * Setting text = '' means that the text array is cleared (this is only for the function).
 * 
 * 1. All tasks with their respective status are retrieved and assigned to the filterStatus array.
 * 2. All tasks with titles matching the value of the input field are retained
 *    and added to the searchResult array.
 * 3. If there are no tasks (the filterStatus array has a length of 0), it writes "No (respective status)" 
 *    or if the search yields no results.
 *    Otherwise,
 *    - If text is empty,
 *        --> Render all tasks.
 *    - If text is not empty,
 *        --> Render all search results.
 * 
 * --> In normal rendering, it is as if only renderBoard() were there.
 * includes = whether a value is included
 */
function renderBoard(id, msg, text = '') {
    let filterStatus = tasks.filter(t => t['status'] == id);
    let searchedResult = filterStatus.filter(t => t['title'].toLowerCase().includes(text.toLowerCase()));
    if (filterStatus.length === 0 || searchedResult.length === 0) {
        document.getElementById(id).innerHTML = /*html*/ ` 
        <div class="status-empty">No Tasks ${msg}</div>
        `;
    } else {
        if (text === '') {
            document.getElementById('searchLogo').classList.remove('d-none');
            document.getElementById('searchClose').classList.add('d-none');
            document.getElementById(id).innerHTML = '';
            for (let index = 0; index < filterStatus.length; index++) {
                const element = filterStatus[index];
                document.getElementById(id).innerHTML += generateTaskHTML(element);
            }
        } else {
            document.getElementById(id).innerHTML = '';
            for (let index = 0; index < searchedResult.length; index++) {
                const element = searchedResult[index];
                document.getElementById(id).innerHTML += generateTaskHTML(element);
            }
        }
    }
}

/**
 * This function render the assigned user icons on the small task card
 * If there are more than 5 users it shows the number of additional users
 * @param {Object} - The task element 
 * @returns A variable that contains generated HTML string representing the assigned user
 */
function renderSmallUserIcons(element) {
    let users = element['contactAbbreviation']
    let colors = element['contactColor']
    let assignedUser = '';
    if (users.length > 5) {
        for (let j = 0; j < 5; j++) {
            let user = users[j];
            let color = colors[j]
            assignedUser += /*html*/ ` 
           <div class="profile-picture fontSize12" style="background-color:${color}">${user}</div>`;
        }
        diff = users.length - 5;
        showUserDiff = /*html*/ ` 
        <div class="diff-counter">+${diff}</div>
        `;
    } else {
        for (let j = 0; j < users.length; j++) {
            let user = users[j];
            let color = colors[j]
            assignedUser += /*html*/ ` 
           <div class="profile-picture fontSize12" style="background-color:${color}">${user}</div>`;
        }
        diff = '';
        showUserDiff = '';
    }
    return assignedUser;
}

/**
 * This function generates a small task card based on the given element
 * 
 * @param {Object} - The task element 
 * @returns {string} - The generated HTML string representing the task
 */
function generateTaskHTML(element) {
    console.log(element)
    updateProgressbar(element);
    let i = element['id']
    let assignedUser = renderSmallUserIcons(element)
    let imageUrl;
    if(element['priority'] == 'low'){
        imageUrl = './img/prio-low.svg';
    }
    if(element['priority'] == 'medium'){
        imageUrl = './img/prio-medium.svg';
    }
    if(element['priority'] == 'urgent'){
        imageUrl = './img/prio-urgent.svg';
    }

    let mover = /*html*/ `  
    <div id="move-dropup">
        <div class="dropup">
            <button class="dropbtn">Move</button>
            <div class="dropup-content">
                <a href="#" onclick="switchStatusToDo(${i})">To Do</a>
                <a href="#" onclick="switchStatusToInProgress(${i})">In Progress</a>
                <a href="#" onclick="switchStatusToAwaitFeedback(${i})">Await Feedback</a>
                <a href="#" onclick="switchStatusToDone(${i})">Done</a>
            </div>
        </div>
    </div>
    `;
    return /*html*/ `
        <div id="dragStatus" draggable="true" ondragstart="startDragging(${element['id']})"  class="task">
            <div class="min-height160" onclick="openTask(${i}, event), slide('task-card', 'popup-container');"> 
                <div class="task-top fontSize16">
                    <div class="task-category" style="${element['categoryColor']}">${element['category']}</div>
                    <div id="move-container">  </div>
                    <span class="task-title fontSize16">${element['title']}</span>
                    <div class="task-description show-scrollbar"> ${element['description']}</div>
                </div>
                ${progressbar}
                <div class="task-users-prio">
                    <div class="task-users">
                    ${assignedUser}
                    </div>
                    ${showUserDiff}
                    <img src="${imageUrl}">
                </div>
            </div>
            ${mover}
        </div>
    `;
}

/**
 * Changes the status of a task with the specified ID to "toDo".
 * 
 */
async function switchStatusToDo(i) {
    let index = tasks.findIndex(task => task.id === i);
    currentDraggedElement = index;
    tasks[currentDraggedElement]['status'] = "toDo";
    await currentUserTaskSave();
    updateBoardHTML();
}

/**
 * Changes the status of a task with the specified ID to "in-progress".
 * 
 */
async function switchStatusToInProgress(i) {
    let index = tasks.findIndex(task => task.id === i);
    currentDraggedElement = index;
    tasks[currentDraggedElement]['status'] = "in-progress";
    await currentUserTaskSave();
    updateBoardHTML();
}

/**
 * Changes the status of a task with the specified ID to "awaiting-feedback".
 * 
 */
async function switchStatusToAwaitFeedback(i) {
    let index = tasks.findIndex(task => task.id === i);
    currentDraggedElement = index;
    tasks[currentDraggedElement]['status'] = "awaiting-feedback";
    await currentUserTaskSave();
    updateBoardHTML();
}

/**
 * Changes the status of a task with the specified ID to "done".
 * 
 */
async function switchStatusToDone(i) {
    let index = tasks.findIndex(task => task.id === i);
    currentDraggedElement = index;
    tasks[currentDraggedElement]['status'] = "done";
    await currentUserTaskSave();
    updateBoardHTML();
}

/**
 *This function updates the progress bar based on the finished subtasks 
 *  
 * @param {Object} - The task element 
 * @returns {string} The generated HTML string representing the progress bar
 */
function updateProgressbar(element) {
    let openSubasks = element['subtasksInProgress'].length
    let finishedSubasks = element['subtasksFinish'].length
    let allSubtasks = openSubasks + finishedSubasks
    let percent = finishedSubasks / allSubtasks;
    percent = Math.round(percent * 100);
    if (openSubasks === 0 && finishedSubasks === 0) {
        progressbar = '';
    } else {
        progressbar = /*html*/ `  
        <div class="task-progress">
            <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100" style="height: 8px; width: 50%; background-color: #F4F4F4">
                <div class="progress-bar" style="background-color: #4589FF; width:${percent}%">
                </div> 
            </div>
            <span class="fontSize12">${finishedSubasks}/${allSubtasks} Subtasks
            </span>
        </div> `
    }
}

/**
 * This function sets the global variable 'currentDraggedElement' with the index of the task having the specified ID
 * 
 * @param {number} id - The id of the task to find
 */
async function startDragging(id) {
    let index = tasks.findIndex(task => task.id === id);
    currentDraggedElement = index;
}

/**
 * This function finds the task by its ID and triggers rendering its detailed view
 * 
 * @param {number} i - The id of the task to open
 */
async function openTask(i, event) {
    event.stopPropagation();
    let index = tasks.findIndex(task => task.id === i);
    renderTaskdetailHTML(index);
    clearSearchInput();
}