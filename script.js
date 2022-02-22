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
    player: {
            grid: [[1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1]],
        destroyerHp: 2,
        submarineHp: 3,
        cruiserHp: 3,
        battleshipHp: 4,
        carrierHp: 5,
        opponentName: "player's"
    },
    cpu: {
        grid: [[1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1]],
        destroyerHp: 2,
        submarineHp: 3,
        cruiserHp: 3,
        battleshipHp: 4,
        carrierHp: 5,
        guesses: [],
        leads: [],
        currentLead: [],
        potentialGuesses: [],
        opponentName: "cpu's"
    }
}

let shipOrientation = 'horizontal';
let noShipHere = [];
let randomNumberValid;
let validatePosition = [];
let shipLength;
let selectedShipElId;
let draggedShip;
let draggedShipClass;
//FIX BELOW TO FALSE
let allShipsPlaced = true;
//FIX ABOVE TO FALSE
let turn = Math.floor(Math.random()*2);
/*----- cached element references -----*/
const GBPlayer = document.querySelector('#GBPlayer');
const GBCpu = document.querySelector('#GBCpu');
const shipsPlaced = document.querySelector("#shipDiv")
const destroyer = [document.querySelector('.destroyer'), 2];
const submarine = [document.querySelector('.submarine'), 3];
const cruiser = [document.querySelector('.cruiser'), 3];
const battleship = [document.querySelector('.battleship'), 4];
const carrier = [document.querySelector('.carrier'), 5];
const playerShips = [destroyer, submarine, cruiser, battleship, carrier];
const cpuShips = [2,3,3,4,5]
const shipClasses = ['destroyer', 'cruiser', 'submarine', 'battleship', 'carrier'];
const rotate = document.querySelector("#rotateButton");
const gameInfo = document.querySelector("#gameInfo");
/*----- event listeners -----*/
rotate.addEventListener("click", rotateShip);

/*----- functions -----*/

