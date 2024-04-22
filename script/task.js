let categoryListOpen = false;
let contactListOpen = false;
let searchingContact = false;
let prioLowSelected = false;

async function init() {
    loadActiveUser();
    userCircle();
    markActivePage();
    await currentUserIdLoad();
    await currentUserCategorysLoad();
    await currentUserContactsLoad();
    await currentUserTaskLoad();
    statusSelected('toDo');
    resetTaskForm();
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

async function addTask() {
    let task = getTaskTemplate();
    tasks.push(task);
    currentId++;
    await currentUserIdSave();
    await currentUserTaskSave();
    changesSaved('Task added to board');
    let currentPage = window.location.pathname;
    handleTaskCompletion(currentPage);
}

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
        'contactName': contactCollection.map(contact => {
            console.log(contact.name);
            return contact.name;
        }),
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
        // document.getElementById('addTaskPop').classList.add('d-none');
        updateBoardHTML();
    } else {
        setTimeout(() => {
            window.location.href = './board.html';
        }, 3000);
    }
}

function resetTaskForm(){
    currentCategorySelected = [{
        'name': '',
        'color': '',
    }];
    subtasksFinish = [];
    subTaskCollection = [];
    selectedIndex = null;
    selectedColorIndex = null;
    currentPrioSelected = "";

    contactCollection = [];
    // toggleContactList();
    renderSelectedContacts();

    taskIdForEdit = '';
    statusEdit = '';

    noPrioritySelected();
    document.getElementById('task_title').value = '';
    document.getElementById('task_description').value = '';
    document.getElementById('date_picker').value = '';

    document.getElementById('selected_contacts').innerHTML = '';
    document.getElementById('selected_subtasks').innerHTML = '';
    document.getElementById('category_input').value = 'Select task category';
   
}

function showValues(){
    let title = document.getElementById('task_title')
    let description = document.getElementById('task_description')
    let date = document.getElementById('date_picker')
    console.log(title.value)
    console.log(description.value)
    console.log(date.value)
    console.log(selectedIndex)
    console.log(selectedColorIndex)
    console.log(currentId)
    console.log(statusGroup)
    console.log(currentCategorySelected)
    console.log(currentPrioSelected)
    console.log(subTaskCollection)
    console.log(subtasksFinish)
    console.log(contactCollection)
    console.log(taskIdForEdit)
    // console.log(statusEdit)
    // console.log()
    // console.log()
    // console.log()
    // console.log()
    // console.log()
    // console.log()
}


/**
 * Saves task-related data.
 */
// async function saveTaskData() {
//     await currentUserTaskSave();
//     await currentUserIdSave();
//     resetAllAddTaskElements();
//     changesSaved('Task added to board');
// }
//front bg

/** Collects and returns data for a new task. */
// function collectTaskData() {
//     return {
//         'id': currentId,
//         'status': statusGroup,
//         'category': currentCategorySelected[0].name,
//         'categoryColor': currentCategorySelected[0].color,
//         'title': document.getElementById('addTitel').value,
//         'description': document.getElementById('addDescription').value,
//         'dueDate': document.getElementById('datepicker').value,
//         'priority': currentPrioSelected,
//         'contactName': contactCollection.map(contact => contact.name),
//         'contactColor': contactCollection.map(contact => contact.color),
//         'contactAbbreviation': contactCollection.map(contact => contact.nameAbbreviation),
//         'subtasksInProgress': subTaskCollection,
//         'subtasksFinish': subtasksFinish,
//     };
// }
// #region Subtasks
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
// #endregion
// #region Priority
//--------------------------------------------Priory--------------------------------------------//
function selectPriority(prio) {
    if (currentPrioSelected != prio) {
        if (prio == 'low') {
            selectLowPriority(prio);
        } else if (prio == 'medium') {
            selectMediumPriority(prio);
        } else if (prio == 'urgent') {
            selectUrgentPriority(prio);
        }
    } else {
        noPrioritySelected();
    }
}

function detectPriority() {
    if (currentPrioSelected == 'low') {
        selectLowPriority(currentPrioSelected);
    } else if (currentPrioSelected == 'medium') {
        selectMediumPriority(currentPrioSelected);
    } else if (currentPrioSelected == 'urgent') {
        selectUrgentPriority(currentPrioSelected);
    } else {
        noPrioritySelected();
    }
}

