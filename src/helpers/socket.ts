import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer;

export const initializeSocket = (server: HttpServer) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: '*',  // Configure CORS based on your frontend
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"],
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