/*- Initialize game -*/ 
init();
function whosFirst(){
    turn===1?turn--:turn++;
    return turn===1?"player":"cpu";
}
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
            newEl.classList.add(`${shipClasses[i]}`)
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
    draggedShipClass = e.target.className;
    shipLength = draggedShip.children.length;
    //setTimeout(()=>{draggedShip.className = 'hide'}, 10);
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
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl-i].classList.add(`${draggedShipClass}`)
            let tempArr = (shipDropSquareIndex+spaceFromLastEl-i).toString().split("");
            if (tempArr.length === 1){
                gameState.player.grid[0][parseInt(tempArr[0])]--;
            }
            else {
                gameState.player.grid[parseInt(tempArr[0])][parseInt(tempArr[1])]--
            }
        }
        draggedShip.parentNode.remove();
    }
    else if ((shipOrientation === 'vertical') && !verticalLimits.slice(0, 10*(shipLength-1)).includes(shipDropSquareIndex+spaceFromLastEl*10) && noShipHere.every(x=>x===true)) {
        for (i=0;i<shipLength;i++){
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl*10-i*10].classList.add('shipEl');
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl*10-i*10].classList.add(`${draggedShipClass}`);
            let tempArr = (shipDropSquareIndex+spaceFromLastEl*10-i*10).toString().split("");
            if (tempArr.length === 1){
                gameState.player.grid[0][parseInt(tempArr[0])]--;
            }
            else {
                gameState.player.grid[parseInt(tempArr[0])][parseInt(tempArr[1])]--
            }
        }
        draggedShip.parentNode.remove();
    }
    e.target.classList.remove('drag-over');
    selectedShipElId = "";
    if (shipsPlaced.childElementCount===0){
        allShipsPlaced = true;
        if (whosFirst()==='cpu'){
                //set timeout
            cpuTurn();
        }
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
                        document.getElementById(`c${randomBoardIndex-j}`).classList.add(`${shipClasses[i]}`);
                        let tempArr = (randomBoardIndex-j).toString().split("");
                            if (tempArr.length === 1){
                                gameState.cpu.grid[0][parseInt(tempArr[0])]--;
                            }
                            else {
                                gameState.cpu.grid[parseInt(tempArr[0])][parseInt(tempArr[1])]--
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
                        document.getElementById(`c${randomBoardIndex-j*10}`).classList.add(`${shipClasses[i]}`);
                        let tempArr = (randomBoardIndex-j*10).toString().split("");
                            if (tempArr.length === 1){
                                gameState.cpu.grid[0][parseInt(tempArr[0])]--;
                            }
                            else {
                                gameState.cpu.grid[parseInt(tempArr[0])][parseInt(tempArr[1])]--
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
        if(!e.target.hasChildNodes() && !e.target.classList.contains("guess")){
        //newEl2.className = 'cpuGuess';
            let selectedCpuId = parseInt(e.target.id.substr(-2))?
            e.target.id.substr(-2):
            e.target.id.substr(-1);
            let tempArr = selectedCpuId.split("");
            placeGuess(tempArr, gameState.cpu, e.target)
            updateShipHp(e.target, gameState.cpu);
            cpuTurn()
            //updateShipHp(cpuGuess, gameState.player);
        }
    }
}
function placeGuess(tempArr, gameStateWithPlayer, target){
    if (tempArr.length === 1){
        if (gameStateWithPlayer.grid[0][parseInt(tempArr[0])]===0){
            const newEl = document.createElement('div');
            newEl.className = 'guess';
            newEl.id = 'hit'
            target.appendChild(newEl);
            //updateShipHp(target, gameStateWithPlayer);
            
        }
        else {
            const newEl = document.createElement('div');
            newEl.className = 'guess';
            newEl.id = 'miss'
            target.appendChild(newEl);
        }
    }
    else {
        if (gameStateWithPlayer.grid[parseInt(tempArr[0])][parseInt(tempArr[1])]===0){
            const newEl = document.createElement('div');
            newEl.className = 'guess';
            newEl.id = 'hit';
            target.appendChild(newEl);
            //updateShipHp(target, gameStateWithPlayer);
        }
        else {
            const newEl = document.createElement('div');
            newEl.className = 'guess';
            newEl.id = 'miss'
            target.appendChild(newEl);
        }
    }
}
function updateShipHp(target, gameStateWithPlayer){
    if (target.classList.contains('destroyer')&&gameStateWithPlayer.destroyerHp!==1) gameStateWithPlayer.destroyerHp--;
    else if(target.classList.contains('destroyer')) {
        gameStateWithPlayer.destroyerHp--;
        gameInfo.innerText = `The ${gameStateWithPlayer.opponentName} destroyer has sunk!`;
    }
    if (target.classList.contains('submarine')&&gameStateWithPlayer.submarineHp!==1) gameStateWithPlayer.submarineHp--;
    else if(target.classList.contains('submarine')) {
        gameStateWithPlayer.submarineHp--;
        gameInfo.innerText = `The ${gameStateWithPlayer.opponentName} submarine has sunk!`;
    }
    if (target.classList.contains('cruiser')&&gameStateWithPlayer.cruiserHp!==1) gameStateWithPlayer.cruiserHp--;
    else if(target.classList.contains('cruiser')) {
        gameStateWithPlayer.cruiserHp--;
        gameInfo.innerText = `The ${gameStateWithPlayer.opponentName} cruiser has sunk!`;
    }
    if (target.classList.contains('battleship')&&gameStateWithPlayer.battleshipHp!==1) gameStateWithPlayer.battleshipHp--;
    else if(target.classList.contains('battleship')) {
        gameStateWithPlayer.battleshipHp--;
        gameInfo.innerText = `The ${gameStateWithPlayer.opponentName} battleship has sunk!`;
    }
    if (target.classList.contains('carrier')&&gameStateWithPlayer.carrierHp!==1) gameStateWithPlayer.carrierHp--;
    else if(target.classList.contains('carrier')) {
        gameStateWithPlayer.carrierHp--;
        gameInfo.innerText = `The ${gameStateWithPlayer.opponentName} carrier has sunk!`;
    }
    if (gameStateWithPlayer.destroyerHp===0&&
        gameStateWithPlayer.submarineHp===0&&
        gameStateWithPlayer.cruiserHp===0&&
        gameStateWithPlayer.battleshipHp===0&&
        gameStateWithPlayer.carrierHp===0){
            gameInfo.innerText = "You won!";
        }
}


function cpuTurn(){
    let tempGuess = cpuGuess()
    const cpuGuessEl = document.getElementById(`_${tempGuess}`);
    let tempArr = tempGuess.toString().split("");
    placeGuess(tempArr, gameState.player, cpuGuessEl)
    updateShipHp(cpuGuessEl, gameState.player)
    //if computer guess = hit 
            //leads.push(guess coordinate as array
    //updateShipHp(cpuGuess, gameState.player);
}
            //if you make the guess and nothing sunk, then it knows it has potential
            //guesses on each end - then it randomly chooses
            // if one end returns a miss, then it knows to guess the other way
            //until a ship has sunk
function cpuGuess(){
    let guessValid = false;
    let guess;
    let chooseRandom;
    let guessId;
    let guessEl;
    while (guessValid === false){
        if (!gameState.cpu.leads[0]){
            guess = Math.floor(Math.random()*100);
            guessEl = document.querySelector(`#_${guess}`)
            guessId = guessEl.id;
        }
        else{
            chooseRandom = Math.floor(Math.random()*(gameState.cpu.potentialGuesses.length));
            guessId = gameState.cpu.potentialGuesses[chooseRandom][0].id;
            guess = parseInt(guessId.substr(-2))?
            parseInt(guessId.substr(-2)):
            parseInt(guessId.substr(-1));   
            guessEl = document.querySelector(`#_${guess}`)
            //reposition these
            //gameState.cpu.potentialGuesses.splice(chooseRandom, 1);
            //gameState.cpu.potentialGuesses.filter(x=>x[1]!==gameState.cpu.potentialGuesses[chooseRandom][1]);
            }
        if (!gameState.cpu.guesses.includes(guess)){
            let tempArr = guess.toString().split("");
            let tempGridEl;
            tempArr.length===1?
            tempGridEl = gameState.player.grid[0][parseInt(tempArr[0])]:
            tempGridEl = gameState.player.grid[parseInt(tempArr[0])][parseInt(tempArr[1])];
            if (tempGridEl===0){
                tempArr.length===1?
                gameState.cpu.leads.push([0,parseInt(tempArr[0])]):
                gameState.cpu.leads.push([parseInt(tempArr[0]),parseInt(tempArr[1])]);
                shipHit = true;       
                if (!chooseRandom){
                    chooseRandom = Math.floor(Math.random()*(gameState.cpu.potentialGuesses.length));
                    //guessId = gameState.cpu.potentialGuesses[chooseRandom][0].id;
                }  
                if (gameState.cpu.potentialGuesses[0]){
                    console.log(chooseRandom)
                    console.log(gameState.cpu.potentialGuesses)
                        if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'vertical'&&
                    gameState.cpu.potentialGuesses[chooseRandom][2] === 'up'&&
                    !gameState.cpu.guesses.includes(guess)){
                        gameState.cpu.potentialGuesses.filter(x=>x!==gameState.cpu.potentialGuesses[chooseRandom]);
                        gameState.cpu.potentialGuesses.filter(x=>x[1]!==gameState.cpu.potentialGuesses[chooseRandom][1]);
                        gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess-10}`), "vertical", 'up'])
                    }
                    else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'vertical'&&
                    gameState.cpu.potentialGuesses[chooseRandom][2] === 'down'&&
                    !gameState.cpu.guesses.includes(guess)){
                        gameState.cpu.potentialGuesses.filter(x=>x!==gameState.cpu.potentialGuesses[chooseRandom]);
                        gameState.cpu.potentialGuesses.filter(x=>x[1]!==gameState.cpu.potentialGuesses[chooseRandom][1]);
                        gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess+10}`), "vertical", 'down'])
                    }
                    else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'horizontal'&&
                    gameState.cpu.potentialGuesses[chooseRandom][2] === 'right'&&
                    !gameState.cpu.guesses.includes(guess)){
                        gameState.cpu.potentialGuesses.filter(x=>x!==gameState.cpu.potentialGuesses[chooseRandom]);
                        gameState.cpu.potentialGuesses.filter(x=>x[1]!==gameState.cpu.potentialGuesses[chooseRandom][1]);
                        gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess+1}`), "horizontal", 'right'])
                    }
                    else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'horizontal'&&
                    gameState.cpu.potentialGuesses[chooseRandom][2] === 'left'&&
                    !gameState.cpu.guesses.includes(guess)){
                        
                        gameState.cpu.potentialGuesses.filter(x=>x[1]!==gameState.cpu.potentialGuesses[chooseRandom][1]);
                        gameState.cpu.potentialGuesses.filter(x=>x!==gameState.cpu.potentialGuesses[chooseRandom]);
                        gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess-1}`), "horizontal", 'left'])
                    }
                }       
                if (!gameState.cpu.potentialGuesses[0]){
                    //let leadNum = parseInt(gameState.cpu.leads.join(""));
                    const elAbove = [document.querySelector(`#_${guess-10}`), "vertical", 'up'];
                    const elRight = [document.querySelector(`#_${guess+1}`), "horizontal", 'right'];
                    const elBelow = [document.querySelector(`#_${guess+10}`), 'vertical', 'down'];
                    const elLeft = [document.querySelector(`#_${guess-1}`), 'horizontal', 'left'];    
                    let potentialsArr = [elAbove,elRight,elBelow,elLeft].filter(x=>x[0]);
                    // .filter(x=>{
                    //     if(guessId.substr(-1)===0){
                    //         return x[0].id.substr(-1)!==9;
                    //     }
                    //     else if (guessId.substr(-1)===9){
                    //         return x[0].id.substr(-1)!==0;
                    //     }
                    //     else x[0];
                    // })
                    for (let i=0;i<potentialsArr.length;i++){
                        if(guessId.substr(-1)===0&&potentialsArr[i][0].id.substr(-1)===9){
                            potentialsArr.splice(i,1);
                        }
                        else if (guessId.substr(-1)===9&&potentialsArr[i][0].id.substr(-1)===0){
                            potentialsArr.splice(i,1);
                        }
                    }
                    gameState.cpu.potentialGuesses = potentialsArr;
                }
                if (guessEl.classList.contains('destroyer')&&gameState.player.destroyerHp===1){
                    gameState.cpu.potentialGuesses = [];
                    gameState.cpu.leads = [];
                }
                if (guessEl.classList.contains('submarine')&&gameState.player.submarineHp===1){
                    gameState.cpu.potentialGuesses = [];
                    gameState.cpu.leads = [];
                }
                if (guessEl.classList.contains('cruiser')&&gameState.player.cruiserHp===1){
                    gameState.cpu.potentialGuesses = [];
                    gameState.cpu.leads = [];
                }
                if (guessEl.classList.contains('battleship')&&gameState.player.battleshipHp===1){
                    gameState.cpu.potentialGuesses = [];
                    gameState.cpu.leads = [];
                }
                if (guessEl.classList.contains('carrier')&&gameState.player.carrierHp===1){
                    gameState.cpu.potentialGuesses = [];
                    gameState.cpu.leads = [];
                }
                //current lead
                //if ship is sunk then take away all potential guesses and leads
            }
            guessValid = true;
            gameState.cpu.guesses.push(guess);
            return guess;   
        }
    }
}