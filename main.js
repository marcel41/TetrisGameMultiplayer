const tetrisManager = new TetrisManager(document);
const localTetris = tetrisManager.createPlayer();
localTetris.element.classList.add('local');
localTetris.run();
const connectionManager = new ConnectionManager(tetrisManager);
connectionManager.connect('ws://lit-caverns-36127.herokuapp.com');

function createMatrix(width, height){
  const matrix = [];
  while(height--){
    matrix.push(new Array(width).fill(0));
  }
  return matrix;
}












//keyboard controlls when the player press left key
//decrease the x direction or instead when press right
//key add x, etc.
const keyListener = (event) => {
  [
    [37, 39, 81, 87, 40],
    [100, 102, 96, 110, 101],
  ].forEach((key, index) => {
    const player = localTetris.player;
    if (event.type === 'keydown'){
      if(event.keyCode === key[0]){
        player.move(-1);
      } else if(event.keyCode === key[1]){
        player.move(1);
      } else if (event.keyCode === key[2]){
        player.rotate(-1);
      } else if (event.keyCode === key[3]){
        player.rotate(1);
      }
    }
    if(event.keyCode === key[4]){
      if(event.type === 'keydown'){
        if(player.dropInterval !== player.DROP_FAST){
          player.drop();
          player.dropInterval = player.DROP_FAST;
        }
      } else {
        player.dropInterval = player.DROP_SLOW;
      }
    }
  });
};
document.addEventListener('keydown', keyListener);
document.addEventListener('keyup', keyListener);
