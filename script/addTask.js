/** Loads task elements. */
loadTaskElements();

/**
 * Initializes the task addition process.
 */
async function initAddTask() {
    loadActiveUser();
    userCircle();
    markCategory();
    await currentUserTaskLoad();
    await currentUserIdLoad();
    await currentUserCategorysLoad();
    statusSelected('toDo');
    renderAddTaskContent();
}

/**
 * Sets the innerHTML of a specified DOM element using the content provided by a function.
 */
function setInnerHTML(elementId, contentFunction) {
    document.getElementById(elementId).innerHTML = contentFunction();
}

/**
 * This involves loading task elements, setting content for various sections of the add task view, and 
 */
function renderAddTaskContent() {
    loadTaskElements();
    setInnerHTML("addTaskHeadline", () => 'Add Task');
    setInnerHTML("assignedToInputContainer", returnAssignToBox1);
    setInnerHTML("assignedToContactsInputContainer", returnAssignToBox2);
    setInnerHTML("categoryAreaV1", returnCategoryBox1);
    setInnerHTML("categoryAreaV2", returnCategoryBox2);
    setInnerHTML("prioBox", returnPrioBox);
    setInnerHTML("buttonAreaAddTask", returnButtonAreaAddTask);
    addInputFieldAndListener();
    borderColorCheck();
    renderAllSelectedContacts();
    renderAllContactsForSearch();
    renderSubTaskCollection();
}

/**
 * Adds an input field and an event listener to handle input changes.
 */
function addInputFieldAndListener() {
    let inputField = document.getElementById('assignedToInput');
    inputField.addEventListener('input', handleInputChange);
}

//SubTaskFunctions//
/**
 * Adds a sub-task to the collection.
 */
function addSubTaskToCollection() {
    let input = document.getElementById('subTaskSelectInput');
    if (input.value === '') {
        return;
    } else {
        subTaskCollection.push(input.value);
        saveTaskElements();
        renderSubTaskCollection();
        input.value = '';
    }
}

/**
 * Renders the sub-task collection to the DOM.
 */
function renderSubTaskCollection() {
    let collection = document.getElementById('selectedSubTaskContainer');
    collection.innerHTML = '';
    hideEditContainer();
    for (let i = 0; i < subTaskCollection.length; i++) {
        const subCollection = subTaskCollection[i];
        collection.innerHTML += returnSubTaskCollection(subCollection, i);
    }
}

/**
 * Deletes a sub-task from the collection.
 * @param {number} i - Index of the sub-task.
 */
function deleteSubtaskCollection(i) {
    subTaskCollection.splice(i, 1);
    saveTaskElements();
    renderSubTaskCollection();
}

/**
 * Edits a sub-task.
 * @param {number} i - Index of the sub-task.
 */
function editSubtask(i) {
    let editSub = subTaskCollection[i];
    let inputContainer = document.getElementById('editContainer');
    showEditContainer();
    inputContainer.innerHTML = '';
    inputContainer.innerHTML += returnEditContainer(i);
    let input = document.getElementById('editInput');
    input.value = editSub;
}

/**
 * Confirms the editing of a sub-task.
 * @param {number} i - Index of the sub-task.
 */
function confirmSubEdit(i) {
    let editedInput = document.getElementById('editInput');
    if (editedInput.value === '') {
        subTaskCollection.splice(i, 1);
    } else {
        subTaskCollection[i] = editedInput.value;
    }
    saveTaskElements();
    renderSubTaskCollection();
}

/**
 * cancel the editing of a sub-task.
 */
function stopSubEdit() {
    let editedInput = document.getElementById('editInput');
    editedInput.value = '';
    hideEditContainer();
}

/**
 * show edit window.
 */
function showEditContainer() {
    let inputContainer = document.getElementById('editContainer');
    inputContainer.classList.remove('d-none');
}

/**
 * hide edit window.
 */
function hideEditContainer() {
    let inputContainer = document.getElementById('editContainer');
    inputContainer.classList.add('d-none');
}


/**
 * Resets all elements and data structures related to adding a task.
 */
function resetAllAddTaskElements() {
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
    taskIdForEdit = '';
    statusEdit = '';
    clearAddTaskInputs();
    resetInputs();
    saveTaskElements();
    renderAddTaskContent();
}

/**
 * Clears the values in the input fields used for adding tasks.
 */
function clearAddTaskInputs() {
    let titleAddTask = document.getElementById('addTitel');
    let descriptionAddTask = document.getElementById('addDescription');
    let dueDateAddTask = document.getElementById('datepicker');
    titleAddTask.value = '';
    descriptionAddTask.value = '';
    dueDateAddTask.value = '';
}

//Hide and Show functions//
/**
 * Toggles the visibility of two DOM elements.
 * @param {string} id - ID of the first DOM element.
 * @param {string} id2 - ID of the second DOM element.
 */
