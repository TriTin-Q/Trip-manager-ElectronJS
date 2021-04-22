const {ipcRenderer} = require('electron');

const editItemForm= document.querySelector('#edit-item-form');

const idInput = editItemForm.querySelector('#item-id');
const titleInput = editItemForm.querySelector('#item-title');
const destinationInput = editItemForm.querySelector('#item-destination');
const little_descriptionInput = editItemForm.querySelector('#item-little_description');
const descriptionInput = editItemForm.querySelector('#item-description');
const advantageInput = editItemForm.querySelector('#item-advantage');
const priceInput = editItemForm.querySelector('#item-price');
const pictureInput = editItemForm.querySelector('#item-picture');

/**
 * INIT DATA
 */

ipcRenderer.once('edit-data', (e,itemToEdit)=>{
    
    idInput.value=itemToEdit.cards.id,
    titleInput.value=itemToEdit.cards.title,
    destinationInput.value = itemToEdit.cards.destination,
    little_descriptionInput.value=itemToEdit.cards.little_description,
    descriptionInput.value= itemToEdit.cards.description ,
    advantageInput.value = itemToEdit.cards.advantage,
    priceInput.value=itemToEdit.cards.price,
    pictureInput.value = itemToEdit.cards.picture
})

/**
 * EDIT ITEM FORM
 */


 function onSubmitEditItem(e) {
     e.preventDefault();
    
     const editedItem = {
        id:idInput.value,
        title:titleInput.value,
        destination:destinationInput.value,
        little_description:little_descriptionInput.value,
        description:descriptionInput.value,
        advantage:advantageInput.value,
        price:priceInput.value,
        picture:pictureInput.value
     };
     ipcRenderer.invoke('edit-item', editedItem);
 }
 
 editItemForm.addEventListener('submit', onSubmitEditItem);