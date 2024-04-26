/** * This Array is used to save the contact infos */
let contactsArray = [];
let nameAbbreviationArray = [];

/** * This Array is used to color the profile images */
const colorArray = [
    "#006400", "#00008B", "#8B0000", "#800080", "#808080",
    "#0000CD", "#008000", "#FF0000", "#8A2BE2", "#FFA500",
    "#2E8B57", "#9932CC", "#DC143C", "#228B22", "#20B2AA",
    "#FF1493", "#D2691E", "#00CED1", "#008080", "#FF6347"
];

let colorIndex = 0;
let nextColorIndex = 0;


/**
 * Asynchronously initializes the contacts by detecting the user, loading the active user, showing user circle,
 * loading current user contacts, rendering contacts, toggling blue line on narrow desktop, adjusting layout for screen size,
 * and marking the active page.
 *
 */
async function initContacts() {
    // detectUser();
    loadActiveUser();
    showUserCircle();
    await currentUserContactsLoad();
    renderContacts();
    toggleBlueLineOnNarrowDesktop();
    adjustLayoutForScreenSize();
    markActivePage();
}


/**
 * Renders the contacts by sorting them, clearing the user content, and pulling the name abbreviations.
 *
 * @param {Element} userContent - the element representing the user content
 * @param {string} previousFirstLetter - the previous first letter
 */
function renderContacts() {
    let userContent = document.getElementById('contact_list');
    userContent.innerHTML = '';
    let previousFirstLetter = '';
    contactsArray.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
    nameAbbreviationArray = [];
    pullNameAbbreviation(userContent, previousFirstLetter);
}


/**
 * Pulls the name abbreviation for each contact, generates the first letter of the first name for category split,
 * and creates a 2-letter abbreviation from the first and last name. Updates the user content with initials and contact summary.
 *
 * @param {Element} userContent - The element representing the user content.
 * @param {string} previousFirstLetter - The previous first letter for comparison.
 */
function pullNameAbbreviation(userContent, previousFirstLetter) {
    for (let i = 0; i < contactsArray.length; i++) {
        let contact = contactsArray[i];
        // split first and last name
        let nameParts = contact.name.split(' ');
        let firstName = nameParts[0];
        let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
        // first letter of first name for the category split
        let firstLetter = contact.name.charAt(0).toUpperCase();
        // first letter of first and last name combined
        let nameAbbreviation = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
        nameAbbreviationArray.push(nameAbbreviation);
        if (firstLetter !== previousFirstLetter) {
            userContent.innerHTML += createInitial(firstLetter);
            previousFirstLetter = firstLetter;
        }
        userContent.innerHTML += loadContactSummary(contact, nameAbbreviation, i);
        addNameAbbreviationInContactsArray();
    }
}


/**
 * Creates an HTML element containing an initial and a parting line.
 *
 * @param {string} firstLetter - The initial to be displayed.
 * @return {string} The HTML element containing the initial and the parting line.
 */
function createInitial(firstLetter) {
    return /* html */ `
    <div class="initial fontSize20">
        ${firstLetter}
    </div>
    <div class="parting-line">
    </div>
    `;
}


/**
 * Generates a contact summary HTML element with a profile picture and contact information.
 *
 * @param {Object} contact - The contact object containing name, email, and color.
 * @param {string} nameAbbreviation - The abbreviated name of the contact.
 * @param {number} i - The index of the contact in the contactsArray.
 * @return {string} The HTML element containing the contact summary.
 */
function loadContactSummary(contact, nameAbbreviation, i) {
    return /* html */ `
    <div class="contact-quickinfo pointer"
        onclick="openContactBigInfo(contactsArray[${i}], ${i}, '${nameAbbreviation}')">
        <div class="profile-picture horicontalAndVertical" style="background-color: ${contact.color}">
            <span class="fontSize12 nameAbbreviation">
                ${nameAbbreviation}
            </span>
        </div>
        <div class="column gap5">
            <span class="fontSize20">${maxLetters(contact['name'], 19)}</span>
            <span class="fontSize16 mail-quickinfo">${maxLetters(contact['email'], 25)}</span>
        </div>
    </div>
    `;
}


