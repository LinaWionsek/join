/**
 * Generates the HTML code for a mobile edit menu.
 *
 * @param {number} i - The index of the menu item.
 * @return {string} The HTML code for the mobile edit menu.
 */
function mobileEditMenu(i) {
    return /*html*/ `
    <div class="mobile-add-contact  horicontalAndVertical pointer" onclick="slideOneObject('mobile_edit_delete_box')">
        <img src="./img/more-vert.svg">
    </div>
    `;
}


/**
 * Generates the HTML code for a mobile edit button that triggers the editContact function with the provided index.
 *
 * @param {number} i - The index of the contact to be edited.
 * @return {string} The HTML code for the mobile edit button.
 */
function editContactMobile(i) {
    showOnMobileView('cancel_btn');
    return /* html */ `
    <div class="mobile-edit gap8 d-flex padding8 pointer colorOnHover" onclick="editContact(${i})">
        ${getPencilSVG()}
        <span class="fontSize16 mobile-edit-text">Edit</span>
    </div>
`;
}


/**
 * Generates the HTML code for a mobile delete button that triggers the deleteContact function with the provided index.
 *
 * @param {number} i - The index of the contact to be deleted.
 * @return {string} The HTML code for the mobile delete button.
 */
function deleteContactMobile(i) {
    showOnMobileView('deleteMobileButtonId');
    return /* html */ `
    <div class="mobile-delete gap8 d-flex padding8 pointer colorOnHover" onclick="deleteContact(${i}), closePopupMobile()">
        ${getDeleteSVG()}
        <span class="fontSize16 mobile-delete-text">Delete</span>
    </div>
    `;
}


/**
 * Closes the mobile popup by hiding certain elements and refreshing the contact dialog UI.
 *
 */
function closePopupMobile() {
    toggleVisibility('mobile_edit_delete_box', false);
    toggleVisibility('mobile_backarrow_id', false);
    toggleVisibility('right-container', false);
    toggleVisibility('mobileDotsSymbol', false);
    toggleVisibility('mobile_add_contact_button', true);
    refreshContactDialogUI();
    highlightContactMobile();
}


/**
 * Resets the background color and text color of all elements with the class 'contact-quickinfo'.
 *
 */
function highlightContactMobile() {
    let highlightContact = document.querySelectorAll('.contact-quickinfo');
    highlightContact.forEach(highlightContactElement => {
        highlightContactElement.style.backgroundColor = '';
        highlightContactElement.style.color = '';
    });
}


/**
 * Displays the arrow on the mobile view, adds a CSS class to the right container, and toggles visibility of the right container.
 *
 */
function showArrowMobileView() {
    showOnMobileView('mobile_backarrow_id');
    document.getElementById('right-container').classList.add('contact-details-mobile');
    toggleVisibility('right-container', true);
}


/**
 * Adjusts the layout for the screen size.
 *
 * @param {number} window.innerWidth - The width of the window.
 */
function adjustLayoutForScreenSize() {
    const isMobile = window.innerWidth <= 768;
    toggleVisibility('right-container', !isMobile);
    toggleVisibility('btnBackgroundId', !isMobile);
    toggleVisibility('mobile_add_contact_button', isMobile);
    toggleVisibility('blue_line_horicontal', isMobile);
    toggleVisibility('delete_edit', !isMobile);
    document.getElementById('right-container').classList.toggle('mobile_edit_delete_box', isMobile);
}


/**
 * Toggles the visibility of the blue line on narrow desktop.
 *
 * @param {boolean} is1345px - Indicates if the window width is less than or equal to 1345 pixels.
 */
function toggleBlueLineOnNarrowDesktop() {
    const is1345px = window.innerWidth <= 1345;
    toggleVisibility('blue_line_horicontal', is1345px);
}


/**
 * Toggles the visibility of an element based on the window width.
 *
 * @param {string} id - The ID of the element to toggle visibility for.
 */
function showNotOnMobileView(id) {
    if (window.innerWidth <= 768) {
        toggleVisibility(id, false);
    } else {
        toggleVisibility(id, true);
    }
}


/**
 * Toggles the visibility of an element based on the window width.
 *
 * @param {string} id - The ID of the element to toggle visibility for.
 */
function showOnMobileView(id) {
    if (window.innerWidth <= 768) {
        toggleVisibility(id, true);
    } else {
        toggleVisibility(id, false);
    }
}