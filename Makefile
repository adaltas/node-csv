
REPORTER = dot

build:
	@./node_modules/.bin/coffee -b -o lib src/*.coffee

doc: build
	@./node_modules/.bin/coffee src/doc $(CSV_DOC)

test: build
	@NODE_ENV=test ./node_modules/.bin/mocha --compilers coffee:coffee-script \
		--reporter $(REPORTER)

coverage: build
	@jscoverage --no-highlight lib lib-cov
	@CSV_COV=1 $(MAKE) test REPORTER=html-cov > doc/coverage.html
	@rm -rf lib-cov

.PHONY: test
