define([], function() {
  return {
    // render settings
    deadCellColor: '#ffffff',
    defaultAccentColor: '#000000',
    cellSize: 10,
    cellSpacing: 1,
    tickBarHeight: 5,

    // grid settings
    gridWidth: 30,
    gridHeight: 40,

    // game settings
    generationDuration: 3000,
    giveCellsEvery: 1, // generations
    timeBetweenUpdates: 10000,

    // player settings
    cellsPerPlayer: 30,
    lastSeenTimeout: 180000,

    // chat settings
    chatLogLength: 175,
    chatMessageLength: 140
  };
});