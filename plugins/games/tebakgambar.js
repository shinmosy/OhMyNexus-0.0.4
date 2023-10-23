
neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.tebakgambar = client.tebakgambar ? client.tebakgambar : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.tebakgambar) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.tebakgambar[id][0])
      let json = Func.jsonRandom('./media/games/tebakgambar.json')
      let clue = json.jawaban.replace(/[AIUEO]/g, '_')
      let teks = `Codename4: TebakGambar  \n*Tebak Gambar*\n\n`
      teks += `Deskripsi : ${json.deskripsi}\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Clue : ${clue} \nReply pesan ini untuk menjawab`
      client.tebakgambar[id] = [
         await client.sendFile(m.chat, json.image, '9.jpg', teks, m),
         json,
         setTimeout(() => {
            if (client.tebakgambar[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.tebakgambar[id][0])
            delete client.tebakgambar[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['tebakgambar'],
   category: 'games', 
   limit: true,
   group: true,
   game: true
}, __filename)