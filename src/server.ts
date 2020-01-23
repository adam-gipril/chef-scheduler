import 'module-alias/register';
import app from '@/app';

const server = app.listen(process.env.PORT || '4003');

export default server;
