/*----- constants -----*/
const gameboardSize = [10,10];
const horizontalLimits = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,12,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93,4,14,24,34,44,54,64,74,84,94];
const verticalLimits = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];
const cpuShips = [2,3,3,4,5]
const shipClasses = ['destroyer', 'cruiser', 'submarine', 'battleship', 'carrier'];
const music = new Audio();
const sfxAmbientBoat = new Audio();
const sfxBell = new Audio();
const sfxSplash = new Audio();
music.src = "./Files/music.mp3";
sfxBell.src = "./Files/bell.wav";
sfxSplash.src = "./Files/splash.wav";
sfxAmbientBoat.src = "./Files/ambient.wav";

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
        opponentName: "player"
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
        opponentName: "cpu",
        huntMode: "",
    }
}
let shipOrientation = 'horizontal';
let noShipHere = [];
let randomNumberValid;
let validatePosition = [];
let turn = Math.floor(Math.random()*2);
let shipLength;
let selectedShipElId;
let draggedShip;
let draggedShipClass;
let sfxToggle = 1;
let winConditionMet = false;
let allShipsPlaced = false;

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
const rotate = document.querySelector("#rotateButton");
const gameInfo = document.querySelector("#gameInfo");
const shipBay = document.querySelector("#shipBay");
const gameBoards = document.querySelector("#gameBoards");
const sound = document.querySelector("#audioButton");
const sfx = document.querySelector("#sfxButton");
const replay = document.querySelector('#replayButton');
const lineMusic = document.querySelector('#lineMusic');
const lineSfx = document.querySelector('#lineSfx');
const rules = document.querySelector('#rules');
const body = document.querySelector('body');
const rulesBox = document.querySelector('#rulesBox');
const rulesBoxExit = document.querySelector('#rulesBoxExit');

/*----- event listeners -----*/
rotate.addEventListener("click", rotateShip);
replay.addEventListener("click", restartGame)
sound.addEventListener("click", playMusic);
sfx.addEventListener("click", sfxToggleFunc);
rules.addEventListener("click", rulesFunc)
rulesBoxExit.addEventListener("click", rulesBoxExitFunc);

/*----- functions -----*/

/*-- Music and SFX --*/ 
function playMusic(){
    if (music.duration>0 && !music.paused){
        music.pause();
        lineMusic.style.display = 'block';
    }
    else {
        music.play();
        music.loop = true;
        lineMusic.style.display = 'none'
    }
}
function sfxToggleFunc(){
    sfxToggle===1?sfxToggle=0:sfxToggle=1;
    if (sfxToggle===0){
        sfxAmbientBoat.pause()
        lineSfx.style.display = 'block';
    }
    if (sfxToggle===1){
        lineSfx.style.display = 'none'
        if (allShipsPlaced===true)
            sfxAmbientBoat.play();
    }
}
function playSfx(sfx){
    if (sfx==="bell"&&sfxToggle===1){
        sfxBell.play();
    }
    if (sfx==="splash"&&sfxToggle===1){
        sfxSplash.play();
        sfxSplash.volume = 0.3;
    }
    if (sfx==="ambient"&&sfxToggle===1){
        sfxAmbientBoat.play();
        sfxAmbientBoat.loop = true;
    }

}
function rulesFunc(){
    rulesBox.classList.toggle("active");
}
function rulesBoxExitFunc(){
    rulesBox.classList.toggle("active");
}