/**
 * Updates the nameAbbreviation property of each contact in the contactsArray by assigning the corresponding value from the nameAbbreviationArray.
 *
 */
function addNameAbbreviationInContactsArray() {
    for (let i = 0; i < contactsArray.length; i++) {
        contactsArray[i].nameAbbreviation = nameAbbreviationArray[i];
    }
}


/**
 * Shortens a given text to a specified maximum length and appends ellipsis if necessary.
 *
 * @param {string} text - The input text to be truncated.
 * @param {number} maxLength - The maximum length of the truncated text.
 * @return {string} The truncated text with ellipsis if necessary.
 */
function maxLetters(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + '...';
    } else {
        return text;
    }
}


/**
 * Opens the add contact window by toggling the visibility of the profile image and no profile image,
 * clearing the input fields, and refreshing the contact dialog UI.
 *
 */
function openAddContactWindow() {
    toggleVisibility('profile_img', false);
    toggleVisibility('no_profile_img', true);
    clearInputFields();
    refreshContactDialogUI();
}


/**
 * Refreshes the contact dialog UI by setting the add contact text elements,
 * initializing the add contact form actions, and updating the mobile add button icon.
 *
 */
function refreshContactDialogUI() {
    setAddContactTextElements();
    initializeAddContactFormActions();
    updateMobileAddButtonIcon();
}


/**
 * Sets the text elements for adding a contact by toggling visibility, setting cancel text, and changing text for adding or editing a contact.
 *
 */
function setAddContactTextElements() {
    toggleVisibility('add_contact_underline', true);
    document.querySelector('#editCancelButtonId').textContent = 'Cancel';
    document.querySelector('#textChangeToEditContactId').textContent = 'Add contact';
    document.querySelector('#textChangeToSaveId').textContent = 'Add contact';
}


/**
 * Initializes the actions for the add contact form.
 *
 * @param {type} editContactForm - the contact form element
 * @param {type} editCancelButton - the cancel button element
 */
function initializeAddContactFormActions() {
    const editContactForm = document.getElementById('contact_form');
    editContactForm.onsubmit = function () {
        createContact();
        return false;
    };
    const editCancelButton = document.getElementById('editCancelButtonId');
    editCancelButton.onclick = function () {
        slideOut('contact_popup', 'contact_popup_section', 200);
    };
}


/**
 * Updates the mobile add button icon.
 *
 * @param {string} newImage - The new image source for the mobile add button icon.
 * @param {HTMLElement} switchImage - The image element for the mobile add button icon.
 */
function updateMobileAddButtonIcon() {
    let newImage = './img/person-add.svg';
    let switchImage = document.querySelector('#mobile_add_contact_button img');
    switchImage.src = newImage;
}


/**
 * Creates a new contact and saves it to the contactsArray.
 *
 */
async function createContact() {
    let newContact = getNewContactTemplate();
    contactsArray.push(newContact);
    await currentUserContactsSave();
    clearInputFields();
    slideOut('contact_popup', 'contact_popup_section', 200);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('right-container', true);
    renderContacts();
    changesSaved('Contact successfully created');
    hoverNewContact(newContact);
}


/**
 * Returns a new contact template object with the values from the input fields.
 *
 * @return {Object} The new contact template object.
 */
function getNewContactTemplate() {
    return {
        'name': document.getElementById('inputNameId').value,
        'nameAbbreviation': makeNameAbbreviation(document.getElementById('inputNameId').value),
        'email': document.getElementById('inputEmailId').value,
        'phone': document.getElementById('input_phone').value,
        'color': getColor(),
    };
}


/**
 * Retrieves the next color from the colorArray and updates the nextColorIndex.
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


/**
 * Clears the input fields by resetting the values of the 'inputNameId', 'inputEmailId', and 'input_phone' elements.
 *
 */
function clearInputFields() {
    document.getElementById('inputNameId').value = '';
    document.getElementById('inputEmailId').value = '';
    document.getElementById('input_phone').value = '';
}


/**
 * Executes the hover action for a new contact. Finds the index of the contact in the contactsArray
 * based on the name and opens the contact's big info.
 *
 * @param {Object} newContact - The new contact object.
 */
