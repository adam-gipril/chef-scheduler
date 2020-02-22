/* istanbul ignore file */
import 'module-alias/register';
import app from '@/app';

const port = process.env.PORT || '4003';
const server = app.listen(port, () => {
  if (process.env.NODE_ENV !== 'test')
    /* eslint-disable-next-line no-console */
    console.log(`listening on ${port}`);
});

export default server;
