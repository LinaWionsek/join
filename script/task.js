let categoryListOpen = false;
let contactListOpen = false;

async function init() {
    loadActiveUser();
    userCircle();
    await currentUserIdLoad();
    await currentUserCategorysLoad();
    await currentUserContactsLoad();
    await currentUserTaskLoad();
}
//statusSelected('toDo');

function changeDivColor(id) {
    document.getElementById(id).style.borderColor = '#29ABE2';
}

function resetDivColor(id) {
    document.getElementById(id).style.borderColor = '#d1d1d1';
}

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
        'category': currentCategorySelected[0].name,
        'categoryColor': currentCategorySelected[0].color,
        'title': document.getElementById('task_title').value,
        'description': document.getElementById('task_description').value,
        'dueDate': document.getElementById('date_picker').value,
        // 'priority': currentPrioSelected,
        // 'contactName': contactCollection.map(contact => contact.name),
        // 'contactColor': contactCollection.map(contact => contact.color),
        // 'contactAbbreviation': contactCollection.map(contact => contact.nameAbbreviation),
        'priority': '',
        'contactName': '',
        'contactColor': '',
        'contactAbbreviation': '',
        // 'subtasksInProgress': subTaskCollection,
        // 'subtasksFinish': subtasksFinish,
        'subtasksInProgress': '',
        'subtasksFinish': '',
    };
    console.log(task)
    tasks.push(task);
    currentId++;
    console.log(currentId);
    // saveTaskElements();
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
//front bg

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

//--------------------------------------------Subtasks--------------------------------------------//
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
                <img onclick="editSubtask(${i})" class="edit-icon" src="./img/pen.svg">
                <img onclick="deleteSubtask(${i})" class="delete-icon" src="./img/delete.svg">
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

