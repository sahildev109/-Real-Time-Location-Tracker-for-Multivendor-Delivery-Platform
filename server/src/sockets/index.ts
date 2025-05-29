import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

interface LocationData {
  deliveryPartnerId: string;
  orderId: string;
  lat: number;
  lng: number;
}

export const setupSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:3000','http://localhost:3001'],
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`🟢 Socket connected: ${socket.id}`);

    socket.on('locationUpdate', (data: LocationData) => {
      console.log(`📍 Location from ${data.deliveryPartnerId}:`, data);

      // Broadcast to everyone *except* sender
      socket.broadcast.emit('locationUpdate', data);
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};