/*-- Initialize Game --*/  
init();
function whosFirst(){
    turn===1?turn--:turn++;
    return turn===1?"player":"cpu";
}
function init(){
    createGameboards();
    createPlayerShips(destroyer, submarine, cruiser, battleship, carrier);
    createCpuShips(...cpuShips);
    music.play();
    music.volume = 0.6;
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
            newEl.className = 'playerShipEl';
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

/*-Drag and drop-*/
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
            if(GBPLayerEl[shipEnterSquareIndex+spaceFromLastEl-i].classList.contains('playerShipEl')){
                noShipHere.push(false);
            } 
            else noShipHere.push(true);
        }
    }
    
    if (shipOrientation === 'vertical'){
        for (i=0;i<shipLength;i++){
            try{
                if(GBPLayerEl[shipEnterSquareIndex+spaceFromLastEl*10-i*10].classList.contains('playerShipEl')){
                    noShipHere.push(false);
                } 
                else noShipHere.push(true);
            }catch{}
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
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl-i].classList.add('playerShipEl')
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
            GBPLayerEl[shipDropSquareIndex+spaceFromLastEl*10-i*10].classList.add('playerShipEl');
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
    playSfx("splash");
    if (shipsPlaced.childElementCount===0){
        rotate.innerText = "Ready for battle!";
        rotate.style.position = "relative";
        rotate.style.left = "0";
        rotate.style.top = "0";
        rotate.style.width = "250px";
        rotate.style.height = "50px";
        rotate.style.color = "white";
        rotate.style.backgroundColor = "rgb(182, 31, 31)";
        rotate.addEventListener("click", deleteShipBay);
    }
}
function deleteShipBay(){
    shipBay.style.display = "none";
    allShipsPlaced = true;
    playSfx("ambient");
    sfxAmbientBoat.loop = true;
    playSfx("bell");
    if (whosFirst()==='cpu'&&allShipsPlaced){
        cpuTurn();
    }
}

/*-Computer Generated Ships-*/
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
                        randomNumberValid = true;
                    }
                } 
            }
        }
    }
}

/*-- Render Game --*/
function render(e){
    if(allShipsPlaced===true&&winConditionMet===false){
        if(!e.target.hasChildNodes() && !e.target.classList.contains("guess")){
            let selectedCpuId = parseInt(e.target.id.substr(-2))?
            e.target.id.substr(-2):
            e.target.id.substr(-1);
            let tempArr = selectedCpuId.split("");
            placeGuess(tempArr, gameState.cpu, e.target)
            updateShipHp(selectedCpuId, "cpu");
            if (winConditionMet===true){
                replay.style.display = 'block';
            }
            cpuTurn();
            if (winConditionMet===true){
                replay.style.display = 'block';
            }
        }
    }
}

