//AddTask//
/**
 * Validates the form and adds a task if the form is valid.
 */
function createTask() {
    input1 = document.getElementById('categoryInputV1');
    input2 = document.getElementById('categoryInputV2');
    var form = document.getElementById('myForm');
    if (form.checkValidity()) {
        if (currentCategorySelected[0].name === '') {
            input1.classList.add('inputRed');
            input2.classList.add('inputRed');
            setTimeout(function () {
                input1.classList.remove('inputRed');
                input2.classList.remove('inputRed');
            }, 10000);
        } else {
            saveTaskElements();
            addTask();
        }
    }
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

/** Collects and returns data for a new task. */
function collectTaskData() {
    return {
        'id': currentId,
        'status': statusGroup,
        'category': currentCategorySelected[0].name,
        'categoryColor': currentCategorySelected[0].color,
        'title': document.getElementById("addTitel").value,
        'description': document.getElementById("addDescription").value,
        'dueDate': document.getElementById("datepicker").value,
        'priority': currentPrioSelected,
        'contactName': contactCollection.map(contact => contact.name),
        'contactColor': contactCollection.map(contact => contact.color),
        'contactAbbreviation': contactCollection.map(contact => contact.nameAbbreviation),
        'subtasksInProgress': subTaskCollection,
        'subtasksFinish': subtasksFinish,
    }
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

/**
 * Handles the completion of a task based on the current page.
 * If the current page is the board, it hides the add task popup and updates the board HTML.
 * Otherwise, it redirects to the board page after a short delay.
 */
function handleTaskCompletion(currentPage) {
    if (currentPage === '/join_698/board.html') {
        document.getElementById('addTaskPop').classList.add('d-none');
        updateBoardHTML();
    } else {
        setTimeout(() => { window.location.href = './board.html'; }, 3000);
    }
}

/**
 * Sets the status group to the provided status.
 */
function statusSelected(status) {
    statusGroup = status;
}

/**
 * Clears all the add task elements, effectively resetting the task addition view.
 */
function clearButton() {
    resetAllAddTaskElements();
}

/**
 * Initializes the task editing window.
 */
function editTaskWindow() {
    loadTaskElements();
    setInnerHTML("buttonAreaAddTask", returnButtonAreaEditTask);
    setInnerHTML("assignedToInputContainer", returnAssignToBox1);
    setInnerHTML("assignedToContactsInputContainer", returnAssignToBox2);
    setInnerHTML("categoryAreaV1", returnCategoryBox1);
    setInnerHTML("categoryAreaV2", returnCategoryBox2);
    setInnerHTML("prioBox", returnPrioBox);
    borderColorCheck();
    renderCategorys();
    renderAllSelectedContacts();
    renderAllContactsForSearch();
    renderSubTaskCollection();
    createCategoryWindow();
    initializePrioButtons();
}

/**
 * Prepares the task editing popup by loading details of a specified task.
 * @param {number} i - The index of the task to be edited from the `tasks` array.
 */
async function editTaskNew(i) {
    slide('addTaskPopupPositionFront', 'addTaskPop');
    closeTask();
    let taskToEdit = tasks[i];
    document.getElementById("addTaskHeadline").innerHTML = 'Edit Task';
    document.getElementById("addTitel").value = taskToEdit.title;
    document.getElementById("addDescription").value = taskToEdit.description;
    document.getElementById("datepicker").value = taskToEdit.dueDate;
    for (let contactNumber = 0; contactNumber < taskToEdit.contactName.length; contactNumber++) {
        const cName = taskToEdit.contactName[contactNumber];
        const cColor = taskToEdit.contactColor[contactNumber];
        const cAbbreviation = taskToEdit.contactAbbreviation[contactNumber];
        contactCollection[contactNumber] = {
            'nameAbbreviation': cAbbreviation,
            'color': cColor,
            'name': cName,
        }
    }
    currentCategorySelected[0].color = taskToEdit.categoryColor;
    currentCategorySelected[0].name = taskToEdit.category;
    statusEdit = taskToEdit.status;
    currentPrioSelected = taskToEdit.priority;
    subTaskCollection = taskToEdit.subtasksInProgress;
    subtasksFinish = taskToEdit.subtasksFinish;
    taskIdForEdit = taskToEdit.id;
    saveTaskElements();
    editTaskWindow();
}

/**
 * Hides dropdown UI components related to the task addition form.
 */
function hideAddTaskDropDowns() {
    toggleVisibilityAddTask('assignedToContactsInputContainer', 'assignedToInputContainer');
    toggleVisibilityAddTask('categoryAreaV2', 'categoryAreaV1');

}

/**
 * Gathers data from the editing form, updates the tasks array, and saves the updated task.
 */
async function addEditTask() {
    const getValue = id => document.getElementById(id).value;
    const getContactInfo = prop => contactCollection.map(contact => contact[prop]);
    let taskEdit = {
        'id': taskIdForEdit, 'status': statusEdit,
        'category': currentCategorySelected[0].name, 'categoryColor': currentCategorySelected[0].color,
        'title': getValue("addTitel"), 'description': getValue("addDescription"), 'dueDate': getValue("datepicker"),
        'priority': currentPrioSelected, 'contactName': getContactInfo('name'), 'contactColor': getContactInfo('color'),
        'contactAbbreviation': getContactInfo('nameAbbreviation'), 'subtasksInProgress': subTaskCollection, 'subtasksFinish': subtasksFinish
    };
    tasks[tasks.findIndex(task => task.id === taskIdForEdit)] = taskEdit;
    await currentUserTaskSave();
    resetAllAddTaskElementsBoard();
    updateBoardHTML();
}

/**
 * Resets the task editing board by clearing various elements and resetting data.
 */
function resetAllAddTaskElementsBoard() {
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
}
//Contact popup//

/**
 * If the contact form is valid, creates a new contact and adds it to the `contactsArray`.
 */
async function createContactByPopup() {
    if (validateForm()) {
        changesSaved('Contact successfully created');
        let name = document.getElementById('inputNameId').value
        let newContact = {
            "name": name,
            "nameAbbreviation": makeNameAbbreviation(name),
            "email": document.getElementById('inputEmailId').value,
            "phone": document.getElementById('inputPhoneId').value,
            "color": getColor()
        }
        contactsArray.push(newContact);
        await currentUserContactsSave();
        clearContactPopup();
        toggleVisibilityAddTask('contactPopupByAddTask', '');
        renderAllContactsForSearch();
    }
}

/**
 * Clears input fields of the contact creation popup and hides it.
 */
function clearContactPopup() {
    document.getElementById('inputNameId').value = '';
    document.getElementById('inputEmailId').value = '';
    document.getElementById('inputPhoneId').value = '';
    toggleVisibilityAddTask('contactPopupByAddTask', '')
}

/**
 * Re-renders the contacts list based on a filter text from an input field.
 */
function handleInputChange() {
    let filterText = document.getElementById('assignedToInput').value;
    renderAllContactsForSearch(filterText);
}

//create category//
/**
 * Initializes the category creation window.
 */
function createCategoryWindow() {
    loadTaskElements();
    createCategoryColors();
}

/**
 * Renders available color options for categories.
 */
function createCategoryColors() {
    let colorContainer = document.getElementById('colorSettingBox');
    colorContainer.innerHTML = '';
    for (let index = 0; index < colorCollection.length; index++) {
        const color = colorCollection[index];
        colorContainer.innerHTML += returnCreateCategoryColors(color, index);
    }
}

/**
 * Updates the selected color for category creation.
 * @param {string} color - The color to be selected.
 */
function selectColor(color) {
    updateSelectedColorIndex(color);
    createCategoryColors();
}

/**
 * Creates and adds a new category to the `allCategorys` array.
 */
async function addCategory() {
    let inputElem = document.getElementById('createCategoryInput');
    allCategorys[0].name.push(inputElem.value);
    allCategorys[0].color.push(selectedColorIndex);
    await currentUserCategorysSave();
    document.getElementById('createCategoryPopupByAddTask').classList.add('d-none');
    selectedColorIndex = null;
    saveTaskElements();
    renderCategorys();
    changesSaved('Category successfully created')
}

/** Updates the selected color index based on the provided index. */
function updateSelectedColorIndex(index) {
    selectedColorIndex = selectedColorIndex === index ? null : index;
    saveTaskElements();
}

/**
 * Checks if category input is valid, and if so, creates a new category.
 */
function confirmCreateCategory() {
    if (isValidCategoryInput()) {
        addCategory();
        renderCategorys();
    } else {
        alertInvalidInput();
    }
    clearCreateWindow();
}

/**
 * Clears the category creation window.
 */
function clearCreateWindow() {
    let input = document.getElementById('createCategoryInput');
    input.value = '';
    selectedColorIndex = null;
    saveTaskElements();
}

/**
 * Alerts the user in case of invalid category input.
 */
function alertInvalidInput() {
    alert("Bitte geben Sie einen Kategorienamen mit mindestens 2 Buchstaben ein und wählen Sie eine Farbe aus.");
}

/**
 * Validates the input for category creation.
 */
function isValidCategoryInput() {
    let inputElem = document.getElementById('createCategoryInput');
    return inputElem.value.length >= 2 && selectedColorIndex !== null;
}

/**
 * Clears the category creation window and hides the category creation popup.
 */
function stopCreateCategory() {
    clearCreateWindow();
    toggleVisibilityAddTask('createCategoryPopupByAddTask', '')
}

//only for date-input by addTask.html/ Due date//
/**
 * Event listener to initialize a date picker for task due date input.
 */
document.addEventListener('DOMContentLoaded', function () {
    var dateInput = document.getElementById('datepicker');
    var picker = new Pikaday({
        field: dateInput,
        position: 'top right',
        format: 'DD/MM/YYYY',
        minDate: new Date(), // Das stellt sicher, dass kein Datum vor dem heutigen Datum ausgewählt werden kann.
        onSelect: function (date) {
            const formattedDate = [
                date.getDate().toString().padStart(2, '0'),
                (date.getMonth() + 1).toString().padStart(2, '0'),
                date.getFullYear()
            ].join('/');
            dateInput.value = formattedDate;
        }
    });

    dateInput.addEventListener('focus', function () {
        if (!this.value) {
            const today = new Date();
            const formattedDate = [
                today.getDate().toString().padStart(2, '0'),
                (today.getMonth() + 1).toString().padStart(2, '0'),
                today.getFullYear()
            ].join('/');
            this.value = formattedDate;
            picker.show();
        }
    });
});

//category container add d-none by body-click//
/**
 * Event listener to hide the category dropdown upon a click outside the dropdown area.
 */
document.body.addEventListener('click', function () {
    toggleVisibilityAddTask('categoryAreaV2', 'categoryAreaV1')
});
document.getElementById('categorySection').addEventListener('click', function (event) {
    event.stopPropagation();
});

//contact container add d-none by body-click//
/**
 * Event listener to hide the contacts dropdown upon a click outside the dropdown area.
 */
document.body.addEventListener('click', function () {
    toggleVisibilityAddTask('assignedToContactsInputContainer', 'assignedToInputContainer')
});
document.getElementById('assignTo').addEventListener('click', function (event) {
    event.stopPropagation();
});