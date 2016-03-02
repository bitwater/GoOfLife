define([], function() {
  var GameServer = function(app, io) {
    this.app = app;
    this.game = app.game;
    this.playerManager = app.playerManager;
    this.chatManager = app.chatManager;
    this.gameManager = app.gameManager;
    this.config = app.config;
    this.io = io;
    this.sockets = {};
    this.md5 = require('MD5');
    this.tokens = {};
  };

  GameServer.prototype.getNewPlayerToken = function(player) {
    return this.hash(player.id + player.name + this.config.secretToken + Date.now()) + Math.floor(Math.random() * 10000) + 'v3';
  };

  GameServer.prototype.getPlayerToken = function(player) {
    return this.hash(player.id + player.name + this.config.secretToken);
  };

  GameServer.prototype.hash = function(s){
    return this.md5(s);
  };

  GameServer.prototype.init = function() {
    this.nextStateUpdate = Date.now() + this.config.timeBetweenStateUpdates;
    this.io.on('connection', this._handleConnect.bind(this));
  };

  GameServer.prototype.getSocket = function(id) {
    return this.sockets[id];
  };

  GameServer.prototype.getTokens = function() {
    return this.tokens;
  };

  GameServer.prototype.isTimeToSendState = function() {
    return (Date.now() > this.nextStateUpdate);
  };

  GameServer.prototype.sendState = function() {
    var state = this.app.getMinimumState();

    this.io.emit('state', state);
    this.nextStateUpdate = Date.now() + this.config.timeBetweenStateUpdates;
  };

  GameServer.prototype.sendStateToSocket = function(socket) {
    var state = this.app.getMinimumState();
    socket.emit('state', state);
  };

  GameServer.prototype.setTokens = function(tokens) {
    this.tokens = tokens;
  };

  GameServer.prototype._broadcastPlayerConnect = function(socket, player) {
    socket.broadcast.emit('player_connect', {
      cellCount: this.game.grid.getLivingCellCount(),
      player: player.transmission()
    });

    console.log(player.name, 'joined.', this.playerManager.getOnlinePlayers().length, 'player(s) online.');
  };

  GameServer.prototype._handleChatMessage = function(message) {
    var player = this.playerManager.getPlayer(message.playerId),
      token = player.getToken(),
      chatMessage;

    if (token !== message.token || !this.chatManager.canAddMessage(message.message)) {
      return false;
    }

    message.message = message.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    chatMessage = this.chatManager.addMessage(player, message.message, Date.now());

    if (chatMessage) {
      player.setLastSeen(Date.now());
      player.setOnline(true);
      this.io.emit('chat_message', chatMessage);
    }
  };

  GameServer.prototype._handleConnect = function(socket) {
    var state = this.app.getMinimumState();
    socket._latency = {};

    // 延迟参数
    socket.on('latency_echo', this._receiveLatencyEcho.bind(this, socket));
    // 应用数据
    socket.on('request_state', this._handleStateRequest.bind(this, socket));
    // 用户登录连接
    socket.on('request_player', this._handleRequestPlayer.bind(this, socket));
    // 创建新用户
    socket.on('request_new_player', this._handleRequestNewPlayer.bind(this, socket));

    socket.emit('state', state);

    // start testing latency
    this._sendLatencyEcho(socket);
  };

  GameServer.prototype._handleDisconnect = function(socket, player, message) {
    player.setOnline(false);
    socket.broadcast.emit('player_disconnect', { playerId: player.id });

    console.log(player.name, 'left.', this.playerManager.getOnlinePlayers().length, 'player(s) online.');
  };

  // 处理登录事件
  GameServer.prototype._handleRequestPlayer = function(socket, message) {
    var transmission,
      token = message['token'],
      player = this.playerManager.getPlayer(this.tokens[token]),
      oldToken;

    if (player) {
      var version = token.substring(token.length - 2, token.length);
      if (token.length <= 32 || version !== 'v3') {
        // this is the old token, assign them a new one
        oldToken = token;
        token = this.getNewPlayerToken(player);
        this.tokens[token] = player.id;
        delete this.tokens[oldToken];
      }

      player.setOnline(true);
      player.setToken(token);
      player.setIP(socket.request.connection.remoteAddress);

      console.log("new connection from " + socket.request.connection.remoteAddress);

      transmission = player.transmission();
      socket.emit('receive_new_player', { player: transmission, token: token });

      this._broadcastPlayerConnect(socket, player);

      // 点击事件
      socket.on('place_live_cells', this._handlePlaceLiveCells.bind(this, socket));
      // 下线断开连接
      socket.on('disconnect', this._handleDisconnect.bind(this, socket, player));
      // 聊天
      socket.on('chat_message', this._handleChatMessage.bind(this));
      //加入房间
      socket.on("join_room", this.onJoinRoom.bind(this, socket));
      //离开房间
      socket.on("leave_room", this.onLeaveRoom.bind(this, socket));
      //准备
      socket.on("ready", this.onReady.bind(this, socket));

      console.log(new Date(), this.playerManager.getOnlinePlayers());
    }
  };

  GameServer.prototype.onJoinRoom = function(socket, data) {
    var roomId = data.roomId
    console.log('onJoinRoom:', data, "  game:");
    //Todo 在点击链接创建游戏
    //var game = this.gameManager.createNewGame({id: roomId});
    //socket.emit('state', {game: game.transmission()});
  };

  GameServer.prototype.onLeaveRoom = function(socket, data) {

  };

  GameServer.prototype.onReady = function(socket, data) {
  };


  GameServer.prototype._handleRequestNewPlayer = function(socket, message) {
    var name = message.name.trim(),
      color = message.color,
      player,
      errorMessage = '',
      token;

    if (this.playerManager.getPlayerByName(name)) {
      errorMessage = 'The name ' + name + ' is already taken';
    } else if (name.length > 26) {
      errorMessage = 'Your name cannot be longer than 26 characters.';
    }

    if (errorMessage.length > 0) {
      socket.emit('new_player_error', { message: errorMessage });
      return false;
    }

    player = this.playerManager.createNewPlayer({
      name: name,
      color: color
    });
    token = this.getNewPlayerToken(player);

    this.tokens[token] = player.id;

    player.setOnline(true);
    player.setToken(token);
    player.setIP(socket.request.connection.remoteAddress);

    socket.emit('receive_new_player', { player: player.transmission(), token: token });

    this._broadcastPlayerConnect(socket, player);

    socket.on('place_live_cells', this._handlePlaceLiveCells.bind(this, socket));
    socket.on('disconnect', this._handleDisconnect.bind(this, socket, player));
    socket.on('chat_message', this._handleChatMessage.bind(this));
  };

  GameServer.prototype._handlePlaceLiveCells = function(socket, message) {
    var cells = message.cells, game,
      player = this.playerManager.getPlayer(message.playerId),
      token = player.getToken();

    if (token !== message.token) {
      return false;
    }

    console.log("_handlePlaceLiveCells  " + new Date(), "remoteAddress " +
      socket.request.connection.remoteAddress + "  OnlinePlayers:", this.playerManager.getOnlinePlayers(),
    "  \nmessage: ", message);

    if (message.roomId)
      game = this.gameManager.getGame(message.roomId);
    else
      game = this.game;

    player.setLastSeen(Date.now());

    var msg = game.canPlaceLiveCells(player, cells);

    if (msg == true) {
      //console.log(cells);
      game.placeCells(player, cells);
      this.io.emit('cells_placed', {
        cells: cells,
        cellCount: game.grid.getLivingCellCount(),
        player: player.transmission()
      });
    } else {
      //console.log("no cells placed");
      socket.emit("no_cells_placed", msg)
    }
  };

  GameServer.prototype._handleStateRequest = function(socket, message) {
    var state,
      player = this.playerManager.getPlayer(message.playerId);

    console.log("_handleStateRequest: ", message);

    if (player) {
      player.setOnline(true);
    }

    if (message.roomId) {
      state = this.app.getRoomMinState(message.roomId);
    } else {
      state = this.app.getMinimumState();
    }

    socket.emit('state', state);
    //this.sendStateToSocket(socket);
  };

  GameServer.prototype._receiveLatencyEcho = function(socket, message) {
    // average trip time
    var latency = (Date.now() - message) / 2,
      _this = this;

    socket._latency = {
      value: latency,
      waiting: false
    };

    socket.emit('latency', socket._latency.value);
    //console.log('latency', socket._latency.value);

    setTimeout(function() {
      // wait and try again
      if (socket.connected) {
        _this._sendLatencyEcho(socket);
      }
    }, this.config.timeBetweenLatencyTests);
  };
  
  GameServer.prototype._sendLatencyEcho = function(socket) {
    socket.emit('latency_echo', Date.now());
    socket._latency.waiting = true;
  };

  return GameServer;
});