/*-- Game Functions --*/
function restartGame(){
    window.location.reload();
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
function updateShipHp(guess, role){
    const gsThis = role=='player' ? gameState.player : gameState.cpu;
    const gsOther = role=='player' ? gameState.cpu : gameState.player;
    let tempGridEl;
    if (gsThis===gameState.player)
        tempGridEl = document.querySelector(`#_${guess}`);
    else 
        tempGridEl = document.querySelector(`#c${guess}`);
    ['destroyer','cruiser','submarine','battleship','carrier'].forEach( ship=>{
        if ( tempGridEl.classList.contains(ship) && gsThis[`${ship}Hp`]!==1 ){
            gsThis[`${ship}Hp`]--;
        }
         else if (tempGridEl.classList.contains(ship) && gsThis[`${ship}Hp`]==1){
            gsThis[`${ship}Hp`]--;
            const wholeShip = document.querySelectorAll(`.${role}ShipEl.${ship}`)
            wholeShip.forEach(x=>x.style.backgroundColor = 'rgb(182, 31, 31)');
            gameInfo.innerText = `The ${gsThis.opponentName}'s ${ship} has sunk!`;
        }
        })
    if (gsThis.destroyerHp===0 &&
        gsThis.submarineHp===0 &&
        gsThis.cruiserHp===0 &&
        gsThis.battleshipHp===0 &&
        gsThis.carrierHp===0){
            gameInfo.innerText = `The ${gsOther.opponentName} has won!`
            winConditionMet = true;
        }
}


/*-Cpu AI-*/
function cpuTurn(){
    let tempGuess = cpuGuess()
    const cpuGuessEl = document.getElementById(`_${tempGuess}`);
    let tempArr = tempGuess.toString().split("");
    placeGuess(tempArr, gameState.player, cpuGuessEl)
}
function cpuNextPotentialGuesses( guess ){
    let newLeads = [];
    const top = guess-10;
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
function cpuCheckProximityHits( guess ){
    if( gameState.cpu.leads.includes(guess-10) || gameState.cpu.leads.includes(guess+10) )
        return 'v'
    else if( gameState.cpu.leads.includes(guess-1) || gameState.cpu.leads.includes(guess+1) )
        return 'h'
    else
        return false
}
function cpuCheckIfHit(guess){
    let tempArr = guess.toString().split("")
    if (tempArr.length===1 && gameState.player.grid[0][parseInt(tempArr[0])]===0)
        return true;
    else if(tempArr.length===2 && gameState.player.grid[parseInt(tempArr[0])][parseInt(tempArr[1])]===0)
        return true;
    else return false;
}
function newPotentialGuessIfHit (guess){
    if( guess>9 && guess<=89 && gameState.cpu.leads.includes(guess-10) && (!gameState.cpu.guesses.includes(guess+10)))
        gameState.cpu.potentialGuesses.push(guess+10);
    if( guess>9 && guess<=89 && gameState.cpu.leads.includes(guess+10) && (!gameState.cpu.guesses.includes(guess-10)))
        gameState.cpu.potentialGuesses.push(guess-10);
    if( guess%10 !==9 && guess%10 !==0 && gameState.cpu.leads.includes(guess-1) && (!gameState.cpu.guesses.includes(guess+1)))
        gameState.cpu.potentialGuesses.push(guess+1);
    if( guess%10 !==9 && guess%10 !==0 && gameState.cpu.leads.includes(guess+1) && (!gameState.cpu.guesses.includes(guess-1)))
        gameState.cpu.potentialGuesses.push(guess-1);
}
function cpuGuess(){
    let huntDirection = gameState.cpu.huntMode;
    let guess = cpuNextGuess();
    gameState.cpu.guesses.push(guess);
    if( cpuCheckIfHit(guess) ){
        updateShipHp(guess, "player");
        gameState.cpu.leads.push(guess);
        if(gameState.cpu.potentialGuesses.length) {
            newPotentialGuessIfHit(guess);
            if( !huntDirection ){
                gameState.cpu.huntMode = cpuCheckProximityHits(guess);
                gameState.cpu.huntGuess = guess;
            }
        }
        else if( !gameState.cpu.potentialGuesses.length && !gameState.cpu.huntMode ){
            let aroundHitGuesses = cpuNextPotentialGuesses( guess );
            gameState.cpu.potentialGuesses.push(...aroundHitGuesses);
        }
    }
    return guess;
}
function cpuNextGuess(){
    if( gameState.cpu.huntMode ){
        let huntPotentialGuesses = [];
        if( gameState.cpu.huntMode==='v' ){
            const guessNum = gameState.cpu.huntGuess%10
            huntPotentialGuesses = gameState.cpu.potentialGuesses.filter( num=>num%10===guessNum );
            
        } else {
            const guessNum = Math.floor(Number(gameState.cpu.huntGuess)/10);
            huntPotentialGuesses = gameState.cpu.potentialGuesses.filter( num=>Math.floor(Number(num)/10)===guessNum );
        }
        if( huntPotentialGuesses.length>1 ){
            const randomGuessIdx = Math.floor(Math.random()*(huntPotentialGuesses.length));
            gameState.cpu.potentialGuesses.splice(gameState.cpu.potentialGuesses.indexOf(huntPotentialGuesses[randomGuessIdx]),1) 
            return huntPotentialGuesses[randomGuessIdx]
        }
        else{
            gameState.cpu.huntMode = "";
            gameState.cpu.huntGuess = null;
            const randomGuessIdx = Math.floor(Math.random()*(huntPotentialGuesses.length));
            let lastHuntedEl = document.querySelector(`#_${huntPotentialGuesses[randomGuessIdx]}`)
            gameState.cpu.potentialGuesses.splice(gameState.cpu.potentialGuesses.indexOf(huntPotentialGuesses[randomGuessIdx]),1) 
            for (i=0;i<shipClasses.length;i++){
                if (lastHuntedEl.classList.contains(shipClasses[i])){
                    LastHuntedElShip = shipClasses[i];
                    if (gameState.player[`${shipClasses[i]}Hp`]===1){
                        gameState.cpu.potentialGuesses = [];
                        gameState.cpu.leads = [];
                    }
                }
            }          
            return huntPotentialGuesses[randomGuessIdx]
        }
    }
    if ( gameState.cpu.potentialGuesses.length>0 ){
        const randomGuessIdx = Math.floor(Math.random()*(gameState.cpu.potentialGuesses.length));
        let chosenGuess = gameState.cpu.potentialGuesses[randomGuessIdx]
        gameState.cpu.potentialGuesses.splice(gameState.cpu.potentialGuesses.indexOf(chosenGuess),1); 
        return chosenGuess;
    }
    let guess;
    do {
        guess = Math.floor(Math.random()*100);
    } while( gameState.cpu.guesses.includes(guess) );
    return guess;
}
