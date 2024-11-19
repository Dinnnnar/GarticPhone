import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR TELEGRAM TOKEN';
const bot = new Telegraf(TOKEN);

bot.command('start', (ctx) => {
    ctx.reply('Welcome!\nHere you can play...', Markup.keyboard(['/start', '/game']).resize());
});

bot.command('game', (ctx) =>
    ctx.reply(
        'Launch mini app from inline keyboard!',
        Markup.inlineKeyboard([Markup.button.webApp('Launch', process.env.WEB_APP_DOMAIN)])
    )
);

export default bot;
