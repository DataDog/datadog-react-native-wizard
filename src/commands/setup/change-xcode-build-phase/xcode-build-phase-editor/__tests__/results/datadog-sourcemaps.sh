#!/bin/sh

REACT_NATIVE_XCODE="node_modules/react-native/scripts/react-native-xcode.sh"
DATADOG_XCODE="/opt/homebrew/bin/node /opt/homebrew/bin/yarn datadog-ci react-native xcode"

/bin/sh -c "$DATADOG_XCODE $REACT_NATIVE_XCODE" 
