issummary = false;
isAddTask = false;
isBoard = false;
isContacts = false;
isPolice = false;
isNotice = false;
openMenu = false;


/**
 * Sets the active state for the provided sidebar item and resets other states.
 */
function loadHeaderSidebar(boolian) {
    resetBoolians();
    switchColorSidebar(boolian);
}


/**
 * Resets all the active states of the sidebar items.
 */
function resetBoolians() {
    issummary = false;
    isAddTask = false;
    isBoard = false;
    isContacts = false;
    isPolice = false;
    isNotice = false;
}


/**
 * Updates the active state for the specified sidebar item.
 */
function switchColorSidebar(boolian) {
    boolian = true;
    for (let i = 0; i < classCSS.length; i++) {
        const element = classCSS[i];
    }
}


/**
 * Toggles the visibility of the header menu.
 */
function openHeaderMenu(event) {
    event.stopPropagation();
    openMenu = !openMenu;
    let headerMenu = document.getElementById('menu-header-container');
    openMenu ? headerMenu.classList.remove('d-none') : headerMenu.classList.add('d-none');
}


/**
 * This function is used to mark the active .html page
 *
 */
function markCategory() {
    const currentPage = window.location.href.split('/').pop().trim() || 'index.html';
    const links = document.querySelectorAll(`.sidebar-text[href*="${currentPage}"]`);

    links.forEach(link => {
        const categoryElement = link.querySelector('.sidebar-text-sub');
        categoryElement.classList.add('htmlActive');
        categoryElement.style.color = 'white';
        const categoryImage = link.querySelector('img');
        if (categoryImage) {
            const categoryName = categoryElement.textContent.trim().toLowerCase();
            categoryImage.src = `img/${categoryName}ImageWhite.png`;
        }
    });
}


/**
 * Displays the user's initials within the specified HTML container.
 * Extracts the initials from the active user's name and populates them inside the designated container.
 */
function userCircle() {
    let container = document.getElementById('header-user-img');
    let nameParts = activeUser.name.split(' ');
    let firstName = nameParts[0];
    let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    let nameAbbreviation = `<b>${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}</b>`;
    container.innerHTML = nameAbbreviation
}


/**
 * Triggers the browser's back functionality.
 */
function goBack() {
    window.history.back();
}


/**
 * Renders the header and sidebar UI elements.
 */
function renderSidebarHeader() {
    renderHeader();
    renderSidebar();
}


/**
 * Populates the sidebar with content.
 * Renders content within the sidebar's designated container.
 */
function renderSidebar() {
    let container = document.getElementById('sidebarArea');
    container.innerHTML = returnRenderSidebar();
}


function returnRenderSidebar() {
    return /*html*/`
<div class="sidebar">

    <div class="logo-container">
        <img src="img/join.logo-white.svg" alt="">
    </div>

    <div id="sidebarLinks" class="sidebar-text-area">
        <div class="sideBarCategory">
            <a class="sidebar-text" href="./summary.html">
                <div class="sidebar-text-sub">
                    <img src="img/SummaryIcon.svg">
                    <div class="fontSize16 fontAtMobile">Summary</div>
                </div>
            </a>
        </div>
        <div class="sideBarCategory">
            <a class="sidebar-text" href="./addTask.html">
                <div class="sidebar-text-sub">
                    <img src="img/add.task.icons.svg">
                    <div class="fontSize16 fontAtMobile">Add Task</div>
                </div>
            </a>
        </div>
        <div class="sideBarCategory">
            <a class="sidebar-text" href="./board.html">
                <div class="sidebar-text-sub">
                    <img src="img/board-icon.svg">
                    <div class="fontSize16 fontAtMobile">Board</div>
                </div>
            </a>
        </div>
        <div class="sideBarCategory">
            <a class="sidebar-text" href="./contacts.html">
                <div class="sidebar-text-sub">
                    <img src="img/contacts-icon.svg">
                    <div class="fontSize16 fontAtMobile">Contacts</div>
                </div>
            </a>
        </div>
    </div>
    <div class="quickLinksSidebar fontSize16">
        <a href="./privacy-police.html" class="sidebar-bottom">Privacy Policy</a>
        <a href="./legalNotice.html" class="sidebar-bottom">Legal Notice</a>
    </div>

</div>
`;
}


