import React, { useState, useCallback, useRef } from 'react';

const GRID_SIZE = 15;
const CELL_TYPES = {
  EMPTY: 'empty',
  WALL: 'wall',
  START: 'start',
  END: 'end',
  PATH: 'path',
  VISITED: 'visited'
};

class Node {
  row; col; f; g; h; parent;
  constructor(row, col, f = 0, g = 0, h = 0) {
    this.row = row;
    this.col = col;
    this.f = f;
    this.g = g;
    this.h = h;
    this.parent = null;
  }
}

const manhattan = (node, goal) => {
  return Math.abs(node.row - goal.row) + Math.abs(node.col - goal.col);
};

const ALGORITHMS = {
  ASTAR: 'A* Search',
  DIJKSTRA: "Dijkstra's Algorithm"
};

const PathfindingGame = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(ALGORITHMS.ASTAR);
  const [grid, setGrid] = useState(() => 
    Array(GRID_SIZE).fill().map(() => 
      Array(GRID_SIZE).fill(CELL_TYPES.EMPTY)
    )
  );
  const [currentTool, setCurrentTool] = useState(CELL_TYPES.WALL);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(50);

  const findStartEnd = useCallback(() => {
    let start = null;
    let end = null;
    
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (grid[i][j] === CELL_TYPES.START) {
          start = { row: i, col: j };
        }
        if (grid[i][j] === CELL_TYPES.END) {
          end = { row: i, col: j };
        }
      }
    }
    
    return { start, end };
  }, [grid]);

  const resetPath = useCallback(() => {
    setGrid(prevGrid => 
      prevGrid.map(row => 
        row.map(cell => 
          cell === CELL_TYPES.PATH || cell === CELL_TYPES.VISITED ? CELL_TYPES.EMPTY : cell
        )
      )
    );
  }, []);

  const updateVisualization = useCallback(async (visitedCells, path = null) => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      // Update visited cells
      visitedCells.forEach(({ row, col }) => {
        if (newGrid[row][col] === CELL_TYPES.EMPTY) {
          newGrid[row][col] = CELL_TYPES.VISITED;
        }
      });
      
      // Update path if available
      if (path) {
        path.forEach(({ row, col }) => {
          if (newGrid[row][col] !== CELL_TYPES.START && newGrid[row][col] !== CELL_TYPES.END) {
            newGrid[row][col] = CELL_TYPES.PATH;
          }
        });
      }
      
      return newGrid;
    });

    await new Promise(resolve => setTimeout(resolve, speed));
  }, [speed]);

  const runDijkstra = useCallback(async () => {
    const { start, end } = findStartEnd();
    if (!start || !end) {
      alert('Please set both start and end points');
      return;
    }

    setIsRunning(true);
    resetPath();

    const distances = {};
    const previous = {};
    const unvisited = new Set();
    const visited = new Set();

    // Initialize distances
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const key = `${row},${col}`;
        distances[key] = Infinity;
        unvisited.add(key);
      }
    }

    distances[`${start.row},${start.col}`] = 0;

    while (unvisited.size > 0) {
      // Find unvisited node with minimum distance
      let minDistance = Infinity;
      let current = null;

      for (const key of unvisited) {
        if (distances[key] < minDistance) {
          minDistance = distances[key];
          current = key;
        }
      }

      if (current === null || distances[current] === Infinity) break;

      const [currentRow, currentCol] = current.split(',').map(Number);
      
      // If we reached the end node
      if (currentRow === end.row && currentCol === end.col) {
        const path = [];
        let curr = `${end.row},${end.col}`;
        
        while (curr) {
          const [row, col] = curr.split(',').map(Number);
          path.unshift({ row, col });
          curr = previous[curr];
        }

        await updateVisualization(
          Array.from(visited).map(str => {
            const [row, col] = str.split(',');
            return { row: parseInt(row), col: parseInt(col) };
          }),
          path
        );

        setIsRunning(false);
        return;
      }

      unvisited.delete(current);
      visited.add(current);

      // Check neighbors
      const neighbors = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
      ];

      for (const neighbor of neighbors) {
        const newRow = currentRow + neighbor.row;
        const newCol = currentCol + neighbor.col;
        
        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) continue;
        if (grid[newRow][newCol] === CELL_TYPES.WALL) continue;

        const neighborKey = `${newRow},${newCol}`;
        if (!unvisited.has(neighborKey)) continue;

        const tentativeDistance = distances[current] + 1;
        if (tentativeDistance < distances[neighborKey]) {
          distances[neighborKey] = tentativeDistance;
          previous[neighborKey] = current;
        }
      }

      await updateVisualization(
        Array.from(visited).map(str => {
          const [row, col] = str.split(',');
          return { row: parseInt(row), col: parseInt(col) };
        })
      );
    }

    alert('No path found!');
    setIsRunning(false);
  }, [grid, findStartEnd, updateVisualization, resetPath]);

  const runAStar = useCallback(async () => {
    const { start, end } = findStartEnd();
    if (!start || !end) {
      alert('Please set both start and end points');
      return;
    }

    setIsRunning(true);
    resetPath();

    const openSet = [];
    const closedSet = new Set();
    
    const startNode = new Node(start.row, start.col);
    const endNode = new Node(end.row, end.col);
    
    openSet.push(startNode);
    
    while (openSet.length > 0) {
      let current = openSet[0];
      let currentIndex = 0;
      
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < current.f) {
          current = openSet[i];
          currentIndex = i;
        }
      }
      
      openSet.splice(currentIndex, 1);
      closedSet.add(`${current.row},${current.col}`);
      
      if (current.row === endNode.row && current.col === endNode.col) {
        const path = [];
        let temp = current;
        
        while (temp !== null) {
          path.push({ row: temp.row, col: temp.col });
          temp = temp.parent;
        }
        
        await updateVisualization(
          Array.from(closedSet).map(str => {
            const [row, col] = str.split(',');
            return { row: parseInt(row), col: parseInt(col) };
          }),
          path.reverse()
        );
        
        setIsRunning(false);
        return;
      }
      
      const neighbors = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 }
      ];
      
      for (const neighbor of neighbors) {
        const newRow = current.row + neighbor.row;
        const newCol = current.col + neighbor.col;
        
        if (newRow < 0 || newRow >= GRID_SIZE || newCol < 0 || newCol >= GRID_SIZE) continue;
        if (grid[newRow][newCol] === CELL_TYPES.WALL) continue;
        if (closedSet.has(`${newRow},${newCol}`)) continue;
        
        const newNode = new Node(newRow, newCol);
        newNode.parent = current;
        newNode.g = current.g + 1;
        newNode.h = manhattan(newNode, endNode);
        newNode.f = newNode.g + newNode.h;
        
        const inOpenSet = openSet.find(n => n.row === newRow && n.col === newCol);
        if (inOpenSet && inOpenSet.g <= newNode.g) continue;
        
        openSet.push(newNode);
      }
      
      await updateVisualization(
        Array.from(closedSet).map(str => {
          const [row, col] = str.split(',');
          return { row: parseInt(row), col: parseInt(col) };
        })
      );
    }
    
    alert('No path found!');
    setIsRunning(false);
  }, [grid, findStartEnd, updateVisualization, resetPath]);

  const handleCellClick = useCallback((row, col) => {
    if (isRunning) return;

    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => [...row]);
      
      if (currentTool === CELL_TYPES.START || currentTool === CELL_TYPES.END) {
        for (let i = 0; i < GRID_SIZE; i++) {
          for (let j = 0; j < GRID_SIZE; j++) {
            if (newGrid[i][j] === currentTool) {
              newGrid[i][j] = CELL_TYPES.EMPTY;
            }
          }
        }
      }
      
      newGrid[row][col] = currentTool;
      return newGrid;
    });
  }, [currentTool, isRunning]);

  const handleReset = useCallback(() => {
    setGrid(Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(CELL_TYPES.EMPTY)));
    setIsRunning(false);
  }, []);

  const getCellClass = useCallback((type) => {
    switch (type) {
      case CELL_TYPES.WALL:
        return 'bg-gray-800';
      case CELL_TYPES.START:
        return 'bg-green-500';
      case CELL_TYPES.END:
        return 'bg-red-500';
      case CELL_TYPES.PATH:
        return 'bg-blue-400';
      case CELL_TYPES.VISITED:
        return 'bg-blue-100';
      default:
        return 'bg-white hover:bg-gray-100';
    }
  }, []);

  return (
    <div className="flex gap-12 justify-center items-start p-8">
      {/* Grid */}
      <div className="border border-gray-200 inline-block self-center">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`w-8 h-8 border border-gray-100 cursor-pointer transition-colors ${getCellClass(cell)}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="w-96 space-y-6 self-center">

        {/* Tools */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Tools</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => setCurrentTool(CELL_TYPES.WALL)}
              className={`px-4 py-2 rounded text-left ${
                currentTool === CELL_TYPES.WALL 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}
            >
              Wall
            </button>
            <button
              onClick={() => setCurrentTool(CELL_TYPES.START)}
              className={`px-4 py-2 rounded text-left ${
                currentTool === CELL_TYPES.START 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}
            >
              Start
            </button>
            <button
              onClick={() => setCurrentTool(CELL_TYPES.END)}
              className={`px-4 py-2 rounded text-left ${
                currentTool === CELL_TYPES.END 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white text-gray-800 border border-gray-300'
              }`}
            >
              End
            </button>
          </div>
        </div>

        {/* Algorithm Selection */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Algorithm</h3>
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="w-full px-4 py-2 rounded border border-gray-300 bg-white text-gray-800"
            disabled={isRunning}
          >
            {Object.values(ALGORITHMS).map(algo => (
              <option key={algo} value={algo}>{algo}</option>
            ))}
          </select>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-300">Animation Speed</h3>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="10"
              max="200"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="w-full"
            />
            <span className="text-sm text-gray-300 w-12">{speed}ms</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => {
              if (selectedAlgorithm === ALGORITHMS.ASTAR) {
                runAStar();
              } else {
                runDijkstra();
              }
            }}
            disabled={isRunning}
            className={`w-full px-4 py-2 rounded bg-blue-500 text-white ${
              isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            Find Path
          </button>
          <button
            onClick={handleReset}
            disabled={isRunning}
            className={`w-full px-4 py-2 rounded bg-gray-500 text-white ${
              isRunning ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600'
            }`}
          >
            Reset
          </button>
        </div>

        {/* Legend and Algorithm Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-blue-100 border border-gray-200"></span>
              <span>Explored</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-blue-400 border border-gray-200"></span>
              <span>Path</span>
            </div>
          </div>

          
        </div>
      </div>
      <div className="text-sm text-gray-400 space-y-3">
            <div>
              <span className="font-medium text-gray-500">A* Search:</span> Uses Manhattan distance to guide the search towards the goal, making it more efficient.
            </div>
            <div>
              <span className="font-medium text-gray-500">Dijkstra's Algorithm:</span> Explores uniformly in all directions, guaranteeing the shortest path but exploring more nodes.
            </div>
          </div>
    </div>
  );
};

export default PathfindingGame;