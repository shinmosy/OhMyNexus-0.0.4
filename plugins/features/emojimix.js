neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   setting,
   Func
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, '😳.😩'), m)
      let [emo1, emo2] = text.split`.`
      if (!emo1 || !emo2) return client.reply(m.chat, Func.texted('bold', `🚩 Give 2 emoticons to mix.`), m)
      let json = await Func.fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emo1)}_${encodeURIComponent(emo2)}`)
  if (json.results[0] == undefined) throw 'Kombinasi Emojimix Tidak Ditemukan'

  let emix = json.results[0].media_formats.png_transparent.url
      
      await client.sendSticker(m.chat, emix, m, {
         packname: setting.sk_pack,
         author: setting.sk_author,
         categories: [emo1, emo2]
      })
   } catch (e) {
      console.log(e)
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['emojimix'],
   hidden: ['mix', 'emomix'],
   use: 'emoji.emoji',
   category: 'features',
   limit: true
}, __filename)