/**
 * Renders content within the header designated container.
 */
function renderHeader() {
    let container = document.getElementById('headerArea');
    container.innerHTML = returnRenderHeader();
}


function returnRenderHeader() {
    return /*html*/`
    <div class="header">
    <img class="headImgLeft" src="./img/headIconLeft.svg">
    <div class="headerHeadlineBox fontSize20">Kanban Projekt Managment Tool</div>
    <div onclick="openHeaderMenu(event)" id="userCircleHeader" class="headBoxRight">
        <a href="help.html"> <img class="headBoxRightImg" src="./img/helpIcon.svg" alt=""></a>
        <div  id="header-user-img" class="headBoxRightUserCircle fontSize16"></div>
    </div>
</div>
    `;
}


/** * This function is used to create a slide in animation */
function slide(frontId, backgroundId) {
    toggleVisibility(frontId, true);
    toggleVisibility(backgroundId, true);
    slideInAnimation = document.getElementById(frontId);
    slideInAnimation.classList.remove('slide-out', 'slide-in');
    slideInAnimation.offsetHeight;
    slideInAnimation.classList.add('slide-in');
}


/** * This function is used to create a slide out animation */
function slideOut(frontId, backgroundId, time) {
    toggleVisibility(frontId, true);
    toggleVisibility(backgroundId, true);
    setTimeout(function () {
        toggleVisibility(backgroundId, false);
    }, time);
    slideInAnimation = document.getElementById(frontId);
    slideInAnimation.classList.remove('slide-out', 'slide-in');
    slideInAnimation.offsetHeight;
    slideInAnimation.classList.add('slide-out');
}


/** * This function is used to create a slide in animation */
function slideOneObject(frontId) {
    toggleVisibility(frontId, true);
    slideInAnimation = document.getElementById(frontId);
    slideInAnimation.classList.remove('slide-out', 'slide-in');
    slideInAnimation.offsetHeight;
    slideInAnimation.classList.add('slide-in');
}

/** * This function is used to create a slide out animation */
function slideOutOneObject(frontId) {
    toggleVisibility(frontId, true);
    slideInAnimation = document.getElementById(frontId);
    slideInAnimation.classList.remove('slide-out', 'slide-in');
    slideInAnimation.offsetHeight;
    slideInAnimation.classList.add('slide-out');
}

/** * This function is used to prevent the popup from closing when clicked. */
function doNotClose(event) {
    event.stopPropagation();
}

/** * This function is used to the edit and delete menu on the mobile view */
function changesSaved(inputText) {
    document.getElementById('successfullyCreatedId').innerHTML = /* html */ `
    ${inputText}`;
    toggleVisibility('successfullyCreatedId', true);
    slideOneObject('successfullyCreatedId');
    setTimeout(function () {
        slideOutOneObject('successfullyCreatedId');
    }, 2500);
    setTimeout(function () {
        toggleVisibility('successfullyCreatedId', false);
    }, 2900);
}

/** * This function is used to make div-container unvisible or visible */
function toggleVisibility(id, show) {
    const showHide = document.getElementById(id);
    showHide.classList.toggle('d-none', !show);
}

/**
 * Toggles the visibility of sidebar links based on the active user's name.
 * If the active user's name is an empty string, it hides the sidebar links. Otherwise, it hides the empty container.
 */
function hideSidebarLinks() {
    if (activeUser.name === '') {
        document.getElementById('sidebarLinks').classList.add('d-none');
    } else {
        document.getElementById('emptyContainer').classList.add('d-none');
    }
}


/**
 * Hides the header menu if it is currently displayed.
 */
function hideMenuHeader() {
    let element = document.getElementById('menu-header-container');

    if (element.classList.contains('d-none')) {
        return;
    } else {
        element.classList.add('d-none');
    }
}


/**
 * Validates the input value of a form's phone field.
 * Checks whether the entered phone number only contains the plus symbol and digits 0-9. 
 * If the validation fails, it displays an error message and prevents form submission. 
 * Otherwise, it allows form submission.
 */
