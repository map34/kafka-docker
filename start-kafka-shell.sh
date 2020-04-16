#!/bin/bash

CURRENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

pushd $CURRENT_DIR
    ./generate-broker-list.sh
    KAFKA_ADVERTISED_HOST_NAME=`./get-host-ip.sh` docker-compose run --rm -e BROKER_LIST=$(cat .hostnames) kafka1 $@
popd
