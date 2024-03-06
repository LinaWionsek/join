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

/** * This function is to load functions at start */
async function initContacts() {
    loadActiveUser();
    userCircle();
    await currentUserContactsLoad();
    renderContacts();
    desktopViewSmall();
    mobileView();
    markCategory();
}

/** * This function us used to render the contact informations and sort it */
function renderContacts() {
    let userContent = document.getElementById('contactsId');
    userContent.innerHTML = '';
    let previousFirstLetter = '';
    contactsArray.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
    nameAbbreviationArray = [];
    pullNameAbbreviation(userContent, previousFirstLetter);
}

/** * This function is to create the name abbreviation */
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
            userContent.innerHTML += contatcsCategory(firstLetter);
            previousFirstLetter = firstLetter;
        }

        userContent.innerHTML += loadContactInfos(contact, nameAbbreviation, i);
        addNameAbbreviationInContactsArray();
    }
}

/** This function is used to create the first letter of a name for the category */
function contatcsCategory(firstLetter) {
    return /* html */ `
    <div class="firstLetterOverContact horicontal fontSize20">
        ${firstLetter}
    </div>
    <div class="partingLine">
    </div>
    `
}

/** * This function is used to save the name abbreviation in the contacts array */
function addNameAbbreviationInContactsArray() {
    for (let i = 0; i < contactsArray.length; i++) {
        contactsArray[i].nameAbbreviation = nameAbbreviationArray[i];
    }
}

/** * This function us used to display the contact infos */
function loadContactInfos(contact, nameAbbreviation, i) {
    return /* html */ `
    <div class="horicontal contactsInfo pointer"
        onclick="openContactBigInfo(contactsArray[${i}], ${i}, '${nameAbbreviation}')">
        <div class="profilePicture horicontalAndVertical" style="background-color: ${contact.color}">
            <span class="fontSize12 nameAbbreviation">
                ${nameAbbreviation}
            </span>
        </div>
        <div class="column gap5">
            <span class="fontSize20">${maxLetters(contact['name'], 19)}</span>
            <span class="fontSize16 emailScrollMenu">${maxLetters(contact['email'], 25)}</span>
        </div>
    </div>
    `
}

/** * This function is to limit the output letters */
function maxLetters(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength - 3) + "...";
    } else {
        return text;
    }
}

/** * This function is used to display the adding screen for new contacts */
function addContact() {
    resetFunctionImageText();
    showNotOnMobileView('cancelBtnMobileId');
    clearInputFields();
}

/** * This function is to save the input in the contact array */
async function createContact() {
    let newContact = {
        "name": document.getElementById('inputNameId').value,
        "nameAbbreviation": makeNameAbbreviation(document.getElementById('inputNameId').value),
        "email": document.getElementById('inputEmailId').value,
        "phone": document.getElementById('inputPhoneId').value,
        "color": getColor()
    }
    contactsArray.push(newContact);
    await currentUserContactsSave();
    clearInputFields();
    slideOut('swipeContactPopupId', 'addContactId', 200);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('mobileVisibilityId', true);
    renderContacts();
    changesSaved('Contact successfully created');
    hoverNewContact(newContact);
}

/** * This function is to clear the input fields in a popup */
function clearInputFields() {
    document.getElementById('inputNameId').value = '';
    document.getElementById('inputEmailId').value = '';
    document.getElementById('inputPhoneId').value = '';
}

