import { app, httpServer, io } from "./core.js";
import bot from './bot.js';

app.use(await bot.createWebhook({ 
  domain: 'https://5cba-194-226-199-2.ngrok-free.app'
}));

httpServer.listen(3000, () => 
  console.log("Listening on port", 3000)
);

