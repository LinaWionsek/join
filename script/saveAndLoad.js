const STORAGE_TOKEN = '7RNGNHOIRRY7RSZAG9040DSCH7N4JNMMZ3I48MJN';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

let tasks = [];
let allUsers = [];
let activUser = {
    'name': '',
}


/** Represents the currently selected index in the task list. */
let selectedIndex = null;
let selectedColorIndex = null;

/** Collection of background colors used for task categories. */
let colorCollection = [
    'background: #006400', 'background: #00008B', 'background: #8B0000', 'background: #800080', 'background: #808080', 'background: #0000CD',
    'background: #008000', 'background: #FF0000', 'background: #8A2BE2', 'background: #FFA500', 'background: #2E8B57', 'background: #9932CC',
    'background: #DC143C', 'background: #228B22', 'background: #20B2AA', 'background: #FF1493', 'background: #D2691E', 'background: #00CED1',
    'background: #008080', 'background: #FF6347'
];

/** Main categories for tasks, each with a name and associated colors. */
let mainCategorys = [{
    'name': ['Technical Task', 'User Story',],
    'color': ['background: #1FD7C1', 'background: #0038FF',],
}];

/** All task categories, initially empty. */
let allCategorys = [{
    'name': [],
    'color': [],
}];

/** * Collection of subtasks associated with tasks. */
let subTaskCollection = [];
/** Collection of finished subtasks. */
let subtasksFinish = [];
/** Collection of contacts associated with tasks. */
let contactCollection = [];
/** Represents the currently selected category with its name and color. */
let currentCategorySelected = [{
    'name': '',
    'color': '',
}];
/** Represents the currently selected priority. */
let currentPrioSelected = "";
/** Represents the current ID for tasks. */
let currentId = 0;
/** Task ID for editing tasks. */
let taskIdForEdit = '';
/** Represents the status for editing tasks. */
let statusEdit = '';
/** Represents the task being edited. */
let editTask = '';
/** Represents the status group for tasks. */
let statusGroup = '';

//save and load task elements

/**
 * Saves various task-related elements to local storage.
 */
function saveTaskElements() {
    localStorage.setItem('categoryCollectionAsText', JSON.stringify(currentCategorySelected));
    localStorage.setItem('currentPrioAsText', JSON.stringify(currentPrioSelected));
    localStorage.setItem('subTaskCollectionAsText', JSON.stringify(subTaskCollection));
    localStorage.setItem('contactCollectionAsText', JSON.stringify(contactCollection));
    localStorage.setItem('selectedIndexAsText', JSON.stringify(selectedIndex));
    localStorage.setItem('selectedColorIndexAsText', JSON.stringify(selectedColorIndex));
    localStorage.setItem('subTaskFinishAsText', JSON.stringify(subtasksFinish));
    localStorage.setItem('taskIdAsText', JSON.stringify(taskIdForEdit));
    localStorage.setItem('statusAsText', JSON.stringify(statusEdit));
}

/**
 * Loads various task-related elements from local storage and applies them.
 */
function loadTaskElements() {
    let currentCategoryLoad = localStorage.getItem('categoryCollectionAsText');
    let currentPrioLoad = localStorage.getItem('currentPrioAsText');
    let subTaskCollectionLoad = localStorage.getItem('subTaskCollectionAsText');
    let contactCollectionLoad = localStorage.getItem('contactCollectionAsText');
    let selectedIndexLoad = localStorage.getItem('selectedIndexAsText');
    let selectedColorLoad = localStorage.getItem('selectedColorIndexAsText');
    let subTaskFinishLoad = localStorage.getItem('subTaskFinishAsText');
    let taskIdLoad = localStorage.getItem('taskIdAsText');
    let statusLoad = localStorage.getItem('statusAsText');
    returnLoad(currentCategoryLoad, currentPrioLoad, subTaskCollectionLoad, contactCollectionLoad, selectedIndexLoad, selectedColorLoad, subTaskFinishLoad, taskIdLoad, statusLoad);
}

/**
 * Applies loaded task elements values to respective global variables.
 */
function returnLoad(currentCategoryLoad, currentPrioLoad, subTaskCollectionLoad, contactCollectionLoad, selectedIndexLoad, selectedColorLoad, subTaskFinishLoad, taskIdLoad, statusLoad) {
    if (currentCategoryLoad && currentPrioLoad && subTaskCollectionLoad && contactCollectionLoad && selectedIndexLoad && selectedColorLoad && subTaskFinishLoad && taskIdLoad && statusLoad) {
        currentCategorySelected = JSON.parse(currentCategoryLoad);
        currentPrioSelected = JSON.parse(currentPrioLoad);
        subTaskCollection = JSON.parse(subTaskCollectionLoad);
        contactCollection = JSON.parse(contactCollectionLoad);
        selectedIndex = JSON.parse(selectedIndexLoad);
        selectedColorIndex = JSON.parse(selectedColorLoad);
        subtasksFinish = JSON.parse(subTaskFinishLoad);
        taskIdForEdit = JSON.parse(taskIdLoad);
        statusEdit = JSON.parse(statusLoad);
    }
}

//------------tasks----------------------//
/**
 * Checks if a certain key exists in storage, if not, sets a default value.
 * @param {string} key - Key to check in storage.
 * @param {*} initialValue - The initial value to set if key is not found.
 * @returns {Promise<void>}
 */
