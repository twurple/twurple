#!/bin/bash

set -e

npm run docs

REPO_USER="${TRAVIS_REPO_SLUG%/*}"
REPO_NAME="${TRAVIS_REPO_SLUG#*/}"

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git clone https://${GH_TOKEN}@github.com/${REPO_USER}/${REPO_USER}.github.io.git docRepo
rm -rfv docRepo/${REPO_NAME}
mv -fv generatedDocs docRepo/${REPO_NAME}

cd docRepo
if [[ `git status --porcelain` ]]; then
	git add .
	git commit -m "Travis build of ${REPO_NAME}: ${TRAVIS_BUILD_NUMBER}"
	git push --quiet --set-upstream origin master
fi