/** * This function is to hover the contact after the contact is created */
function hoverNewContact(newContact) {
    const newIndex = contactsArray.findIndex(contact => contact.name === newContact.name);
    openContactBigInfo(newContact, newIndex, newContact['nameAbbreviation']);
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

/** * This function is used to display the contact info in a big container */
function openContactBigInfo(contact, i, nameAbbreviation) {
    slideOneObject('contactInfoBigId');
    showOnMobileView('mobileDotsSymbol');
    toggleVisibility('mobileAddContactId', false);
    document.getElementById('mobileDotsSymbol').innerHTML = mobileEditMenu(i);
    showArrowMobileView();
    changeFunction(i);
    highlightContact(i);

    document.getElementById('profilePictureBigId').innerHTML = contactImage(contact, nameAbbreviation);
    contactDescription(contact);

    document.getElementById('editMobileButtonId').innerHTML = editContactMobile(i);
    deleteEditContactAtIndex(i);
    document.getElementById('deleteMobileButtonId').innerHTML = deleteContactMobile(i);
    deleteEditContactAtIndex(i);
}

/** * This function is used to create the button for the mobile view edit contact menu */
function mobileEditMenu(i) {
    return /*html*/`
    <div class="mobileAddContact horicontalAndVertical pointer" onclick="slideOneObject('mobileEditDeleteBoxId')">
    <img src="./img/more_vert.svg">
    </div>
    `
}

/** * This function is used to show the back button on the mobile view */
function showArrowMobileView() {
    showOnMobileView('mobile_backarrow_id');
    document.getElementById('mobileVisibilityId').classList.add('mobileContactOverview');
    toggleVisibility('mobileVisibilityId', true);
}

/** * This function is used to show the color image on the contact detail view! */
function contactImage(contact, nameAbbreviation) {
    return /*html*/ `
    <div class="profilePictureBig horicontalAndVertical fontSize47" style="background-color: ${contact.color}" id="nameAbbreviationId">
        ${nameAbbreviation}
    </div>
`;
}

/** * This function is used to show the contact description on the detail view */
function contactDescription(contact) {
    document.getElementById('nameId').innerHTML = /*html*/ `${contact['name']}`;
    document.getElementById('emailId').innerHTML = /*html*/ `<a href="mailto:${contact['email']}">${contact['email']}</a>`;
    document.getElementById('phoneId').innerHTML = /*html*/ `<a class="phoneNumber" href="tel:${contact['phone']}">${contact['phone']}</a>`;
}

/** * This function is used to display the Edit Button on the mobile view */
function editContactMobile(i) {
    showOnMobileView('cancelBtnMobileId');
    return /* html */ `
    <div class="mobileEdit gap8 d-flex padding8 pointer colorOnHover" onclick="editContact(${i})">
    ${getPencilSVG()}
        <span class="fontSize16 mobileEditText">Edit</span>
    </div>
`
}

/** * This function is to delete a contact on mobile view */
function deleteContactMobile(i) {
    showOnMobileView('deleteMobileButtonId');
    return /* html */ `
    <div class="mobileDelete gap8 d-flex padding8 pointer colorOnHover" onclick="deleteContact(${i}), closePopupMobile()">
    ${getDeleteSVG()}
        <span class="fontSize16 mobileDeleteText">Delete</span>
    </div>
    `
}

/** * This function is used to highlight the contact which is onclicked */
function highlightContact(i) {
    let highlightContact = document.querySelectorAll('.contactsInfo');
    highlightContact.forEach((highlightContactElement) => {
        highlightContactElement.style.backgroundColor = '';
        highlightContactElement.style.color = '';
    });
    highlightContact[i].style.backgroundColor = '#2A3647';
    highlightContact[i].style.color = 'white';
}

/** * This function is used to close the popup window on mobile view */
function closePopupMobile() {
    toggleVisibility('mobileEditDeleteBoxId', false);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('mobileVisibilityId', false);
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobileAddContactId', true);
    resetFunctionImageText();
    highlightContactMobile();
}

/** * This function is used to reset the highlight of the contact which is onclicked on mobile view*/
function highlightContactMobile() {
    let highlightContact = document.querySelectorAll('.contactsInfo');
    highlightContact.forEach((highlightContactElement) => {
        highlightContactElement.style.backgroundColor = '';
        highlightContactElement.style.color = '';
    });
}

/** * This function is used to pull the index from the contact and give it to the onclicked person */
function deleteEditContactAtIndex(i) {
    let deleteContact = document.getElementById('deleteEditId');
    deleteContact.innerHTML = /* html */ `
    <div class="colorOnHover">
        <div class="editDeleteContact pointer horicontal" onclick="editContact(${i})">
            ${getPencilSVG()}<span class="pencilBigView">Edit</span>
        </div>
    </div>
    <div class="colorOnHover">
        <div class="editDeleteContact pointer horicontal" onclick="deleteContact(${i})">
            ${getDeleteSVG()}Delete
        </div>
    </div>
    `
}

/** * This function is used to delete a contact */
async function deleteContact(i) {
    changesSaved('Contact successfully deleted');
    resetFunctionImageText();
    contactsArray.splice(i, 1);
    await currentUserContactsSave();
    showHideAfterDeleteContact();
    changeButtonTextToDeleted();
    renderContacts();
}

/** This function is to show or hide objects after deleting a contact */
function showHideAfterDeleteContact() {
    toggleVisibility('mobileEditDeleteBoxId', false);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('contactInfoBigId', false);
    toggleVisibility('contactsTitleId', true);
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobileAddContactId', true);
    showNotOnMobileView('mobileVisibilityId');
}

/** * This function is used to edit a contact */
async function editContact(i) {
    slide('swipeContactPopupId', 'addContactId');
    toggleVisibility('cancelBtnMobileId', true);
    toggleVisibility('addContactId', true);
    toggleVisibility('mobileEditDeleteBoxId', false);

    document.getElementById('inputNameId').value = contactsArray[i]['name'];
    document.getElementById('inputEmailId').value = contactsArray[i]['email'];
    document.getElementById('inputPhoneId').value = contactsArray[i]['phone'];

    changeText();
    changeFunction(i);
    await currentUserContactsSave();
    renderContacts();
    highlightContact(i);
}

/** * This function is used to save the changes by editing a contact */
async function saveContact(i) {
    contactsArray[i].name = document.getElementById('inputNameId').value;
    contactsArray[i].email = document.getElementById('inputEmailId').value;
    contactsArray[i].phone = document.getElementById('inputPhoneId').value;
    contactsArray[i].nameAbbreviation = document.getElementById('nameAbbreviationId').innerHTML;

    await currentUserContactsSave();

    document.getElementById('nameId').innerHTML = contactsArray[i].name;
    document.getElementById('emailId').innerHTML = contactsArray[i].email;
    document.getElementById('phoneId').innerHTML = contactsArray[i].phone;

    changesSaved('Contact successfully saved');
    showHideAfterSaveContact();
    resetFunctionImageText();
    changeText();
    highlightContact(i);
    renderContacts();
}

/** * This function is to show or hide objects after saving a contact */
function showHideAfterSaveContact() {
    showNotOnMobileView('mobileVisibilityId');
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobileAddContactId', true);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('contactInfoBigId', false);
    toggleVisibility('contactsTitleId', true);
    slideOut('swipeContactPopupId', 'addContactId', 200);
}

/** * This function is used to change the text in a container */
function changeText() {
    document.querySelector('#editCancelButtonId').textContent = "Delete";
    document.querySelector('#textChangeToEditContactId').textContent = "Edit contact";
    document.querySelector('#textChangeToSaveId').textContent = "Save";
}

/** * This function is to change the text in a button */
function changeButtonTextToDeleted() {
    document.querySelector('#successfullyCreatedId').textContent = "Contact successfully deleted";
}

/** * This function is used to change a function */
function changeFunction(id) {
    const editContactForm = document.getElementById('editContactFormId');
    editContactForm.onsubmit = function () {
        saveContact(id);
        return false;
    };
    const editCancelButton = document.getElementById('editCancelButtonId');
    editCancelButton.onclick = function () {
        deleteContact(id);
    };
}

/** * This function is to reset the changeText() */
function originalText() {
    document.querySelector('#editCancelButtonId').textContent = "Cancel";
    document.querySelector('#textChangeToEditContactId').textContent = "Add contact";
    document.querySelector('#textChangeToSaveId').textContent = "Add contact";
}

/** * This function is to reset the changeFunction(i) */
function originalFunction() {
    const editContactForm = document.getElementById('editContactFormId');
    editContactForm.onsubmit = function () {
        createContact();
        return false;
    };
    const editCancelButton = document.getElementById('editCancelButtonId');
    editCancelButton.onclick = function () {
        slideOut('swipeContactPopupId', 'addContactId', 200);
    };
}

/** * This function is to reset the changeImage() */
function originalImage() {
    let newImage = './img/person_add.svg';
    let switchImage = document.querySelector('#mobileAddContactId img');
    switchImage.src = newImage;
}

/** * This function is switch multiply objects to the original function */
function resetFunctionImageText() {
    originalImage();
    originalText();
    originalFunction();
}

/** * This function is used to disable and enable some id's on the mobile view */
function mobileView() {
    const isMobile = window.innerWidth <= 768;
    toggleVisibility('mobileVisibilityId', !isMobile);
    toggleVisibility('btnBackgroundId', !isMobile);
    toggleVisibility('joinLogoAddContactId', !isMobile);
    toggleVisibility('mobileAddContactId', isMobile);
    toggleVisibility('blueLineId', isMobile);
    toggleVisibility('deleteEditId', !isMobile);
    document.getElementById('contactsTitleId').classList.toggle('horicontal', !isMobile);
    document.getElementById('mobileVisibilityId').classList.toggle('mobileEditDeleteBoxId', isMobile);
}

/** * This function is used to disable and enable some id's on the mobile view */
function desktopViewSmall() {
    const is1345px = window.innerWidth <= 1345;
    toggleVisibility('blueLineId', is1345px);
}

/** * This function is to toggle the visibility (mobile view = yes) */
function showNotOnMobileView(id) {
    if (window.innerWidth <= 768) {
        toggleVisibility(id, false);
    } else {
        toggleVisibility(id, true);
    }
}

/** * This function is to toggle the visibility (mobile view = no) */
function showOnMobileView(id) {
    if (window.innerWidth <= 768) {
        toggleVisibility(id, true);
    } else {
        toggleVisibility(id, false);
    }
}