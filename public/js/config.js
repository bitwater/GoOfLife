define([], function() {
  return {
    // render settings
    deadCellColor: '#ffffff',
    defaultAccentColor: '#000000',
    cellSize: 3,
    cellSpacing: 1,
    tickBarHeight: 5,

    // grid settings
    gridWidth: 162,
    gridHeight: 162,

    M:18,
    T:2000,

    // game settings
    generationDuration: 5000,
    giveCellsEvery: 1, // generations
    timeBetweenUpdates: 10000,

    // player settings
    cellsPerPlayer: 600,
    lastSeenTimeout: 180000,

    // chat settings
    chatLogLength: 175,
    chatMessageLength: 140
  };
});