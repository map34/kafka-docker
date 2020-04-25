const kafka = require('kafka-node');
const path = require('path');
const { execSync } = require('child_process');
const uuidv4 =  require('uuid').v4;
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere
const hostnamesPath = path.resolve(__dirname, '..', '.hostnames');
const stdout = execSync(`cat ${hostnamesPath}`);
const kafkaHost = stdout.toString().trim();

const client = new kafka.KafkaClient({kafkaHost});
const producer = new kafka.HighLevelProducer(client);

const writeToKafka = async () => {
    return await new Promise((resolve, reject) => {
        const payloads = ['ams_stream', 'cm', 'routing'].map((topic) => {
            const messageAndKey = uuidv4();
            const km = new kafka.KeyedMessage(messageAndKey, messageAndKey);
            return { topic, messages: [km] };
        });

        producer.send(payloads, function (err, data) {
            if (err) {
                reject({ data: null, err });
            } else {
                resolve({ data, err: null })
            }
        });
    });
};

producer.on('ready', function () {
    // Send random data every 5 seconds
    setInterval(async () => {
        const result = await writeToKafka();
        console.log(`Data: ${JSON.stringify(result)}`)
    }, 5000);
});

producer.on('error', function (err) {
    console.error(err);
});
