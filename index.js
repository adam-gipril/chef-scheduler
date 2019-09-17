import express from 'express';

const PORT = process.env.PORT || 4003;

const app = express();
const server = app.listen(PORT);

export { app, server };
