ifconfig en0 | awk '$1 == "inet" {gsub(/\/.*$/, "", $2); print $2}'