function toggleVisibilityAddTask(id, id2, event) {
    const elementOne = document.getElementById(id);
    const elementTwo = document.getElementById(id2);
    if (event) event.stopPropagation();
    if (id) elementOne.classList.add('d-none');
    if (id2) elementTwo.classList.remove('d-none');

    renderAllSelectedContacts();
    renderCategorys();
    createCategoryWindow();
    document.getElementById('selectedContactsDeselect').classList.add('d-none');
}

//Contact functions//
/**
 * Renders all selected contacts to the DOM.
 */
function renderAllSelectedContacts() {
    let contactZone = document.getElementById('selectedContactsContainer');
    contactZone.innerHTML = '';
    for (let index = 0; index < contactCollection.length; index++) {
        contactColors = contactCollection[index].color;
        contactNamesAbbreviation = contactCollection[index].nameAbbreviation;
        contactZone.innerHTML += returnRenderAllSelectedContacts(contactColors, contactNamesAbbreviation, index);
    }
}

/**
 * Renders all contacts for search, optionally filtered by a text.
 */
async function renderAllContactsForSearch(filterText = '') {
    await currentUserContactsLoad();
    let contactZone = document.getElementById('contactsRenderContainer');
    contactZone.innerHTML = '';
    for (let index = 0; index < contactsArray.length; index++) {
        contactColors = contactsArray[index].color;
        contactNamesAbbreviation = contactsArray[index].nameAbbreviation;
        contactNames = contactsArray[index].name;

        if (filterText && !contactNames.toLowerCase().includes(filterText.toLowerCase())) {
            continue;
        }
        contactZone.innerHTML += returnRenderAllContactsForSearch(contactColors, contactNamesAbbreviation, contactNames, index);
    }
}

/**
 * Selects or deselects a contact based on its current state.
 * @param {number} i - Index of the contact.
 * @param {string} key - Key of the contact in the `allContacts` collection.
 */
async function toggleContactSelection(i, event) {
    event.stopPropagation();
    await currentUserContactsLoad();
    const contact = contactsArray[i];
    const el = (suffix) => document.getElementById(`${suffix}${i}`);
    const [mainElement, firstSecondary, secondSecondary] = [el('assignedContactsBox'), el('assignedBox'), el('assignedBoxChecked')];

    if (mainElement.classList.contains('assignedContactsBox')) {
        selectContact(mainElement, firstSecondary, secondSecondary);
        if (!contactCollection.some(c => c.name === contact.name)) contactCollection.push(contact);
    } else {
        deselectContact(mainElement, firstSecondary, secondSecondary);
        contactCollection = contactCollection.filter(c => c.name !== contact.name || c.color !== contact.color);
    }
    saveTaskElements();
}

/**
 * Edits a selected contact by displaying an edit window and populating the input field with the contact's name.
 */
function editSelectedContact(i) {
    let editWindow = document.getElementById('selectedContactsDeselect');
    editWindow.classList.remove('d-none');
    editWindow.innerHTML = returnEditContact(i)
    let input = document.getElementById('editSelectedContact');
    input.value = contactCollection[i].name;
}

/**
 * Clears or removes a selected contact from the contactCollection and updates the rendered views.
 */
function clearSelectedContact(index) {
    contactCollection.splice(index, 1);
    renderAllSelectedContacts();
    renderAllContactsForSearch();
    saveTaskElements();
    let editWindow = document.getElementById('selectedContactsDeselect');
    editWindow.classList.add('d-none');
    let input = document.getElementById('editSelectedContact');
    input.value = '';
}

/**
 * Stops the contact editing process by hiding the edit window and clearing the input field.
 */
function stopEditContact() {
    let editWindow = document.getElementById('selectedContactsDeselect');
    editWindow.classList.add('d-none');
    let input = document.getElementById('editSelectedContact');
    input.value = '';
}

//Category functions//
/**
 * Renders the categories into the specified container.
 */
function renderCategorys() {
    let container = document.getElementById('categoryRenderContainer');
    container.innerHTML = ''; // Leert den Container bevor er neu gerendert wird
    let all = allCategorys[0];
    let main = mainCategorys[0];
    for (let m = 0; m < main.name.length; m++) {
        const mName = main.name[m];
        const mColor = main.color[m];
        container.innerHTML += returnRenderMainCategorys(mName, mColor, m);
    }
    for (let a = 0; a < all.name.length; a++) {
        const aName = all.name[a];
        const aColor = all.color[a];
        container.innerHTML += returnRenderAllCategorys(aName, aColor, a);
    }
}

/**
 * Deletes a specific category and saves the updated categories.
 */
async function deleteCategory(i) {
    let allCategory = allCategorys[0];
    allCategory.name.splice(i, 1);
    allCategory.color.splice(i, 1);
    await currentUserCategorysSave();
    saveTaskElements();
}

/**
 * This function updates the current selected category, re-renders the categories, saves the task elements,
 * and checks the border color.
 */
