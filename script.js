/* PseudoCode
Create Gameboards

Ship placing phase
Create ships
Make ships draggable onto board 
Make ships rotatable
Auto generate computer ship placement
Log ship placement into gamestate

Playing phase
Create guessing pieces
Allow playerguesses on cpu board
Create ai for cpu guesses
Log guesses in gamestate
Track guesses for win condition match
Once game is won, display winning message

Implement extras:
    -SFX and Music
    -Banner with hamburger menu
        -About section
        -Settings
*/

/*----- constants -----*/
const gameboardSize = [10,10];
const destroyerSize = 2;
const submarineSize = 3;
const cruiserSize = 3;
const battleshipSize = 4;
const carrierSize = 5;
/*Create limitations for ship placement*/
const horizontalLimits = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,12,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93,4,14,24,34,44,54,64,74,84,94];
const verticalLimits = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];

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
let noShipHere = [];
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
    createPlayerShips(destroyer, submarine, cruiser, battleship, carrier);
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
function createPlayerShips(...args){
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
        args[i][0].style.margin = "5px 0 0 5px";
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
            ships[i][0].style.margin = "5px 0 0 5px";
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
    });
})

const GBPLayerEl = document.querySelectorAll('.GBPLayerEl');
GBPLayerEl.forEach(el=>{
    el.addEventListener('dragenter', dragEnter);
    el.addEventListener('dragover', dragOver);
    el.addEventListener('dragleave', dragLeave);
    el.addEventListener('drop', dragDrop);
});
function dragStart(e) {
    draggedShip = e.target;
    shipLength = draggedShip.children.length;
    //setTimeout(()=>{draggedShip.className = 'hide'}, 10);
}
function drag(e) {
}
function dragEnd(e) {
}
function dragEnter(e) {
    e.preventDefault()
    e.target.classList.add('drag-over');
    let draggedShipLastElIndex = shipLength-1;
    let selectedShipElIndex = parseInt(selectedShipElId.substr(-1));
    let spaceFromLastEl = draggedShipLastElIndex-selectedShipElIndex;
    let shipEnterSquareId = e.target.id;
    let shipEnterSquareIndex = parseInt(shipEnterSquareId.substr(-2))?
    parseInt(shipEnterSquareId.substr(-2)):
    parseInt(shipEnterSquareId.substr(-1)); 
    noShipHere = [];
    if (shipOrientation === 'horizontal'){
        for (i=0;i<shipLength;i++){
            if(GBPLayerEl[shipEnterSquareIndex+spaceFromLastEl-i].classList.contains('shipEl')){
                noShipHere.push(false);
            } 
            else noShipHere.push(true);
        }
    }
    
    if (shipOrientation === 'vertical'){
        for (i=0;i<shipLength;i++){
            if(GBPLayerEl[shipEnterSquareIndex+spaceFromLastEl*10-i*10].classList.contains('shipEl')){
                noShipHere.push(false);
            } 
            else noShipHere.push(true);
        }
    }
    console.log(noShipHere);   
}
function dragOver(e) {
    e.preventDefault()
    e.target.classList.add('drag-over');
}
function dragLeave(e) {
    e.target.classList.remove('drag-over');
}
function dragDrop(e) {
    console.log(noShipHere)
    //let draggedShipLastElId = draggedShip.lastChild.id;
    let draggedShipLastElIndex = shipLength-1;
    let selectedShipElIndex = parseInt(selectedShipElId.substr(-1));
    let spaceFromLastEl = draggedShipLastElIndex-selectedShipElIndex;

    let shipDropSquareId = e.target.id;
    let shipDropSquareIndex = parseInt(shipDropSquareId.substr(-2))?
    parseInt(shipDropSquareId.substr(-2)):
    parseInt(shipDropSquareId.substr(-1)); 

    
    if ((shipOrientation === 'horizontal') && !horizontalLimits.slice(0, 10*(shipLength-1)).includes(shipDropSquareIndex+spaceFromLastEl) && noShipHere.every(x=>x===true)){
        for (i=0;i<shipLength;i++){
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl-i].classList.add('shipEl')
        }
        draggedShip.classList.add('hide');
    }
    else if ((shipOrientation === 'vertical') && !verticalLimits.slice(0, 10*(shipLength-1)).includes(shipDropSquareIndex+spaceFromLastEl*10) && noShipHere.every(x=>x===true)) {
        for (i=0;i<shipLength;i++){
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl*10-i*10].classList.add('shipEl')
        }
        draggedShip.classList.add('hide');
    }
    //draggedShip.style.margin = "0px"
    e.target.classList.remove('drag-over');
    selectedShipElId = "";
}
/*Computer Generated Ships*/
function createCpuShips(...args){
    for (i=0;i<args.length;i++){
        for (let j=0;j<args[i][1];j++){
            const newEl1 = document.createElement('div');
            newEl1.className = 'cpuShipEl';
            newEl1.id = `cpuShipEl_${j}`;
            args[i][0].appendChild(newEl1);
        }
        args[i][0].setAttribute('draggable', 'true');
        args[i][0].style.gridTemplateColumns = `repeat(${args[i][1]}, 20%)`;
        args[i][0].style.gridTemplateRows = "100%";
        args[i][0].style.width = "150px";
        args[i][0].style.height = "30px";
        args[i][0].style.margin = "5px 0 0 5px";
    }
}

