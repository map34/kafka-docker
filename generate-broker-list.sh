CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

pushd $CURRENT_DIR
    KAFKA_ADVERTISED_HOST_NAME=`./get-host-ip.sh`
    ports=$(./broker-util.sh --print-broker-list)
    brokers=""
    delimiter=,
    s=$ports$delimiter
    while [[ $s ]]; do
        brokers+="${KAFKA_ADVERTISED_HOST_NAME}${s%%"$delimiter"*},";
        s=${s#*"$delimiter"};
    done;

    brokers=${brokers%?}

    echo $brokers > .hostnames

popd