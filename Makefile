
build:
	@./node_modules/.bin/coffee -b -o lib src/*.coffee

test: 
	@./node_modules/.bin/mocha --compilers coffee:coffee-script

.PHONY: test
