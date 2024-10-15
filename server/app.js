import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupSocketHandlers } from "./socketHandlers.js";
import { corsOptions } from "./config.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

setupSocketHandlers(io);

export { app, server, io };