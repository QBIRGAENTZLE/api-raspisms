# RaspiSMS NodeJS API
Node.js (v8.2.1) API for [RaspiSMS] (https://github.com/RaspbianFrance/RaspiSMS/) application

## Details
This API contains:

- [ExpressJS](https://github.com/expressjs/express), for your web server.
- Logs to trace HTTP requests and Node.js messages with [Morgan](https://github.com/expressjs/morgan) and [Log4JS](https://github.com/nomiddlename/log4js-node).
- Units tests with [Mocha](https://github.com/mochajs/mocha), [Chai](https://github.com/chaijs/chai), [Supertest](https://github.com/visionmedia/supertest) and [Istanbul](https://github.com/gotwarlost/istanbul).
- [Gulp](https://github.com/gulpjs/gulp), awesome to build your production package.
- [Yarn](https://github.com/yarnpkg/yarn), instead of NPM, to manage dependencies.
- [ESLint](https://github.com/eslint/eslint), to standardize source code.
- [apiDoc](https://github.com/apidoc/apidoc ), to generate documentation for API.
- [documentation](https://github.com/documentationjs/documentation), to generate developer documentation.

## Prerequisites
- Node.js v8.2.1
- Yarn: `npm i -g yarn`

## Development install
Install dependencies with `yarn` command.

Run the server with `npm run dev` command.

### Recommendations
Use ESLint plugin for your code editor to lint easely your code:

- [Atom](https://github.com/AtomLinter/linter-eslint)
- [WebStorm](https://plugins.jetbrains.com/plugin/7494-eslint)
- [SublimeText](https://github.com/roadhump/SublimeLinter-eslint)


