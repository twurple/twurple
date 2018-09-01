#!/bin/sh
CWD="$(pwd)"
cd "$(dirname $0)"
npm version ${1:-patch} -m "release version %s"
npm publish
cd "$CWD"
