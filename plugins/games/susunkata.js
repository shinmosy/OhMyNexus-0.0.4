neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.susunkata = client.susunkata ? client.susunkata : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.susunkata) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.susunkata[id][0])
      let json = Func.jsonRandom('./media/games/susunkata.json')
      let teks = `Codename1: arrange words  \n*Susun kata*\n\n`
      teks += `Soal: ${json.pertanyaan}\nTipe: ${json.tipe}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Reply pesan ini untuk menjawab`
      client.susunkata[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.susunkata[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.susunkata[id][0])
            delete client.susunkata[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['susunkata'],
   category: 'games', 
   limit: true,
   group: true,
   game: true
}, __filename)