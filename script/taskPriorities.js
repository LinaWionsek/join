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

function noPrioritySelected() {
    currentPrioSelected = '';
    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');
    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');
    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}

function selectLowPriority(prio) {
    currentPrioSelected = prio;
    document.getElementById('prio_low').src = `./img/prio-low-white.svg`;
    document.getElementById('button_low').classList.add('prio-low');
    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');
    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}

function selectMediumPriority(prio) {
    currentPrioSelected = prio;
    document.getElementById('prio_medium').src = `./img/prio-medium-white.svg`;
    document.getElementById('button_medium').classList.add('prio-medium');
    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');
    document.getElementById('prio_urgent').src = `./img/prio-urgent.svg`;
    document.getElementById('button_urgent').classList.remove('prio-urgent');
}

function selectUrgentPriority(prio) {
    currentPrioSelected = prio;
    document.getElementById('prio_urgent').src = `./img/prio-urgent-white.svg`;
    document.getElementById('button_urgent').classList.add('prio-urgent');
    document.getElementById('prio_low').src = `./img/prio-low.svg`;
    document.getElementById('button_low').classList.remove('prio-low');
    document.getElementById('prio_medium').src = `./img/prio-medium.svg`;
    document.getElementById('button_medium').classList.remove('prio-medium');
}