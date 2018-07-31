class Player
{
    constructor(tetris)
    {
      this.DROP_SLOW = 1000;
      this.DROP_FAST = 30;
      this.events = new Events();
      this.tetris = tetris;
      this.arena = tetris.arena;
      this.dropCounter = 0;
      this.dropInterval = this.DROP_SLOW;


      this.position= {x:0, y:0};
      this.matrix = null;
      this.score = 0;
      this.reset();
    }
    createPieces(type)
    {
      if(type == 'TPiece'){
       return [
          [0, 0 ,0],
          [1, 1, 1],
          [0, 1, 0],
        ];
      } else if(type === 'OPiece'){
          return [
            [2, 2],
            [2, 2],
          ]
      } else if(type === 'LPiece'){
          return [
            [0, 3 ,0],
            [0, 3, 0],
            [0, 3, 3],
          ]
      } else if(type === 'JPiece'){
          return [
            [0, 4 ,0],
            [0, 4, 0],
            [4, 4, 0],
          ]
      } else if(type === 'IPiece'){
          return [
            [0, 5 ,0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
          ]
      } else if(type === 'SPiece'){
          return [
            [0, 6 ,6],
            [6, 6, 0],
            [0, 0, 0],
          ]
      } else if(type === 'ZPiece'){
          return [
            [7, 7 ,0],
            [0, 7, 7],
            [0, 0, 0],
          ]
      }
    }
    drop()
    {
      this.position.y++;
      this.dropCounter = 0;
      if(this.arena.collide(this)){
        this.position.y--;
        this.arena.merge(this);
        this.reset();
        this.score += this.arena.sweep();
        this.events.emit('score', this.score);
        return;
      }
      this.events.emit('position', this.position)
    }

    move(direction)
    {
      this.position.x += direction
      if(this.arena.collide(this)){
        this.position.x -= direction;
        return;
      }
      this.events.emit('position', this.position)
    }
    reset(){
      const piecesToPick = ['IPiece', 'LPiece', 'JPiece', 'OPiece',
                           'TPiece', 'SPiece', 'ZPiece'];
      console.log(piecesToPick.length);
      this.matrix = this.createPieces(piecesToPick[Math.round((piecesToPick.length - 1) * Math.random())]);
      this.position.y = 0;
      this.position.x = (this.arena.matrix[0].length/2 | 0) - (this.matrix[0].length/2 | 0);
      if(this.arena.collide(this)){
        this.arena.clear();
        this.score = 0;
        this.events.emit('score', this.score);
      }
      this.events.emit('position', this.position);
      this.events.emit('matrix', this.matrix);
    }
    rotate(direction)
    {
      let tempPosition = this.position.x;
      let offset = 1;
      this._rotateMatrix(this.matrix, direction);
      while(this.arena.collide(this)){
        this.position.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if(offset > this.matrix[0].length){
          this._rotateMatrix(this.matrix, -direction);
          this.position.x = tempPosition;
          return;
        }
      }
      this.events.emit('matrix', this.matrix);
    }
    _rotateMatrix(matrix, direction)
    {
      for(let yIndex = 0; yIndex < matrix.length; ++yIndex){
        for(let xIndex = 0; xIndex < yIndex; ++xIndex){
          [matrix[xIndex][yIndex],
           matrix[yIndex][xIndex],
          ] = [
               matrix[yIndex][xIndex],
               matrix[xIndex][yIndex],
             ];
        }
      }
      if(direction > 0) {
        matrix.forEach(row => row.reverse());
      } else {
          matrix.reverse();
      }
    }
    update(deltaTime)
    {
      this.dropCounter += deltaTime;
      if(this.dropCounter > this.dropInterval)
      {
        this.drop();
      }
    }

}
