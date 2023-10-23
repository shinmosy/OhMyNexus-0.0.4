neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'how to create web api'), m)
      client.sendReact(m.chat, '🕒', m.key)
      let red = '• *Model : Google Bard Ai*\n'
            red += '▰▰▰▰▰▰▰▰▰▰▰▰\n\n'
      const json = await Api.bard(text)
      if (!json.status) return m.reply(Func.jsonFormat(json))
      client.sendMessageModify(m.chat, red + Func.texted('bold', json.data.message), m, {
         ads: false,
         largeThumb: true,
         thumbnail: 'https://iili.io/J2xKKb9.jpg'
      })
   } catch (e) {
      return client.reply(m.chat, e.message.toString(), m)
   }
}, {
   usage: ['bard'],
   use: 'query',
   category: 'aimenu',
   limit: true
}, __filename)