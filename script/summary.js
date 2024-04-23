/**
 * Asynchronously initializes the summary section.
 *
 */
async function initSummary() {
    detectUser();
    loadActiveUser();
    showUserCircle();
    await currentUserTaskLoad();
    loadTimeOfDay();
    loadText();
    markActivePage();
    addAnimationOnResize();
    animationAdded = false;
}


/**
 * Loads various text elements required for the user interface.
 *
 */
function loadText() {
    loadUserName();
    searchNumbers();
    loadUrgentPrioDate();
}


/**
 * Loads the current active user's name into a specified element on the webpage.
 *
 */
function loadUserName() {
    userName = document.getElementById('name')
    userName.innerText = activeUser.name;
}


/**
 * This function is used to create an animation to fade out the greeting message
 * when the window is resized to a width less than or equal to 1200 pixels.
 * If the window is resized to a width greater than 1200 pixels, the animation is removed.
 *
 */
function addAnimationOnResize() {
    if (window.innerWidth <= 1200) {
        addAnimation();
        animationAdded = true;
    } else if (window.innerWidth > 1200) {
        const greetingText = document.querySelector('.greeting-text');
        greetingText.classList.remove('fade-out');
        greetingText.classList.remove('hidden');
        animationAdded = false;
    }
}


/**
 * This function adds an animation to the greeting text by applying CSS classes and setting a timeout.
 *
 */
function addAnimation() {
    const greetingText = document.querySelector('.greeting-text');
    greetingText.classList.add('fade-out');
    setTimeout(function () {
        greetingText.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }, 2000);
}


/**
 * This function searches the number of tasks in the respective category
 * 
 */
function searchNumbers() {
    let todo = tasks.filter(t => t['status'] == 'toDo').length;
    let inProgress = tasks.filter(t => t['status'] == 'in-progress').length;
    let awaitingFeedback = tasks.filter(t => t['status'] == 'awaiting-feedback').length;
    let done = tasks.filter(t => t['status'] == 'done').length;
    let allTasks = tasks.length
    let urgent = tasks.filter(t => t['priority'] == 'urgent').length;
    displayNumbers(todo, inProgress, awaitingFeedback, done, allTasks, urgent)
}


/**
 * This function shows the number of tasks in the respective category
 * 
 */
function displayNumbers(todo, inProgress, awaitingFeedback, done, allTasks, urgent) {
    document.getElementById('to-dos').innerHTML = todo;
    document.getElementById('done').innerHTML = done;
    document.getElementById('await-feedback').innerHTML = awaitingFeedback;
    document.getElementById('in-progress').innerHTML = inProgress;
    document.getElementById('board').innerHTML = allTasks;
    document.getElementById('urgent').innerHTML = urgent;
}


/**
 * This function loads the next urgent due date
 * 
 */
function loadUrgentPrioDate() {
    let container = document.getElementById('date');
    const nextUrgentDate = getNextUrgentDueDate(tasks);
    if (nextUrgentDate) {
        const convertedDate = convertDateFormat(nextUrgentDate);
        container.innerHTML = convertedDate;
    } else {
        container.innerHTML = "No urgent due dates";
    }
}


/**
 * Loads the current time of day into the HTML element with the ID 'time-of-day'.
 *
 */
function loadTimeOfDay() {
    let HoursOfTheDay = document.getElementById('time-of-day');
    HoursOfTheDay.innerHTML = getTimeOfDay();
}


/**
 * Returns a greeting based on the current time of day.
 *
 * @return {string} The greeting string in HTML format.
 */
function getTimeOfDay() {
    const currentHour = new Date().getHours();
    if (currentHour >= 0 && currentHour < 6) {
        return `<span class="time-of-day">Good&nbsp</span>
        <span></span>
        <span class="time-of-day">night</span>`;
    } else if (currentHour >= 6 && currentHour < 12) {
        return `<span class="time-of-day">Good&nbsp</span><span class="time-of-day">morning</span>`;
    } else if (currentHour >= 12 && currentHour < 18) {
        return `<span class="time-of-day">Good&nbsp</span>
        <span class="time-of-day" >afternoon</span>`;
    } else {
        return `<span class="time-of-day">Good&nbsp</span><span class="time-of-day">evening</span>`;
    }
}


/**
 * Retrieves the next urgent due date from a given array of tasks.
 *
 * @param {Array} tasks - An array of task objects with properties:
 *                        - priority: a string indicating the task priority
 *                        - dueDate: a string representing the due date in the format "MM/DD/YYYY"
 * @return {string|null} The next urgent due date in the format "MM/DD/YYYY", or null if no urgent tasks found.
 */
function getNextUrgentDueDate(tasks) {
    const urgentTasks = tasks.filter(task => task.priority === "urgent");
    console.log("urgentTasks", urgentTasks)
    if (urgentTasks.length === 0) return null;
    urgentTasks.sort((a, b) => {
        const dateA = new Date(a.dueDate.split("/").reverse().join("-"));
        const dateB = new Date(b.dueDate.split("/").reverse().join("-"));
        return dateA - dateB;
    });
    return urgentTasks[0].dueDate;
}


/**
 * Converts the input date string into a formatted date string.
 *
 * @param {string} inputDate - The date string in the format "YYYY-MM-DD".
 * @return {string} The formatted date string in the format "Month Dayth, Year".
 */
function convertDateFormat(inputDate) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const parts = inputDate.split("-");
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parts[2];
    return `${months[monthIndex]} ${day}th, ${year}`;
}