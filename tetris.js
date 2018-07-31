class Tetris
{
  constructor(element)
  {
    this.element = element;
    this.canvas = element.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.scale(20, 20);
    this.arena = new Arena(12, 20);
    this.player = new Player(this);
    this.player.events.listen('score', score => {
      this.updateScore(score);
    });

    //for the colours
    this.colourOfPiece = [
      null,
      'purple',
      'yellow',
      'orange',
      'blue',
      'skyblue',
      'green',
      'red',
    ];

    let lastTime = 0;
    this._update = (time = 0) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      this.player.update(deltaTime);
      this.draw();
      requestAnimationFrame(this._update);
    };

    this.updateScore(0);
  }
  draw()
  {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawMatrix(this.arena.matrix,{x:0, y:0})
    this.drawMatrix(this.player.matrix, this.player.position);
  }
  //check for all rows and column and figure to know how
  //to draw the figure
  drawMatrix(matrix, offset)
  {
    matrix.forEach((row, yIndex) => {
      row.forEach((value, xIndex) =>{
        if(value !== 0)
        {
          this.context.beginPath();
          this.context.fillStyle = this.colourOfPiece[value];
          this.context.fillRect(xIndex + offset.x, yIndex + offset.y, 1, 1);
          this.context.strokeStyle = 'black';
          this.context.lineWidth = '0.030';
          this.context.rect(xIndex + offset.x, yIndex + offset.y, 1, 1);
          this.context.stroke();
        }
      });
    });
  }
  updateScore(score){
    this.element.querySelector('.score').innerText = score;
  }
  run()
  {
    this._update();
  }
  serialize()
  {
    return{
      arena:{
        matrix: this.arena.matrix,
      },
      player:{
        matrix:this.player.matrix,
        position:this.player.position,
        score:this.player.score,
      },
    };
  }
  unserialize(state)
  {
    this.arena = Object.assign(state.arena);
    this.player = Object.assign(state.player);
    this.updateScore(this.player.score);
    this.draw();
  }

}
