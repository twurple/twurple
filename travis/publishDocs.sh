#!/bin/bash

set -e

npm run docs

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git clone https://${GH_TOKEN}@github.com/d-fischer/d-fischer.github.io.git
rm -rfv d-fischer.github.io/twitch
mv -fv generatedDocs d-fischer.github.io/twitch

cd d-fischer.github.io
if [[ `git status --porcelain` ]]; then
	git add .
	git commit -m "Travis build of twitch: $TRAVIS_BUILD_NUMBER"
	git push --quiet --set-upstream origin master
fi
