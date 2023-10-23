neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.caklontong = client.caklontong ? client.caklontong : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.caklontong) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.caklontong[id][0])

      let json = Func.jsonRandom('./media/games/caklontong.json')
      let clue = json.jawaban.replace(/[aiueo]/g, '_')
      let teks = `Codename3: Lontong  \n*Cak Lontong*\n\n`
      teks += `Soal: ${json.pertanyaan}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Clue : ${clue} \nReply pesan ini untuk menjawab`
      client.caklontong[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.caklontong[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*\n*${json.deskripsi}`, client.caklontong[id][0])
            delete client.caklontong[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['caklontong'],
   category: 'games', 
   limit: true,
   group: true,
   game: true
}, __filename)