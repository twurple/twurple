#!/bin/sh
set -e

CWD="$(pwd)"
cd "$(dirname $0)"

yarn lint
yarn build

VERSIONTYPE="${1:-patch}"
lerna version --no-push --no-commit-hooks --preid pre ${VERSIONTYPE} -m "release new versions"
case ${VERSIONTYPE} in
	"pre"*) lerna publish from-package --dist-tag next ;;
	*) lerna publish from-package ;;
esac
cd "$CWD"
