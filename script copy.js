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

const ships = [ 'destroyer','submarine','cruiser','battleship','carrier' ]
const player = {
    name: "",
    //        1             2               3            4               5
    active: { destroyer: [], submarine: [], cruiser: [], battleship: [], carrier: [] },
    dead: {},
    guesses: [],
    hits: [],
    
}

// save to the grid



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
            grid: [1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1],
        destroyerHp: 2,
        submarineHp: 3,
        cruiserHp: 3,
        battleshipHp: 4,
        carrierHp: 5,
        opponentName: "player's"
    },
    cpu: {
        grid: [1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1,
            1,1,1,1,1,1,1,1,1,1],
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
                //change to 1D
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
                //change to 1D
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
                                //change to 1D
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
                                //change to 1D
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
            let selectedCpuId = parseInt(e.target.id.substr(-2))?
            e.target.id.substr(-2):
            e.target.id.substr(-1);
            let tempArr = selectedCpuId.split("");
            placeGuess(tempArr, gameState.cpu, e.target)
            updateShipHp(e.target, gameState.cpu);
            cpuTurn()
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
        }
        else {
            const newEl = document.createElement('div');
            newEl.className = 'guess';
            newEl.id = 'miss';
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

/*  Our Strategy:
    With a hit, we encompass area around hit to find circumference of the ship(s)

    { leads, potentialGuess, guesses }    
    Shot, Hit? -> NO -> Save +{guesses} -> potentialGuess? -> NO -> [Shot]
         |YES                                           |YES
    Save +{leads}                                    [Shot]
         |
    Any Hits Beside This (assess vertical/horizontal hit path)? -> NO -> [Shot]
         |YES
    Complete shots in either direction from hit until misses on either side

    * * * 
    Redoing with our current function structure flow
    <cpuNextGuess>   <------  <-----
         |                  |      |
    <cpuCheckIfHit> -> NO ->       |
         | YES                     |
    (Are we in Hunt Mode?) -> YES -|     (in hunt mode we stay focused on 'hunting' the ship)
         | NO                      |
    <cpuCheckProximityHits> -> NO -|            (an already 'hunted' ship should NOT trigger proximity hit)
         | YES                     |
    (Go into hunt-mode around hit)-


    only big challenge: how to look for proximity hits, EXCLUDING prior sunk ships.
    object for a sunk ship:
       [34,35,36]
    so proximity check must exclude the sunk ships

    THAT'S ALL FOLKS!

    What part do you want me to do? Vs you, Derek?

    0   0   0   0   0   0   0   0   0   0
    0  11  12   0   0   0   0   0   0   0
    0   0   0   2   0   0   0   0   0   0
    0   0   0   2   0   0   0   0   0   0
    0   0   0   2   0   0   0   0   0   0
    0   0   0   0   0   0   0   0   0   0
    0   0   0   0   0   0   0   0   0   0
    0   0   0   0   3   3   3   3   0   0
    0   0   5   5   5   5   5   0   0   0
    0   0   0   0   0   0   0   0   0   0

    cpuShips = { destroyer: [11, 12], battleship: [24,34,44], cruiser: [] }
    if hit:
    check if full-set of ships in the cpuLeads [10,11,12]

*/
function cpuTurn(){
    let tempGuess = cpuGuess()
    const cpuGuessEl = document.getElementById(`_${tempGuess}`);
    let tempArr = tempGuess.toString().split("");
    placeGuess(tempArr, gameState.player, cpuGuessEl)
    updateShipHp(cpuGuessEl, gameState.player)
}
function cpuNextPotentialGuesses( guess ){
    // we take the point, then we figure out LEFT, RIGHT, TOP, BELOW
    //          (top)
    //   (left)   *   (right)
    //         (bottom)
    let newLeads = [];
    const top = guess-10;
    // if this point exists & is not already a hit, we keep it.
    if( top>=0 && top<=99 && !gameState.cpu.guesses.includes(top) )
        newLeads.push( top );

    const bottom = guess+10;
    if( bottom>=0 && bottom<=99 && !gameState.cpu.guesses.includes(bottom) )
        newLeads.push( bottom );        

    const right = guess+1;    
    if( guess%10<9 && !gameState.cpu.guesses.includes(right) )
        newLeads.push( right );

    const left = guess-1;    
    if( guess%10>0 && !gameState.cpu.guesses.includes(left) )
        newLeads.push( left );
        
    return newLeads;
}

// NextGuess does this:
// - if 'huntMode' we look for matches in potentialGuesses along the hunt-path
// - else randomly pick from potentialGuesses
// - else new random pick (point that is not already tried)
function cpuNextGuess(){
    if( gameState.cpu.huntMode ){
        // we are in hunt-mode so guessing along path of the 'huntGuess'
        let huntPotentialGuesses = []
        if( gameState.cpu.huntMode==='v' ){
            // take the ones-digit
            const guessNum = gameState.cpu.huntGuess%10
            huntPotentialGuesses = gameState.cpu.potentialGuesses.filter( num=>num%10===guessNum );
        } else {
            // take the 10/s digit (which is horizontal placement)
            const guessNum = Math.floor(Number(gameState.cpu.huntGuess)/10);
            huntPotentialGuesses = gameState.cpu.potentialGuesses.filter( num=>Math.floor(Number(num)/10)===guessNum );
        }
        if( huntPotentialGuesses.length>1 ){
            const randomGuessIdx = Math.floor(Math.random()*(huntPotentialGuesses.length));
            return huntPotentialGuesses[randomGuessIdx]
        }
        // no more leads, give up, and turn huntmode off.
        gameState.cpu.huntMode = false;
    }

    if ( gameState.cpu.potentialGuesses.length ){
        // walk through potential leads
        const randomGuessIdx = Math.floor(Math.random()*(gameState.cpu.potentialGuesses.length));
        // guessId = gameState.cpu.potentialGuesses[chooseRandom][0].id;

        return gameState.cpu.potentialGuesses[randomGuessIdx][0]
    }
    let guess;
    do {
        // guess new lead placement
        guess = Math.floor(Math.random()*100);
        // if the guess is already in our guess set, let's clear it.
    } while( gameState.cpu.guesses.includes(guess) );
    return guess;
}
function cpuCheckProximityHits( guess ){
    // if gameState.cpu.leads ABOVE/BELOW guess -> hunt Vertical
    if( gameState.cpu.leads.includes(guess-10) || gameState.cpu.leads.includes(guess+10) )
        return 'v'
    else if( gameState.cpu.leads.includes(guess-1) || gameState.cpu.leads.includes(guess+1) )
        return 'h'
    else
        return false
}

function cpuGuess(){
    let huntGuess;
    let huntDirection;
    // let guess;
    // let chooseRandom;
    // let guessId;
    // let guessEl;
    let settingPGs = false;
    // let chosenGuess;

    let guess = cpuNextGuess();

    if( cpuCheckIfHit(guess) ){
        
        if( !gameState.cpu.potentialGuesses.length ){
            // generate NextGuess Leads ... 
            let aroundHitGuesses = cpuNextPotentialGuesses( guess );
            gameState.cpu.potentialGuesses.push( aroundHitGuesses); // = [...gameState.cpu.leads, ...newGuessLeads]
            console.log( ` .. (no prior leads), new ones generated:`, newGuessLeads );
        } else {
            // are we in hunt mode? 
            if( !huntDirection ){
                // see if there's a hunt-pattern
                huntDirection = cpuCheckProximityHits(guess)
                huntGuess = guess
            } else {
                // choose a hunt-direction potentialGuess as our next guess try

            }
        }
        // if hit, and no prior leads 
        cpuNextGuessAroundHit()
    }

    let guessEl = document.querySelector(`#_${guess}`)
    let guessId = guessEl.id;

    // generate our nextGuess AI guidelines
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
            //below may not be necessary     
            if (!chooseRandom){
                console.log("!!Choose random in while loop triggered (unexpected)!!")
                chooseRandom = Math.floor(Math.random()*(gameState.cpu.potentialGuesses.length));
            }  
            // if (gameState.cpu.potentialGuesses[0]){
            //         if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'vertical'&&
            //     gameState.cpu.potentialGuesses[chooseRandom][2] === 'up'&&
            //     !gameState.cpu.guesses.includes(guess)){
            //         gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
            //         gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess-10}`), "vertical", 'up'])
            //     }
            //     else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'vertical'&&
            //     gameState.cpu.potentialGuesses[chooseRandom][2] === 'down'&&
            //     !gameState.cpu.guesses.includes(guess)){
            //         gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
            //         gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess+10}`), "vertical", 'down'])
            //     }
            //     else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'horizontal'&&
            //     gameState.cpu.potentialGuesses[chooseRandom][2] === 'right'&&
            //     !gameState.cpu.guesses.includes(guess)){
            //         gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
            //         gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess+1}`), "horizontal", 'right'])
                    
            //     }
            //     else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'horizontal'&&
            //     gameState.cpu.potentialGuesses[chooseRandom][2] === 'left'&&
            //     !gameState.cpu.guesses.includes(guess)){
            //         gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
            //         gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess-1}`), "horizontal", 'left'])
            //     }
            // }       
            // if (!gameState.cpu.potentialGuesses[0]){
            //     settingPGs = true;
            //     let elAbove;
            //     let elRight;
            //     let elBelow;
            //     let elLeft;
            //     let potentialsArr = [];
            //     if (!gameState.cpu.guesses.includes(guess-10) && 0<=(guess-10)<=99){
            //         elAbove = [document.querySelector(`#_${guess-10}`), "vertical", 'up'];
            //         potentialsArr.push(elAbove);
            //     }
            //     if (!gameState.cpu.guesses.includes(guess+1) && 0<=(guess+1)<=99){
            //         elRight = [document.querySelector(`#_${guess+1}`), "horizontal", 'right'];
            //         potentialsArr.push(elRight);
            //     }
            //     if (!gameState.cpu.guesses.includes(guess+10) && 0<=(guess+10)<=99){
            //         elBelow = [document.querySelector(`#_${guess+10}`), 'vertical', 'down'];
            //         potentialsArr.push(elBelow);
            //     }
            //     if (!gameState.cpu.guesses.includes(guess-1) && 0<=(guess-1)<=99){
            //         elLeft = [document.querySelector(`#_${guess-1}`), 'horizontal', 'left'];    
            //         potentialsArr.push(elLeft);
            //     }
            //     for (let i=0;i<potentialsArr.length;i++){
            //         if((guessId.substr(-1)==0&&potentialsArr[i][0].id.substr(-1)==9)||
            //         (guessId.substr(-1)==9&&potentialsArr[i][0].id.substr(-1)==0)){
            //             potentialsArr.splice(i,1);
            //         }
            //     }
            // }
            AIGuesser(guess, guessId, chosenGuess, gameState, chooseRandom);
            
            if ((guessEl.classList.contains('destroyer')&&gameState.player.destroyerHp===1)||
            (guessEl.classList.contains('submarine')&&gameState.player.submarineHp===1)||
            (guessEl.classList.contains('cruiser')&&gameState.player.cruiserHp===1)||
            (guessEl.classList.contains('battleship')&&gameState.player.battleshipHp===1)||
            (guessEl.classList.contains('carrier')&&gameState.player.carrierHp===1)){
                gameState.cpu.potentialGuesses = [];
                gameState.cpu.leads = [];
            }
        }
        if (!settingPGs&&gameState.cpu.leads[0]){
            console.log("chosen guess = ", chosenGuess);
            console.log("Before chosen guess splice: ", gameState.cpu.potentialGuesses.indexOf(chosenGuess))
            gameState.cpu.potentialGuesses.splice(gameState.cpu.potentialGuesses.indexOf(chosenGuess),1);
            console.log("resulting potential guesses : ", [...gameState.cpu.potentialGuesses])

        }
        guessValid = true;
        gameState.cpu.guesses.push(guess);
        return guess;   
    }
}



