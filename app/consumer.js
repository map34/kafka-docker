const kafka = require('kafka-node');
const async = require('async');
const { execSync } = require('child_process');
// stderr is sent to stdout of parent process
// you can set options.stdio if you want it to go elsewhere
const stdout = execSync('cat .hostnames');
const kafkaHost = stdout.toString().trim();

const consumerOptions = {
    // connect directly to kafka broker (instantiates a KafkaClient)
    kafkaHost,
    groupId: 'cm-group',
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    sessionTimeout: 15000,
    fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
    // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
    // built ins (see below to pass in custom assignment protocol)
    protocol: ['range'],
    // Offsets to use for new groups other options could be 'earliest' or 'none'
    // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
    fromOffset: 'earliest',
    // how to recover from OutOfRangeOffset error (where save offset is past server retention)
    // accepts same value as fromOffset
    outOfRangeOffset: 'earliest'
};


const consumerGroup = new kafka.ConsumerGroup(Object.assign({id: 'cm_group_1_member1'}, consumerOptions), ['cm']);

consumerGroup.on('error', onError);
consumerGroup.on('message', onMessage);
consumerGroup.on('connect', function () {
    console.log(`${consumerGroup.memberId} connected`);
    // Read from the start
    consumerGroup.setOffset('cm', 0, 0);
});

function onError(error) {
    console.error(error);
    console.error(error.stack);
}

function onMessage(message) {
    console.log(
        '%s read msg=%s',
        this.client.clientId,
        JSON.stringify(message)
    );
}

var consumerGroup2 = new kafka.ConsumerGroup(Object.assign({id: 'cm_group_1_member2' }, consumerOptions), ['cm']);
consumerGroup2.on('error', onError);
consumerGroup2.on('message', onMessage);
consumerGroup2.on('connect', function () {
    console.log(`${consumerGroup2.memberId} connected`);
});

process.once('SIGINT', async function () {
    await Promise.all([consumerGroup, consumerGroup2].map((consumer) => {
        return (async() => {
            const result = await new Promise((resolve, reject) => {
                consumer.close(true, (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(`${consumer.memberId} closed`);
                    }
                });
            });
            console.log(result);
        })();
    }));
    process.exit(0)
});