function noPrioritySelected() {
    console.log('no prio');
    currentPrioSelected = '';
    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');

    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');

    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}

function selectLowPriority(prio) {
    currentPrioSelected = prio;
    console.log(currentPrioSelected);
    document.getElementById('prio_low').src = `./img/prio-low-white.svg`;
    document.getElementById('button_low').classList.add('prio-low');

    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');

    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}

function selectMediumPriority(prio) {
    currentPrioSelected = prio;
    console.log(currentPrioSelected);
    document.getElementById('prio_medium').src = `./img/prio-medium-white.svg`;
    document.getElementById('button_medium').classList.add('prio-medium');

    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');

    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}

function selectUrgentPriority(prio) {
    currentPrioSelected = prio;
    console.log(currentPrioSelected);
    document.getElementById('prio_urgent').src = `./img/prio-urgent-white.svg`;
    document.getElementById('button_urgent').classList.add('prio-urgent');

    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');

    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');
}

// #endregion
// #region Categories
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

function changeDeleteImg() {
    document.getElementById('delete_icon').src = 'img/delete-white.svg';
}

function resetDeleteImg() {
    document.getElementById('delete_icon').src = 'img/delete.svg';
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
        toggleVisibility('category_select_arrow_up', false);
        toggleVisibility('category_select_arrow_down', true);
    }
}
// #endregion
// #region Category Creation
//--------------------------------------------Category Creation--------------------------------------------//
function cancelCategorySelection() {
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
            onclick="slideOut('task_popup', 'task_popup_section', 200)"
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
</div>`;
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
    changesSaved('Category successfully created');
}

function isValidCategoryInput() {
    let inputElem = document.getElementById('createCategoryInput');
    return inputElem.value.length >= 2 && selectedColorIndex !== null;
}

function alertInvalidInput() {
    alert('Bitte geben Sie einen Kategorienamen mit mindestens 2 Buchstaben ein und wählen Sie eine Farbe aus.');
}

function closePopup() {
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
// #endregion
// #region Contacts
//--------------------------------------------Contacts--------------------------------------------//
function toggleContactList() {
    if (contactListOpen || searchingContact) {
        toggleVisibility('contact_list_container', true);
        toggleVisibility('contact_select_arrow_up', true);
        toggleVisibility('contact_select_arrow_down', false);

        getContacts();
    } else {
        toggleVisibility('contact_list_container', false);
        toggleVisibility('contact_select_arrow_up', false);
        toggleVisibility('contact_select_arrow_down', true);
    }
    contactListOpen = !contactListOpen;
}

function getContacts() {
    let contactContainer = document.getElementById('contact_list');
    let text = document.getElementById('assigned_to_input').value;
    let searchedResult = contactsArray.filter(t => t['name'].toLowerCase().includes(text.toLowerCase()));

    if (text === '') {
        searchingContact = false;
        contactContainer.innerHTML = '';
        for (let i = 0; i < contactsArray.length; i++) {
            const contactColor = contactsArray[i]['color'];
            const contactNameAbbreviation = contactsArray[i]['nameAbbreviation'];
            const contactName = contactsArray[i]['name'];
            contactContainer.innerHTML += renderContacts(contactColor, contactNameAbbreviation, contactName);
        }
    } else {
        searchingContact = true;
        contactContainer.innerHTML = '';
        for (let j = 0; j < searchedResult.length; j++) {
            const colorResult = searchedResult[j]['color'];
            const nameAbbreviationResult = searchedResult[j]['nameAbbreviation'];
            const nameResult = searchedResult[j]['name'];
            contactContainer.innerHTML += renderContacts(colorResult, nameAbbreviationResult, nameResult);
        }
    }
}

function renderContacts(color, abbreviation, name) {
    let index = contactCollection.findIndex(c => c['name'] === name);
    if (index == -1) {
        return /*html*/ `
        <div onclick="selectContact('${name}')" class="contact-box">
            <div class="contact">
                <div style="background-color:${color}" class="contact-logo">
                    ${abbreviation}
                </div>
                <div>${name}</div>
            </div>
            <div>
                <img src="./img/subtask-checkbox-unchecked.svg">
            </div>
        </div>
       `;
        // renderSelectedContacts(i);
    } else {
        return /*html*/ `
        <div onclick="selectContact('${name}')" class="contact-box selected">
            <div class="contact selected">
                <div style="background-color:${color}" class="contact-logo">
                    ${abbreviation}
                </div>
                <div>${name}</div>
            </div>
            <div>
                <img src="./img/add-task-selected-contact-checkbox.svg">
            </div>
        </div>
    `;
    }
}

function selectContact(name) {
    let i = contactsArray.findIndex(c => c['name'] === name);
    let selectedContact = {
        'name': contactsArray[i]['name'],
        'nameAbbreviation': contactsArray[i]['nameAbbreviation'],
        'color': contactsArray[i]['color'],
    };

    let index = contactCollection.findIndex(c => c['name'] === selectedContact['name']);
    if (index == -1) {
        contactCollection.push(selectedContact);
        renderSelectedContacts(i);
    } else {
        contactCollection.splice(index, 1);
        renderSelectedContacts(i);
    }
    getContacts();
    console.log(contactCollection);
}

function renderSelectedContacts() {
    document.getElementById('selected_contacts').innerHTML = '';
    for (let k = 0; k < contactCollection.length; k++) {
        const element = contactCollection[k];

        document.getElementById('selected_contacts').innerHTML += /*html*/ `
        <div class="contact">
            <div style="background-color:${element['color']}" class="contact-logo">
            ${element['nameAbbreviation']}
            </div>
        </div>
        `;
    }
}

function searchContacts() {
    searchingContact = true;
    toggleContactList();
}

// #endregion
// #region Contact Creation
//--------------------------------------------Contact Creation--------------------------------------------//
function openAddContactPopup() {
    slide('task_popup', 'task_popup_section');
    renderAddContactLeftContent();
    renderAddContactCenterContent();
    renderAddContactRightContent();
}
function renderAddContactLeftContent() {
    document.getElementById('left_popup_content').innerHTML = /*html*/ `
    <img src="./img/join-logo-white.svg" id="join_logo_add_contact">
    <spline class="left-popup-text-headline"><b>Add contact</b></spline>
    <spline class="left-popup-text">Tasks are
        better with a team!</spline>
    <div class="blue-line">
    </div>
    `;
}

function renderAddContactCenterContent() {
    document.getElementById('center_popup_content').innerHTML = /*html*/ `
        <div id="no_profile_img">
            <img class="circle" src="./img/circle.svg">
            <img class="person-in-circle" src="./img/person.svg">
        </div>
    `;
}

function renderAddContactRightContent() {
    document.getElementById('right_popup_content').innerHTML = /*html*/ `  
    <form onsubmit="createContact(); return false;" id="contact_form">

    <input type="text" placeholder="Name" id="inputNameId" class="fontSize20" required>
    <input type="email" placeholder="Email" id="inputEmailId" class="fontSize20" required>
    <input type="tel" pattern="[0-9+ ]+" placeholder="Phone" id="inputPhoneId"
        class="fontSize20"
        oninvalid="this.setCustomValidity('Invalid input! Only + and numbers from 0-9 are allowed')"
        oninput="this.setCustomValidity('')" required>


    <div class="d-flex textHorizontal contact-popup-buttons fontSize20">
        <button class="button outline-btn"
            onclick="slideOut('task_popup', 'task_popup_section', 200)"
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
        <button class="button blue-btn">
            <span id="textChangeToSaveId">Create contact</span>
            <img src="./img/check-white.svg">
        </button>
    </div>

</form>`;
}

async function createContact() {
    let newContact = {
        'name': document.getElementById('inputNameId').value,
        'nameAbbreviation': makeNameAbbreviation(document.getElementById('inputNameId').value),
        'email': document.getElementById('inputEmailId').value,
        'phone': document.getElementById('inputPhoneId').value,
        'color': getColor(),
    };
    contactsArray.push(newContact);
    await currentUserContactsSave();
    clearInputFields();
    slideOut('task_popup', 'task_popup_section', 200);
    changesSaved('Contact successfully created');
    getContacts();
}

/** * This function is used to create the profile image color */
function getColor() {
    if (nextColorIndex >= colorArray.length) {
        nextColorIndex = 0;
    }
    let color = colorArray[nextColorIndex];
    nextColorIndex++;
    setItem('nextColorIndex', JSON.stringify(nextColorIndex));
    return color;
}

// contactsaArray[i][nameAbbreviation]
//contactsaArray[i][color]
// contactsaArray[i][name]

// #endregion
// #region Edit Task
//--------------------------------------------Edit Task--------------------------------------------//

async function editTask(i) {
    await currentUserCategorysLoad();
    await currentUserContactsLoad();
    console.log('i', i);
    slide('edit_popup', 'edit_popup_section');
    closeTask();
    let taskToEdit = tasks[i];
    // document.getElementById("addTaskHeadline").innerHTML = 'Edit Task';
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
    console.log('task id for edit', taskIdForEdit);
    editTaskWindow();
}

function editTaskWindow() {
    detectPriority();
    // toggleCategoryList();
    updateSelectedCategory();
    renderSelectedContacts();
    // toggleContactList();
    renderSubtasks();
}

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

function resetEditForm() {
    document.getElementById('category_input').value = 'Select task category';
    contactCollection = [];
    taskIdForEdit = '';
    statusEdit = '';
    selectedIndex = null;
    selectedColorIndex = null;
}

// #endregion

async function addTaskFromBoard() {
    await currentUserCategorysLoad();
    await currentUserContactsLoad();
    slide('board_task_popup', 'board_task_popup_section');
    document.getElementById('board_task_popup').innerHTML = renderAddTaskContent();
    resetTaskForm();
}

// board_task_popup;
// board_task_popup_section;
function renderAddTaskContent() {
    return /*html*/ `
   <div onclick="stopBody(event)" class="contentPositionAddTaskPopup">
   <div class="addTaskPopupHeadlineContainer">
       <div class="fontSize61"><b>Add Task</b></div>
       <div class="pointer close-popup"
       onclick="slideOut('board_task_popup', 'board_task_popup_section', 200)">
       <img src="./img/close.svg" alt="">
   </div>
   </div>
       <section class="task-popup-bg d-none" id="task_popup_section">
           <div class="task-popup-card d-flex" id="task_popup">
               <div class="left-popup">
                   <div id="close_popup_mobile">
                       <img onclick="closePopup()" src="./img/close-white.svg">
                   </div>
                   <div id="left_popup_content">
                   </div>
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
                       <input placeholder="Enter a title" id="task_title"
                           class="fontSize20 width-100P">
                   </div>
                   <div>
                       <div>
                           Description
                       </div>
                       <textarea id="task_description" class="width-100P fontSize20"
                           placeholder="Enter a Description" type="text"></textarea>
                   </div>
                   <div>
                       <div>
                           Assigned to
                       </div>
                       <div onclick="toggleContactList()" id="assigned_to_input_container"
                           class="custom-input">
                           <input onkeyup="searchContacts()" placeholder="Select contacts to assign" id="assigned_to_input" class="fontSize20">
                           <img id="contact_select_arrow_up" class="d-none" src="./img/arrow-up.svg"
                               alt="">
                           <img id="contact_select_arrow_down" src="./img/arrow-down.svg" alt="">
                       </div>
                       <div id="contact_list_container" class="d-none">
                           <div id="contact_list"></div>
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
                       <input type="date" placeholder="Enter a title" id="date_picker"
                           class="fontSize20 width-100P">
                   </div>
                   <div>
                       <div>
                           Prio
                       </div>
                       <div class="prio-container">
                           <div id="button_urgent" onclick="selectPriority('urgent')"
                               class="button prio-btn">
                               <span>Urgent</span>
                               <img id="prio_urgent" src="./img/prio-urgent.svg" alt="">
                           </div>
                           <div id="button_medium" onclick="selectPriority('medium')"
                               class="button prio-btn">
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
                       <div onclick="toggleCategoryList()" id="category_input_container"
                           class="custom-input">
                           <input readonly value="Select task category" id="category_input"
                               class="fontSize20 pointer">
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
                           stroke="currentColor" stroke-width="2" stroke-linecap="round"
                           stroke-linejoin="round" />
                   </svg>
               </div>
               <div onclick="submitForm(), slideOut('board_task_popup', 'board_task_popup_section', 200)" class="button blue-btn">
                   Create Task
                   <img src="./img/check-white.svg" alt="">
               </div>
           </div>
           </div>
       </form>
   <!-- </div> -->

</div>
   `;
}
