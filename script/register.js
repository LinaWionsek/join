let registerBtn = document.getElementById('registerBtn');
let checkbox = document.getElementById('register_checkbox');


/**
 * Initializes the registration process by loading the users.
 *
 */
async function initRegister() {
    await loadUsers();
}


/**
 * Validates user inputs, checks for email duplicates, and proceeds with the registration process.
 */
async function registUser() {
    let emailControl = document.getElementById('register_email');
    if (!arePasswordsMatching()) return handlePasswordMismatch();
    if (allUsers.some(u => u.email === emailControl.value)) return handleEmailExists();
    // if (document.getElementById('register_checkbox').checked = true) await handleRegistration();
    if (checkbox.checked) await handleRegistration();
    await handleRegistration();
}

//document.getElementById('checkbox_id').checked = true

/**
 * Handles a scenario when entered passwords don't match.
 *
 */
function handlePasswordMismatch() {
    loadRedBorderPassword();
    loadWarningTextTamplate();
}


/**
 * Handles a scenario when the entered email already exists in the system.
 *
 */
function handleEmailExists() {
    document.getElementById('register_email').classList.add('red-border');
    document.getElementById('warning_email').classList.remove('d-none');
    resetForm();
}


/**
 * Registers a new user, saves the user's data, and redirects to the homepage after successful registration.
 *
 */
async function handleRegistration() {
    registerBtn.disabled = true;
    allUsers.push({
        'name': register_name.value,
        'email': register_email.value,
        'password': register_password.value,
    });
    await setItem('users', JSON.stringify(allUsers));
    changesSaved('You Signed Up successfully');
    setTimeout(() => {
        resetForm();
        window.location = 'index.html';
    }, 3000);
}


/**
 * Adds the 'red-border' class to the input elements with the IDs 'register_password' and 'register_password_confirm', 
 * highlighting them in red.
 *
 */
function loadRedBorderPassword() {
    let inputIds = ['register_password', 'register_password_confirm'];
    for (let id of inputIds) {
        document.getElementById(id).classList.add('red-border');
    }
}


/**
 * Loads the warning text template by removing the 'd-none' class from the specified warning elements.
 *
 * @param {Array} warningIds - An array of warning element IDs.
 */
function loadWarningTextTamplate() {
    let warningIds = ['warning-password', 'warning-confirmPassword'];
    for (let id of warningIds) {
        document.getElementById(id).classList.remove('d-none');
    }
}


/**
 * Checks if the entered password and confirmation password are matching.
 *
 * @return {boolean} Returns true if the passwords match, false otherwise.
 */
function arePasswordsMatching() {
    const password = document.getElementById('register_password').value;
    const confirmPassword = document.getElementById('register_password_confirm').value;
    return password === confirmPassword;
}


/**
 * Asynchronously loads existing users from the storage.
 *
 * @return {Promise<void>} A promise that resolves when the users are successfully loaded.
 * @throws {Error} If there is an error loading the users.
 */
async function loadUsers() {
    try {
        allUsers = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}



/**
 * Resets the registration form by clearing inputs and enabling the register button.
 *
 */
function resetForm() {
    register_email.value = '';
    register_password.value = '';
    register_password_confirm.value = '';
    registerBtn.disabled = false;
}


/**
 * Resets all users in the backend storage.
 *
 */
async function resetAllBackendUser() {
    await loadUsers();
    allUsers.splice(0, allUsers.length);
    await setItem('users', JSON.stringify(allUsers));
}
