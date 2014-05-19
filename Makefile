
REPORTER = dot

build:
	@./node_modules/.bin/coffee -b -o lib src/*

coverage: build
	@jscoverage --no-highlight lib lib-cov
	@CSV_COV=1 $(MAKE) test REPORTER=html-cov > doc/coverage.html
	@rm -rf lib-cov

.PHONY: test
