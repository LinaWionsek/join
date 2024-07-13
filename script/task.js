let categoryListOpen = false;
let contactListOpen = false;
let searchingContact = false;
let prioLowSelected = false;

async function init() {
    loadActiveUser();
    detectUser();
    showUserCircle();
    markActivePage();
    await currentUserIdLoad();
    await currentUserCategorysLoad();
    await currentUserContactsLoad();
    await currentUserTaskLoad();
    statusSelected('toDo');
    resetTaskForm();
}


/**
 * Sets the status group to the provided status.
 */
function statusSelected(status) {
    statusGroup = status;
}


/**
 * Handles the form submission by checking input fields and adding red borders if necessary.
 */
async function submitForm() {
    let titleInput = document.getElementById('task_title');
    let dateInput = document.getElementById('date_picker');
    if (titleInput.value == '') {
        document.getElementById('task_title').classList.add('red-border');
    } else if (dateInput.value == '') {
        document.getElementById('date_picker').classList.add('red-border');
    } else if (currentCategorySelected[0].name === '') {
        document.getElementById('category_input_container').classList.add('red-border');
    } else {
        addTask();
    }
}


/**
 * Adds a new task to the task list, saves the user ID and task, and handles task completion.
 *
 */
async function addTask() {
    // if (subtasksFinish == undefined){
    //     subtasksFinish = ["-"]
    // }
    // if (subTaskCollection == undefined){
    //     subTaskCollection = ["-"]
    // }
    let task = getTaskTemplate();
    tasks.push(task);
    currentId++;
    await currentUserIdSave();
    await currentUserTaskSave();
    changesSaved('Task added to board');
    let currentPage = window.location.pathname;
    handleTaskCompletion(currentPage);
}


/**
 * Returns a template object for a new task with various properties filled in from the current state.
 *
 * @return {Object} The task template object.
 */
function getTaskTemplate() {
    return {
        'id': currentId,
        'status': statusGroup,
        'category': currentCategorySelected[0].name,
        'categoryColor': currentCategorySelected[0].color,
        'title': document.getElementById('task_title').value,
        'description': document.getElementById('task_description').value,
        'dueDate': document.getElementById('date_picker').value,
        'priority': currentPrioSelected,
        'contactName': contactCollection.map(contact => contact.name),
        'contactColor': contactCollection.map(contact => contact.color),
        'contactAbbreviation': contactCollection.map(contact => contact.nameAbbreviation),
        'subtasksInProgress': subTaskCollection,
        'subtasksFinish': subtasksFinish,
    };
}


/**
 * Handles the completion of a task based on the current page.
 * If the current page is the board, it hides the add task popup and updates the board HTML.
 * Otherwise, it redirects to the board page after a short delay.
 */
function handleTaskCompletion(currentPage) {
    if (currentPage === '/join/board.html') {
        updateBoardHTML();
    } else {
        setTimeout(() => {
            window.location.href = './board.html';
        }, 3000);
    }
}


/**
 * Resets the task form by clearing all the fields and resetting the state variables.
 *
 */
function resetTaskForm() {
    currentCategorySelected = [
        {
            'name': '',
            'color': '',
        },
    ];
    subtasksFinish = [];
    subTaskCollection = [];
    selectedIndex = null;
    selectedColorIndex = null;
    currentPrioSelected = '';
    contactCollection = [];
    renderSelectedContacts();
    taskIdForEdit = '';
    statusEdit = '';
    noPrioritySelected();
    resetTaskInputs();
}


/**
 * Resets the task inputs by clearing all the fields and resetting the state variables.
 *
 */
function resetTaskInputs() {
    document.getElementById('task_title').value = '';
    document.getElementById('task_description').value = '';
    document.getElementById('date_picker').value = '';
    document.getElementById('selected_contacts').innerHTML = '';
    document.getElementById('selected_subtasks').innerHTML = '';
    document.getElementById('category_input').value = 'Select task category';
}


//--------------------------------------------Edit Task--------------------------------------------//


/**
 * Asynchronously edits a task based on the provided index.
 *
 * @param {number} i - The index of the task to edit.
 */
