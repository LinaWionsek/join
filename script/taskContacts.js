/**
 * Toggles the visibility of the contact list container, contact select arrow up, and contact select arrow down elements.
 * If the contact list is open or searching is in progress, the elements are made visible and the contacts are fetched.
 * Otherwise, the elements are hidden.
 *
 */
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


/**
 * Retrieves contacts based on the input value and updates the contact list accordingly.
 *
 */
function getContacts() {
    let contactContainer = document.getElementById('contact_list');
    let text = document.getElementById('assigned_to_input').value;
    let searchedResult = contactsArray.filter(t => t['name'].toLowerCase().includes(text.toLowerCase()));
    if (text === '') {
        searchingContact = false;
        showAllContacts(contactContainer);
    } else {
        searchingContact = true;
        showSearchedContacts(contactContainer, searchedResult);
    }
}


/**
 * Renders all contacts in the given contact container.
 *
 * @param {HTMLElement} contactContainer - The container element where the contacts will be rendered.
 */
function showAllContacts(contactContainer) {
    contactContainer.innerHTML = '';
    for (let i = 0; i < contactsArray.length; i++) {
        const contactColor = contactsArray[i]['color'];
        const contactNameAbbreviation = contactsArray[i]['nameAbbreviation'];
        const contactName = contactsArray[i]['name'];
        contactContainer.innerHTML += renderContacts(contactColor, contactNameAbbreviation, contactName);
    }
}


/**
 * Renders the searched contacts in the given contact container.
 *
 * @param {HTMLElement} contactContainer - The container element where the contacts will be rendered.
 * @param {Array} searchedResult - The array of contacts that match the search criteria.
 * @return {void} This function does not return anything.
 */
function showSearchedContacts(contactContainer, searchedResult) {
    contactContainer.innerHTML = '';
    for (let j = 0; j < searchedResult.length; j++) {
        const colorResult = searchedResult[j]['color'];
        const nameAbbreviationResult = searchedResult[j]['nameAbbreviation'];
        const nameResult = searchedResult[j]['name'];
        contactContainer.innerHTML += renderContacts(colorResult, nameAbbreviationResult, nameResult);
    }
}


/**
 * Renders a contact box HTML element with the provided color, abbreviation, and name.
 *
 * @param {string} color - The color of the contact logo.
 * @param {string} abbreviation - The abbreviation of the contact name.
 * @param {string} name - The full name of the contact.
 * @return {string} The HTML element representing the contact box.
 */
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


/**
 * Selects a contact from the contactsArray and updates the contactCollection and UI accordingly.
 *
 * @param {string} name - The name of the contact to select.
 */
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
}


/**
 * Renders the selected contacts.
 *
 */
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


/**
 * Searches for contacts and toggles the contact list.
 *
 */
function searchContacts() {
    searchingContact = true;
    toggleContactList();
}


//--------------------------------------------Contact Creation--------------------------------------------//


/**
 * Opens the add contact popup by sliding the 'task_popup' element into view and rendering the left, center, and right content for the popup.
 *
 */
function openAddContactPopup() {
    slide('task_popup', 'task_popup_section');
    renderAddContactLeftContent();
    renderAddContactCenterContent();
    renderAddContactRightContent();
}


/**
 * Renders the left content of the add contact popup by setting the innerHTML of the 'left_popup_content' element.
 *
 */
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


/**
 * Renders the center content of the add contact popup by setting the innerHTML of the 'center_popup_content' element.
 *
 */
function renderAddContactCenterContent() {
    document.getElementById('center_popup_content').innerHTML = /*html*/ `
        <div id="no_profile_img">
            <img class="circle" src="./img/circle.svg">
            <img class="person-in-circle" src="./img/person.svg">
        </div>
    `;
}


/**
 * Renders the right content of the add contact popup by setting the innerHTML of the 'right_popup_content' element.
 *
 */
function renderAddContactRightContent() {
    document.getElementById('right_popup_content').innerHTML = /*html*/ `  
    <form onsubmit="createContact(); return false;" id="contact_form">
    <input type="text" placeholder="Name" id="inputNameId" class="fontSize20" required>
    <input type="email" placeholder="Email" id="inputEmailId" class="fontSize20" required>
    <input type="tel" pattern="[0-9+ ]+" placeholder="Phone" id="input_phone"
        class="fontSize20"
        oninvalid="this.setCustomValidity('Invalid input! Only + and numbers from 0-9 are allowed')"
        oninput="this.setCustomValidity('')" required>
    <div class="d-flex textHorizontal contact-popup-buttons fontSize20">
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
        <button class="button blue-btn">
            <span id="textChangeToSaveId">Create contact</span>
            <img src="./img/check-white.svg">
        </button>
    </div>
</form>`;
}


/**
 * Creates a new contact with the input values, saves it, and performs necessary UI updates.
 *
 */
async function createContact() {
    let newContact = {
        'name': document.getElementById('inputNameId').value,
        'nameAbbreviation': makeNameAbbreviation(document.getElementById('inputNameId').value),
        'email': document.getElementById('inputEmailId').value,
        'phone': document.getElementById('input_phone').value,
        'color': getColor(),
    };
    contactsArray.push(newContact);
    await currentUserContactsSave();
    clearInputFields();
    slideOut('task_popup', 'task_popup_section', 200);
    changesSaved('Contact successfully created');
    getContacts();
}


/**
 * This function retrieves the next color from the colorArray, updates the nextColorIndex, and returns the color.
 *
 * @return {string} The color retrieved from the colorArray.
 */
function getColor() {
    if (nextColorIndex >= colorArray.length) {
        nextColorIndex = 0;
    }
    let color = colorArray[nextColorIndex];
    nextColorIndex++;
    setItem('nextColorIndex', JSON.stringify(nextColorIndex));
    return color;
}