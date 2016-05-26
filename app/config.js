define([], function() {
  return {
    // render settings
    deadCellColor: '#ffffff',
    //cellSize: 3,
    //cellSpacing: 1,

    // grid settings
    gridWidth: 108,
    gridHeight: 108,

    M:12,
    T:2000,
    probability: 0.3,

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
    lowestHighScore: 100,
    chatLogLength: 175,
    chatMessageLength: 140,
    timeBetweenLatencyTests: 10000
  };
});