class Arena
{
  constructor(width, height)
  {
    const matrix = [];
    while(height--){
      matrix.push(new Array(width).fill(0));
    }
    this.matrix = matrix;

    this.events = new Events;
  }
  clear()
  {
    this.matrix.forEach(row => row.fill(0));
    this.events.emit('matrix', this.matrix);
  }
  collide(player)
  {
    const [matrix, position] = [player.matrix, player.position];
    for(let yIndex = 0; yIndex < matrix.length; ++yIndex){
      for(let xIndex = 0; xIndex < matrix[yIndex].length; ++xIndex){
        if(matrix[yIndex][xIndex] !== 0 &&
           (this.matrix[yIndex + position.y] &&
           this.matrix[yIndex + position.y][xIndex + position.x]) !== 0){
             return true;
        }
      }
    }
    return false;
  }

  merge(player)
  {
    player.matrix.forEach((row, yIndex) => {
      row.forEach((value, xIndex) => {
        if(value !== 0){
          this.matrix[yIndex + player.position.y][xIndex + player.position.x] = value;
        }
      });
    });
    this.events.emit('matrix', this.matrix);
  }
  sweep()
  {
    let rowCount = 1;
    let score = 0;
    outer: for(let yIndex = this.matrix.length - 1; yIndex > 0; --yIndex){
      for(let xIndex = 0; xIndex < this.matrix[yIndex].length; ++xIndex){
        if(this.matrix[yIndex][xIndex] === 0){
          continue outer;
        }
      }
      const row = this.matrix.splice(yIndex, 1)[0].fill(0);
      this.matrix.unshift(row);
      ++yIndex;
      score += rowCount * 10;
      rowCount *= 2;
    }
    return score;
    this.events.emit('matrix', this.matrix);
  }
}
