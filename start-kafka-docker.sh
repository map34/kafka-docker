CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

pushd $CURRENT_DIR
    KAFKA_ADVERTISED_HOST_NAME=`./get-host-ip.sh` docker-compose up -d $@
    docker-compose logs -f
    # ./broker-util.sh --register-broker-hostnames
popd