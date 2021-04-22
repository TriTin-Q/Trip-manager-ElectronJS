const {ipcRenderer} = require('electron');

const newItemForm = document.querySelector('#new-item-form');
const newItemSubmit = newItemForm.querySelector('#new-item-submit');

const titleInput = newItemForm.querySelector('#item-title');
const destinationInput = newItemForm.querySelector('#item-destination');
const little_descriptionInput = newItemForm.querySelector('#item-little_description');
const descriptionInput = newItemForm.querySelector('#item-description');
const advantageInput = newItemForm.querySelector('#item-advantage');
const priceInput = newItemForm.querySelector('#item-price');
const pictureInput = newItemForm.querySelector('#item-picture');

function onSubmitNewItem(e){
    e.preventDefault();

    const newItem={
        title:titleInput.value,
        destination:destinationInput.value,
        little_description:little_descriptionInput.value,
        description:descriptionInput.value,
        advantage:advantageInput.value,
        price:priceInput.value,
        picture:pictureInput.value
    }

    ipcRenderer.invoke('new-item',newItem)
}

newItemForm.addEventListener('submit',onSubmitNewItem);

