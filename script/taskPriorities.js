/**
 * Selects a priority based on the given priority value.
 *
 * @param {string} prio - The priority value to select.
 */
function selectPriority(prio) {
    if (currentPrioSelected != prio) {
        if (prio == 'low') {
            selectLowPriority(prio);
        } else if (prio == 'medium') {
            selectMediumPriority(prio);
        } else if (prio == 'urgent') {
            selectUrgentPriority(prio);
        }
    } else {
        noPrioritySelected();
    }
}


/**
 * Detects the priority based on the currentPrioSelected value and calls the corresponding priority selection function.
 *
 */
function detectPriority() {
    if (currentPrioSelected == 'low') {
        selectLowPriority(currentPrioSelected);
    } else if (currentPrioSelected == 'medium') {
        selectMediumPriority(currentPrioSelected);
    } else if (currentPrioSelected == 'urgent') {
        selectUrgentPriority(currentPrioSelected);
    } else {
        noPrioritySelected();
    }
}


/**
 * Resets the selected priority to none and updates the visual representation of the priorities.
 *
 */
function noPrioritySelected() {
    currentPrioSelected = '';
    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');
    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');
    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}


/**
 * Selects the low priority and updates the visual representation of the priorities.
 *
 * @param {string} prio - The priority value to select.
 */
function selectLowPriority(prio) {
    currentPrioSelected = prio;
    document.getElementById('prio_low').src = `./img/prio-low-white.svg`;
    document.getElementById('button_low').classList.add('prio-low');
    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');
    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}


/**
 * Selects the medium priority and updates the visual representation of the priorities.
 *
 * @param {string} prio - The priority value to select.
 */
function selectMediumPriority(prio) {
    currentPrioSelected = prio;
    document.getElementById('prio_medium').src = `./img/prio-medium-white.svg`;
    document.getElementById('button_medium').classList.add('prio-medium');
    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');
    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}


/**
 * Selects the urgent priority and updates the visual representation of the priorities.
 *
 * @param {string} prio - The priority value to select.
 */
function selectUrgentPriority(prio) {
    currentPrioSelected = prio;
    document.getElementById('prio_urgent').src = `./img/prio-urgent-white.svg`;
    document.getElementById('button_urgent').classList.add('prio-urgent');
    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');
    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');
}