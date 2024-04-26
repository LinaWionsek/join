function toggleCategoryList() {
    if (categoryListOpen) {
        openCategoryList();
        renderAllCategories();
    } else {
        closeCategoryList();
    }
    categoryListOpen = !categoryListOpen;
}

function openCategoryList() {
    toggleVisibility('category_list_container', true);
    toggleVisibility('category_select_arrow_up', true);
    toggleVisibility('category_select_arrow_down', false);
}

function renderAllCategories() {
    let categoryContainer = document.getElementById('category_list');
    categoryContainer.innerHTML = '';
    let customCategory = customCategories[0];
    let mainCategory = mainCategories[0];
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
}

function renderMainCategories(name, color, i) {
    if (currentCategorySelected[0].name === name && currentCategorySelected[0].color === color) {
        return /*html*/ `
        <div onclick='selectCategory("main", ${i})' id='categoryMainList${i}' class="cateogry-list-item selected">
            <span>${name}</span>
            <div class="color-circle" style="${color}"></div>
        </div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectCategory("main", ${i})' id='categoryMainList${i}' class="cateogry-list-item">
            <span>${name}</span>
            <div class="color-circle" style="${color}"></div>
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
                <div class="color-circle" style="${color}"></div>
            </div>
        </div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectCategory("custom", ${i})' id='categoryCustomList${i}' class="cateogry-list-item">
            <span>${name}</span>
            <div class="delete-category-container">
                <img onclick="deleteCategory(${i})" id="delete_icon" class="delete-icon" src="img/delete.svg" alt="">
                <div class="color-circle" style="${color}"></div>
            </div>
        </div>
        `;
    }
}

function closeCategoryList() {
    toggleVisibility('category_list_container', false);
    toggleVisibility('category_select_arrow_up', false);
    toggleVisibility('category_select_arrow_down', true);
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

function cancelCategorySelection() {
    toggleVisibility('category_list_container', false);
    document.getElementById('category_input').value = 'Select task category';
}

function openAddCategoryPopup() {
    slide('task_popup', 'task_popup_section');
    renderAddCategoryLeftContent();
    renderAddCategoryCenterContent();
    renderAddCategoryRightContent();
    createCategoryColors();
}

function renderAddCategoryLeftContent() {
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
    <div class="color-settings-container" id="color_settings">
    </div>
    <div class="popup-button-container">
        <button class="button outline-btn"
            onclick="slideOut('task_popup', 'task_popup_section', 200)"
            id="cancel_btn">
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
    let colorContainer = document.getElementById('color_settings');
    colorContainer.innerHTML = '';
    for (let index = 0; index < colorCollection.length; index++) {
        const color = colorCollection[index];
        colorContainer.innerHTML += returnCreateCategoryColors(color, index);
    }
}

function returnCreateCategoryColors(color, index) {
    if (color === selectedColorIndex) {
        return /*html*/ `
        <div onclick='selectColor("${color}")' style="${color}" id='color_circle${index}' class="color-circle selected-color"></div>
        `;
    } else {
        return /*html*/ `
        <div onclick='selectColor("${color}")' style="${color}" id='color_circle${index}' class="color-circle"></div>
        `;
    }
}

function selectColor(color) {
    updateSelectedColorIndex(color);
    createCategoryColors();
}

function updateSelectedColorIndex(index) {
    selectedColorIndex = selectedColorIndex === index ? null : index;
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
    selectedColorIndex = null;
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
