import Server from './config/server.js';
import './config/database.js';
import './config/index.js';

console.log('--------------------------------------------------')

const server = new Server();
server.start();