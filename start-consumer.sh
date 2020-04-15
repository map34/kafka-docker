CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

pushd $CURRENT_DIR
    KAFKA_ADVERTISED_HOST_NAME=`./get-host-ip.sh`
    echo "PORT = $1"
    echo "TOPIC = $2"
    ./start-kafka-shell.sh kafka-console-consumer.sh --bootstrap-server ${KAFKA_ADVERTISED_HOST_NAME}:$1 --topic $2
popd