function hoverNewContact(newContact) {
    const newIndex = contactsArray.findIndex(contact => contact.name === newContact.name);
    openContactBigInfo(newContact, newIndex, newContact['nameAbbreviation']);
}


/**
 * Opens the detailed information view for a specific contact, populating it with the necessary data.
 *
 * @param {Object} contact - The contact object to display details for.
 * @param {number} i - The index of the contact in the contactsArray.
 * @param {string} nameAbbreviation - The abbreviated name of the contact.
 */
function openContactBigInfo(contact, i, nameAbbreviation) {
    slideOneObject('contact_details');
    showOnMobileView('mobileDotsSymbol');
    toggleVisibility('mobile_add_contact_button', false);
    document.getElementById('mobileDotsSymbol').innerHTML = mobileEditMenu(i);
    showArrowMobileView();
    initializeEditContactBehavior(i);
    highlightContact(i);
    document.getElementById('detail_profile_picture').innerHTML = contactImage(contact, nameAbbreviation);
    contactDescription(contact);
    document.getElementById('editMobileButtonId').innerHTML = editContactMobile(i);
    deleteEditContactAtIndex(i);
    document.getElementById('deleteMobileButtonId').innerHTML = deleteContactMobile(i);
    deleteEditContactAtIndex(i);
}


/**
 * Initializes the behavior for editing a contact.
 *
 * @param {number} id - The ID of the contact to be edited.
 */
function initializeEditContactBehavior(id) {
    const editContactForm = document.getElementById('contact_form');
    editContactForm.onsubmit = function () {
        saveContact(id);
        return false;
    };
    const editCancelButton = document.getElementById('editCancelButtonId');
    editCancelButton.onclick = function () {
        deleteContact(id);
    };
}


/**
 * Highlights a specific contact by changing its background color and text color.
 *
 * @param {number} i - The index of the contact to be highlighted.
 */
function highlightContact(i) {
    let highlightContact = document.querySelectorAll('.contact-quickinfo');
    highlightContact.forEach(highlightContactElement => {
        highlightContactElement.style.backgroundColor = '';
        highlightContactElement.style.color = '';
    });
    highlightContact[i].style.backgroundColor = '#2A3647';
    highlightContact[i].style.color = 'white';
}


/**
 * Generates a big profile picture element with the provided name abbreviation and contact color.
 *
 * @param {Object} contact - The contact object containing color information.
 * @param {string} nameAbbreviation - The abbreviated name to display.
 * @return {string} The HTML element representing the big profile picture.
 */
function contactImage(contact, nameAbbreviation) {
    return /*html*/ `
    <div class="big-profile-picture horicontalAndVertical fontSize47" style="background-color: ${contact.color}" id="nameAbbreviationId">
        ${nameAbbreviation}
    </div>
`;
}


/**
 * Sets the contact description in the HTML document.
 *
 * @param {Object} contact - The contact object containing the name, email, and phone.
 */
function contactDescription(contact) {
    document.getElementById('contact_name').innerHTML = /*html*/ `${contact['name']}`;
    document.getElementById('emailId').innerHTML = /*html*/ `<a href="mailto:${contact['email']}">${contact['email']}</a>`;
    document.getElementById('phoneId').innerHTML = /*html*/ `<a class="phone-number" href="tel:${contact['phone']}">${contact['phone']}</a>`;
}


/**
 * Deletes or edits a contact at the specified index.
 *
 * @param {number} i - The index of the contact to delete or edit.
 */
function deleteEditContactAtIndex(i) {
    let deleteContact = document.getElementById('delete_edit');
    deleteContact.innerHTML = /* html */ `
    <div class="colorOnHover">
        <div class="edit-delete-contact pointer" onclick="editContact(${i})">
            ${getPencilSVG()}<span>Edit</span>
        </div>
    </div>
    <div class="colorOnHover">
        <div class="edit-delete-contact pointer" onclick="deleteContact(${i})">
            ${getDeleteSVG()}Delete
        </div>
    </div>
    `;
}


/**
 * Saves the contact information to the contactsArray and updates the UI accordingly.
 *
 * @param {number} i - The index of the contact in the contactsArray.
 */
