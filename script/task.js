async function init() {
    await currentUserContactsLoad();
    await currentUserIdLoad();
    await currentUserTaskLoad();
}
//statusSelected('toDo');

function changeDivColor(id) {
    document.getElementById(id).style.borderColor = '#29ABE2';
}

/**
 * Sets the status group to the provided status.
 */
function statusSelected(status) {
    statusGroup = status;
}

async function createTask() {
    statusSelected('toDo');
    console.log(currentId);
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

//**************************** Subtasks ****************************//
function addSubtask() {
    let input = document.getElementById('subtasks_input');
    if (input.value === '') {
        return;
    } else {
        subTaskCollection.push(input.value);
        renderSubtasks();
        input.value = '';
    }
}

function renderSubtasks() {
    let subtasks = document.getElementById('selected_subtasks');
    subtasks.innerHTML = '';
    for (let i = 0; i < subTaskCollection.length; i++) {
        const singleSubtask = subTaskCollection[i];
        subtasks.innerHTML += /*html*/ `
        <ul ondblclick="editSubtask(${i})" class="d-flex">
            <li>${singleSubtask}</li>
            <div>
                <img onclick="editSubtask(${i})" src="./img/pen.svg">
                <img onclick="deleteSubtask(${i})" src="img/delete.svg">
            </div>
        </ul>
        `;
    }
}

function editSubtask(i) {
    let subtaskToEdit = subTaskCollection[i];
    let editContainer = document.getElementById('edit_container');
    toggleVisibility('edit_container', true);
    editContainer.innerHTML = '';
    editContainer.innerHTML += /*html*/ `
    <div class="subtask-edit-input">
        <input id="edit_input" type="text">
        <img onclick="cancelSubtaskEdit()" class="editAbsolutCross" src="./img/close.svg">
        <img onclick="confirmSubtaskEdit(${i})" class="editAbsolutCheck" src="./img/check-blue.svg">
    </div>
    `;
    let input = document.getElementById('edit_input');
    input.value = subtaskToEdit;
}

function confirmSubtaskEdit(i) {
    let input = document.getElementById('edit_input');
    if (input.value == '') {
        subTaskCollection.splice(i, 1);
    } else {
        subTaskCollection[i] = input.value;
    }
    renderSubtasks();
    input.value = '';
    toggleVisibility('edit_container', false);
}

function cancelSubtaskEdit() {
    let input = document.getElementById('edit_input');
    input.value = '';
    toggleVisibility('edit_container', false);
}

function deleteSubtask(i) {
    subTaskCollection.splice(i, 1);
    renderSubtasks();
}

function renderCategories() {
    toggleVisibility('category_list_container', true);
    let categoryContainer = document.getElementById('category_list');
    categoryContainer.innerHTML = '';
    let customCategory = customCategories[0];
    let mainCategory = mainCategories[0];

    for (let m = 0; m < mainCategory.name.length; m++) {
        const mName = mainCategory.name[m];
        const mColor = mainCategory.color[m];
        categoryContainer.innerHTML += renderMainCategories(mName, mColor, m);
    }

    for (let c = 0; c < customCategory.length; m++) {
        const cName = customCategory.name[m];
        const cColor = customCategory.color[m];
        categoryContainer.innerHTML += renderCustomCategories(cName, cColor, c);
    }
}

function renderMainCategories(name, color, i) {
    if (currentCategorySelected[0].name === name && currentCategorySelected[0].color === color) {
        return /*html*/ `
        <div onclick='selectCategory("main", ${i})' id='categoryMainList${i}' class="cateogry-list-item selected">
            <span>${name}</span>
            <div class="colorCircle" style="${color}"></div>
        </div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectCategory("main", ${i})' id='categoryMainList${i}' class="cateogry-list-item">
            <span>${name}</span>
            <div class="colorCircle" style="${color}"></div>
        </div>
        `;
    }
}

function renderCustomCategories(name, color, i) {
    if (currentCategorySelected[0].name === name && currentCategorySelected[0].color === color) {
        return /*html*/ `
        <div onclick='selectCategory("custom", ${i})' id='categoryCustomList${i}' class="cateogry-list-item selected">
            <span>${name}</span>
            <div class="colorCircle" style="${color}"></div>
        </div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectCategory("custom", ${i})' id='categoryCustomList${i}' class="cateogry-list-item">
            <span>${name}</span>
            <div class="colorCircle" style="${color}"></div>
        </div>
        `;
    }
}

function selectCategory(type, index) {
    let mainCategory = mainCategories[0];
    let customCategory = customCategories[0];
    if (type === 'main') {
        currentCategorySelected[0].name = mainCategory.name[index];
        currentCategorySelected[0].color = mainCategory.color[index];
    }
    if (type === 'custom') {
        currentCategorySelected[0].name = customCategory.name[index];
        currentCategorySelected[0].color = customCategory.color[index];
    }
    renderCategories();
    updateSelectedCategory();
}

function updateSelectedCategory() {
    if (currentCategorySelected[0].name) {
        let input = document.getElementById('category_input');
        input.value = currentCategorySelected[0].name;
        toggleVisibility('category_list_container', false);
    } 
}

function cancelCategorySelection(){
    toggleVisibility('category_list_container', false);
    document.getElementById('category_input').value = 'Select task category';
}

function addCategory() {
    toggleVisibility('add_category_dialog', true);
}
