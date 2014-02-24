TESTS = "test/**/*.js"
REPORTER = list
MOCHA = ./node_modules/.bin/mocha
JSHINT = ./node_modules/.bin/jshint
TIMEOUT = 10000

build: npm jshint

npm:
	@npm install

jshint:
	@$(JSHINT) .

test: npm
	@NODE_ENV=test $(MOCHA) \
		--bail \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		$(TESTS)

watch: npm
	@NODE_ENV=test $(MOCHA) \
		--bail \
		--reporter $(REPORTER) \
		--timeout $(TIMEOUT) \
		--growl \
		--watch \
		$(TESTS)

jenkins: build
	@NODE_ENV=test $(MOCHA) \
		--reporter xunit \
		--timeout $(TIMEOUT) \
		$(TESTS) > report.xml

.PHONY: test watch build npm jshint jenkins
