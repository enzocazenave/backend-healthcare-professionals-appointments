import Server from './config/server.js';
import './config/database.js';
import './config/index.js';
import cron from 'node-cron'
import { checkNext24hAppointments } from './push-notifications/pushNotificator.js'

console.log('--------------------------------------------------')

const server = new Server();
server.start();

cron.schedule('*/30 * * * * *', async () => {
  await checkNext24hAppointments()
})