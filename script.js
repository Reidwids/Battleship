/*----- constants -----*/
const gameboardSize = [10,10]
const destroyerSize = 2;
const submarineSize = 3;
const cruiserSize = 3;
const battleshipSize = 4;
const carrierSize = 5;
/*----- app's state (variables) -----*/
const gameStatePlayer = [
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
];

const gameStateCPU = [
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
    ]
/*----- cached element references -----*/
const GBPlayer = document.querySelector('#GBPlayer');
const GBCpu = document.querySelector('#GBCpu');
const destroyer = [document.querySelector('#destroyer'), 2];
const submarine = [document.querySelector('#submarine'), 3];
const cruiser = [document.querySelector('#cruiser'), 3];
const battleship = [document.querySelector('#battleship'), 4];
const carrier = [document.querySelector('#carrier'), 5];
/*----- event listeners -----*/

/*----- functions -----*/

/*- Initialize game -*/ 
init();
function init(){
    createGameboards();
    createShipEls(destroyer, submarine, cruiser, battleship, carrier);
}
function createGameboards(){
    for (i=0;i<gameboardSize[0];i++){
        for (j=0;j<gameboardSize[1];j++){
            const newEl1 = document.createElement('div');
            const newEl2 = document.createElement('div');
            newEl1.id = `${i}-${j}`;
            newEl2.id = `${i}-${j}`;
            newEl1.className = 'GBPLayerEl';
            newEl2.className = 'GBCpuEl';
            GBPlayer.appendChild(newEl1); 
            GBCpu.appendChild(newEl2); 
        }
    }
}
function createShipEls(...args){
    for (i=0;i<args.length;i++){
        for (let j=0;j<args[i][1];j++){
            const newEl1 = document.createElement('div');
            newEl1.className = 'shipEl';
            newEl1.id = `shipEl${j+i}`;
            newEl1.setAttribute('draggable', 'true');
            //args[i][0].setAttribute('draggable', 'true');
            args[i][0].appendChild(newEl1);
        }
    }
}

/*Drag and drop*/
// destroyer[0].addEventListener('dragstart', dragStart);
// destroyer[0].addEventListener('dragstart', dragStart);
// destroyer[0].addEventListener('drag', drag);
// destroyer[0].addEventListener('dragend', dragEnd);
const shipEl = document.querySelectorAll('.shipEl');
shipEl.forEach(el=>{
el.addEventListener('dragstart', dragStart);
el.addEventListener('dragstart', dragStart);
el.addEventListener('drag', drag);
el.addEventListener('dragend', dragEnd);
})
const GBPLayerEl = document.querySelectorAll('.GBPLayerEl');
GBPLayerEl.forEach(el=>{
el.addEventListener('dragenter', dragEnter);
el.addEventListener('dragover', dragOver);
el.addEventListener('dragleave', dragLeave);
el.addEventListener('drop', dragDrop);
});

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {e.target.classList.add('hide')}, 0.1);
    e.target.style.width = "70%";
    e.target.style.height = "70%";
    console.log('dragging');
}
function drag(e) {
    console.log('drag')
}
function dragEnd(e) {
    console.log('dragend')
}
function dragEnter(e) {
    e.preventDefault()
    e.target.classList.add('drag-over');
}
function dragOver(e) {
    e.preventDefault()
    e.target.classList.add('drag-over');
    console.log("over");
}
function dragLeave(e) {
    e.target.classList.remove('drag-over');
    console.log("leave")
}
function dragDrop(e) {
    e.target.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    e.target.appendChild(draggable);
    draggable.classList.remove('hide');
    e.target.style.width = "129%";
    e.target.style.height = "129%";
    console.log("drop")
    // let shipNameWithLastId = draggedShip.lastChild.id
    // let shipClass = shipNameWithLastId.slice(0, -2)
    // // console.log(shipClass)
    // let lastShipIndex = parseInt(shipNameWithLastId.substr(-1))
    // let shipLastId = lastShipIndex + parseInt(this.dataset.id)
    // // console.log(shipLastId)
    // const notAllowedHorizontal = [0,10,20,30,40,50,60,70,80,90,1,11,21,31,41,51,61,71,81,91,2,22,32,42,52,62,72,82,92,3,13,23,33,43,53,63,73,83,93]
    // const notAllowedVertical = [99,98,97,96,95,94,93,92,91,90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,72,71,70,69,68,67,66,65,64,63,62,61,60]
    
    // let newNotAllowedHorizontal = notAllowedHorizontal.splice(0, 10 * lastShipIndex)
    // let newNotAllowedVertical = notAllowedVertical.splice(0, 10 * lastShipIndex)

    // selectedShipIndex = parseInt(selectedShipNameWithIndex.substr(-1))

    // shipLastId = shipLastId - selectedShipIndex
    // // console.log(shipLastId)

    // if (isHorizontal && !newNotAllowedHorizontal.includes(shipLastId)) {
    //   for (let i=0; i < draggedShipLength; i++) {
    //     userSquares[parseInt(this.dataset.id) - selectedShipIndex + i].classList.add('taken', shipClass)
    //   }
    // //As long as the index of the ship you are dragging is not in the newNotAllowedVertical array! This means that sometimes if you drag the ship by its
    // //index-1 , index-2 and so on, the ship will rebound back to the displayGrid.
    // } else if (!isHorizontal && !newNotAllowedVertical.includes(shipLastId)) {
    //   for (let i=0; i < draggedShipLength; i++) {
    //     userSquares[parseInt(this.dataset.id) - selectedShipIndex + width*i].classList.add('taken', shipClass)
    //   }
    // } else return

    // displayGrid.removeChild(draggedShip)
    // if(!displayGrid.querySelector('.ship')) allShipsPlaced = true
}
