import { app, httpServer, io } from './core.js';
import bot from './bot.js';

app.use(
    await bot.createWebhook({
        domain: 'https://hw7m8gq2-3000.euw.devtunnels.ms/',
    })
);

httpServer.listen(3000, () => console.log('Listening on port', 3000));
