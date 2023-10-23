neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.asahotak = client.asahotak ? client.asahotak : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.asahotak) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.asahotak[id][0])
      let json = Func.jsonRandom('./media/games/asahotak.json')
      let clue = json.jawaban.replace(/[aiueo]/g, '_')
      let teks = `Codename2: Brain teaser  \n*AsahOtak*\n\n`
      teks += `Soal: ${json.pertanyaan}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Clue : ${clue}\nReply pesan ini untuk menjawab`
      client.asahotak[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.asahotak[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.asahotak[id][0])
            delete client.asahotak[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['asahotak'],
   category: 'games', 
   limit: true,
   group: true,
   game: true
}, __filename)