function validateForm() {
    var input = document.getElementById('inputPhoneId');

    var regex = /^[+0-9]+$/;

    if (!regex.test(input.value)) {
        input.style.borderColor = 'red';
        document.getElementById('errorMessage').innerText = "Invalid input! Only + and numbers from 0-9 are allowed.";
        setTimeout(function () {
            input.style.borderColor = '#A8A8A8';
            document.getElementById('errorMessage').innerText = "";
        }, 6000);

        return false; // Verhindert das Absenden des Formulars
    } else {
        document.getElementById('errorMessage').innerText = "";
        return true; // Ermöglicht das Absenden des Formulars
    }
}


/**
 * Creates a 2-letter abbreviation from a given name (e.g. "John Doe" -> "JD").
 */
function makeNameAbbreviation(name) {
    // split first and last name
    let nameParts = name.split(' ');
    let firstName = nameParts[0];
    let lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    // first letter of first and last name combined
    let nameAbbreviation = `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
    return nameAbbreviation;
}


/** This function is to display the delete svg image */
function getDeleteSVG() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
    <mask id="mask0_89141_3997" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0"
        width="25" height="24">
        <rect x="0.5" width="24" height="24" fill="#D9D9D9" />
    </mask>
    <g mask="url(#mask0_89141_3997)">
        <path
            d="M7.5 21C6.95 21 6.47917 20.8042 6.0875 20.4125C5.69583 20.0208 5.5 19.55 5.5 19V6C5.21667 6 4.97917 5.90417 4.7875 5.7125C4.59583 5.52083 4.5 5.28333 4.5 5C4.5 4.71667 4.59583 4.47917 4.7875 4.2875C4.97917 4.09583 5.21667 4 5.5 4H9.5C9.5 3.71667 9.59583 3.47917 9.7875 3.2875C9.97917 3.09583 10.2167 3 10.5 3H14.5C14.7833 3 15.0208 3.09583 15.2125 3.2875C15.4042 3.47917 15.5 3.71667 15.5 4H19.5C19.7833 4 20.0208 4.09583 20.2125 4.2875C20.4042 4.47917 20.5 4.71667 20.5 5C20.5 5.28333 20.4042 5.52083 20.2125 5.7125C20.0208 5.90417 19.7833 6 19.5 6V19C19.5 19.55 19.3042 20.0208 18.9125 20.4125C18.5208 20.8042 18.05 21 17.5 21H7.5ZM7.5 6V19H17.5V6H7.5ZM9.5 16C9.5 16.2833 9.59583 16.5208 9.7875 16.7125C9.97917 16.9042 10.2167 17 10.5 17C10.7833 17 11.0208 16.9042 11.2125 16.7125C11.4042 16.5208 11.5 16.2833 11.5 16V9C11.5 8.71667 11.4042 8.47917 11.2125 8.2875C11.0208 8.09583 10.7833 8 10.5 8C10.2167 8 9.97917 8.09583 9.7875 8.2875C9.59583 8.47917 9.5 8.71667 9.5 9V16ZM13.5 16C13.5 16.2833 13.5958 16.5208 13.7875 16.7125C13.9792 16.9042 14.2167 17 14.5 17C14.7833 17 15.0208 16.9042 15.2125 16.7125C15.4042 16.5208 15.5 16.2833 15.5 16V9C15.5 8.71667 15.4042 8.47917 15.2125 8.2875C15.0208 8.09583 14.7833 8 14.5 8C14.2167 8 13.9792 8.09583 13.7875 8.2875C13.5958 8.47917 13.5 8.71667 13.5 9V16Z"
            fill="#2A3647" />
    </g>
</svg>
    `
}


/** This function is to display the pencil svg image */
function getPencilSVG() {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <mask id="mask0_89141_3992" style="mask-type:alpha"         maskUnits="userSpaceOnUse" x="0" y="0"
        width="24" height="24">
            <rect width="24" height="24" fill="#D9D9D9" />
        </mask>
        <g mask="url(#mask0_89141_3992)">
            <path
            d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"
            fill="#2A3647" />
        </g>
    </svg>
    `
}