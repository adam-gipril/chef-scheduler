# Chef Cal Integration

> My friends and I cook dinner almost every night. One of us cooks a main dish, and someone else
> cooks a side.
>
> — <cite>Zana Jipsen</cite>

Zana very kindly developed a Python application called
[Chef Scheduler](https://github.com/zjipsen/chef-scheduler) for scheduling each of us to cook on
days we're available, and with a degree of intelligence in favoring chefs that haven't cooked in a
while. The Python application sends out schedule updates once weekly via text message.

Because text conversations can be easily buried and difficult to resurface, it would be convenient
to also glance at the schedule in a Calendar view. This Node/Express application accepts POST
requests from the scheduler, and converts the schedule into Google Calendar events.

## Table of Contents

1. [Developing](#developing)
1. [Documentation](#documentation)
1. [Contributing](#contributing)
1. [Deploying](#deploying)
1. [Links](#links)

## Developing

### Prerequisites

* [Node.js](https://nodejs.org/en/download/) (12.4.x)
* [NPM](https://www.npmjs.com)

  #### Optional

  * [Nodemon](https://nodemon.io/) (1.19.x)
  * [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md)

### Cloning the project and installing dependencies

```bash
git clone https://github.com/bikeshaman/chef-cal-integration.git
cd chef-cal-integration
nvm install # if you don't have nvm, make sure Node.js v12.4.x is installed (node --version)
npm install
```

### Compiling

This project is written in TypeScript, and therefore needs to be compiled before it can be run by
Node.js. To compile the project, run:

```bash
npm run build       # compiles the project
npm run build:watch # compiles the project and watches for changes
```

### Authentication

This application is configured to work with Google service accounts having the
[Google Calendar API](https://developers.google.com/calendar) enabled. Requests to the API are
authenticated using OAuth 2.0, with credentials loaded from a file named `credentials.json` in the
root directory.

For more information on OAuth 2.0, Google service accounts, and obtaining the requisite credentials
to make successful requests, see
[Using OAuth 2.0 for Server to Server Applications](https://developers.google.com/identity/protocols/OAuth2ServiceAccount).

### Running the server

The server can be started using one of the following commands. Note that the `start:watch` script
does not set the requisite environment variable to authenticate with Google, and as such doesn't
make successful calls to the Google Calendar API.

The default port is 4003, and can be overridden by preceding either command with
`PORT=<desired port>`.

```bash
npm start           # runs the server
npm run start:watch # runs the server using nodemon to watch for changes
```

## Documentation

Each method, class, and interface definition is documented using [JSDoc](https://devdocs.io/jsdoc/)
syntax. Many IDEs are capable of generating hover-over documentation on-the-fly from JSDoc syntax.
To compile a navigable documentation resource and open it in your default browser, be sure to first
[compile the project](#compiling) then run:

```bash
npm run docs
```

## Contributing

I'm the only contributor right now, and I'll plan to fill out this section after the deploy process
is decided upon.

## Deploying

This project is not yet deployed, and this section will be updated as soon as the deploy process is
decided upon.

## Links

* [Chef Scheduler](https://github.com/zjipsen/chef-scheduler)
* [Chef Cal Integration](https://github.com/bikeshaman/chef-cal-integration)
* [Google Calendar API](https://developers.google.com/calendar)
* [Using OAuth 2.0 for Server to Server Applications](https://developers.google.com/identity/protocols/OAuth2ServiceAccount)
* [Node.js](https://nodejs.org/en/download/)
* [NPM](https://www.npmjs.com)
* [Nodemon](https://nodemon.io/)
* [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md)
* [JSDoc](https://devdocs.io/jsdoc/)
