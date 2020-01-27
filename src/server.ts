import app from '@/app';

const port = process.env.PORT ?? '4003';
// eslint-disable-next-line no-console
const server = app.listen(port, () => console.log(`listening on ${port}`));

export default server;
