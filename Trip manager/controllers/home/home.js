const{ipcRenderer, ipcMain}=require('electron');

function generateCard(tableId,tableData){
    const ul = document.querySelector('#ul')
    tableData.forEach(row => {
        console.log(row);
        
    const li = document.createElement('li');
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('mb-3');
        card.classList.add('pb-5');
        card.classList.add('shadow');
        card.id=row.id;

        const title = document.createElement('h5');
        title.classList.add('card-title');
        title.classList.add('font-weight-bold');
        title.innerText = row.title;
        title.classList.add('pl-4');
        title.classList.add('title');

        const AllInformationCard = document.createElement('div');
        AllInformationCard.classList.add('row');
        AllInformationCard.classList.add('d-flex');
        AllInformationCard.classList.add('justify-content-around');
        AllInformationCard.classList.add('flex-nowrap');
        
        const div3 = document.createElement('div');

        const picture = document.createElement('img');
        picture.src = row.picture;
        picture.alt='...';
        picture.style= 'width:150px';
        picture.style= 'height:170px';
        picture.classList.add('picture');

        const div4 = document.createElement('div');

        const bodyCard = document.createElement('div');
        bodyCard.classList.add('card-body');
        const destination = document.createElement('h6');
        destination.classList.add('card-title');
        destination.innerText = row.destination
        destination.classList.add('destination');

        const little_description = document.createElement('p');
        little_description.classList.add('card-text');
        little_description.innerText = row.little_description;
        little_description.classList.add('little_description');

        const p2 = document.createElement('p');
        p2.classList.add('font-weight-bold');
        p2.innerText="Les plus(+) de cette offre !";

        const advantage = document.createElement('p');
        advantage.innerText = row.advantage;
        advantage.classList.add('advantage')

        const picture_information = document.createElement('div');
        picture_information.classList.add("d-flex")

        const AllActionsCard = document.createElement('div');
        AllActionsCard.classList.add("d-flex");
        AllActionsCard.classList.add('flex-column');
        AllActionsCard.classList.add('justify-content-around');
        const price = document.createElement('div');
        price.classList.add('border');
        price.classList.add('border-dark');
        price.classList.add('bg-light');
        price.classList.add('font-weight-bold');
        price.classList.add('text-center');
        price.innerHTML = `${row.price} €`;
        price.classList.add('price');


        const moreInformation = document.createElement('button');
        moreInformation.classList.add('btn', 'btn-outline-success', 'mx-2');
        moreInformation.innerText = '>';



        const onCardClick=()=>{
            ipcRenderer.send('open-item-window',{
            })

            const card = {
                id:row.id, picture:row.picture, 
                title:row.title, destination:row.destination, description:row.description,
                advantage:row.advantage,price:row.price
            }
            ipcRenderer.invoke('card',card);

        }
        card.addEventListener('click',onCardClick);

        card.appendChild(title);
        card.appendChild(AllInformationCard);
        AllInformationCard.appendChild(picture_information);
        AllInformationCard.appendChild(div4);
        AllInformationCard.appendChild(AllActionsCard);
        div3.appendChild(picture);
        div4.appendChild(bodyCard);
        bodyCard.appendChild(destination);
        bodyCard.appendChild(little_description);
        bodyCard.appendChild(p2);
        bodyCard.appendChild(advantage);
        picture_information.appendChild(div3);
        picture_information.appendChild(bodyCard);
        AllActionsCard.appendChild(price);
        AllActionsCard.appendChild(moreInformation);
        li.appendChild(card);
        ul.appendChild(li);

    })

}
function editCard(id,data){
    const card = document.getElementById(`${id}`);
    
    card.querySelector('.title').innerText= data.editedItem.title,
    card.querySelector('.destination').innerText =  data.editedItem.destination,
    card.querySelector('.little_description').innerText= data.editedItem.little_description,
    card.querySelector('.advantage').innerText =  data.editedItem.advantage,
    card.querySelector('.price').innerText= data.editedItem.price,
    card.querySelector('.picture').src =  data.editedItem.picture

}
function deleteCard(Id,tableData){
    const card = document.getElementById(`${Id}`);
    card.remove();
}

ipcRenderer.once('item-edited',(e,data)=>{
    console.log(data);

    editCard(data.id,data);
})

ipcRenderer.once('init-data',(e,data)=>{
    console.log(data);

    generateCard('cards-table',data.cards);
});

/**
 * ADD ITEM
 */
function onClickAddItemBtn(e){
    ipcRenderer.send('open-new-item-window',{
    })
}

const addTripBtn = document.querySelector('#add-trip');

addTripBtn.addEventListener('click',onClickAddItemBtn);

ipcRenderer.on('new-item-added',(e,data)=>{
    console.log(data.item);
    generateCard(`cards-table`,data.item);
})

ipcRenderer.once('card-data-deleted',(e,data)=>{
    console.log(data.cards.cards);
    const id = data.cards.cards.id
    deleteCard(id,data);
})