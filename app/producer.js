const kafka = require('kafka-node');
const uuidv4 =  require('uuid').v4;

const client = new kafka.KafkaClient({kafkaHost: '192.168.0.16:9092'});
const producer = new kafka.Producer(client);

const km = new kafka.KeyedMessage(uuidv4(), uuidv4());
const payloads = [
    // { topic: 'clicks', messages: [km] },
    { topic: 'notifications', messages: [km], partitions: 0 },
];

producer.on('ready', function () {
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
