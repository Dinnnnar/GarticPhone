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
    ctx.reply(
        `Запустите мини-приложение для игры с помощью кнопки ниже!`,
        Markup.inlineKeyboard([
            Markup.button.switchToChat('Пригласить друзей', `game_${randomRoom}`),
        ])
    );
});

bot.on('inline_query', async (ctx) => {
    const randomRoom = Math.floor(1000 + Math.random() * 9000);
    const botUsername = bot.botInfo ? bot.botInfo.username : '';

    try {
        await ctx.answerInlineQuery(
            [
                {
                    type: 'article',
                    id: String(randomRoom),
                    title: 'Пригласить в игру Gartic Phone',
                    description: 'Отправить приглашение в игру друзьям',
                    input_message_content: {
                        message_text: `🎮 Приглашение в игру Gartic Phone!\n🔗 Комната #${randomRoom}\n`,
                        parse_mode: 'HTML',
                    },
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: '▶️ Открыть Mini App',
                                    url: `https://t.me/${botUsername}/game?startapp=${randomRoom}`,
                                },
                            ],
                        ],
                    },
                },
            ],
            {
                cache_time: 0,
            }
        );
    } catch (error) {
        console.error('Error in inline query:', error);
    }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

export default bot;
