import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

const TOKEN = process.env.TELEGRAM_TOKEN || 'YOUR TELEGRAM TOKEN';
const bot = new Telegraf(TOKEN);

bot.command('start', (ctx) => {
    ctx.reply('Добро пожаловать в Gartic Phone!', Markup.keyboard(['/start', '/game']).resize());
});

bot.command('game', (ctx) => {
    const randomRoom = Math.floor(1000 + Math.random() * 9000);
    const webAppUrl = `${process.env.WEB_APP_DOMAIN}?room=${randomRoom}`;

    ctx.reply(
        'Запустите мини-приложение для игры с помощью кнопки ниже!',
        Markup.inlineKeyboard([Markup.button.webApp('Играть', webAppUrl)])
    );
});

export default bot;
