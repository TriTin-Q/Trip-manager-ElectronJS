const { app, BrowserWindow, ipcMain,dialog, ipcRenderer} = require('electron');
const Store = require('electron-store');
const path = require('path');

const store = new Store();
const cards = [];
if(cards.length === 0){
    cards.push({id:1, picture:'http://fr.dangcongsan.vn/DATA/4/2020/04/c%E1%BA%A7u_v%C3%A0ng_%C4%91%C3%A0_n%E1%BA%B5ng_1-10_34_56_893.jpg', 
    title:'Une semaine à Da Nang ', destination:'Da Nang au Vietnam', little_description:'Vols + hotel + transfert',
    advantage:'Une toute nouvelles culture, des paysages à couper le souffle',price:1399,description:'Đà Nẵng ou Da Nang, jadis appelée en Occident Tourane(également orthographié Touron), est une ville de la région de la Côte centrale du Sud du Viêt Nam. L\'ancienne cité appelée Indrapura, capitale du Champā entre 875 et 978, se trouve proche de la ville.C\'est aujourd\'hui la troisième ville du pays. Longtemps considérée comme une ville de province, la ville connaît un boom économique symbolisée par ses nombreux et récents gratte-ciels. '});
    cards.push( {id:2, picture:'https://www.rominaibizavillas.com/wp-content/uploads/2018/07/ibiza-inmobiliaria-romina-villas.jpg',
    title:'Week-end à Ibiza',destination:'île des Baléares, archipel espagnol de la Méditerranée.', little_description:'vols + transfert + club + hotel',
    advantage:'Des souvenirs inoubliables, des boissons et soirées offertes'
    ,price:559,description:'Ibiza est une île des Baléares, archipel espagnol de la Méditerranée. Elle est célèbre pour sa vie nocturne animée en centre-ville et à Sant Antoni, où les principales boîtes de nuit d\'Europe ont des antennes l\'été. L\'île compte aussi des villages paisibles, des centres de yoga et des plages, de Platja d\'en Bossa, bordée d\'hôtels, de bars et de boutiques, aux criques sableuses et plus tranquilles, adossées à des collines plantées de pins typiques de la côte. '});
    
    store.set('cards',cards);
}

let mainWindow = null;
let secondWindow = null;

function createWindow (viewPath, width=1400, height = 1000) {
    const win = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            preload:path.join(__dirname,'preload.js')
        }
    });

    win.loadFile(path.join(__dirname, viewPath));

    return win;
}

app.whenReady().then(()=>{
    mainWindow = createWindow('views/home/home.html');

    mainWindow.webContents.on('did-finish-load',()=>{
        mainWindow.webContents.send('init-data',{
            cards:cards
        });
    })

});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    mainWindow = createWindow('views/home/home.html');

    mainWindow.webContents.on('did-finish-load',()=>{
        mainWindow.webContents.send('init-data',{
            cards:cards
        });
    })
});

/**
 * IPC HANDLER
 */

 ipcMain.on('open-item-window', (e, data) => {
    const win = createWindow('views/card/card.html', 1000, 500);
    secondWindow = win;
    ipcMain.handle('card', (e, card) => {
        const arrayCard = cards;
        win.webContents.on('did-finish-load',()=>{
            win.webContents.send('card-data',{
                cards:card
            });
        })
    });
    win.on('close', () => {
        ipcMain.removeHandler('card');
    });
});

ipcMain.on('open-new-item-window', (e, data) => {

    const win = createWindow('views/add-item/add-item.html', 1000, 500);


    ipcMain.handle('new-item', (e, newItem) => {
        newItem.id = 1;
        const arrayToAdd = cards;
        if (arrayToAdd.length > 0) {
            newItem.id = arrayToAdd[arrayToAdd.length - 1].id + 1;
        }
        arrayToAdd.push(newItem);
        store.set(`${data.type}s`, arrayToAdd);
        mainWindow.webContents.send('new-item-added', {
            type: cards,
            item: [newItem],
            cards:cards
        });
        return 'Item correctement ajouté!';
    });

    win.on('close', () => {
        ipcMain.removeHandler('new-item');
    });
});
ipcMain.handle('delete-card', (e, card) => {
    mainWindow.webContents.on('did-finish-load',()=>{
        mainWindow.webContents.send('card-data-deleted',{
            cards:card
        });
    })
});
ipcMain.handle('show-confirm-delete-item',(e,data)=>{
    const choice = dialog.showMessageBoxSync({
        type:'warning',
        buttons:['Non','Oui'],
        title: 'Confirmation de suppression',
        message:'Êtes-vous sur de vouloir supprimer cet élément ?'
    })
 
    if(choice){
        const inArrayToSearch = cards;

        for(let[index,item]of inArrayToSearch.entries()){
            if(item.id===data.id){
                inArrayToSearch.splice(index,1);
                break
            }
        }
    }
    return {choice,cards}
})

ipcMain.on('open-edit-item-window', (e, data) => {

    const win = createWindow('views/edit-item/edit-item.html', 1000, 500);

    // Send the item when the view is ready
    win.webContents.on('did-finish-load', () => {
       win.webContents.send('edit-data', data.itemToEdit);
    });

    ipcMain.handle('edit-item', (e, editedItem) => {

        const arrayToEdit = cards;

        for(let [index, item] of arrayToEdit.entries()) {
            if(item.id === editedItem.id) {
                arrayToEdit[index] = editedItem;
                break;
            }
        }

        store.set(cards, arrayToEdit);
        secondWindow.webContents.send('item-edited', {
            editedItem: editedItem,
            id:arrayToEdit
        });
        mainWindow.webContents.send('item-edited', {
            editedItem: editedItem,
            id:editedItem.id
        });
        return 'L\'item a correctement été modifié !';
    });

    win.on('closed', () => {
       ipcMain.removeHandler('edit-item');
    });

});