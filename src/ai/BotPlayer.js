const PlayerTracker = require('../server/PlayerTracker');
const Vec2 = require('../modules/Vec2');

const decideTypes = [
    function decidePlayer(node, cell) {
        // Same team, don't eat
        if (this.server.mode.haveTeams && cell.owner.team == node.owner.team)
            return 0;
        if (cell._size > node._size * 1.15) // Edible
            return node._size * 2.5;
        if (node._size > cell._size * 1.15) // Bigger, avoid
            return -node._size;
        return -(node._size / cell._size) / 3;
    },
    function decideFood(node, cell) { // Always edible
        return 1;
    },
    function decideVirus(node, cell) {
        const behavior = this.server.config.botsAvoidViruses;

        if (cell._size > node._size * 1.15) { // Edible
            if (this.cells.length == this.server.config.playerMaxCells) {
                // Reached cell limit, won't explode
                return node._size * 2.5;
            }
            return -behavior*0.8;
        }
        if (node.isMotherCell && node._size > cell._size * 1.15) {
            // Avoid mother cell (same logic for all behaviors)
            return -1;
        }
        return 0;
    },
    function decideEjected(node, cell) {
        if (cell._size > node._size * 1.15)
            return node._size;
        return 0;
    }
];

class BotPlayer extends PlayerTracker {
    constructor(server, socket) {
        super(server, socket);
        this.isBot = true;
        this.influence = 0;
        this.splitCooldown = 0;
    }
    largest(list) {
        return list.reduce((largest, current) => {
            return current._size > largest._size ? current : largest;
        });
    }
    checkConnection() {
        // Respawn if bot is dead
        if (!this.cells.length)
            this.server.mode.onPlayerSpawn(this.server, this);
    }
    sendUpdate() {
        this.decide(this.largest(this.cells));
    }
    decide(cell) {
        if (!cell) return;
        const result = new Vec2(0, 0);

        for (const node of this.viewNodes) {
            if (node.owner == this) continue;
            this.influence = decideTypes[node.type].call(this, node, cell);
            if (this.influence == 0) continue;

            const displacement = node.position.difference(cell.position);
            let distance = displacement.dist();
            if (this.influence < 0)
                distance -= cell._size + node._size;
            if (distance < 1) distance = 1;

            this.influence /= distance;

            if (
                this.server.config.botCanSplit &&
                (node.type === 0 || node.type === 3) && // <---- PATCHED LINE
                cell._size > node._size * 1.15 &&
                !this.splitCooldown && this.cells.length < 8 &&
                400 - cell._size / 2 - node._size >= distance
            ) {
                this.splitCooldown = 15;
                this.mouse.assign(node.position);
                this.socket.packetHandler.pressSpace = true;
                return;
            } else {
                result.add(displacement.normalize().product(this.influence));
            }
        }

        // Set bot's mouse position
        this.mouse.assign(cell.position.sum(result.multiply(900)));
        if (this.splitCooldown > 0) this.splitCooldown--;
    }
}
module.exports = BotPlayer;
