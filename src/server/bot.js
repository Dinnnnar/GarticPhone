import { Telegraf, Markup } from "telegraf";
console.log(process.env.TOKEN)
const TOKEN = process.env.TOKEN || '7758041676:AAGrQ6akwx6b9wsKPfs9KRhSKm5p--Piuxs';
const bot = new Telegraf(TOKEN);

bot.command('start', ctx => {
  ctx.reply("Welcome!\nHere you can play...",
    Markup.keyboard([
      "/start",
      '/game',
    ]).resize()
  );
});

bot.command("game", ctx =>
	ctx.reply(
		"Launch mini app from inline keyboard!",
		Markup.inlineKeyboard([Markup.button.webApp("Launch", `https://tdhjd4qq-5173.euw.devtunnels.ms?room=9999`)]),
	),
);

export default bot;
