import tcppubsub from '../lib/main.js';
var port = 2223;
var host = 'localhost';
var member = new tcppubsub.Member(port, host);
member.connect(function () {
    member.sub('app/configuration/service');
    member.sub('hey/ho');
    member.sub('app/configuration/server', function (topic) {
        member.pub('app/configuration/server', {
            alias: 'yamigr',
            b: 'Hello World'
        });
    });
    member.pub('app/configuration/2', 'after pub', function () {
        setTimeout(function () {
            member.sub('app/configuration/2');
        }, 1000);
    });
    member.on('app/configuration/server', function (data) {
        member.unsub('app/configuration/server');
        console.log('rcv publish:', data);
    });
    member.on('message', function (topic, data) {
        member.unsub('app/configuration/server');
        console.log(topic, data);
    });
    member.listen('app/static/config', function (data, res) {
        res({ msg: 'Hello ' + data.name });
    });
    let timeout = 2000;
    member.req('app/static/config', { alias: 'Peter Pan' }, function (err, data, id) {
        if (!err) {
            console.log('rcv response:', data.msg);
        }
    }, timeout);
});