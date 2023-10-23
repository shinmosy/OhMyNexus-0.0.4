neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   users,
   Func
}) => {
   try {
      if (!args || !args[0] || args[0].startsWith('0')) return client.reply(m.chat, Func.texted('bold', `🚩 Give the number of points you want to spin.`), m)
      if (isNaN(args[0])) return client.reply(m.chat, Func.example(prefix, command, '10000'), m)
      if (args[0] > users.point) return client.reply(m.chat, Func.texted('bold', `🚩 Your points are not enough to spin ${Func.formatNumber(args[0])} points.`), m)
      if (args[0] < 1000) return client.reply(m.chat, Func.texted('bold', `🚩 Cannot spin with a nominal value below 1000 points.`), m)
      users.point -= args[0]
      let reward = Func.randomInt(100, args[0] * 3)
      users.point += reward
      let last = users.point
      let teks = `乂 🎰 *S P I N - R E S U L T*\n\n`
      teks += `	*- ${Func.formatNumber(args[0])}*\n`
      teks += `	*+ ${Func.formatNumber(reward)}*\n\n`
      teks += `• *your point* : ${Func.formatNumber(last)} Point\n\n`
      teks += `• *BET* : (${Func.formatNumber(args[0])})` 
      teks += `*NB : “Wait ${global.cooldown} seconds for next execution.”*`
      client.sendMessageModify(m.chat, teks, m, {
         ads: false,
         largeThumb: true,
         thumbnail: 'https://iili.io/Jds5p3l.jpg', 
        } )
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['spin'],
   hiden: ['zeus', 'slot', 'bet'], 
   category: 'games',
   limit: true,
   game: true,
   group: true
}, __filename)