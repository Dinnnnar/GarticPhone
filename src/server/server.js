import { app, httpServer, io } from './core.js';
import bot from './bot.js';

app.use(
    await bot.createWebhook({
        domain: process.env.WEBHOOK_DOMAIN,
    })
);

httpServer.listen(3000, () => console.log('Listening on port', 3000));
