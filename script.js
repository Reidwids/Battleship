/*----- constants -----*/
const gameboardSize = [10,10]
const destroyerSize = 2;
const submarineSize = 3;
const cruiserSize = 3;
const battleshipSize = 4;
const carrierSize = 5;
/*----- app's state (variables) -----*/
const gameState = {
    gameStatePlayer: [
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','','']
    ],

    gameStateCPU: [
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','',''],
    ['','','','','','','','','','']
    ],
}
let shipOrientation = 'horizontal';
/*----- cached element references -----*/
const GBPlayer = document.querySelector('#GBPlayer');
const GBCpu = document.querySelector('#GBCpu');
const destroyer = [document.querySelector('#destroyer'), 2];
const submarine = [document.querySelector('#submarine'), 3];
const cruiser = [document.querySelector('#cruiser'), 3];
const battleship = [document.querySelector('#battleship'), 4];
const carrier = [document.querySelector('#carrier'), 5];
const ships = [destroyer, submarine, cruiser, battleship, carrier];
const rotate = document.querySelector("#rotateButton");
/*----- event listeners -----*/
rotate.addEventListener("click", rotateShip);
/*----- functions -----*/

/*- Initialize game -*/ 
init();
function init(){
    createGameboards();
    createShipEls(destroyer, submarine, cruiser, battleship, carrier);
}
function createGameboards(){
    for (i=0;i<gameboardSize[0]*gameboardSize[1];i++){
        const newEl1 = document.createElement('div');
        const newEl2 = document.createElement('div');
        newEl1.id = `_${i}`;
        newEl2.id = `_${i}`;
        newEl1.className = 'GBPLayerEl';
        newEl2.className = 'GBCpuEl';
        GBPlayer.appendChild(newEl1); 
        GBCpu.appendChild(newEl2); 
    }
}
function createShipEls(...args){
    for (i=0;i<args.length;i++){
        for (let j=0;j<args[i][1];j++){
            const newEl1 = document.createElement('div');
            newEl1.className = 'shipEl';
            newEl1.id = `shipEl-${j}`;
            args[i][0].appendChild(newEl1);
        }
        args[i][0].setAttribute('draggable', 'true');
        args[i][0].style.gridTemplateColumns = `repeat(${args[i][1]}, 20%)`;
        args[i][0].style.gridTemplateRows = "100%";
        args[i][0].style.width = "150px";
        args[i][0].style.height = "30px";
    }
}
function rotateShip(){
    shipOrientation==='horizontal'?shipOrientation='vertical':shipOrientation='horizontal';
    for (i=0;i<ships.length;i++){
        if (shipOrientation==='horizontal'){
            ships[i][0].style.gridTemplateColumns = `repeat(${ships[i][1]}, 20%)`;
            ships[i][0].style.gridTemplateRows = "100%";
            ships[i][0].style.width = "150px";
            ships[i][0].style.height = "30px";
        }
        if (shipOrientation==='vertical'){
            ships[i][0].style.gridTemplateColumns = '100%'
            ships[i][0].style.gridTemplateRows = `repeat(${ships[i][1]}, 20%)`;
            ships[i][0].style.width = "30px";
            ships[i][0].style.height = "150px";
        }
    }
}

/*Drag and drop*/
let shipLength;
let selectedShipElId;
let draggedShip;
ships.forEach(ship=>{
    ship[0].addEventListener('dragstart', dragStart);
    ship[0].addEventListener('dragstart', dragStart);
    ship[0].addEventListener('drag', drag);
    ship[0].addEventListener('dragend', dragEnd);
    ship[0].addEventListener('mousedown', (e)=> {
        selectedShipElId = e.target.id;
    })
})

const GBPLayerEl = document.querySelectorAll('.GBPLayerEl');
GBPLayerEl.forEach(el=>{
el.addEventListener('dragenter', dragEnter);
el.addEventListener('dragover', dragOver);
el.addEventListener('dragleave', dragLeave);
el.addEventListener('drop', dragDrop);
});

function dragStart(e) {
    shipLength = this.children.length;
    draggedShip = e.target;
    setTimeout(()=>{draggedShip.className = 'hide'}, 10);
   // e.target.style.width = "70%";
    //e.target.style.height = "70%";
}
function drag(e) {
}
function dragEnd(e) {
}
function dragEnter(e) {
    e.preventDefault()
    e.target.classList.add('drag-over');
}
function dragOver(e) {
    e.preventDefault()
    e.target.classList.add('drag-over');
}
function dragLeave(e) {
    e.target.classList.remove('drag-over');
}
function dragDrop(e) {
    let draggedShipLastElId = draggedShip.lastChild.id;
    let draggedShipLastElIndex = shipLength-1;
    let selectedShipElIndex = parseInt(selectedShipElId.substr(-1))
    let spaceFromLastEl = draggedShipLastElIndex-selectedShipElIndex;

    let shipDropSquareId = e.target.id;
    let shipDropSquareIndex = parseInt(shipDropSquareId.substr(-2))?
    parseInt(shipDropSquareId.substr(-2)):
    parseInt(shipDropSquareId.substr(-1)); 
    //let shipDropSquareLastIndex = shipDropSquareIndex-spaceFromLastEl;
    if (shipOrientation === 'horizontal'){
        for (i=0;i<shipLength;i++){
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl-i].classList.add('shipEl')
        }
    }
    else {
        for (i=0;i<shipLength;i++){
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl*10-i*10].classList.add('shipEl')
        }
    }
    
    e.target.classList.remove('drag-over');
     element = document.getElementById(draggedShip);
    //draggedShip.classList.remove('hide');
}
