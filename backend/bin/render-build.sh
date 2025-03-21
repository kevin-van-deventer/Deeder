#!/bin/bash
set -o errexit  # Exit on error

bundle install
bundle exec rails assets:precompile
bundle exec rails assets:clean
