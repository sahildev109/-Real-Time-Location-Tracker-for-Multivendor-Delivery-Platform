import app from './app';
import http from 'http';
import { setupSocketIO } from './sockets';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

setupSocketIO(server);

server.listen(PORT, () => {
  console.log(`Server + Socket.IO running at http://localhost:${PORT}`);
});
