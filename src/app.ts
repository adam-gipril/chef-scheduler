/* istanbul ignore file */
import express from 'express';

const app = express();
const port = process.env.PORT || '4003';
/* eslint-disable-next-line */
const server = app.listen(port, () => console.log(`listening on ${port}`));

export default { app, server };
