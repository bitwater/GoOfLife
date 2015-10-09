define([], function() {
  return {
    // render settings
    deadCellColor: '#ffffff',
    cellSize: 10,
    cellSpacing: 1,

    // grid settings
    gridWidth: 30,
    gridHeight: 40,

    // game settings
    generationDuration: 3000,
    giveCellsEvery: 1, // generations
    
    // player settings
    cellsPerPlayer: 20,
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