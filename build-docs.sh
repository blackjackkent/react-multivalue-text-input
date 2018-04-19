#!/bin/sh

setup_git() {
  git config --global user.email "travis@travis-ci.org"
  git config --global user.name "Travis CI"
}

commit_website_files() {
  git checkout -b gh-pages
  yarn
  yarn build:docs
  git add styleguide
  git commit --message "Travis build: $TRAVIS_BUILD_NUMBER"
}

upload_files() {
  git remote add origin-pages https://${GH_TOKEN}@github.com/blackjackkent/react-multivalue-text-input.git > /dev/null 2>&1
  git push --quiet --set-upstream origin-pages gh-pages -f
}

if [ "$TRAVIS_REPO_SLUG" == "blackjackkent/react-multivalue-text-input" ] && [ "$TRAVIS_PULL_REQUEST" == "false" ] && [ "$TRAVIS_BRANCH" == "production" ]; then

  setup_git
  commit_website_files
  upload_files

fi