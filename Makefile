SRC_DIR = src
SPEC_DIR = spec
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs 2>/dev/null`
LINT = `which jshint 2>/dev/null`

UGLIFY ?= `which uglifyjs 2>/dev/null`
POST_UGLIFY = ${JS_ENGINE} ${BUILD_DIR}/post-uglify.js

BASE_FILES = ${SRC_DIR}/query.js ${SRC_DIR}/uri.js

MODULES = ${SRC_DIR}/intro.js ${BASE_FILES} ${SRC_DIR}/outro.js

VERSION = $(shell cat version.txt | sed ':a;N;$!ba;s/\n/ /g')
REPLACE_VER = sed "s/@VERSION/${VERSION}/"

JSURI = ${DIST_DIR}/jsuri.js
JSURI_MIN = ${DIST_DIR}/jsuri.min.js

JSURI_V = ${DIST_DIR}/jsuri-${VERSION}.js
JSURI_MINV = ${DIST_DIR}/jsuri.min-${VERSION}.js

DATE=$(shell git log -1 --pretty=format:%ad)

PANDOC ?= `which pandoc 2>/dev/null`
README_WIKI = ${DIST_DIR}/README.wiki


all: core

core: dist_dir jsuri min lint v minv readme_wiki
	@@echo "jsUri build complete."

dist_dir:
	@@mkdir -p ${DIST_DIR}

jsuri: 
	@@echo 'Building' ${JSURI}
	@@cat ${MODULES} | \
		sed 's/@DATE/'"${DATE}"'/' | \
		sed "s/@VERSION/${VERSION}/" > ${JSURI};

lint: jsuri
	@@if test ! -z ${LINT}; then \
		echo "Checking jsUri against JSHint..."; \
		${LINT} ${JSURI}; \
	else \
		@@echo "You must have JSHint installed in order to lint jsUri."; \
	fi

min: jsuri 
	@@if test ! -z ${UGLIFY}; then \
		echo "Minifying " ${JSURI_MIN}; \
		${UGLIFY} ${JSURI} > ${JSURI_MIN}.tmp; \
		${POST_UGLIFY} ${JSURI_MIN}.tmp > ${JSURI_MIN}; \
		rm -f ${JSURI_MIN}.tmp; \
	else \
		@@echo "You must have uglifyjs installed in order to minify jsUri."; \
	fi

v: jsuri dist_dir 
	@@echo "Copying ${JSURI} to ${JSURI_V}";
	@@cp ${JSURI} ${JSURI_V}

minv: min dist_dir 
	@@echo "Copying ${JSURI_MIN} to ${JSURI_MINV}";
	@@cp ${JSURI_MIN} ${JSURI_MINV}

readme_wiki:
	@@if test ! -z ${PANDOC}; then \
		echo "Building ${README_WIKI}..."; \
		${PANDOC} -f markdown -t mediawiki README.md | \
			sed "s/<pre>/\n{{{\n/" | \
			sed "s/<\/pre>/\n}}}\n/" \
			> ${README_WIKI}; \
	else \
		@@echo "You must have pandoc installed in order to convert README.md to README.wiki."; \
	fi

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
