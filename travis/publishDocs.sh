#!/bin/sh

set -e

npm run docs

git config --global user.email "travis@travis-ci.org"
git config --global user.name "Travis CI"

git clone git://${GH_TOKEN}@github.com/d-fischer/d-fischer.github.io
rm -rfv d-fischer.github.io/twitch
mv -fv generatedDocs d-fischer.github.io/twitch

cd d-fischer.github.io
git add .
git commit -m "Travis build of twitch: $TRAVIS_BUILD_NUMBER"
git push --quiet --set-upstream origin master
