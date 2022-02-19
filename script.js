/* PseudoCode
o Create Gameboards
o Ship placing phase

o Create playerShips
o Make playerShips draggable onto board 
o Make playerShips rotatable
o Auto generate computer ship placement
Log ship placement into gamestate

Playing phase
Create guessing pieces
Allow playerguesses on cpu board
Create ai for cpu guesses on playerboard
Log guesses in gamestate
Track guesses for win condition match
Once game is won, display winning message

Implement extras:
    -SFX and Music
    -Banner with hamburger menu
        -About section
        -Settings
        -ship sinking animation
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
    player: [
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
    cpu: [
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
let randomNumberValid;
let validatePosition = [];
let shipLength;
let selectedShipElId;
let draggedShip;
//FIX BELOW TO FALSE
let allShipsPlaced = true;
//FIX ABOVE TO FALSE
let turn = Math.floor(Math.random()*2);
/*----- cached element references -----*/
const GBPlayer = document.querySelector('#GBPlayer');
const GBCpu = document.querySelector('#GBCpu');
const shipsPlaced = document.querySelector("#shipDiv")
const destroyer = [document.querySelector('#destroyer'), 2];
const submarine = [document.querySelector('#submarine'), 3];
const cruiser = [document.querySelector('#cruiser'), 3];
const battleship = [document.querySelector('#battleship'), 4];
const carrier = [document.querySelector('#carrier'), 5];
const playerShips = [destroyer, submarine, cruiser, battleship, carrier];
const cpuShips = [2,3,3,4,5]
const rotate = document.querySelector("#rotateButton");
/*----- event listeners -----*/
rotate.addEventListener("click", rotateShip);

/*----- functions -----*/

/*- Initialize game -*/ 
init();

function init(){
    createGameboards();
    createPlayerShips(destroyer, submarine, cruiser, battleship, carrier);
    createCpuShips(...cpuShips);
}

/*-Initialization Functions-*/
function createGameboards(){
    for (i=0;i<gameboardSize[0]*gameboardSize[1];i++){
        const newEl = document.createElement('div');
        const newEl2 = document.createElement('div');
        newEl.id = `_${i}`;
        newEl2.id = `c${i}`;
        newEl.className = 'GBPLayerEl';
        newEl2.className = 'GBCpuEl';
        GBPlayer.appendChild(newEl); 
        GBCpu.appendChild(newEl2);
    }
    const GBCpuEl = document.querySelectorAll('.GBCpuEl');
    GBCpuEl.forEach(x=>x.addEventListener('click', render))
}

function createPlayerShips(...args){
    for (i=0;i<args.length;i++){
        for (let j=0;j<args[i][1];j++){
            const newEl = document.createElement('div');
            newEl.className = 'shipEl';
            newEl.id = `playerShipEl-${j}`;
            args[i][0].appendChild(newEl);
        }
        args[i][0].setAttribute('draggable', 'true');
        args[i][0].style.gridTemplateColumns = `repeat(${args[i][1]}, 20%)`;
        args[i][0].style.gridTemplateRows = "100%";
        args[i][0].style.width = "150px";
        args[i][0].style.height = "30px";
        args[i][0].style.margin = "5px 0 0 5px";
    }
}

/*-Ship Placement-*/
function rotateShip(){
    shipOrientation==='horizontal'?shipOrientation='vertical':shipOrientation='horizontal';
    for (i=0;i<playerShips.length;i++){
        if (shipOrientation==='horizontal'){
            playerShips[i][0].style.gridTemplateColumns = `repeat(${playerShips[i][1]}, 20%)`;
            playerShips[i][0].style.gridTemplateRows = "100%";
            playerShips[i][0].style.width = "150px";
            playerShips[i][0].style.height = "30px";
        }
        if (shipOrientation==='vertical'){
            playerShips[i][0].style.gridTemplateColumns = '100%'
            playerShips[i][0].style.gridTemplateRows = `repeat(${playerShips[i][1]}, 20%)`;
            playerShips[i][0].style.width = "30px";
            playerShips[i][0].style.height = "150px";
            playerShips[i][0].style.margin = "5px 0 0 5px";
        }
    }
}

/*Drag and drop*/

