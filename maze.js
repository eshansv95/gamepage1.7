const canvas = document.getElementById('maze');
const ctx = canvas.getContext('2d');
const message = document.getElementById('message');

const rows = 10;
const cols = 10;
const cellSize = 40;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = [];
let stack = [];
let current;
let start;
let end;

// Cell constructor
function Cell(row, col) {
  this.row = row;
  this.col = col;
  this.visited = false;
  this.walls = { top: true, right: true, bottom: true, left: true };
  
  this.show = function() {
    const x = this.col * cellSize;
    const y = this.row * cellSize;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Draw top wall
    if (this.walls.top) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
    }
    // Draw right wall
    if (this.walls.right) {
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
    }
    // Draw bottom wall
    if (this.walls.bottom) {
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
    }
    // Draw left wall
    if (this.walls.left) {
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
    }
    ctx.stroke();
  };

  this.checkNeighbors = function() {
    let neighbors = [];
    
    const top = grid[this.row - 1]?.[this.col];
    const right = grid[this.row]?.[this.col + 1];
    const bottom = grid[this.row + 1]?.[this.col];
    const left = grid[this.row]?.[this.col - 1];
    
    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);
    
    if (neighbors.length > 0) {
      return neighbors[Math.floor(Math.random() * neighbors.length)];
    }
    return undefined;
  };
}

// Initialize the grid
function setup() {
  grid = [];
  stack = [];
  
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = new Cell(r, c);
    }
  }

  start = grid[0][0];
  end = grid[rows - 1][cols - 1];
  current = start;
  stack.push(current);
  current.visited = true;
  
  generateMaze();
}

// Remove walls between two cells
function removeWalls(current, next) {
  const x = current.col - next.col;
  const y = current.row - next.row;

  if (x === 1) {
    current.walls.left = false;
    next.walls.right = false;
  } else if (x === -1) {
    current.walls.right = false;
    next.walls.left = false;
  }

  if (y === 1) {
    current.walls.top = false;
    next.walls.bottom = false;
  } else if (y === -1) {
    current.walls.bottom = false;
    next.walls.top = false;
  }
}

// Generate the maze using DFS
function generateMaze() {
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const next = current.checkNeighbors();

    if (next) {
      next.visited = true;
      stack.push(next);
      removeWalls(current, next);
      drawMaze();
    } else {
      stack.pop();
    }
  }
}

// Draw the maze
function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.forEach(row => row.forEach(cell => cell.show()));
}

// Player object
let player = { row: 0, col: 0 };

// Draw the player
function drawPlayer() {
  const x = player.col * cellSize;
  const y = player.row * cellSize;
  
  ctx.fillStyle = 'green';
  ctx.fillRect(x, y, cellSize, cellSize);
}

// Move the player
function movePlayer(direction) {
  console.log(`${direction} pressed`); // Log the direction pressed
  
  let nextRow = player.row;
  let nextCol = player.col;

  // Determine next position
  if (direction === 'up') nextRow--;
  if (direction === 'down') nextRow++;
  if (direction === 'left') nextCol--;
  if (direction === 'right') nextCol++;

  // Ensure within bounds
  if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
    const currentCell = grid[player.row][player.col];
    const nextCell = grid[nextRow][nextCol];
    
    // Check if next cell is a path and there's no wall blocking the movement
    if (nextCell && !currentCell.walls[direction] && nextCell.visited) {
      player.row = nextRow;
      player.col = nextCol;
      drawMaze();
      drawPlayer();

      // Check if the player has reached the end
      if (player.row === end.row && player.col === end.col) {
        message.style.display = 'block'; // Show the message
      }
    }
  }
}

// Handle keyboard input
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') movePlayer('up');
  if (e.key === 'ArrowDown') movePlayer('down');
  if (e.key === 'ArrowLeft') movePlayer('left');
  if (e.key === 'ArrowRight') movePlayer('right');
});

// Draw the maze and player initially
setup();
drawPlayer();
