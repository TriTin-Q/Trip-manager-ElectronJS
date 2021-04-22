
const{ipcRenderer}=require('electron');

function generateInformationPage(tableId,tableData){
    const img = document.querySelector('img');
    const title = document.querySelector('#title');
    const description = document.querySelector('#description');
    const destination = document.querySelector('#destination');
    const advantage = document.querySelector('#advantage');
    const price = document.querySelector('#price');
    const actions = document.querySelector('#actions');
    title.innerHTML = tableData.cards.title;
    description.innerHTML = tableData.cards.description;
    destination.innerHTML = tableData.cards.destination;
    advantage.innerHTML = tableData.cards.advantage;
    price.innerHTML = `${tableData.cards.price} €`;
    img.src =tableData.cards.picture;
    const actionsButtons = document.createElement('div');
    actionsButtons.classList.add('text-right')
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn', 'btn-outline-danger', 'mx-2');
    deleteBtn.innerText = 'Suppr';
    

    const editBtn = document.createElement('button');
    editBtn.classList.add('btn', 'btn-warning', 'mx-2');
    editBtn.innerText = 'Modif';
    
    const onClickUpdateBtn = () => {
        ipcRenderer.send('open-edit-item-window', {
            itemToEdit: tableData,
            type: tableId.split('-')[0]
        });
        ipcRenderer.once('item-edited',(e,data)=>{
            title.innerText= data.editedItem.title,
            destination.innerText =  data.editedItem.destination,
            description.innerText= data.editedItem.description,
            advantage.innerText =  data.editedItem.advantage,
            price.innerText= data.editedItem.price,
            img.src =  data.editedItem.picture
        })
    };
    editBtn.addEventListener('click', onClickUpdateBtn);

    const onClickDeleteBtn = () => {
        ipcRenderer.invoke('show-confirm-delete-item', {
                id: tableData.id
            })
            .then(res => {
                if (res.choice) { // 1 is the index in the array buttons but 1 is also true (boolean)
                    ipcRenderer.invoke('delete-card',tableData);
        
                }
                });

    };
    deleteBtn.addEventListener('click', onClickDeleteBtn);

    actionsButtons.appendChild(editBtn);
    actionsButtons.appendChild(deleteBtn);
    actions.appendChild(price);
    actions.appendChild(actionsButtons);

}

    ipcRenderer.once('card-data',(e,data)=>{
    
        generateInformationPage('card',data);
    })
