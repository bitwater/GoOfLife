define([], function() {
  return {
    // render settings
    deadCellColor: '#ffffff',
    defaultAccentColor: '#000000',
    cellSize: 6,
    cellSpacing: 1,
    tickBarHeight: 5,

    // grid settings
    gridWidth: 108,
    gridHeight: 108,

    M:12,
    T:2000,
    probability: 0.3,

    // game settings
    generationDuration: 2000,
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