import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { authRouter } from './routes/authRoutes';
import { orderRouter } from './routes/orderRoutes';
import { createDataRouter } from './routes/dataRoutes';
import { setupSocket } from './socket';

const PORT = 3003;

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: '*' }));
app.use(express.json());

// Socket.IO setup first so we have io instance for dataRouter
const io = new Server(server, {
  cors: { origin: '*' },
});
setupSocket(io);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);
app.use('/api/data', createDataRouter(io));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📡 Socket.IO is available for connections`);
});