function selectCategory(type, index) {
    let mainCategory = mainCategorys[0];
    let allCategory = allCategorys[0];
    if (type === 'main') {
        currentCategorySelected[0].name = mainCategory.name[index];
        currentCategorySelected[0].color = mainCategory.color[index];
    }
    if (type === 'all') {
        currentCategorySelected[0].name = allCategory.name[index];
        currentCategorySelected[0].color = allCategory.color[index];
    }
    renderCategorys();
    saveTaskElements();
    borderColorCheck();
}

/**
 * Checks the border color based on the current category selection.
 * If a category is selected, it toggles the visibility of category input areas and updates the inputs.
 */
function borderColorCheck() {
    loadTaskElements();
    if (currentCategorySelected[0].name) {
        toggleVisibilityAddTask('categoryAreaV2', 'categoryAreaV1');
        updateInputs();
    } else {
        resetInputs();
    }
}

/**
 * Updates the values of input elements based on the current category selection.
 */
function updateInputs() {
    let inputV1 = document.getElementById('categoryInputV1');
    let inputV2 = document.getElementById('categoryInputV2');
    setInputValueAndColor(inputV1);
    setInputValueAndColor(inputV2);
}

/**
 * Sets the value of a specified input element based on the current category selection.
 */
function setInputValueAndColor(inputElem) {
    inputElem.value = currentCategorySelected[0].name;
}

/**
 * Resets the values and styles of input elements.
 */
function resetInputs() {
    let inputV1 = document.getElementById('categoryInputV1');
    let inputV2 = document.getElementById('categoryInputV2');
    resetInputValueAndColor(inputV1);
    resetInputValueAndColor(inputV2);
}

/**
 * Resets the value and border color of a specified input element.
 */
function resetInputValueAndColor(inputElem) {
    inputElem.value = 'Select task category';
    inputElem.style.borderColor = '#D1D1D1';
}

//Prio Buttons class-change//
/**
 * Updates visual representation of priority buttons (activ).
 */
function activateButton(btnId, iconId, activeIconId, activeClass, iconSrc) {
    document.getElementById(btnId).classList.add(activeClass);
    document.getElementById(iconId).classList.add('d-none');
    document.getElementById(activeIconId).classList.remove('d-none');
    currentPrioSelected = iconSrc;
    saveTaskElements();
}

/**
 * Updates visual representation of priority buttons (deactiv).
 */
function deactivateButton(btnId, iconId, activeIconId, activeClass) {
    document.getElementById(btnId).classList.remove(activeClass);
    document.getElementById(iconId).classList.remove('d-none');
    document.getElementById(activeIconId).classList.add('d-none');
    currentPrioSelected = "";
    saveTaskElements();
}

/**
 * switch visual representation of priority buttons.
 */
function prioSelectedToggle(btnId, iconId, activeIconId, activeClass, iconSrc, resetOther) {
    if (currentPrioSelected === iconSrc) {
        deactivateButton(btnId, iconId, activeIconId, activeClass);
    } else {
        if (resetOther) resetAll();
        activateButton(btnId, iconId, activeIconId, activeClass, iconSrc);
    }
}

/**
 * Initializes the priority buttons based on the current selected priority.
 * This function determines which button to activate based on the value of currentPrioSelected.
 */
function initializePrioButtons() {
    if (!currentPrioSelected) return;
    let btnId, iconId, activeIconId, activeClass;
    switch (currentPrioSelected) {
        case './img/prioUrgent.svg':
            btnId = 'prioUrgentBtn';
            iconId = 'prioUrgentIcon';
            activeIconId = 'prioUrgentIconActiv';
            activeClass = 'prioBtnActivUrgent';
            break;
        case './img/prioMedium.svg':
            btnId = 'prioMediumBtn';
            iconId = 'prioMediumIcon';
            activeIconId = 'prioMediumIconActiv';
            activeClass = 'prioBtnActivMedium';
            break;
        case './img/prioLow.svg':
            btnId = 'prioLowBtn';
            iconId = 'prioLowIcon';
            activeIconId = 'prioLowIconActiv';
            activeClass = 'prioBtnActivLow';
            break;
        default:
            console.error('Unbekanntes Icon in currentPrioSelected:', currentPrioSelected);
            return;
    }
    activateButton(btnId, iconId, activeIconId, activeClass, currentPrioSelected);
}

/**
 * Resets all priority buttons to their default states.
 */
function resetAll() {
    const buttons = ['prioUrgentBtn', 'prioMediumBtn', 'prioLowBtn'];
    const icons = ['prioUrgentIcon', 'prioMediumIcon', 'prioLowIcon'];
    const activeIcons = ['prioUrgentIconActiv', 'prioMediumIconActiv', 'prioLowIconActiv'];
    const activeClasses = ['prioBtnActivUrgent', 'prioBtnActivMedium', 'prioBtnActivLow'];

    for (let i = 0; i < buttons.length; i++) {
        document.getElementById(buttons[i]).classList.remove(activeClasses[i]);
        document.getElementById(icons[i]).classList.remove('d-none');
        document.getElementById(activeIcons[i]).classList.add('d-none');
    }
    currentPrioSelected = "";
    saveTaskElements();
}


