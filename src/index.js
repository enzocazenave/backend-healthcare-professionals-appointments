import Server from './config/server.js';
import './config/database.js';
import './config/index.js';
import cron from 'node-cron'

console.log('--------------------------------------------------')

const server = new Server();
server.start();

cron.schedule('*/30 * * * *', async () => {
  await checkNext24hAppointments()
})