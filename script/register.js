let registerBtn = document.getElementById('registerBtn');
let checkbox = document.getElementById('myCheckbox');

/**
 * Initializes the registration functionality by loading existing user data.
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
    document.getElementById('register_email').classList.add('red-border');
    document.getElementById('warning-email').classList.remove('d-none');
    resetForm();
}

/**
 * Registers a new user, saves the user's data, and redirects to the homepage after successful registration.
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
 * Highlights password fields in red.
 */
function loadRedBorderPassword() {
    let inputIds = ['register_password', 'register_password_confirm'];
    for (let id of inputIds) {
        document.getElementById(id).classList.add('red-border');
    }
}

/**
 * Displays warning messages for password fields.
 */
function loadWarningTextTamplate() {
    let warningIds = ['warning-password', 'warning-confirmPassword'];
    for (let id of warningIds) {
        document.getElementById(id).classList.remove('d-none');
    }
}

/**
 * Checks if the entered password and confirmation password are matching.
 */
function arePasswordsMatching() {
    const password = document.getElementById('register_password').value;
    const confirmPassword = document.getElementById('register_password_confirm').value;
    return password === confirmPassword;
}

/**
 * Loads existing users from the storage.
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
 */
function resetForm() {
    register_email.value = '';
    register_password.value = '';
    register_password_confirm.value = '';
    registerBtn.disabled = false;
}

/**
 * Resets all users in the backend storage.
 */
async function resetAllBackendUser() {
    await loadUsers();
    allUsers.splice(0, allUsers.length);
    await setItem('users', JSON.stringify(allUsers));
}
