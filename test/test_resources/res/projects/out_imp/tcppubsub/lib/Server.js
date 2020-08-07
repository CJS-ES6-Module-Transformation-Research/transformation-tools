
import _moduleAccess_node_wildcard from 'node-wildcard';
import wildcard from 'node-wildcard';
import _moduleAccess_events from 'events';
import _moduleAccess_net from 'net';
import net from 'net';
const EventEmitter = _moduleAccess_events.EventEmitter;
class Server extends EventEmitter {
    constructor(port, host, block) {
        super();
        this.port = port ? port : 1337;
        this.host = host ? host : '127.0.0.1';
        this.server = net.createServer();
        this.topics = {};
        this.wildcards = {};
        this.openTasks = {};
        this.eof = '\n';
        this.block = typeof block === 'undefined' ? true : block;
    }
    getConnections(cb) {
        cb = typeof cb === 'function' ? cb : function () {
        };
        this.server.getConnections(function (err, numb) {
            cb(err, numb);
        });
    }
    connection() {
        let self = this;
        this.server.on('connection', function (sock) {
            sock.setEncoding('utf8');
            self.events(sock);
            self.messages(sock);
        });
    }
    listen() {
        let self = this;
        this.connection();
        this.server.listen({
            host: this.host,
            port: this.port
        }, function () {
            console.log('tcppubsub-broker listening on %j', self.server.address());
        });
    }
    messages(sock) {
        let self = this;
        let chunk = '';
        let messages = [];
        let len = 0;
        let message = '';
        sock.on('data', function (data) {
            chunk += data.toString();
            if (chunk.indexOf(self.eof) !== -1) {
                messages = chunk.split(self.eof);
                chunk = '';
                len = messages.length;
                for (let i = 0; i < len; i++) {
                    try {
                        message = messages.shift();
                        self.handle(message.charAt(0), JSON.parse(message.substr(1, message.length)), sock);
                    } catch (e) {
                        if (e) {
                            chunk = message;
                        }
                    }
                }
            }
        });
    }
    handle(meta, chunk, sock) {
        switch (meta) {
        case 'p':
            this.publish(chunk, sock);
            if (Object.keys(this.wildcards).length) {
                this.wildcardpublish(chunk, sock);
            }
            this.emit('published', chunk);
            break;
        case 's':
            for (let t in chunk) {
                this.subscribe(chunk[t], sock);
                this.emit('subscribed', chunk[t]);
            }
            break;
        case 'u':
            for (let t in chunk) {
                this.unsubscribe(chunk[t], sock);
                this.emit('unsubscribed', chunk[t]);
            }
            break;
        case 'd':
            this.destroy(sock);
            this.emit('destroy', sock.address());
            break;
        default:
            this.emit('default', chunk);
            break;
        }
    }
    events(sock) {
        let self = this;
        let remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
        this.emit('clientConnected', 'Client connected: ' + remoteAddress);
        sock.on('end', function () {
            self.emit('end', 'end');
        });
        sock.on('close', function () {
            self.emit('close', 'Socket close');
        });
        sock.on('error', function (err) {
            self.emit('error', err.message);
            self.destroy(sock);
        });
    }
    publish(chunk, sock) {
        if (!this.topics[chunk.t]) {
            this.openTasks[chunk.t] = chunk;
            return;
        }
        for (let socket in this.topics[chunk.t]) {
            try {
                if (this.block) {
                    if (this.topics[chunk.t][socket] !== sock) {
                        this.topics[chunk.t][socket].write(Buffer.from(JSON.stringify(chunk) + this.eof));
                    }
                } else {
                    this.topics[chunk.t][socket].write(Buffer.from(JSON.stringify(chunk) + this.eof));
                }
            } catch (e) {
                delete this.topics[chunk.t][socket];
            }
        }
    }
    wildcardpublish(chunk, sock) {
        for (let card in this.wildcards) {
            if (wildcard(chunk.t, card)) {
                for (let socket in this.wildcards[card]) {
                    try {
                        if (this.block) {
                            if (this.wildcards[card][socket] !== sock) {
                                this.wildcards[card][socket].write(Buffer.from(JSON.stringify(chunk) + this.eof));
                            }
                        } else {
                            this.wildcards[card][socket].write(Buffer.from(JSON.stringify(chunk) + this.eof));
                        }
                    } catch (e) {
                        delete this.topics[chunk.t][socket];
                    }
                }
            }
        }
    }
    subscribe(topic, sock) {
        if (topic.indexOf('#') === -1) {
            if (!this.topics[topic]) {
                this.topics[topic] = [];
            }
            this.topics[topic].push(sock);
            if (this.openTasks[topic]) {
                this.publish(this.openTasks[topic]);
                delete this.openTasks[topic];
            }
        } else {
            this.wildcardsubscribe(topic, sock);
        }
    }
    wildcardsubscribe(topic, sock) {
        let card = topic.replace(/#/g, '*');
        if (!this.wildcards[card]) {
            this.wildcards[card] = [];
        }
        this.wildcards[card].push(sock);
        for (let openTopic in this.openTasks) {
            if (wildcard(topic, openTopic)) {
                this.wildcardpublish(this.openTasks[openTopic]);
                delete this.openTasks[openTopic];
            }
        }
    }
    unsubscribe(topic, sock) {
        if (topic.indexOf('#') === -1) {
            if (this.topics[topic]) {
                this.deleteTopic(topic, sock);
            }
        } else {
            this.wildcardunsubscribe(topic, sock);
        }
    }
    wildcardunsubscribe(topic, sock) {
        let card = topic.replace(/#/g, '*');
        if (this.wildcards[card]) {
            this.deleteWildcard(card, sock);
        }
    }
    destroy(sock) {
        for (let topic in this.topics) {
            this.deleteTopic(topic, sock);
        }
        this.wildcarddestroy(sock);
    }
    wildcarddestroy(sock) {
        for (let topic in this.wildcards) {
            this.deleteWildcard(topic, sock);
        }
    }
    deleteTopic(topic, sock) {
        let index = this.topics[topic].indexOf(sock);
        if (index >= 0) {
            this.topics[topic].splice(index, 1);
        }
        if (!this.topics[topic].length) {
            delete this.topics[topic];
        }
    }
    deleteWildcard(topic, sock) {
        let index = this.wildcards[topic].indexOf(sock);
        if (index >= 0) {
            this.wildcards[topic].splice(index, 1);
        }
        if (!this.wildcards[topic].length) {
            delete this.wildcards[topic];
        }
    }
    pub(topic, payload) {
        this.publish({
            t: topic,
            p: payload
        });
    }
}
module.exports = Server;