async function editTask(i) {
    await currentUserCategorysLoad();
    await currentUserContactsLoad();
    slide('edit_popup', 'edit_popup_section');
    closeTask();
    let taskToEdit = tasks[i];
    document.getElementById('task_title').value = taskToEdit.title;
    document.getElementById('task_description').value = taskToEdit.description;
    document.getElementById('date_picker').value = taskToEdit.dueDate;
    for (let contactNumber = 0; contactNumber < taskToEdit.contactName.length; contactNumber++) {
        const cName = taskToEdit.contactName[contactNumber];
        const cColor = taskToEdit.contactColor[contactNumber];
        const cAbbreviation = taskToEdit.contactAbbreviation[contactNumber];
        contactCollection[contactNumber] = {
            'nameAbbreviation': cAbbreviation,
            'color': cColor,
            'name': cName,
        };
    }
    currentCategorySelected[0].color = taskToEdit.categoryColor;
    currentCategorySelected[0].name = taskToEdit.category;
    statusEdit = taskToEdit.status;
    currentPrioSelected = taskToEdit.priority;
    subTaskCollection = taskToEdit.subtasksInProgress;
    subtasksFinish = taskToEdit.subtasksFinish;
    taskIdForEdit = taskToEdit.id;
    editTaskWindow();
}


/**
 * Updates the task window by detecting priority, updating selected category, rendering selected contacts, and rendering subtasks.
 *
 */
function editTaskWindow() {
    detectPriority();
    updateSelectedCategory();
    renderSelectedContacts();
    renderSubtasks();
}


/**
 * Asynchronously submits the edits made to a task, updates the task object, saves the current user's tasks,
 * slides out the edit popup, marks changes as saved, updates the board HTML, and resets the edit form.
 *
 */
async function submitEdit() {
    const getValue = id => document.getElementById(id).value;
    const getContactInfo = prop => contactCollection.map(contact => contact[prop]);
    let taskEdit = {
        'id': taskIdForEdit,
        'status': statusEdit,
        'category': currentCategorySelected[0].name,
        'categoryColor': currentCategorySelected[0].color,
        'title': getValue('task_title'),
        'description': getValue('task_description'),
        'dueDate': getValue('date_picker'),
        'priority': currentPrioSelected,
        'contactName': getContactInfo('name'),
        'contactColor': getContactInfo('color'),
        'contactAbbreviation': getContactInfo('nameAbbreviation'),
        'subtasksInProgress': subTaskCollection,
        'subtasksFinish': subtasksFinish,
    };
    tasks[tasks.findIndex(task => task.id === taskIdForEdit)] = taskEdit;
    await currentUserTaskSave();
    slideOut('edit_popup', 'edit_popup_section', 200);
    changesSaved('Task edited');
    updateBoardHTML();
    resetEditForm();
}


/**
 * Resets the edit form by clearing all fields and setting variables to initial values.
 *
 */
function resetEditForm() {
    document.getElementById('category_input').value = 'Select task category';
    contactCollection = [];
    taskIdForEdit = '';
    statusEdit = '';
    selectedIndex = null;
    selectedColorIndex = null;
}


//--------------------------------------------Add Task Board--------------------------------------------//


/**
 * Asynchronously adds a task from the board.
 *
 */
async function addTaskFromBoard() {
    await currentUserCategorysLoad();
    await currentUserContactsLoad();
    slide('board_task_popup', 'board_task_popup_section');
    document.getElementById('board_task_popup').innerHTML = renderAddTaskContent();
    resetTaskForm();
}


/**
 * Renders the content for adding a task.
 *
 * @return {string} The HTML string for the task popup content.
 */
