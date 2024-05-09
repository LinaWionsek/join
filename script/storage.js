const STORAGE_TOKEN = '7RNGNHOIRRY7RSZAG9040DSCH7N4JNMMZ3I48MJN';
const STORAGE_URL = 'https://portfolio-join-default-rtdb.europe-west1.firebasedatabase.app/';

let tasks = [];
let allUsers = [];
let activeUser = {
    'name': '',
};

/** Represents the currently selected index in the task list. */
let selectedIndex = null;
let selectedColorIndex = null;

/** Collection of background colors used for task categories. */
let colorCollection = [
    'background: #006400',
    'background: #00008B',
    'background: #8B0000',
    'background: #800080',
    'background: #808080',
    'background: #0000CD',
    'background: #008000',
    'background: #FF0000',
    'background: #8A2BE2',
    'background: #FFA500',
    'background: #2E8B57',
    'background: #9932CC',
    'background: #DC143C',
    'background: #228B22',
    'background: #20B2AA',
    'background: #FF1493',
    'background: #D2691E',
    'background: #00CED1',
    'background: #008080',
    'background: #FF6347',
];

/** Main categories for tasks, each with a name and associated colors. */
let mainCategories = [
    {
        'name': ['Technical Task', 'User Story'],
        'color': ['background: #1FD7C1', 'background: #0038FF'],
    },
];

/** All task categories, initially empty. */
let customCategories = [
    {
        'name': [],
        'color': [],
    },
];

/** Represents the current ID for tasks. */
let currentId = 0;

/** Represents the status group for tasks. */
let statusGroup = '';

/** Represents the currently selected category with its name and color. */
let currentCategorySelected = [
    {
        'name': '',
        'color': '',
    },
];

/** Represents the currently selected priority. */
let currentPrioSelected = '';

/** * Collection of subtasks associated with tasks (unfinished). */
let subTaskCollection = [];

/** Collection of finished subtasks. */
let subtasksFinish = [];

/** Collection of contacts associated with tasks. */
let contactCollection = [];

/** Task ID for editing tasks. */
let taskIdForEdit = '';

/** Represents the status for editing tasks. */
let statusEdit = '';

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
 * If the active user is 'Guest', the tasks are saved to local storage.
 * Otherwise, they are saved to remote storage.
 */
async function currentUserTaskSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('tasksAsText', JSON.stringify(tasks));
        console.log(tasks);
    } else {
        await setItem('tasks', JSON.stringify(tasks));
    }
}

/**
 * Asynchronously loads the current user's tasks.
 * If the active user is 'Guest', the tasks are loaded from local storage.
 * Otherwise, they are fetched from remote storage.
 */
async function currentUserTaskLoad() {
    if (activeUser.name === 'Guest') {
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

/**
 * Asynchronously saves the current user's ID.
 * If the active user is 'Guest', the ID is saved to local storage.
 * Otherwise, it is saved to remote storage.
 *
 */
async function currentUserIdSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('currentIdAsText', JSON.stringify(currentId));
    } else {
        await setItem('currentId', JSON.stringify(currentId));
    }
}

/**
 * Asynchronously loads the current user's ID.
 * If the active user is 'Guest', the ID is loaded from local storage.
 * Otherwise, it is fetched from remote storage.
 *
 */
async function currentUserIdLoad() {
    if (activeUser.name === 'Guest') {
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

/**
 * Asynchronously saves the current user's categories.
 * If the active user is 'Guest', the categories are saved to local storage.
 * Otherwise, they are saved to remote storage.
 */
async function currentUserCategorysSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('categorysAsText', JSON.stringify(customCategories));
    } else {
        await setItem('customCategories', JSON.stringify(customCategories));
    }
}

/**
 * Asynchronously loads the current user's categories.
 * If the active user is 'Guest', the categories are loaded from local storage.
 * Otherwise, they are fetched from remote storage.
 */
async function currentUserCategorysLoad() {
    if (activeUser.name === 'Guest') {
        let categorysLoad = localStorage.getItem('categorysAsText');
        if (categorysLoad) {
            customCategories = JSON.parse(categorysLoad);
        }
    } else {
        try {
            customCategories = JSON.parse(await getItem('customCategories'));
        } catch (e) {
            console.info('Could not load created categorys. created categorys are empty');
        }
    }
}

/**
 * Asynchronously saves the current user's contacts.
 * If the active user is 'Guest', the contacts are saved to local storage.
 * Otherwise, they are saved to remote storage.
 */
