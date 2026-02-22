#!/usr/bin/env bash
set -euo pipefail

WP_VERSION="${WP_VERSION:-latest}"
WP_DIR="${WP_DIR:-/tmp/wordpress}"
WP_TESTS_DIR="${WP_TESTS_DIR:-/tmp/wordpress-tests-lib}"
DB_NAME="${DB_NAME:-wordpress_test}"
DB_USER="${DB_USER:-root}"
DB_PASS="${DB_PASS:-}"
DB_HOST="${DB_HOST:-localhost}"

if ! command -v svn >/dev/null 2>&1; then
  echo "Error: svn is required to download the WordPress test suite."
  exit 1
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "Error: curl is required to download WordPress core."
  exit 1
fi

mkdir -p "$WP_DIR" "$WP_TESTS_DIR"

if [ ! -f "$WP_DIR/wp-settings.php" ]; then
  echo "Downloading WordPress core (${WP_VERSION})..."
  curl -sL "https://wordpress.org/wordpress-${WP_VERSION}.tar.gz" | tar -xz -C "$WP_DIR" --strip-components=1
fi

if [ ! -f "$WP_TESTS_DIR/includes/functions.php" ]; then
  echo "Downloading WordPress test suite..."
  svn export --quiet "https://develop.svn.wordpress.org/trunk/tests/phpunit/includes/" "$WP_TESTS_DIR/includes"
  svn export --quiet "https://develop.svn.wordpress.org/trunk/tests/phpunit/data/" "$WP_TESTS_DIR/data"
  curl -sL "https://develop.svn.wordpress.org/trunk/wp-tests-config-sample.php" -o "$WP_TESTS_DIR/wp-tests-config.php"
fi

if [ -f "$WP_TESTS_DIR/wp-tests-config.php" ]; then
  sed -i.bak \
    -e "s/youremptytestdbnamehere/${DB_NAME}/" \
    -e "s/yourusernamehere/${DB_USER}/" \
    -e "s/yourpasswordhere/${DB_PASS}/" \
    -e "s|localhost|${DB_HOST}|" \
    -e "s|/path/to/wordpress/|${WP_DIR}/|" \
    "$WP_TESTS_DIR/wp-tests-config.php"
  rm -f "$WP_TESTS_DIR/wp-tests-config.php.bak"
fi

echo "Done."
echo "WP_DIR=${WP_DIR}"
echo "WP_TESTS_DIR=${WP_TESTS_DIR}"
