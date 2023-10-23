neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'neoxr bot'), m)
      if (text.length > 10) return client.reply(m.chat, Func.texted('bold', `🚩 Text is too long max 10 characters.`), m)
      let old = new Date()
      await client.sendReact(m.chat, '🥰', m.key)
      let result = await Api.tm(command.toLowerCase(), text)
      if (!result.status) return client.reply(m.chat, global.status.fail, m)
      client.sendFile(m.chat, result.data.url, ``, `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['blackpink', 'blood', 'breakwall', 'glow', 'joker', 'magma', 'matrix', 'multicolor', 'neon', 'papercut', 'slice'],
   use: 'text',
   category: 'text maker'
}, __filename)