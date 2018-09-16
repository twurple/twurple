#!/bin/sh
CWD="$(pwd)"
cd "$(dirname $0)"
VERSIONTYPE="${1:-patch}"
npm version --preid pre ${VERSIONTYPE} -m "release version %s"
case ${VERSIONTYPE} in
	"pre"*) npm publish --tag next ;;
	*) npm publish ;;
esac
cd "$CWD"
