# Chef Scheduler

My community of friends participates in a shared cooking schedule. Each week, we each cook on one
of Sundday–Thursday. Because we all have dynamic schedules and various commitments we need to
keep, the need for a scheduling system more sophisticated than fixed or rotating assignments has
arisen.

This application addresses the need to schedule a particular chef for a day on which to cook by
taking into account that chef's availability each week. A task is scheduled to run each Friday,
which first gathers each person's availability, then generates a schedule conforming to their
availabilities, after which the schedule is posted to a shared Google Calendar and the group
notified via SMS.

## Table of Contents

1. [Developing](#developing)
1. [Testing](#testing)
1. [Documentation](#documentation)
1. [Deploying](#deploying)
1. [Contributing](#contributing)
1. [Links](#links)

## Developing

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (lts/erbium)
- [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md)
- [NPM](https://www.npmjs.com)

### Cloning the project and installing dependencies

```bash
git clone https://github.com/bikeshaman/chef-scheduler.git
cd chef-scheduler
nvm install
npm install
```

### Compiling

This project is written in TypeScript, and therefore needs to be compiled before it can be run by
Node.js. To compile the project, run:

```bash
npm run build       # compiles the project
npm run build:watch # compiles the project and watches for changes
```

### Running the application

The application can be started using one of the following commands.

```bash
npm start           # runs the application (requires a build to have been run first)
npm run start:watch # runs the application using nodemon to watch for changes
```

Nodemon is configured to run Node registered with `ts-node` on the `start:watch` script, so changes
to TypeScript files will trigger a restart of the application.

### Debugging

There are several paths to success for debugging this project. Here are a few options which are
pre-configured:

#### Nodemon with Chrome DevTools

The `nodemon.json` configuration runs Node in inspect mode. When Chrome detects a Node process
running in inspect mode, an icon will appear in the top left corner of any open DevTools panel.
A click on that icon will open a new instance of DevTools, attached to the Node process:

![DevTools Node icon](/assets/images/devtools.png)

#### Nodemon launched with VSCode debugger

A VSCode debugger configuration named "Run node script" is available. This configuration, when run,
first prompts for a file to run, and then runs that file through `ts-node`, with the VSCode
debugger attached to the process. Breakpoints and Logpoints can be set in the left gutter of the
VSCode editor. Read [here](https://code.visualstudio.com/docs/editor/debugging#_debug-actions) for
more information on the VSCode debugger.

#### VSCode debugger attached to running Nodemon process, or running, built Node process

In addition to the "Run node script" configuration, an "Attach by Process ID" configuration is
available. This allows the VSCode debugger to attach to an already-running instance of the server,
without the process needing to be in inspect mode. Simply run the server, run the debugger, and
select to which Node process the debugger should attach.

### Authentication

This application is configured to work with Google service accounts having the
[Google Calendar API](https://developers.google.com/calendar) enabled.

Requests to the API are authenticated using OAuth 2.0, with credentials loaded from the
`CREDENTIALS` environment variable. The environment variable needs to be set on your machine or the
deployment instance, and its value should be the stringified `credentials.json` object obtained
through the [Google Cloud Platform console](https://console.cloud.google.com/) for your service
account.

For more information on OAuth 2.0, Google service accounts, and obtaining the requisite credentials
to make successful requests to Google, see
[Using OAuth 2.0 for Server to Server Applications](https://developers.google.com/identity/protocols/OAuth2ServiceAccount).

## Testing

Unit tests in this project are written using [Jest](https://jestjs.io). At the time of this writing,
the project has 100% test coverage. The following commands are available for running the tests.

```bash
npm test              # runs all tests
npm run test:watch    # runs all tests in watch mode
npm run test:coverage # outputs test coverage, opens report in a browser
```

Additional options can be passed to the test command, separated from npm options with `--`. Read
[here](https://jestjs.io/docs/en/cli#options) for more information.

I also recommend the Jest extension for VSCode, which runs all tests in watch mode for you, with
feedback on test status visualized directly in your IDE. It also provides VSCode debugging support
for test suites.

## Documentation

Each function, method, class, and interface definition is documented using
[JSDoc](https://devdocs.io/jsdoc/) syntax. Many IDEs are capable of generating hover-over
documentation on-the-fly from JSDoc syntax.

To compile a navigable documentation resource and open it in your default browser, be sure to first
[compile the project](#compiling) then run:

```bash
npm run docs
```

## Deploying

This application is deployed on [Heroku](https://www.heroku.com/). A webhook is in place to
automatically update the deployment any time a change is committed to `master` on the GitHub repo.
Google credentials are set with a config var through the Heroku dashboard or CLI.

I'm currently the only individual with access to the deployment, so please get in touch with any
questions or requests regarding the deploy
[via email](mailto:bikeshaman@icloud.com?subject=Chef%20Scheduler).

## Contributing

With the webhook in place to automatically deploy any committed changes to `master`, please
contribute via a feature branch and pull request. That being said, it's pretty low stakes if
something fails on this service, so no big deal.

## Links

- [Chef Scheduler](https://github.com/bikeshaman/chef-scheduler)
- [Google Calendar API](https://developers.google.com/calendar)
- [Using OAuth 2.0 for Server to Server Applications](https://developers.google.com/identity/protocols/OAuth2ServiceAccount)
- [Google Cloud Platform](https://console.cloud.google.com/)
- [Node.js](https://nodejs.org/en/download/)
- [NPM](https://www.npmjs.com)
- [Nodemon](https://nodemon.io/)
- [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md)
- [Jest](https://jestjs.io)
- [JSDoc](https://devdocs.io/jsdoc/)
- [Heroku](https://www.heroku.com/)
