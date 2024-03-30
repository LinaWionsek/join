async function init() {
    await currentUserContactsLoad();
    await currentUserIdLoad();
    await currentUserTaskLoad();
}
//statusSelected('toDo');

/**
 * Sets the status group to the provided status.
 */
function statusSelected(status) {
    statusGroup = status;
}

async function createTask() {
    statusSelected('toDo');
    console.log(currentId)
    let task = {
        'id': currentId,
        'status': statusGroup,
        'category': '',
        'categoryColor': '',
        // 'category': currentCategorySelected[0].name,
        // 'categoryColor': currentCategorySelected[0].color,
        'title': document.getElementById('task_title').value,
        'description': document.getElementById('task_description').value,
        // 'dueDate': document.getElementById('datepicker').value,
        'dueDate': '',
        // 'priority': currentPrioSelected,
        // 'contactName': contactCollection.map(contact => contact.name),
        // 'contactColor': contactCollection.map(contact => contact.color),
        // 'contactAbbreviation': contactCollection.map(contact => contact.nameAbbreviation),
        'priority': '',
        'contactName': '',
        'contactColor': '',
        'contactAbbreviation': '',
        'subtasksInProgress': subTaskCollection,
        'subtasksFinish': subtasksFinish,
    };
    tasks.push(task);
    currentId++;
    console.log(currentId);
    saveTaskElements();
    await currentUserIdSave();
    await currentUserTaskSave();
    
    changesSaved('Task added to board');
    let currentPage = window.location.pathname;
    handleTaskCompletion(currentPage);
    // document.getElementById('task_title')
    // document.getElementById('task_title')
    // document.getElementById('task_title')
    // document.getElementById('task_title')
}

/**
 * Retrieves data from form elements and adds a new task.
 */
async function addTask() {
    let currentPage = window.location.pathname;
    let task = collectTaskData();
    tasks.push(task);
    currentId++;
    await saveTaskData();
    handleTaskCompletion(currentPage);
}

/**
 * Saves task-related data.
 */
async function saveTaskData() {
    await currentUserTaskSave();
    await currentUserIdSave();
    resetAllAddTaskElements();
    changesSaved('Task added to board');
}

async function currentUserTaskSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('tasksAsText', JSON.stringify(tasks));
    } else {
        await setItem('tasks', JSON.stringify(tasks));
    }
}

async function currentUserIdSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('currentIdAsText', JSON.stringify(currentId));
    } else {
        await setItem('currentId', JSON.stringify(currentId));
    }
}
/**
 * Handles the completion of a task based on the current page.
 * If the current page is the board, it hides the add task popup and updates the board HTML.
 * Otherwise, it redirects to the board page after a short delay.
 */
function handleTaskCompletion(currentPage) {
    if (currentPage === '/join/board.html') {
        // document.getElementById('addTaskPop').classList.add('d-none');
        updateBoardHTML();
    } else {
        setTimeout(() => {
            window.location.href = './board.html';
        }, 3000);
    }
}

// function saveTaskElements() {
//     localStorage.setItem('categoryCollectionAsText', JSON.stringify(currentCategorySelected));
//     localStorage.setItem('currentPrioAsText', JSON.stringify(currentPrioSelected));
//     localStorage.setItem('subTaskCollectionAsText', JSON.stringify(subTaskCollection));
//     localStorage.setItem('contactCollectionAsText', JSON.stringify(contactCollection));
//     localStorage.setItem('selectedIndexAsText', JSON.stringify(selectedIndex));
//     localStorage.setItem('selectedColorIndexAsText', JSON.stringify(selectedColorIndex));
//     localStorage.setItem('subTaskFinishAsText', JSON.stringify(subtasksFinish));
//     localStorage.setItem('taskIdAsText', JSON.stringify(taskIdForEdit));
//     localStorage.setItem('statusAsText', JSON.stringify(statusEdit));
// }

//AddTask//
/**
 * Validates the form and adds a task if the form is valid.
 */
// function createTask() {
//     input1 = document.getElementById('categoryInputV1');
//     input2 = document.getElementById('categoryInputV2');
//     var form = document.getElementById('myForm');
//     if (form.checkValidity()) {
//         if (currentCategorySelected[0].name === '') {
//             input1.classList.add('inputRed');
//             input2.classList.add('inputRed');
//             setTimeout(function () {
//                 input1.classList.remove('inputRed');
//                 input2.classList.remove('inputRed');
//             }, 10000);
//         } else {
//             saveTaskElements();
//             addTask();
//         }
//     }
// }

/**
 * Retrieves data from form elements and adds a new task.
 */
async function addTask() {
    let currentPage = window.location.pathname;
    let task = collectTaskData();
    tasks.push(task);
    currentId++;
    await saveTaskData();
    handleTaskCompletion(currentPage);
}

/**
 * Saves task-related data.
 */
async function saveTaskData() {
    await currentUserTaskSave();
    await currentUserIdSave();
    resetAllAddTaskElements();
    changesSaved('Task added to board');
}

async function currentUserTaskSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('tasksAsText', JSON.stringify(tasks));
    } else {
        await setItem('tasks', JSON.stringify(tasks));
    }
}

async function currentUserIdSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('currentIdAsText', JSON.stringify(currentId));
    } else {
        await setItem('currentId', JSON.stringify(currentId));
    }
}

/** Collects and returns data for a new task. */
function collectTaskData() {
    return {
        'id': currentId,
        'status': statusGroup,
        'category': currentCategorySelected[0].name,
        'categoryColor': currentCategorySelected[0].color,
        'title': document.getElementById('addTitel').value,
        'description': document.getElementById('addDescription').value,
        'dueDate': document.getElementById('datepicker').value,
        'priority': currentPrioSelected,
        'contactName': contactCollection.map(contact => contact.name),
        'contactColor': contactCollection.map(contact => contact.color),
        'contactAbbreviation': contactCollection.map(contact => contact.nameAbbreviation),
        'subtasksInProgress': subTaskCollection,
        'subtasksFinish': subtasksFinish,
    };
}

function changeDivColor(id) {
    document.getElementById(id).style.borderColor = '#29ABE2';
}