function renderAddTaskContent() {
    return /*html*/ `
        <div onclick="stopBody(event)" class="task-popup-content">
            <div class="task-popup-headline-container">
                <div class="fontSize61"><b>Add Task</b></div>
                <div class="pointer close-popup" onclick="slideOut('board_task_popup', 'board_task_popup_section', 200)">
                    <img src="./img/close.svg" alt="">
                </div>
            </div>
            <section class="task-popup-bg d-none" id="task_popup_section">
                <div class="task-popup-card d-flex" id="task_popup">
                    <div class="left-popup">
                        <div id="close_popup_mobile">
                            <img onclick="closePopup()" src="./img/close-white.svg">
                        </div>
                        <div id="left_popup_content"></div>
                    </div>
                    <div class="center-popup">
                        <div id="center_popup_content"></div>
                    </div>
                    <div class="right-popup d-flex">
                        <div id="close_popup" class="pointer">
                            <img onclick="closePopup()" src="./img/close.svg" alt="">
                        </div>
                        <div id="right_popup_content"></div>
                    </div>
                </div>
            </section>

            <form>
                <div class="task-content">
                    <div class="left-container">
                        <div>
                            <div>
                                Title
                                <span class="required-star">*</span>
                            </div>
                            <input placeholder="Enter a title" id="task_title" class="fontSize20 width-100P">
                        </div>
                        <div>
                            <div>
                                Description
                            </div>
                            <textarea id="task_description" class="width-100P fontSize20" placeholder="Enter a Description"
                                type="text"></textarea>
                        </div>
                        <div>
                            <div>
                                Assigned to
                            </div>
                            <div onclick="toggleContactList()" id="assigned_to_input_container" class="custom-input">
                                <input onkeyup="searchContacts()" placeholder="Select contacts to assign" id="assigned_to_input"
                                    class="fontSize20">
                                <img id="contact_select_arrow_up" class="d-none" src="./img/arrow-up.svg" alt="">
                                <img id="contact_select_arrow_down" src="./img/arrow-down.svg" alt="">
                            </div>
                            <div id="contact_list_container" class="d-none">
                                <div id="contact_list" class="contact-list"></div>
                                <div onclick="openAddContactPopup()" class="button blue-btn">
                                    Add contact
                                    <img src="./img/add-task-person-add.svg" alt="">
                                </div>
                            </div>
                            <div id="selected_contacts"></div>
                        </div>
                    </div>
                    <img class="task-vector" src="./img/vector-task.svg" alt="">
                    <div class="right-container">
                        <div>
                            <div>
                                Due date
                                <span class="required-star">*</span>
                            </div>
                            <input type="date" placeholder="Enter a title" id="date_picker" class="fontSize20 width-100P">
                        </div>
                        <div>
                            <div>
                                Prio
                            </div>
                            <div class="prio-container">
                                <div id="button_urgent" onclick="selectPriority('urgent')" class="button prio-btn">
                                    <span>Urgent</span>
                                    <img id="prio_urgent" src="./img/prio-urgent.svg" alt="">
                                </div>
                                <div id="button_medium" onclick="selectPriority('medium')" class="button prio-btn">
                                    Medium
                                    <img id="prio_medium" src="./img/prio-medium.svg" alt="">
                                </div>
                                <div id="button_low" onclick="selectPriority('low')" class="button prio-btn">
                                    Low
                                    <img id="prio_low" src="./img/prio-low.svg" alt="">
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                Category
                                <span class="required-star">*</span>
                            </div>
                            <div onclick="toggleCategoryList()" id="category_input_container" class="custom-input">
                                <input readonly value="Select task category" id="category_input" class="fontSize20 pointer">
                                <img onclick="renderCategories()" class="d-none" id="category_select_arrow_up"
                                    src="./img/arrow-up.svg" alt="">
                                <img id="category_select_arrow_down" src="./img/arrow-down.svg" alt="">
                            </div>
                            <div id="category_list_container" class="d-none">
                                <div id="category_list" class="cateogry-list"></div>
                                <div onclick="openAddCategoryPopup()" class="button blue-btn">
                                    Add new category
                                    <img src="./img/add-task-category.svg" alt="">
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                Subtasks
                            </div>
                            <div id="subtasks_input_container" class="custom-input">
                                <input placeholder="Add new subtask" id="subtasks_input" class="fontSize20">
                                <img onclick="addSubtask()" src="./img/plus.svg">
                            </div>
                            <div id="selected_subtasks"></div>
                            <div id="edit_container" class="d-none"></div>
                        </div>
                    </div>
                </div>
                <div class="task-bottom-edit">
                    <div class="required-info">
                        <span class="required-star">*</span>
                        This field is required
                    </div>
                    <div class="button-group">
                        <div onclick="resetTaskForm()" class="button outline-btn">
                            Clear
                            <svg class="colorOnHover" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 25" fill="none">
                                <path
                                    d="M12.001 12.5001L17.244 17.7431M6.758 17.7431L12.001 12.5001L6.758 17.7431ZM17.244 7.25708L12 12.5001L17.244 7.25708ZM12 12.5001L6.758 7.25708L12 12.5001Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div onclick="submitForm(), slideOut('board_task_popup', 'board_task_popup_section', 200)"
                            class="button blue-btn">
                            Create Task
                            <img src="./img/check-white.svg" alt="">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `;
}
