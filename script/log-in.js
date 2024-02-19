let dialog = document.getElementById('dialog');

/**
 * Initializes the login sequence by setting the active user, starting animations,
 */
async function initLogin() {
    activUser = {
        'name': '',
    };
    saveActivUser();
    startAnimation();
    loadLogIn();
    await loadUserGroup698();
}

/**
 * Populates the login dialog with the login template.
 */
function loadLogIn() {
    dialog.innerHTML = loadTempleteLogIn();
    let rememberedEmail = localStorage.getItem('rememberMe');
    if (rememberedEmail) {
        document.getElementById('email').value = rememberedEmail;
        document.getElementById('myCheckbox').checked = true; // Setzen Sie das "Remember me" Kästchen als angekreuzt
    }
}

/**
 * Starts the join-logo animation if the document referrer is empty.
 */
function startAnimation() {
    if (!document.referrer) { // Wenn referrer leer ist
        document.querySelector('.join-logo-contain').classList.add('animated');
        document.querySelector('.join-logo-contain').classList.remove('d-none');
        document.querySelector('.join-logo').classList.add('animated');
    }
}

/**
 * Redirects the user to the registration page.
 */
function loadRegister() {
    window.location.href = "./register.html";
}

/**
 * Populates the dialog with the password reset template.
 */
function resetPasswort() {
    dialog.innerHTML = loadTemplateResetPasswort();
}

/**
 * Reverts the dialog back to the login interface.
 */
function closeDialog() {
    loadLogIn();
}

/**
 * Validates user credentials and logs them in if valid.
 */
function login() {
    let email = document.getElementById('email');
    let passwort = document.getElementById('passwort');
    let users = user.find(u => u.email === email.value && u.password === passwort.value);
    let currentUser = user.findIndex(u => u.email === email.value);
    if (users) {
        if (document.getElementById('myCheckbox').checked) {
            localStorage.setItem('rememberMe', email.value);
        } else {
            localStorage.removeItem('rememberMe');
        }
        activUser['name'] = user[currentUser].name;
        saveActivUser();
        window.location.href = "./summary.html";
    } else {
        loadRedBorderInput();
        loadWarningTextTamplate();
    }
}

/**
 * Logs in a user as a guest and fills default data arrays.
 */
function guestLogin() {
    activUser.name = 'Guest698';
    saveActivUser();
    fillTestArray();
    window.location.href = "./summary.html";
}

/**
 * Fills default test data for the guest login. This data includes sample contacts, tasks, and categories.
 */
function fillTestArray() {
    contactsArray = [
        {
            "name": "Bernhard Sigl",
            "nameAbbreviation": "BS",
            "email": "B-Test@web.de",
            "phone": "01631234567",
            "color": "#006400"
        },
        {
            "name": "David Peterka",
            "nameAbbreviation": "DP",
            "email": "test@web.de",
            "phone": "123456",
            "color": "#00008B"
        },
        {
            "name": "Lina Wionsek",
            "nameAbbreviation": "LW",
            "email": "test2@web.de",
            "phone": "123456",
            "color": "#8B0000"
        }];

    tasks = [{
        "id": 3,
        "status": "toDo",
        "category": "Technical Task",
        "categoryColor": "background: #1FD7C1",
        "title": "first guest task",
        "description": "text for task",
        "dueDate": "22/10/2023",
        "priority": "./img/prioUrgent.svg",
        "contactName": [
            "Bernhard Sigl",
            "David Peterka",
            "Lina Wionsek"
        ],
        "contactColor": [
            "#006400",
            "#00008B",
            "#8B0000"
        ],
        "contactAbbreviation": [
            "BS",
            "DP",
            "LW"
        ],
        "subtasksInProgress": [
            "first subtask",
            "second subtask",
            "third subtask"
        ],
        "subtasksFinish": []
    },
    {
        "id": 4,
        "status": "toDo",
        "category": "New Category",
        "categoryColor": "background: #FF6347",
        "title": "second guest task",
        "description": "text for task",
        "dueDate": "24/10/2023",
        "priority": "./img/prioMedium.svg",
        "contactName": [
            "Bernhard Sigl",
            "David Peterka",
            "Lina Wionsek"
        ],
        "contactColor": [
            "#006400",
            "#00008B",
            "#8B0000"
        ],
        "contactAbbreviation": [
            "BS",
            "DP",
            "LW"
        ],
        "subtasksInProgress": [
            "first subtask",
            "second subtask",
            "third subtask"
        ],
        "subtasksFinish": []
    },
    {
        "id": 5,
        "status": "awaiting-feedback",
        "category": "User Story",
        "categoryColor": "background: #0038FF",
        "title": "third guest task",
        "description": "text for task",
        "dueDate": "21/10/2023",
        "priority": "./img/prioUrgent.svg",
        "contactName": [
            "Bernhard Sigl",
            "David Peterka",
            "Lina Wionsek"
        ],
        "contactColor": [
            "#006400",
            "#00008B",
            "#8B0000"
        ],
        "contactAbbreviation": [
            "BS",
            "DP",
            "LW"
        ],
        "subtasksInProgress": [
            "first subtask",
            "second subtask",
            "third subtask"
        ],
        "subtasksFinish": []
    }
    ];

    allCategorys[0] = {
        "name": [
            "New Category"
        ],
        "color": [
            "background: #FF6347"
        ]
    }
    currentUserTaskSave();
    currentUserCategorysSave();
    currentUserContactsSave();
}

/**
 * Adds a red border to specified input elements indicating an error.
 */
function loadRedBorderInput() {
    let inputIds = ["input-email", "input-passwort"];
    for (let id of inputIds) {
        document.getElementById(id).classList.add("red-border");
    }
}

/**
 * Displays warning text templates for specified elements.
 */
function loadWarningTextTamplate() {
    let warningIds = ["warning-text-passwort", "warning-text-email"];
    for (let id of warningIds) {
        document.getElementById(id).classList.remove("d-none");
    }
}

/**
 * Returns the HTML template for the login form.
 */
function loadTempleteLogIn() {
    return /*html*/ `
    <form onsubmit="login(); return false;">
        <div class="logInTitle">
            <div class="fontSize61"><b>Log in</b></div>
            <div class="underline"></div>
        </div>
        <div  class="input-fields fontSize20">
            <div id="input-email" class="input-field ">
                <input required id="email" type="text" placeholder="Email">
                <img src="./img/letter.svg" alt="Bild hinten" class="input-suffix">
            </div>
            <div class="warning-field">
            <span id="warning-text-email" class="d-none">
            Please enter the appropriate email address.
            </span>
            </div>
            <div id="input-passwort" class="input-field">
                <input required id="passwort" type="password" placeholder="Password">
                <img src="./img/lock.svg" alt="Bild hinten" class="input-suffix">
            </div>
            <div class="warning-field">
            <span id="warning-text-passwort" class="d-none">
            Please enter the appropriate password.
            </span>
            </div>
        </div>

        <div class="rememberMeForgetMyPasswordContainer">
            <div class="checkboxRememberMeContainer">
                <input type="checkbox" name="myCheckbox" id="myCheckbox">
                <label for=" fontSize16">Remember me</label>
            </div>

        </div>
        <div class="buttonsUnderLogin">
            <button type="submit" class="button-log-in fontSize21">Log in</button>
            <button onclick='guestLogin()' type="button" class="button-guest-login fontSize21">Guest Log in</button>
        </div>
    </form>`;
}