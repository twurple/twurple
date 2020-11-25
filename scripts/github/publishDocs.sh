#!/bin/bash

set -e

REPO_BRANCH="${GIT_REF#refs/heads/}"

git clone "https://${GH_TOKEN}@github.com/${REPO_USER}/${REPO_USER}.github.io.git" docRepo

npm run docs -- --base-url / --repo-branch "${REPO_BRANCH}" --out-dir docRepo

cd docRepo

git config user.email "actions@github.com"
git config user.name "GitHub Actions"

if [[ $(git status --porcelain) ]]; then
	git add .
	git commit -m "GitHub Actions build ${BUILD_NUMBER}, branch ${REPO_BRANCH}"
	git push --quiet --set-upstream origin master
fi
