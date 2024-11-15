import { Telegraf, Markup } from "telegraf";
console.log(process.env.TOKEN)
const TOKEN = process.env.TOKEN;
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
		Markup.inlineKeyboard([Markup.button.webApp("Launch", `https://something?room=9999`)]),
	),
);

export default bot;
