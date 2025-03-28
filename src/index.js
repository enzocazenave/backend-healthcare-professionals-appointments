import Server from './config/server.js';
import './config/database.js';

console.log('--------------------------------------------------')

const server = new Server();
server.start();