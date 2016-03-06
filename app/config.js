define([], function() {
  return {
    // render settings
    deadCellColor: '#ffffff',
    //cellSize: 3,
    //cellSpacing: 1,

    // grid settings
    gridWidth: 144,
    gridHeight: 144,

    M:16,
    T:2000,

    // game settings
    generationDuration: 5000,
    giveCellsEvery: 1, // generations
    
    // player settings
    cellsPerPlayer: 600,
    defaultPlayerColor: '#00aaff',
    lastSeenTimeout: 180000,

    // server settings
    timeBetweenStateUpdates: 10000,
    secretToken: "secret witch's brew",
    lowestHighScore: 100,
    chatLogLength: 175,
    chatMessageLength: 140,
    timeBetweenLatencyTests: 10000
  };
});