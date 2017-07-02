#!/bin/sh
pushd $(dirname $0)
npm version ${1:-patch} -m "release version %s"
npm publish
popd
