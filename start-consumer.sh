CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

pushd $CURRENT_DIR
    ./generate-broker-list.sh
    brokers=$(cat .hostnames)

    echo "BROKERS = ${brokers}"
    echo "TOPIC = $1"
    ./start-kafka-shell.sh kafka-console-consumer.sh --bootstrap-server ${brokers}  --topic $2
popd