function AIGuesser(guess, guessId, chosenGuess, gameState, chooseRandom){
    if (gameState.cpu.potentialGuesses[0]){
        chosenGuessDirection = gameState.cpu.potentialGuesses[chooseRandom][1];
       if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'vertical'&&
            gameState.cpu.potentialGuesses[chooseRandom][2] === 'up'&&
            !gameState.cpu.guesses.includes(guess)){
                gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
                gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess-10}`), "vertical", 'up'])
            }
        else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'vertical'&&
            gameState.cpu.potentialGuesses[chooseRandom][2] === 'down'&&
            !gameState.cpu.guesses.includes(guess)){
                gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
                gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess+10}`), "vertical", 'down'])
            }
        else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'horizontal'&&
            gameState.cpu.potentialGuesses[chooseRandom][2] === 'right'&&
            !gameState.cpu.guesses.includes(guess)){
                gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
                gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess+1}`), "horizontal", 'right'])
                
            }
        else if (gameState.cpu.potentialGuesses[chooseRandom][1] === 'horizontal'&&
            gameState.cpu.potentialGuesses[chooseRandom][2] === 'left'&&
            !gameState.cpu.guesses.includes(guess)){
                gameState.cpu.potentialGuesses = gameState.cpu.potentialGuesses.filter(x=>x[1]===chosenGuessDirection);
                gameState.cpu.potentialGuesses.push([document.querySelector(`#_${guess-1}`), "horizontal", 'left'])
            }
        console.log("Updated guesses: ", {...gameState.cpu.potentialGuesses})

    }       
    if (!gameState.cpu.potentialGuesses[0]){
        settingPGs = true;
        let elAbove;
        let elRight;
        let elBelow;
        let elLeft;
        let potentialsArr = [];
        if (!gameState.cpu.guesses.includes(guess-10) && 0<=(guess-10)<=99){
            elAbove = [document.querySelector(`#_${guess-10}`), "vertical", 'up'];
            potentialsArr.push(elAbove);
        }
        if (!gameState.cpu.guesses.includes(guess+1) && 0<=(guess+1)<=99){
            elRight = [document.querySelector(`#_${guess+1}`), "horizontal", 'right'];
            potentialsArr.push(elRight);
        }
        if (!gameState.cpu.guesses.includes(guess+10) && 0<=(guess+10)<=99){
            elBelow = [document.querySelector(`#_${guess+10}`), 'vertical', 'down'];
            potentialsArr.push(elBelow);
        }
        console.log(`Does guess include left element: ${!gameState.cpu.guesses.includes(guess-1)} && Guess is between 0-99: ${0<=(guess-1)<=99}`)
        if (!gameState.cpu.guesses.includes(guess-1) && 0<=(guess-1)<=99){
            elLeft = [document.querySelector(`#_${guess-1}`), 'horizontal', 'left'];
            console.log("  -", elLeft);    
            potentialsArr.push(elLeft);
        }
        console.log("before prune: ", [...potentialsArr]);
        for (let i=0;i<potentialsArr.length;i++){
            let potentialId = potentialsArr[i][0].id.substr(-1);
            console.log(" -", potentialId);
            if((guessId.substr(-1)==0&&potentialId==9)||
            (guessId.substr(-1)==9&&potentialId==0)){
                console.log("Removed: ", potentialsArr[i]);
                //potentialsArr.splice(i,1);
                
            }
        }
        console.log("Initial Guesses added: ", [...potentialsArr])
        gameState.cpu.potentialGuesses = [...gameState.cpu.potentialGuesses, ...potentialsArr]
        console.log("Total potential guesses: ", [...gameState.cpu.potentialGuesses])
        chosenGuess = gameState.cpu.potentialGuesses[chooseRandom];
        // chosenGuessDirection = gameState.cpu.potentialGuesses[chooseRandom][1];
        return chosenGuess;
    }
}
