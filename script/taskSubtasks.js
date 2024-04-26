/**
 * Adds a subtask to the subTaskCollection array and renders the updated subtasks.
 *
 */
function addSubtask() {
    let input = document.getElementById('subtasks_input');
    if (input.value === '') {
        return;
    } else {
        subTaskCollection.push(input.value);
        renderSubtasks();
        input.value = '';
    }
}


/**
 * Renders the subtasks on the webpage based on the subTaskCollection array.
 *
 */
function renderSubtasks() {
    let subtasks = document.getElementById('selected_subtasks');
    subtasks.innerHTML = '';
    for (let i = 0; i < subTaskCollection.length; i++) {
        const singleSubtask = subTaskCollection[i];
        subtasks.innerHTML += /*html*/ `
        <ul ondblclick="editSubtask(${i})" class="d-flex">
            <li>${singleSubtask}</li>
            <div>
                <img onclick="editSubtask(${i})" class="edit-icon" src="./img/pen.svg">
                <img onclick="deleteSubtask(${i})" class="delete-icon" src="./img/delete.svg">
            </div>
        </ul>
        `;
    }
}


/**
 * Edits a subtask based on the provided index.
 *
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtask(i) {
    let subtaskToEdit = subTaskCollection[i];
    let editContainer = document.getElementById('edit_container');
    toggleVisibility('edit_container', true);
    editContainer.innerHTML = '';
    editContainer.innerHTML += /*html*/ `
    <div class="subtask-edit-input">
        <input id="edit_input" type="text">
        <img onclick="cancelSubtaskEdit()" class="editAbsolutCross" src="./img/close.svg">
        <img onclick="confirmSubtaskEdit(${i})" class="editAbsolutCheck" src="./img/check-blue.svg">
    </div>
    `;
    let input = document.getElementById('edit_input');
    input.value = subtaskToEdit;
}


/**
 * Confirms the edit of a subtask and updates the subTaskCollection array accordingly.
 *
 * @param {number} i - The index of the subtask to edit.
 */
function confirmSubtaskEdit(i) {
    let input = document.getElementById('edit_input');
    if (input.value == '') {
        subTaskCollection.splice(i, 1);
    } else {
        subTaskCollection[i] = input.value;
    }
    renderSubtasks();
    input.value = '';
    toggleVisibility('edit_container', false);
}


/**
 * Cancels the subtask edit by clearing the input value and hiding the edit container.
 *
 */
function cancelSubtaskEdit() {
    let input = document.getElementById('edit_input');
    input.value = '';
    toggleVisibility('edit_container', false);
}


/**
 * Deletes a subtask from the subTaskCollection array at the specified index and re-renders the subtasks.
 *
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
    subTaskCollection.splice(i, 1);
    renderSubtasks();
}