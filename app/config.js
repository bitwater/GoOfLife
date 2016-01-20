define([], function() {
  return {
    // render settings
    deadCellColor: '#ffffff',
    cellSize: 3,
    cellSpacing: 1,

    // grid settings
    gridWidth: 192,
    gridHeight: 192,

    M:16,
    T:2000,
    boardWidth: 5,
    boardHeight: 10,

    // game settings
    generationDuration: 2000,
    giveCellsEvery: 1, // generations
    
    // player settings
    cellsPerPlayer: 600,
    defaultPlayerColor: '#00aaff',
    lastSeenTimeout: 180000,

    // server settings
    timeBetweenStateUpdates: 10000,
    secretToken: "secret witch's brew",
    lowestHighScore: 200,
    chatLogLength: 175,
    chatMessageLength: 140,
    timeBetweenLatencyTests: 10000
  };
});