async function currentUserContactsSave() {
    if (activeUser.name === 'Guest') {
        localStorage.setItem('contactsAsText', JSON.stringify(contactsArray));
        localStorage.setItem('nextColorAsText', JSON.stringify(nextColorIndex));
    } else {
        await setItem('contactsArray', JSON.stringify(contactsArray));
        await setItem('nextColorIndex', JSON.stringify(nextColorIndex));
    }
}

/**
 * Asynchronously loads the contacts of the current user.
 *
 */
async function currentUserContactsLoad() {
    if (activeUser.name === 'Guest') {
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

/**
 * Saves the current active user to local storage.
 *
 */
function saveActiveUser() {
    localStorage.setItem('activeUserAsText', JSON.stringify(activeUser));
}

/**
 * Loads the current active user from local storage.
 *
 */
function loadActiveUser() {
    let activeUserLoad = localStorage.getItem('activeUserAsText');
    if (activeUserLoad) {
        activeUser = JSON.parse(activeUserLoad);
    }
}

/**
 * Sets a key-value pair in the remote storage.
 *
 * @param {string} key - The key to set in the storage.
 * @param {*} value - The value to associate with the key.
 * @return {Promise<any>} A promise that resolves to the response from the server.
 */
// async function setItem(key, value) {
//     const payload = { key, value };
//     return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
//         .then(res => res.json());
// }

async function setItem(path = '', data = {}) {
    if (path == 'tasks') {
        console.log('ALERT', data);
        let dataAsJSON = JSON.parse(data);
        Array.from(dataAsJSON).forEach(singleData => {
            console.log(singleData, 'SINGLEDATA');
            if (singleData.subtasksFinish == undefined || singleData.subtasksFinish.length == 0) {
                singleData.subtasksFinish = ['-'];
            }
            if (singleData.subtasksInProgress == undefined || singleData.subtasksInProgress.length == 0) {
                singleData.subtasksInProgress = ['-'];
            }
            if (singleData.contactName == undefined || singleData.contactName.length == 0) {
                singleData.contactName = ['-'];
            }
            if (singleData.contactColor == undefined || singleData.contactColor.length == 0) {
                singleData.contactColor = ['-'];
            }
            if (singleData.contactAbbreviation == undefined || singleData.contactAbbreviation.length == 0) {
                singleData.contactAbbreviation = ['-'];
            }
        });
        data = JSON.stringify(dataAsJSON);
    }

    let response = await fetch(STORAGE_URL + path + '/' + '.json', {
        method: 'PUT',
        header: {
            'Content-Type': 'application/json',
        },
        body: data,
    });
    return (responseToJson = await response.json());
}

/**
 * Retrieves a value from the remote storage by its key.
 *
 * @param {string} key - The key used to retrieve the value.
 * @return {Promise<any>} A promise that resolves to the retrieved value.
 */
// async function getItem(key) {
//     const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//     return fetch(url).then(res => res.json()).then(res => {
//         if (res.data) {
//             return res.data.value;
//         }
//         throw `Could not find data with key "${key}".`;
//     });
// }

function initArrays() {
    tasks = [];
    allUsers = [];
    activeUser = {
        'name': '',
    };
    customCategories = [
        {
            'name': [],
            'color': [],
        },
    ];
    contactsArray = [];
    nameAbbreviationArray = [];
    currentId = 0;
}

async function getItem(path = '') {

    let response = await fetch(STORAGE_URL + path + '/' + '.json');
    let responseToJson = await response.json();

    console.log(responseToJson);
    if (path == 'tasks') {

        Array.from(responseToJson).forEach(singleData => {
            console.log(singleData, 'SINGLEDATA');
            if (singleData.subtasksFinish.length == 1 && singleData.subtasksFinish[0] == '-') {
                singleData.subtasksFinish = [];
            }
            if (singleData.subtasksInProgress.length == 1 && singleData.subtasksInProgress[0] == '-') {
                singleData.subtasksInProgress = [];
            }
            if (singleData.contactName.length == 1 && singleData.contactName[0] == '-') {
                singleData.contactName = [];
            }
            if (singleData.contactColor.length == 1 && singleData.contactColor[0] == '-') {
                singleData.contactColor = [];
            }
            if (singleData.contactAbbreviation.length == 1 && singleData.contactAbbreviation[0] == '-') {
                singleData.contactAbbreviation = [];
            }
            console.log(singleData, '----SINGLEDATA');
        });

    }
   



   
    return JSON.stringify(responseToJson);


    // return (responseToJson = await response.json());
}

/**
 * Detects the user and performs necessary actions if the user is a guest.
 *
 */
function detectUser() {
    if (activeUser.name == '') {
        activeUser.name = 'Guest';
        saveActiveUser();
        fillTestArray();
    }
}

/**
 * Fills default test data including contacts, tasks, and categories.
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