async function saveContact(i) {
    contactsArray[i].name = document.getElementById('inputNameId').value;
    contactsArray[i].email = document.getElementById('inputEmailId').value;
    contactsArray[i].phone = document.getElementById('input_phone').value;
    contactsArray[i].nameAbbreviation = document.getElementById('nameAbbreviationId').innerHTML;
    await currentUserContactsSave();
    document.getElementById('contact_name').innerHTML = contactsArray[i].name;
    document.getElementById('emailId').innerHTML = contactsArray[i].email;
    document.getElementById('phoneId').innerHTML = contactsArray[i].phone;
    changesSaved('Contact successfully saved');
    showHideAfterSaveContact();
    refreshContactDialogUI();
    editContactText();
    highlightContact(i);
    renderContacts();
}


/**
 * Shows or hides certain elements based on the current state of the contact popup after saving a contact.
 *
 */
function showHideAfterSaveContact() {
    showNotOnMobileView('right-container');
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobile_add_contact_button', true);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('contact_details', false);
    toggleVisibility('contactsTitleId', true);
    slideOut('contact_popup', 'contact_popup_section', 200);
}


/**
 * Updates the text content of certain elements to indicate that a contact is being edited.
 *
 */
function editContactText() {
    document.querySelector('#editCancelButtonId').textContent = 'Cancel';
    document.querySelector('#textChangeToEditContactId').textContent = 'Edit contact';
    document.querySelector('#textChangeToSaveId').textContent = 'Save';
}


/**
 * Deletes a contact from the contactsArray and performs related UI updates.
 *
 * @param {number} i - The index of the contact to delete.
 * @return {Promise<void>} A promise that resolves after the contact is deleted and UI is updated.
 */
async function deleteContact(i) {
    changesSaved('Contact successfully deleted');
    refreshContactDialogUI();
    contactsArray.splice(i, 1);
    await currentUserContactsSave();
    showHideAfterDeleteContact();
    changeButtonTextToDeleted();
    renderContacts();
}


/**
 * Toggles the visibility of certain elements after deleting a contact.
 *
 */
function showHideAfterDeleteContact() {
    toggleVisibility('mobile_edit_delete_box', false);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('contact_details', false);
    toggleVisibility('contactsTitleId', true);
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobile_add_contact_button', true);
    showNotOnMobileView('right-container');
}


/**
 * Changes the button text to "Contact successfully deleted".
 *
 */
function changeButtonTextToDeleted() {
    document.querySelector('#success_info_container').textContent = 'Contact successfully deleted';
}


/**
 * Edits a contact by updating the contact popup section and the contact information.
 *
 * @param {number} i - The index of the contact in the contactsArray.
 */
async function editContact(i) {
    slide('contact_popup', 'contact_popup_section');
    handleVisibilitySettingsForEdit();
    document.getElementById('profile_img').innerHTML = contactImageEdit(i);
    document.getElementById('inputNameId').value = contactsArray[i]['name'];
    document.getElementById('inputEmailId').value = contactsArray[i]['email'];
    document.getElementById('input_phone').value = contactsArray[i]['phone'];
    editContactText();
    initializeEditContactBehavior(i);
    await currentUserContactsSave();
    renderContacts();
    highlightContact(i);
}


/**
 * Handles the visibility settings for the edit mode.
 *
 */
function handleVisibilitySettingsForEdit() {
    toggleVisibility('cancel_btn', false);
    toggleVisibility('contact_popup_section', false);
    toggleVisibility('mobile_edit_delete_box', true);
    toggleVisibility('add_contact_underline', true);
    toggleVisibility('profile_img', false);
    toggleVisibility('no_profile_img', true);
}


/**
 * Generates a big profile picture element with the provided name abbreviation and contact color for editing.
 *
 * @param {number} i - The index of the contact in the contactsArray.
 * @return {string} The HTML element representing the big profile picture for editing.
 */
function contactImageEdit(i) {
    return /*html*/ `
    <div class="profile-edit-img fontSize47" style="background-color: ${contactsArray[i]['color']}" id="nameAbbreviationId">
        ${contactsArray[i]['nameAbbreviation']}
    </div>
`;
}