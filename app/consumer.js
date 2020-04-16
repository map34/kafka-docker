const kafka = require('kafka-node');
const client = new kafka.KafkaClient({kafkaHost: '192.168.0.16:9094,192.168.0.16:9093,192.168.0.16:9092'});
const consumer = new kafka.Consumer(
    client,
    [
        { topic: 'notifications', partition: 0 },
        { topic: 'clicks', partition: 0 },

    ],
    {
        autoCommit: false
    }
);

consumer.on('message', function (message) {
    console.log("New message"),
    console.log(message);
});
