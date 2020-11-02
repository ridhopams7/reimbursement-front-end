# MOEFIS Frontend

* Typescript
* ReactJS
* Redux
* Redux Persist (save Redux state to local storage and encrypt it)
* Redux middleware (Saga) to hit API (backend)
* Bootstrap 4 CSS framework
* CoreUI Admin Template

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [What's included](#whats-included)

## Installation

``` bash
# clone the repo, example:
$ git clone ssh://git@gitlab.playcourt.id:31022/AMAdev/AMA-MOEFIS-FINSYS-FRONTEND.git my-project

# go into app's directory
$ cd my-project

```

**Then copy and rename .env.example to .env**
**and edit .env file based on your or server needs**

``` bash
# install app's dependencies
$ npm install
```

## Create React App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

see also:
[User Guide](CRA.md)

### Basic usage (for developers)

``` bash
# running dev server with hot reload at http://localhost:3000
$ npm start
```

Navigate to [http://localhost:3000](http://localhost:3000). The app will automatically reload if you change any of the source files.

### Unit Testing (for developers)

``` bash
# running unit testing with hot reload (don't close your Terminal or any Command Line Tools)
$ npm test
```

On your Terminal, The app will automatically run unit testing if you change any of the source files. We used Jest for unit testing, [for further documentation](https://jestjs.io/docs/en/getting-started).

### Build (for devops)

Run `npm run build:env` to build the project. The build artifacts will be stored in the `build/` directory. Then put `build/` directory to www based on system HTTP service/server (Nginx, Apache, etc).

``` bash
# build for development with minification
$ npm run build:development

# build for stagging with minification
$ npm run build:stagging

# build for production with minification
$ npm run build:production
```

## What's included

Within the download you'll find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You'll see something like this:

```
App
├── public/          #static files
│   ├── assets/      #assets
│   └── index.html   #html template
│
├── src/             #project root
│   ├── assets/
│   ├── bootstrap/
│   ├── components/
│   ├── config/
│   ├── css/
│   ├── modules/
│   ├── scss/
│   ├── utilities/
│   ├── index.tsx
│   ├── react-app-env.d.ts
│   ├── serviceWorker.ts
│   └── setupTests.js
│
└── package.json
```

## Credits

* [CoreUI](https://coreui.io)
* [ReactJS](https://reactjs.org/)
* [Bootstrap](https://getbootstrap.com/)
