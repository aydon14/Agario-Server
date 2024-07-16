// Import
var BinaryWriter = require("./BinaryWriter");

function writeCount(writer, flag1, flag2) {
    writer.writeUInt8(flag1); // Packet ID
    writer.writeUInt32(flag2 >>> 0); // Number of elements
}

class UpdateLeaderboard {
    constructor(playerTracker, leaderboard, leaderboardType) {
        this.playerTracker = playerTracker;
        this.leaderboard = leaderboard;
        this.leaderboardType = leaderboardType;
        this.leaderboardCount = Math.min(leaderboard.length, playerTracker.server.config.serverMaxLB);
    }
    build(protocol) {
        switch (this.leaderboardType) {
            case 48:
                // UserText
                if (protocol < 11)
                    return this.buildUserText(protocol);
                else
                    return this.buildUserText14();
            case 49:
                // FFA
                if (protocol < 6)
                    return this.buildFfa5();
                else if (protocol < 11)
                    return this.buildFfa6();
                else
                    return this.buildFfa(protocol); // 13/14
            case 50:
                // Team
                return this.buildTeam();
            default:
                return null;
        }
    }
    // User text all other protocols
    buildUserText(protocol) {
        var writer = new BinaryWriter();
        writeCount(writer, 0x31, this.leaderboard.length);
        for (var i = 0; i < this.leaderboard.length; i++) {
            var item = this.leaderboard[i] || "";
            if (protocol < 11)
                writer.writeUInt32(0);
            if (protocol < 6)
                writer.writeStringZeroUnicode(item);
            else
                writer.writeStringZeroUtf8(item);
        }
        return writer.toBuffer();
    }
    // User text 14
    buildUserText14() {
        var writer = new BinaryWriter();
        writer.writeUInt8(0x35);
        for (var i = 0; i < this.leaderboard.length; i++) {
            var item = this.leaderboard[i] || "";
            writer.writeUInt8(0x02);
            writer.writeStringZeroUtf8(item);
        }
        return writer.toBuffer();
    }
    // FFA protocol 5
    buildFfa5() {
        var writer = new BinaryWriter();
        writeCount(writer, 0x31, this.leaderboardCount);
        for (var i = 0; i < this.leaderboardCount; i++) {
            var item = this.leaderboard[i];
            if (item == null)
                return null; // bad leaderboardm just don't send it
            var name = item._nameUnicode;
            var id = 0;
            if (item == this.playerTracker && item.cells.length)
                id = item.cells[0].nodeId ^ this.playerTracker.scrambleId;
            writer.writeUInt32(id >>> 0); // Player cell Id
            if (name)
                writer.writeBytes(name);
            else
                writer.writeUInt16(0);
        }
        return writer.toBuffer();
    }
    // FFA protocol 6
    buildFfa6() {
        var writer = new BinaryWriter();
        writeCount(writer, 0x31, this.leaderboardCount);
        for (var i = 0; i < this.leaderboardCount; i++) {
            var item = this.leaderboard[i];
            if (item == null)
                return null; // bad leaderboard just don't send it
            var name = item._nameUtf8;
            var id = item == this.playerTracker ? 1 : 0;
            writer.writeUInt32(id >>> 0); // isMe flag
            if (name)
                writer.writeBytes(name);
            else
                writer.writeUInt8(0);
        }
        return writer.toBuffer();
    }
    // FFA protocol 13/14
    buildFfa(protocol) {
        var writer = new BinaryWriter();
        if (protocol < 14)
            writer.writeUInt8(0x33); // 13
        else
            writer.writeUInt8(0x35); // 14
        for (var i = 0; i < this.leaderboardCount; i++) {
            var item = this.leaderboard[i];
            if (item == null)
                return null; // bad leaderboard just don't send it
            if (item === this.playerTracker) {
                writer.writeUInt8(0x09);
                writer.writeUInt16(1);
            }
            else {
                var name = item._name;
                writer.writeUInt8(0x02);
                if (name != null && name.length)
                    writer.writeStringZeroUtf8(name);
                else
                    writer.writeUInt8(0);
            }
        }
        var thing = this.leaderboard.indexOf(this.playerTracker) + 1;
        var place = (thing <= 10) ? null : thing;
        if (this.playerTracker.cells.length && place != null) {
            writer.writeUInt8(0x09);
            writer.writeUInt16(place);
        }
        return writer.toBuffer();
    }
    // Team
    buildTeam() {
        var writer = new BinaryWriter();
        writeCount(writer, 0x32, this.leaderboard.length);
        for (var i = 0; i < this.leaderboard.length; i++) {
            var value = this.leaderboard[i];
            if (value == null)
                return null; // bad leaderboard just don't send it
            if (isNaN(value))
                value = 0;
            value = value < 0 ? 0 : value;
            value = value > 1 ? 1 : value;
            writer.writeFloat(value); // isMe flag (previously cell ID)
        }
        return writer.toBuffer();
    }
}
module.exports = UpdateLeaderboard;