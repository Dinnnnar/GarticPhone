import { app, httpServer, io } from "./core.js";
import bot from './bot.js';

app.use(await bot.createWebhook({ 
  domain: 'https://something'
}));

httpServer.listen(3000, () => 
  console.log("Listening on port", 3000)
);

