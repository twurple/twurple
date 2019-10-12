#!/bin/sh
set -e

CWD="$(pwd)"
cd "$(dirname $0)"

yarn lint
yarn prettier:check
yarn build

VERSIONTYPE="${1:-patch}"
yarn lerna version --no-push --no-commit-hooks --preid pre ${VERSIONTYPE} -m "release version %v"
case ${VERSIONTYPE} in
	"pre"*) yarn lerna publish from-package --dist-tag next ;;
	*) yarn lerna publish from-package ;;
esac
cd "$CWD"
