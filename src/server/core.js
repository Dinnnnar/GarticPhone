import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./socketHandlers.js";

export const app = express();

app.use(express.json());
app.use(express.static('build'));

export const httpServer = createServer(app);
export const io = new Server(httpServer);

setupSocketHandlers(io);