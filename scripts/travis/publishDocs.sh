#!/bin/bash

set -e
shopt -s extglob

REPO_USER="${TRAVIS_REPO_SLUG%/*}"

if [[ $TRAVIS_BRANCH = "master" ]]; then
	BASE_URL="/"
else
	BASE_URL="/branches/${TRAVIS_BRANCH}/"
fi

npm run docs -- --base-url "${BASE_URL}" --repo-branch "${TRAVIS_BRANCH}"

git clone "https://${GH_TOKEN}@github.com/${REPO_USER}/${REPO_USER}.github.io.git" docRepo

if [[ $TRAVIS_BRANCH = "master" ]]; then
	(
		export GLOBIGNORE="branches"
		shopt -u dotglob
		rm -rfv docRepo/*
		mv -fv generatedDocs/* docRepo/
	)
else
	rm -rfv docRepo/branches/"${TRAVIS_BRANCH}"/*
	mkdir -pv "docRepo/branches/${TRAVIS_BRANCH}"
	mv -fv generatedDocs/* "docRepo/branches/${TRAVIS_BRANCH}"
fi

cd docRepo

git config user.email "travis@travis-ci.org"
git config user.name "Travis CI"

if [[ $(git status --porcelain) ]]; then
	git add .
	git commit -m "Travis build ${TRAVIS_BUILD_NUMBER}, branch ${TRAVIS_BRANCH}"
	git push --quiet --set-upstream origin master
fi
