#!/bin/bash

set -e

REPO_USER="${TRAVIS_REPO_SLUG%/*}"

git clone "https://${GH_TOKEN}@github.com/${REPO_USER}/${REPO_USER}.github.io.git" docRepo

npm run docs -- --base-url / --repo-branch "${TRAVIS_BRANCH}" --out-dir docRepo

cd docRepo

git config user.email "travis@travis-ci.org"
git config user.name "Travis CI"

if [[ $(git status --porcelain) ]]; then
	git add .
	git commit -m "Travis build ${TRAVIS_BUILD_NUMBER}, branch ${TRAVIS_BRANCH}"
	git push --quiet --set-upstream origin master
fi