playerShips.forEach(ship=>{
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
}
function dragOver(e) {
    e.preventDefault()
    e.target.classList.add('drag-over');
}
function dragLeave(e) {
    e.target.classList.remove('drag-over');
}
function dragDrop(e) {
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
            let tempArr = (shipDropSquareIndex+spaceFromLastEl-i).toString().split("");
            if (tempArr.length === 1){
                gameState.player[0][parseInt(tempArr[0])] = "S";
            }
            else {
                gameState.player[parseInt(tempArr[0])][parseInt(tempArr[1])] = "S"
            }
        }
        draggedShip.parentNode.remove();
    }
    else if ((shipOrientation === 'vertical') && !verticalLimits.slice(0, 10*(shipLength-1)).includes(shipDropSquareIndex+spaceFromLastEl*10) && noShipHere.every(x=>x===true)) {
        for (i=0;i<shipLength;i++){
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl*10-i*10].classList.add('shipEl')
            let tempArr = (shipDropSquareIndex+spaceFromLastEl*10-i*10).toString().split("");
            if (tempArr.length === 1){
                gameState.player[0][parseInt(tempArr[0])] = "S";
            }
            else {
                gameState.player[parseInt(tempArr[0])][parseInt(tempArr[1])] = "S"
            }
        }
        draggedShip.parentNode.remove();
    }
    e.target.classList.remove('drag-over');
    selectedShipElId = "";
    if (shipsPlaced.childElementCount===0){
        allShipsPlaced = true;
        render()
    }
}
/*Computer Generated Ships*/
function createCpuShips(...args){
    for (let i=0;i<args.length;i++){
        randomNumberValid = false;
        while (!randomNumberValid){
            let randomBoardIndex = Math.floor(Math.random()*100);
            let randomOrientation = Math.floor(Math.random()*2);
            validatePosition = [true];
            randomOrientation===1?randomOrientation='horizontal':randomOrientation='vertical';
            if (randomOrientation==='horizontal'){
                for (let j=0;j<args[i];j++){
                    if((randomBoardIndex-j)>=0){
                        if (horizontalLimits.slice(0, 10*(args[i]-1)).includes(randomBoardIndex)||
                        document.getElementById(`c${randomBoardIndex-j}`).classList.contains('cpuShipEl')){
                            validatePosition.push(false);
                        }
                    }
                    else validatePosition.push(false);
                }
                if (validatePosition.every(x=>x===true)){
                    for (let j=0;j<args[i];j++){
                        document.getElementById(`c${randomBoardIndex-j}`).className = 'cpuShipEl'; 
                        let tempArr = (randomBoardIndex-j).toString().split("");
                            if (tempArr.length === 1){
                                gameState.cpu[0][parseInt(tempArr[0])] = "S";
                            }
                            else {
                                gameState.cpu[parseInt(tempArr[0])][parseInt(tempArr[1])] = "S"
                            }
                        // const newEl = document.createElement('div');
                        // newEl.className = 'cpuShipEl';
                        // newEl.id = `cpuShipEl-${args[i]-j}`;
                        // document.getElementById(`c${randomBoardIndex-j}`).appendChild(newEl);
                        randomNumberValid = true;
                    }
                } 
            }
            if (randomOrientation==='vertical'){
                for (let j=0;j<args[i];j++){
                    if((randomBoardIndex-j*10)>=0){
                        if (verticalLimits.slice(0, 10*(args[i]-1)).includes(randomBoardIndex)||
                        document.getElementById(`c${randomBoardIndex-j*10}`).classList.contains('cpuShipEl')){
                            validatePosition.push(false);
                        }
                    }
                    else validatePosition.push(false);
                }
                if (validatePosition.every(x=>x===true)){
                    for (let j=0;j<args[i];j++){
                        document.getElementById(`c${randomBoardIndex-j*10}`).className = 'cpuShipEl'; 
                        let tempArr = (randomBoardIndex-j*10).toString().split("");
                            if (tempArr.length === 1){
                                gameState.cpu[0][parseInt(tempArr[0])] = "S";
                            }
                            else {
                                gameState.cpu[parseInt(tempArr[0])][parseInt(tempArr[1])] = "S"
                            }
                        // const newEl = document.createElement('div');
                        // newEl.className = 'cpuShipEl';
                        // newEl.id = `cpuShipEl-${args[i]-j}`;
                        // document.getElementById(`c${randomBoardIndex-j}`).appendChild(newEl);
                        randomNumberValid = true;
                    }
                } 
            }
        }
    }
}

/*-Render Game-*/
function render(e){
    if(allShipsPlaced===true){
        if(whosTurn()==='player'){
            //newEl2.className = 'cpuGuess';
            let selectedCpuId = parseInt(e.target.id.substr(-2))?
            e.target.id.substr(-2):
            e.target.id.substr(-1);
            let tempArr = selectedCpuId.split("");
            console.log(gameState.cpu)
            console.log(gameState.cpu[0][parseInt(tempArr[0])]);
            if (tempArr.length === 1){
                if (gameState.cpu[0][parseInt(tempArr[0])]==='S'){
                    const newEl = document.createElement('div');
                    newEl.className = 'guess';
                    newEl.id = 'hit'
                    e.target.appendChild(newEl);
                }
                else {
                    const newEl = document.createElement('div');
                    newEl.className = 'guess';
                    newEl.id = 'miss'
                    e.target.appendChild(newEl);
                }
            }
            else {
                if (gameState.cpu[parseInt(tempArr[0])][parseInt(tempArr[1])]==='S'){
                    const newEl = document.createElement('div');
                    newEl.className = 'guess';
                    newEl.id = 'hit'
                    e.target.appendChild(newEl);
                }
                else {
                    const newEl = document.createElement('div');
                    newEl.className = 'guess';
                    newEl.id = 'miss'
                    e.target.appendChild(newEl);
                }
            }
            checkShips()
        }
        else {
            
        }
    }
}

function whosTurn(){
    turn===1?turn--:turn++;
    return turn===1?"player":"cpu";
}
function checkShips(){

}