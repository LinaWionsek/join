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


async function initContacts() {
    detectUser();
    loadActiveUser();
    showUserCircle();
    await currentUserContactsLoad();
    renderContacts();
    toggleBlueLineOnNarrowDesktop();
    adjustLayoutForScreenSize();
    markActivePage ();
}


function renderContacts() {
    let userContent = document.getElementById('contact_list');
    userContent.innerHTML = '';
    let previousFirstLetter = '';
    contactsArray.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
    nameAbbreviationArray = [];
    pullNameAbbreviation(userContent, previousFirstLetter);
}


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


function createInitial(firstLetter) {
    return /* html */ `
    <div class="initial fontSize20">
        ${firstLetter}
    </div>
    <div class="parting-line">
    </div>
    `
}


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
    `
}


function addNameAbbreviationInContactsArray() {
    for (let i = 0; i < contactsArray.length; i++) {
        contactsArray[i].nameAbbreviation = nameAbbreviationArray[i];
    }
}


function maxLetters(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
    } else {
        return text;
    }
}


function openAddContactWindow() {
    toggleVisibility('profile_img', false);
    toggleVisibility('no_profile_img', true);
    clearInputFields();
    refreshContactDialogUI();
}


function refreshContactDialogUI() {
    setAddContactTextElements();
    initializeAddContactFormActions();
    updateMobileAddButtonIcon();
}


function setAddContactTextElements() {
    toggleVisibility('add_contact_underline', true);
    document.querySelector('#editCancelButtonId').textContent = "Cancel";
    document.querySelector('#textChangeToEditContactId').textContent = "Add contact";
    document.querySelector('#textChangeToSaveId').textContent = "Add contact";
}


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


function updateMobileAddButtonIcon() {
    let newImage = './img/person-add.svg';
    let switchImage = document.querySelector('#mobile_add_contact_button img');
    switchImage.src = newImage;
}


async function createContact() {
    let newContact = {
        "name": document.getElementById('inputNameId').value,
        "nameAbbreviation": makeNameAbbreviation(document.getElementById('inputNameId').value),
        "email": document.getElementById('inputEmailId').value,
        "phone": document.getElementById('input_phone').value,
        "color": getColor()
    }
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


function getColor() {
    if (nextColorIndex >= colorArray.length) {
        nextColorIndex = 0;
    }
    let color = colorArray[nextColorIndex];
    nextColorIndex++;
    setItem('nextColorIndex', JSON.stringify(nextColorIndex));
    return color;
}


function clearInputFields() {
    document.getElementById('inputNameId').value = '';
    document.getElementById('inputEmailId').value = '';
    document.getElementById('input_phone').value = '';
}


function hoverNewContact(newContact) {
    const newIndex = contactsArray.findIndex(contact => contact.name === newContact.name);
    openContactBigInfo(newContact, newIndex, newContact['nameAbbreviation']);
}


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


function highlightContact(i) {
    let highlightContact = document.querySelectorAll('.contact-quickinfo');
    highlightContact.forEach((highlightContactElement) => {
        highlightContactElement.style.backgroundColor = '';
        highlightContactElement.style.color = '';
    });
    highlightContact[i].style.backgroundColor = '#2A3647';
    highlightContact[i].style.color = 'white';
}


function contactImage(contact, nameAbbreviation) {
    return /*html*/ `
    <div class="big-profile-picture horicontalAndVertical fontSize47" style="background-color: ${contact.color}" id="nameAbbreviationId">
        ${nameAbbreviation}
    </div>
`;
}


function contactDescription(contact) {
    document.getElementById('contact_name').innerHTML = /*html*/ `${contact['name']}`;
    document.getElementById('emailId').innerHTML = /*html*/ `<a href="mailto:${contact['email']}">${contact['email']}</a>`;
    document.getElementById('phoneId').innerHTML = /*html*/ `<a class="phone-number" href="tel:${contact['phone']}">${contact['phone']}</a>`;
}


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
    `
}


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


function showHideAfterSaveContact() {
    showNotOnMobileView('right-container');
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobile_add_contact_button', true);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('contact_details', false);
    toggleVisibility('contactsTitleId', true);
    slideOut('contact_popup', 'contact_popup_section', 200);
}


function editContactText() {
    document.querySelector('#editCancelButtonId').textContent = "Cancel";
    document.querySelector('#textChangeToEditContactId').textContent = "Edit contact";
    document.querySelector('#textChangeToSaveId').textContent = "Save";
}