//--------------------------------------------Categories--------------------------------------------//
function toggleCategoryList() {
    if (categoryListOpen) {
        toggleVisibility('category_list_container', true);
        toggleVisibility('category_select_arrow_up', true);
        toggleVisibility('category_select_arrow_down', false);
        let categoryContainer = document.getElementById('category_list');
        categoryContainer.innerHTML = '';
        let customCategory = customCategories[0];
        let mainCategory = mainCategories[0];
        changeDivColor('category_input_container');
    
        for (let m = 0; m < mainCategory.name.length; m++) {
            const mName = mainCategory.name[m];
            const mColor = mainCategory.color[m];
            categoryContainer.innerHTML += renderMainCategories(mName, mColor, m);
        }
    
        for (let c = 0; c < customCategory.name.length; c++) {
            const cName = customCategory.name[c];
            const cColor = customCategory.color[c];
            categoryContainer.innerHTML += renderCustomCategories(cName, cColor, c);
        }
    } else {
        toggleVisibility('category_list_container', false);
        toggleVisibility('category_select_arrow_up', false);
        toggleVisibility('category_select_arrow_down', true);
        resetDivColor('category_input_container');
    }
   
    categoryListOpen = !categoryListOpen;

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
            <div class="delete-category-container">
                <img onclick="deleteCategory(${i})" class="delete-icon" src="img/delete.svg" alt="">
                <div class="colorCircle" style="${color}"></div>
            </div>
        </div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectCategory("custom", ${i})' id='categoryCustomList${i}' onmouseover="changeDeleteImg()" onmouseout="resetDeleteImg()" class="cateogry-list-item">
            <span>${name}</span>
            <div class="delete-category-container">
                <img onclick="deleteCategory(${i})" id="delete_icon" class="delete-icon" src="img/delete.svg" alt="">
                <div class="colorCircle" style="${color}"></div>
            </div>
        </div>
        `;
    }
}

function changeDeleteImg(i) {
    document.getElementById('delete_icon').src = "img/delete-white.svg";
}

function resetDeleteImg() {
    document.getElementById('delete_icon').src = "img/delete.svg";
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
    toggleCategoryList();
    updateSelectedCategory();
}

function updateSelectedCategory() {
    if (currentCategorySelected[0].name) {
        let input = document.getElementById('category_input');
        input.value = currentCategorySelected[0].name;
        toggleVisibility('category_list_container', false);
        toggleVisibility('arrow_up', false);
        toggleVisibility('arrow_down', true);
    } 
}


//--------------------------------------------Category Creation--------------------------------------------//
function cancelCategorySelection(){
    toggleVisibility('category_list_container', false);
    document.getElementById('category_input').value = 'Select task category';
}

function openAddCategoryPopup() {
    // toggleVisibility('add_category_dialog', true);
    slide('task_popup', 'task_popup_section');
    renderAddCategoryLeftContent();
    renderAddCategoryCenterContent();
    renderAddCategoryRightContent();
    createCategoryColors();
}

function renderAddCategoryLeftContent() {
    // center_popup_content
    document.getElementById('left_popup_content').innerHTML = /*html*/ `
    <img src="./img/join-logo-white.svg" id="join_logo_add_contact">
    <spline class="left-popup-text-headline"><b>Add new category</b></spline>
    <spline class="left-popup-text">Tasks are
        better with a category!</spline>
    <div class="blue-line">
    </div>
    `;
}

function renderAddCategoryCenterContent() {
    document.getElementById('center_popup_content').innerHTML = /*html*/ `
    <div class="center-popup-category-content">
        <div class="add-category-logo-bg"></div>
        <img class="person-in-circle" src="./img/add-task-category.svg">
    </div>
    `;
}

function renderAddCategoryRightContent() {
    document.getElementById('right_popup_content').innerHTML = /*html*/ `  
    <div class="custom-select">
    <input id="createCategoryInput" placeholder="New category name..." type="text">
    <div class="colorSettingBox" id="colorSettingBox">
    </div>
    <div class="popup-button-container">

        <button class="button outline-btn"
            onclick="slideOut('contact_popup', 'contact_popup_section', 200)"
            id="cancelBtnMobileId">
            <spline id="editCancelButtonId">Cancel</spline>

            <svg class="colorOnHover" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                viewBox="0 0 24 25" fill="none">
                <path
                    d="M12.001 12.5001L17.244 17.7431M6.758 17.7431L12.001 12.5001L6.758 17.7431ZM17.244 7.25708L12 12.5001L17.244 7.25708ZM12 12.5001L6.758 7.25708L12 12.5001Z"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </button>
        <button onclick="confirmCreateCategory()" class="button blue-btn">
            <span id="textChangeToSaveId">Create category</span>
            <img src="./img/check-white.svg">
        </button>
    </div>
</div>`
}
function createCategoryColors() {
    let colorContainer = document.getElementById('colorSettingBox');
    colorContainer.innerHTML = '';
    for (let index = 0; index < colorCollection.length; index++) {
        const color = colorCollection[index];
        colorContainer.innerHTML += returnCreateCategoryColors(color, index);
    }
}

function returnCreateCategoryColors(color, index) {
    if (color === selectedColorIndex) {
        return /*html*/ `
        <div onclick='selectColor("${color}")' style="${color}" id='colorCircle${index}' class="colorCircle selectedColor"></div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectColor("${color}")' style="${color}" id='colorCircle${index}' class="colorCircle"></div>
        `;
    }
}

function selectColor(color) {
    updateSelectedColorIndex(color);
    createCategoryColors();
}

function updateSelectedColorIndex(index) {
    selectedColorIndex = selectedColorIndex === index ? null : index;
    // saveTaskElements();
}

function confirmCreateCategory() {
    if (isValidCategoryInput()) {
        closePopup();
        addCategory();
        toggleCategoryList();
    } else {
        alertInvalidInput();
    }
    clearAddCategoryInput();
}

async function addCategory() {
    let inputElem = document.getElementById('createCategoryInput');
    customCategories[0].name.push(inputElem.value);
    customCategories[0].color.push(selectedColorIndex);
    await currentUserCategorysSave();
    // document.getElementById('createCategoryPopupByAddTask').classList.add('d-none');
    selectedColorIndex = null;
    // saveTaskElements();
    toggleCategoryList();
    changesSaved('Category successfully created')
}

function isValidCategoryInput() {
    let inputElem = document.getElementById('createCategoryInput');
    return inputElem.value.length >= 2 && selectedColorIndex !== null;
}

function alertInvalidInput() {
    alert("Bitte geben Sie einen Kategorienamen mit mindestens 2 Buchstaben ein und wählen Sie eine Farbe aus.");
}

function closePopup(){
    slideOut('task_popup', 'task_popup_section', 200);
}

async function deleteCategory(i) {
    customCategories[0].name.splice(i, 1);
    customCategories[0].color.splice(i, 1);
    await currentUserCategorysSave();
    document.getElementById('category_input').value = 'Select task category';
}

function clearAddCategoryInput() {
    document.getElementById('createCategoryInput').value = '';
    selectedColorIndex = null;
}


//--------------------------------------------Contacts--------------------------------------------//
function toggleContactList(){
    if (contactListOpen) {
        toggleVisibility('contact_list_container', true);
        toggleVisibility('contact_select_arrow_up', true);
        toggleVisibility('contact_select_arrow_down', false);
        let contactContainer = document.getElementById('contact_list');
        contactContainer.innerHTML = '';
        for (let i = 0; i < contactsArray.length; i++) {
            const contactColor = contactsArray[i]['color'];
            const contactNameAbbreviation = contactsArray[i]['nameAbbreviation'];
            const contactName = contactsArray[i]['name'];
            contactContainer.innerHTML += renderContacts(contactColor, contactNameAbbreviation, contactName, i)
            
            
        }
    } else {
        toggleVisibility('contact_list_container', false);
        toggleVisibility('contact_select_arrow_up', false);
        toggleVisibility('contact_select_arrow_down', true);
    }
    contactListOpen = !contactListOpen;
}

function renderContacts(color, abbreviation, name, i){
    return /*html*/ `
    <div class="contact-box">
    <div style="background-color:${color}" class="contact-logo">
    <div>${abbreviation}</div>
    </div>
    <div>${name}</div>
    </div>
    
    `;
}
//--------------------------------------------Contact Creation--------------------------------------------//


// contactsaArray[i][nameAbbreviation]
//contactsaArray[i][color]
// contactsaArray[i][name]