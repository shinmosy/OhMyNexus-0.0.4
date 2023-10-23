neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Scraper,
   Func
}) => {
   try {
   	let q = m.quoted ? m.quoted : m
      let mime = (q.msg || q).mimetype || ''
      if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 File not found!`), m)
      client.sendReact(m.chat, '🕒', m.key)
      const file = await q.download()
      const json = await Scraper.uploadImage(file)
      let old = new Date()
      let result = Api.ie(command.toLowerCase(), json.data.url)

      client.sendFile(m.chat, result, `${command.toLowerCase}.jpg`, `*Note:* Coba Gunakan Efek yang lain jika gambar tidak muncul\n🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['alien', 'brick', 'bunny', 'caricature', 'clown', 'ink', 'latte', 'letter', 'pencil', 'puzzel', 'roses', 'sketch', 'splash', 'staco'],
   use: 'reply foto',
   category: 'image maker'
}, __filename)