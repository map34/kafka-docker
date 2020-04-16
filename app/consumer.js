const kafka = require('kafka-node');
const { execSync } = require('child_process');
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere
const stdout = execSync('cat .hostnames');
const kafkaHost = stdout.toString().trim();
const client = new kafka.KafkaClient({kafkaHost});
const consumer = new kafka.Consumer(
    client,
    [
        { topic: 'cm' },
        { topic: 'routing' },
        { topic: 'ams_stream' },
    ],
    {
        autoCommit: false
    }
);

consumer.on('message', function (message) {
    console.log("New message");
    console.log(message);
});
