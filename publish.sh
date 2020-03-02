#!/bin/sh
set -e

git remote update
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "@{u}")
BASE=$(git merge-base @ "@{u}")

if [ "$LOCAL" != "$REMOTE" ] && [ "$REMOTE" != "$BASE" ]; then
	echo "Your local repository is out of date; please pull"
	exit 1
fi

CWD="$(pwd)"
cd "$(dirname $0)"

yarn lint
yarn prettier:check
yarn rebuild

VERSIONTYPE="${1:-patch}"
yarn lerna version --no-push --no-commit-hooks --force-publish --preid pre "$VERSIONTYPE" -m "release version %v"
case ${VERSIONTYPE} in
	"pre"*) yarn lerna publish from-package --dist-tag next ;;
	*) yarn lerna publish from-package ;;
esac
cd "$CWD"
