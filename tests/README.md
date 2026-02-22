# Test Setup

This plugin uses the WordPress PHPUnit test suite.

## Prereqs

- `phpunit` available on your PATH
- `svn` and `curl`
- A MySQL-compatible database for tests

## Install the WordPress test suite

```
WP_VERSION=latest \
DB_NAME=wordpress_test \
DB_USER=root \
DB_PASS= \
DB_HOST=localhost \
tests/bin/install-wp-tests.sh
```

## Run tests

```
WP_TESTS_DIR=/tmp/wordpress-tests-lib phpunit -c phpunit.xml.dist
```
