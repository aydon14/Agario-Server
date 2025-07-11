// Library imports
const fs = require("fs");

// Project imports
const FakeSocket = require('./FakeSocket');
const PacketHandler = require('../server/PacketHandler');
const BotPlayer = require('./BotPlayer');
const MinionPlayer = require('./MinionPlayer');

class BotLoader {
    constructor(server) {
        this.server = server;
        this.nextBotId = 1;
        this.freeBotIds = [];
    }

    getNextBotId() {
        if (this.freeBotIds.length > 0) {
            return this.freeBotIds.shift();
        }
        return this.nextBotId++;
    }

    addBot() {
        const id = this.getNextBotId();
        const botName = `bot ${id}`;

        const socket = new FakeSocket(this.server);
        socket.playerTracker = new BotPlayer(this.server, socket);
        socket.packetHandler = new PacketHandler(this.server, socket);

        this.server.clients.push(socket);
        socket.packetHandler.setNickname(botName);

        socket._botId = id;
    }

    addMinion(owner, name, mass) {
        const maxSize = this.server.config.minionMaxStartSize;
        const defaultSize = this.server.config.minionStartSize;

        const socket = new FakeSocket(this.server);
        socket.playerTracker = new MinionPlayer(this.server, socket, owner);
        socket.packetHandler = new PacketHandler(this.server, socket);

        socket.playerTracker.spawnmass = mass || (maxSize > defaultSize
            ? Math.floor(Math.random() * (maxSize - defaultSize) + defaultSize)
            : defaultSize);

        this.server.clients.push(socket);
        socket.packetHandler.setNickname(name == "" || !name ? this.server.config.defaultName : name);
    }

    releaseBotId(id) {
        if (!this.freeBotIds.includes(id)) {
            this.freeBotIds.push(id);
            this.freeBotIds.sort((a, b) => a - b);
        }
    }
}

module.exports = BotLoader;