async function initializeStorage(key, initialValue) {
    try {
        await getItem(key);
    } catch (e) {
        console.info(`Key "${key}" not found in storage. Initializing with default value.`);
        await setItem(key, JSON.stringify(initialValue));
    }
}

/**
 * Asynchronously saves the current user's tasks. 
 * If the active user is 'Guest698', the tasks are saved to local storage. 
 * Otherwise, they are saved to remote storage.
 */
async function currentUserTaskSave() {
    if (activUser.name === 'Guest698') {
        localStorage.setItem('tasksAsText', JSON.stringify(tasks));
    } else {
        await setItem('tasks', JSON.stringify(tasks));
    }
}

/**
 * Asynchronously loads the current user's tasks. 
 * If the active user is 'Guest698', the tasks are loaded from local storage. 
 * Otherwise, they are fetched from remote storage.
 */
async function currentUserTaskLoad() {
    if (activUser.name === 'Guest698') {
        let tasksLoad = localStorage.getItem('tasksAsText');
        if (tasksLoad) {
            tasks = JSON.parse(tasksLoad);
        }
    } else {
        try {
            tasks = JSON.parse(await getItem('tasks'));
        } catch (e) {
            console.info('Could not load tasks');
        }
    }
}

//current id
/**
 * Asynchronously saves the current user's ID. 
 * If the active user is 'Guest698', the ID is saved to local storage. 
 * Otherwise, it is saved to remote storage.
 */
async function currentUserIdSave() {
    if (activUser.name === 'Guest698') {
        localStorage.setItem('currentIdAsText', JSON.stringify(currentId));
    } else {
        await setItem('currentId', JSON.stringify(currentId));
    }
}

/**
 * Asynchronously loads the current user's ID. 
 * If the active user is 'Guest698', the ID is loaded from local storage. 
 * Otherwise, it is fetched from remote storage.
 */
async function currentUserIdLoad() {
    if (activUser.name === 'Guest698') {
        let currentIdLoad = localStorage.getItem('currentIdAsText');
        if (currentIdLoad) {
            currentId = JSON.parse(currentIdLoad);
        }
    } else {
        try {
            currentId = JSON.parse(await getItem('currentId'));
        } catch (e) {
            console.info('Could not load currentId');
        }
    }
}

//Categorys
/**
 * Asynchronously saves the current user's categories. 
 * If the active user is 'Guest698', the categories are saved to local storage. 
 * Otherwise, they are saved to remote storage.
 */
async function currentUserCategorysSave() {
    if (activUser.name === 'Guest698') {
        localStorage.setItem('categorysAsText', JSON.stringify(allCategorys));
    } else {
        await setItem('allCategorys', JSON.stringify(allCategorys));
    }
}

/**
 * Asynchronously loads the current user's categories. 
 * If the active user is 'Guest698', the categories are loaded from local storage. 
 * Otherwise, they are fetched from remote storage.
 */
async function currentUserCategorysLoad() {
    if (activUser.name === 'Guest698') {
        let categorysLoad = localStorage.getItem('categorysAsText');
        if (categorysLoad) {
            allCategorys = JSON.parse(categorysLoad);
        }
    } else {
        try {
            allCategorys = JSON.parse(await getItem('allCategorys'));
        } catch (e) {
            console.info('Could not load created categorys. created categorys are empty');
        }
    }
}

//Contacts
/**
 * Asynchronously saves the current user's contacts. 
 * If the active user is 'Guest698', the contacts are saved to local storage. 
 * Otherwise, they are saved to remote storage.
 */
async function currentUserContactsSave() {
    if (activUser.name === 'Guest698') {
        localStorage.setItem('contactsAsText', JSON.stringify(contactsArray));
        localStorage.setItem('nextColorAsText', JSON.stringify(nextColorIndex));
    } else {
        await setItem('contactsArray', JSON.stringify(contactsArray));
        await setItem('nextColorIndex', JSON.stringify(nextColorIndex));
    }
}

/** * This function is to load contacts or display a error message */
async function currentUserContactsLoad() {
    if (activUser.name === 'Guest698') {
        let contactsLoad = localStorage.getItem('contactsAsText');
        let nextColorLoad = localStorage.getItem('nextColorAsText');
        if (contactsLoad && nextColorLoad) {
            contactsArray = JSON.parse(contactsLoad);
            nextColorIndex = JSON.parse(nextColorLoad);
        }
    } else {
        try {
            contactsArray = JSON.parse(await getItem('contactsArray'));
            nextColorIndex = JSON.parse(await getItem('nextColorIndex'));
        } catch (e) {
            console.info('Could not load contacts');
        }
    }
}

//Activ user
/**
 * Saves the current active user to local storage.
 */
function saveActiveUser() {
    localStorage.setItem('activUserAsText', JSON.stringify(activUser));
}

/**
 * Loads the current active user from local storage.
 */
function loadActivUser() {
    let activUserLoad = localStorage.getItem('activUserAsText');
    if (activUserLoad) {
        activUser = JSON.parse(activUserLoad);
    }
}

//save and load remote
/**
 * Sets a key-value pair in the remote storage.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

/**
 * Retrieves a value from the remote storage by its key.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value;
        }
        throw `Could not find data with key "${key}".`;
    });
}

