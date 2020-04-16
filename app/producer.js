const kafka = require('kafka-node');
const { execSync } = require('child_process');
const uuidv4 =  require('uuid').v4;
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere
const stdout = execSync('cat .hostnames');
const kafkaHost = stdout.toString().trim();

const client = new kafka.KafkaClient({kafkaHost});
const producer = new kafka.Producer(client);

const km = new kafka.KeyedMessage(uuidv4(), uuidv4());
const payloads = [
    { topic: 'ams_stream', messages: [km] },
    { topic: 'cm', messages: [km] },
    { topic: 'routing', messages: [km] },
];

producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Data: ${JSON.stringify(data)}`);
        }
    });
    producer.send(payloads, function (err, data) {
        if (err) {
            console.error(err);
        } else {
            console.log(`Data: ${JSON.stringify(data)}`);
        }
    });
});

producer.on('error', function (err) {
    console.error(err);
});
