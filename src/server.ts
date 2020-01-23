import 'module-alias/register';
import app from '@/app';

const port = process.env.PORT || '4003';
const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  if (process.env.NODE_ENV === 'development') console.log(`listening on ${port}`);
});

export default server;
