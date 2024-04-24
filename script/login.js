let dialog = document.getElementById('dialog');


/**
 * Initializes the login sequence by setting the active user, starting animations,
 * loading the login dialog, and loading existing users.
 *
 */
async function initLogin() {
    activeUser = {
        'name': '',
    };
    saveActiveUser();
    startAnimation();
    loadLogIn();
    await loadUsers();
}


/**
 * Fills the login dialog with the login template.
 *
 */
function loadLogIn() {
    dialog.innerHTML = loadTempleteLogIn();
    let rememberedEmail = localStorage.getItem('rememberMe');
    if (rememberedEmail) {
        document.getElementById('login_email').value = rememberedEmail;
        document.getElementById('checkbox_id').checked = true; // Setzen Sie das "Remember me" Kästchen als angekreuzt
    }
}


/**
 * Starts the join-logo animation by adding the 'animated' class to the '.join-logo-contain' and '.join-logo' elements.
 *
 */
function startAnimation() {
    document.querySelector('.join-logo-contain').classList.add('animated');
    document.querySelector('.join-logo-contain').classList.remove('d-none');
    document.querySelector('.join-logo').classList.add('animated');
}


/**
 * Redirects the user to the registration page.
 *
 */
function loadRegister() {
    window.location.href = './register.html';
}


/**
 * Validates user credentials and logs them in if valid.
 *
 */
function login() {
    let email = document.getElementById('login_email');
    let password = document.getElementById('login_password');
    if (verifyLoginCredentials(email, password)) {
        handleRememberMe(email);
        setActiveUser(email);
        saveActiveUser();
        window.location.href = './summary.html';
    } else {
        loadRedBorderInput();
        loadWarningTextTamplate();
    }
}


/**
 * Verifies the login credentials of a user.
 *
 * @param {Object} email - The email input element.
 * @param {Object} password - The password input element.
 * @return {Object|undefined} - The user object if the credentials are valid, undefined otherwise.
 */
function verifyLoginCredentials(email, password) {
    return allUsers.find(u => u.email === email.value && u.password === password.value);
}


/**
 * Handles the remember me feature based on the checkbox status.
 *
 * @param {Object} email - The email input element.
 */
function handleRememberMe(email) {
    if (document.getElementById('checkbox_id').checked) {
        localStorage.setItem('rememberMe', email.value);
    } else {
        localStorage.removeItem('rememberMe');
    }
}


/**
 * Sets the active user based on the provided email.
 *
 * @param {Object} email - The email input element.
 */
function setActiveUser(email) {
    let currentUser = allUsers.findIndex(u => u.email === email.value);
    activeUser['name'] = allUsers[currentUser].name;
}


/**
 * Logs in a user as a guest and fills default data arrays.
 *
 */
function guestLogin() {
    activeUser.name = 'Guest';
    saveActiveUser();
    fillTestArray();
    window.location.href = './summary.html';
}


/**
 * Fills default test data for the guest login. This data includes sample contacts, tasks, and categories.
 *
 */

function fillTestArray() {
    contactsArray = [
        {
            'name': 'Bernhard Sigl',
            'nameAbbreviation': 'BS',
            'email': 'B-Test@web.de',
            'phone': '01631234567',
            'color': '#006400',
        },
        {
            'name': 'David Peterka',
            'nameAbbreviation': 'DP',
            'email': 'test@web.de',
            'phone': '123456',
            'color': '#00008B',
        },
        {
            'name': 'Lina Wionsek',
            'nameAbbreviation': 'LW',
            'email': 'test2@web.de',
            'phone': '123456',
            'color': '#8B0000',
        },
    ];

    tasks = [
        {
            'id': 3,
            'status': 'toDo',
            'category': 'Technical Task',
            'categoryColor': 'background: #1FD7C1',
            'title': 'first guest task',
            'description': 'text for task',
            'dueDate': '2023-10-22',
            'priority': 'urgent',
            'contactName': ['Bernhard Sigl', 'David Peterka', 'Lina Wionsek'],
            'contactColor': ['#006400', '#00008B', '#8B0000'],
            'contactAbbreviation': ['BS', 'DP', 'LW'],
            'subtasksInProgress': ['first subtask', 'second subtask', 'third subtask'],
            'subtasksFinish': [],
        },
        {
            'id': 4,
            'status': 'toDo',
            'category': 'New Category',
            'categoryColor': 'background: #FF6347',
            'title': 'second guest task',
            'description': 'text for task',
            'dueDate': '2023-10-24',
            'priority': 'medium',
            'contactName': ['Bernhard Sigl', 'David Peterka', 'Lina Wionsek'],
            'contactColor': ['#006400', '#00008B', '#8B0000'],
            'contactAbbreviation': ['BS', 'DP', 'LW'],
            'subtasksInProgress': ['first subtask', 'second subtask', 'third subtask'],
            'subtasksFinish': [],
        },
        {
            'id': 5,
            'status': 'awaiting-feedback',
            'category': 'User Story',
            'categoryColor': 'background: #0038FF',
            'title': 'third guest task',
            'description': 'text for task',
            'dueDate': '2023-10-21',
            'priority': 'urgent',
            'contactName': ['Bernhard Sigl', 'David Peterka', 'Lina Wionsek'],
            'contactColor': ['#006400', '#00008B', '#8B0000'],
            'contactAbbreviation': ['BS', 'DP', 'LW'],
            'subtasksInProgress': ['first subtask', 'second subtask', 'third subtask'],
            'subtasksFinish': [],
        },
    ];

    customCategories[0] = {
        'name': ['New Category'],
        'color': ['background: #FF6347'],
    };
    currentUserTaskSave();
    currentUserCategorysSave();
    currentUserContactsSave();
}


/**
 * Adds a red border to the specified input elements with the IDs 'login_email' and 'login_password',
 * indicating an error.
 *
 */
function loadRedBorderInput() {
    let inputIds = ['login_email', 'login_password'];
    for (let id of inputIds) {
        document.getElementById(id).classList.add('red-border');
    }
}


/**
 * Displays warning text templates for specified elements.
 *
 */
function loadWarningTextTamplate() {
    let warningIds = ['warning-text-passwort', 'warning-text-email'];
    for (let id of warningIds) {
        document.getElementById(id).classList.remove('d-none');
    }
}


/**
 * Returns the HTML template for the login form.
 *
 * @return {string} The HTML template for the login form.
 */
function loadTempleteLogIn() {
    return /*html*/ `
    <form onsubmit="login(); return false;">
            <div class="login-title">
                <div class="fontSize61"><b>Log in</b></div>
                <div class="underline"></div>
            </div>
            <div class="input-fields fontSize20">
                <input required id="login_email" type="email" placeholder="Email">
                <div class="warning-field">
                    <span id="warning-text-email" class="d-none">
                        Please enter the appropriate email address. 
                    </span>
                </div>
                <input class="mt-32" required id="login_password" type="password" placeholder="Password">  
                <div class="warning-field">
                    <span id="warning-text-passwort" class="d-none">
                        Please enter the appropriate password.
                    </span>
                </div>
            </div>

            <div class="remember-me-container">
                <div class="checkbox-container">
                    <input type="checkbox" name="myCheckbox" id="checkbox_id">
                    <label for=" fontSize16">Remember me</label>
                </div>

            </div>
            <div class="buttonsUnderLogin">
                <button type="submit" class="button blue-btn border-radius-8 fontSize20">Log in</button>
                <button onclick='guestLogin()' type="button" class="button outline-btn border-radius-8 fontSize20">Guest Log in</button>
            </div>

    </form>`;
}