async function deleteContact(i) {
    changesSaved('Contact successfully deleted');
    refreshContactDialogUI();
    contactsArray.splice(i, 1);
    await currentUserContactsSave();
    showHideAfterDeleteContact();
    changeButtonTextToDeleted();
    renderContacts();
}


function showHideAfterDeleteContact() {
    toggleVisibility('mobile_edit_delete_box', false);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('contact_details', false);
    toggleVisibility('contactsTitleId', true);
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobile_add_contact_button', true);
    showNotOnMobileView('right-container');
}


function changeButtonTextToDeleted() {
    document.querySelector('#success_info_container').textContent = "Contact successfully deleted";
}


async function editContact(i) {
    console.log(contactsArray[i]['color'],
	contactsArray[i]['nameAbbreviation'])
    slide('contact_popup', 'contact_popup_section');
    toggleVisibility('cancel_btn', true);
    toggleVisibility('contact_popup_section', true);
    toggleVisibility('mobile_edit_delete_box', false);
    toggleVisibility('add_contact_underline', false);
    toggleVisibility('profile_img', true);
    toggleVisibility('no_profile_img', false);
    document.getElementById('profile_img').innerHTML = contactImageEdit(i)
    document.getElementById('inputNameId').value = contactsArray[i]['name'];
    document.getElementById('inputEmailId').value = contactsArray[i]['email'];
    document.getElementById('input_phone').value = contactsArray[i]['phone'];
    editContactText();
    initializeEditContactBehavior(i);
    await currentUserContactsSave();
    renderContacts();
    highlightContact(i);
}


function contactImageEdit(i) {
    return /*html*/ `
    <div class="profile-edit-img fontSize47" style="background-color: ${contactsArray[i]['color']}" id="nameAbbreviationId">
        ${contactsArray[i]['nameAbbreviation']}
    </div>
`;
}

/* MOBILE */
function mobileEditMenu(i) {
    return /*html*/`
    <div class="mobile-add-contact  horicontalAndVertical pointer" onclick="slideOneObject('mobile_edit_delete_box')">
    <img src="./img/more-vert.svg">
    </div>
    `
}


function editContactMobile(i) {
    showOnMobileView('cancel_btn');
    return /* html */ `
    <div class="mobile-edit gap8 d-flex padding8 pointer colorOnHover" onclick="editContact(${i})">
    ${getPencilSVG()}
        <span class="fontSize16 mobile-edit-text">Edit</span>
    </div>
`
}


function deleteContactMobile(i) {
    showOnMobileView('deleteMobileButtonId');
    return /* html */ `
    <div class="mobile-delete gap8 d-flex padding8 pointer colorOnHover" onclick="deleteContact(${i}), closePopupMobile()">
    ${getDeleteSVG()}
        <span class="fontSize16 mobile-delete-text">Delete</span>
    </div>
    `
}


function closePopupMobile() {
    toggleVisibility('mobile_edit_delete_box', false);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('right-container', false);
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobile_add_contact_button', true);
    refreshContactDialogUI();
    highlightContactMobile();
}


function highlightContactMobile() {
    let highlightContact = document.querySelectorAll('.contact-quickinfo');
    highlightContact.forEach((highlightContactElement) => {
        highlightContactElement.style.backgroundColor = '';
        highlightContactElement.style.color = '';
    });
}


function showArrowMobileView() {
    showOnMobileView('mobile_backarrow_id');
    document.getElementById('right-container').classList.add('contact-details-mobile');
    toggleVisibility('right-container', true);
}


function adjustLayoutForScreenSize() {
    const isMobile = window.innerWidth <= 768;
    toggleVisibility('right-container', !isMobile);
    toggleVisibility('btnBackgroundId', !isMobile);
    toggleVisibility('mobile_add_contact_button', isMobile);
    toggleVisibility('blue_line_horicontal', isMobile);
    toggleVisibility('delete_edit', !isMobile);
    document.getElementById('right-container').classList.toggle('mobile_edit_delete_box', isMobile);
}


function toggleBlueLineOnNarrowDesktop() {
    const is1345px = window.innerWidth <= 1345;
    toggleVisibility('blue_line_horicontal', is1345px);
}


function showNotOnMobileView(id) {
    if (window.innerWidth <= 768) {
        toggleVisibility(id, false);
    } else {
        toggleVisibility(id, true);
    }
}


function showOnMobileView(id) {
    if (window.innerWidth <= 768) {
        toggleVisibility(id, true);
    } else {
        toggleVisibility(id, false);
    }
}