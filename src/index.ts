import * as express from 'express';

const port: string = process.env.PORT || '4003';

const app = express();
const server = app.listen(port);

export { app, server };
