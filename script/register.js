let registerBtn = document.getElementById('registerBtn');
let checkbox = document.getElementById("myCheckbox");


/**
 * Initializes the registration functionality by loading existing user data.
 */
async function initRegister() {
    await loadUserGroup698()
}

/**
 * Initiates the sign-up process by loading the respective template into the dialog.
 */
function signUp() {
    dialog.innerHTML = loadTemplateSignUp();
}

/**
 * Validates user inputs, checks for email duplicates, and proceeds with the registration process.
 */
async function registUser() {
    let emailControl = document.getElementById('email');
    if (!arePasswordsMatching()) return handlePasswordMismatch();
    if (user.some(u => u.email === emailControl.value)) return handleEmailExists();
    if (checkbox.checked) await handleRegistration();
}

/**
 * Handles a scenario when entered passwords don't match.
 */
function handlePasswordMismatch() {
    loadRedBorderPassword();
    loadWarningTextTamplate();
}

/**
 * Handles a scenario when the entered email already exists in the system.
 */
function handleEmailExists() {
    document.getElementById('inputEmail').classList.add("red-border");
    document.getElementById('warning-email').classList.remove("d-none");
    resetForm();
}

/**
 * Registers a new user, saves the user's data, and redirects to the homepage after successful registration.
 */
async function handleRegistration() {
    registerBtn.disabled = true;
    user.push({
        name: userName.value,
        email: email.value,
        password: password.value,
    });
    await setItem('userGroup698', JSON.stringify(user));
    changesSaved('You Signed Up successfully');
    setTimeout(() => {
        resetForm();
        window.location = 'index.html';
    }, 3000);
}

/**
 * Highlights password fields in red.
 */
function loadRedBorderPassword() {
    let inputIds = ["inputPassword", "inputConfirmPassword"];
    for (let id of inputIds) {
        document.getElementById(id).classList.add("red-border");
    }
}

/**
 * Displays warning messages for password fields.
 */
function loadWarningTextTamplate() {
    let warningIds = ["warning-password", "warning-confirmPassword"];
    for (let id of warningIds) {
        document.getElementById(id).classList.remove("d-none");
    }
}

/**
 * Checks if the entered password and confirmation password are matching.
 */
function arePasswordsMatching() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    return password === confirmPassword;
}

/**
 * Loads existing users from the storage.
 */
async function loadUserGroup698() {
    try {
        user = JSON.parse(await getItem('userGroup698'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Resets the registration form by clearing inputs and enabling the register button.
 */
function resetForm() {
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
}


/* NICHT AKTUELL! WEIL FALSCHER KEY! */
/**
 * Resets all users in the backend storage.
 */
// async function resetAllBackendUser() {
//     users.splice(0, users.length);
//     await setItem('users', JSON.stringify(users));
// }