#!/bin/bash

set -e

REPO_USER="${TRAVIS_REPO_SLUG%/*}"
REPO_NAME="${TRAVIS_REPO_SLUG#*/}"

if [[ $TRAVIS_BRANCH = "master" ]]; then
	REPO_FULL_NAME="${REPO_NAME}"
else
	REPO_FULL_NAME="${REPO_NAME}@${TRAVIS_BRANCH}"
fi

npm run docs -- --base-url "/${REPO_FULL_NAME}" --repo-branch "${TRAVIS_BRANCH}"

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git clone https://${GH_TOKEN}@github.com/${REPO_USER}/${REPO_USER}.github.io.git docRepo
rm -rfv docRepo/${REPO_FULL_NAME}
mv -fv generatedDocs docRepo/${REPO_FULL_NAME}

cd docRepo
if [[ `git status --porcelain` ]]; then
	git add .
	git commit -m "Travis build of ${REPO_FULL_NAME}: ${TRAVIS_BUILD_NUMBER}"
	git push --quiet --set-upstream origin master
fi
