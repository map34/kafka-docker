#!/bin/bash

set -e

CONTAINERS=$(docker ps | grep -E "start-kafka.sh.*Up" | awk '{print $1}')


function printBrokerList() {
    BROKERS=""
    for CONTAINER in ${CONTAINERS};
    do
        BROKERS=$BROKERS$(docker port "$CONTAINER" 9092 | sed -e "s/0.0.0.0:/$HOST_IP:/g"),;
    done
    echo "${BROKERS%?}"
}

function registerBrokerHostnames() {
    for CONTAINER in ${CONTAINERS};
    do
        echo "127.0.0.1 $CONTAINER" >> /etc/hosts
    done
}

function unregisterBrokerHostnames() {
    for CONTAINER in ${CONTAINERS};
    do
        sed -i "" "/${CONTAINER}/d" /etc/hosts
    done
}

if  [[ $1 = "--print-broker-list" ]]; then
    printBrokerList
elif [[ $1 = "--register-broker-hostnames" ]]; then
    registerBrokerHostnames
elif [[ $1 = "--unregister-broker-hostnames" ]]; then
    unregisterBrokerHostnames
else
    echo "Unknown option: $1"
    echo "Available options: --print-broker-list"
    echo "                   --register-broker-hostnames"
    echo "                   --unregister-broker-hostnames"
    exit 1
fi
