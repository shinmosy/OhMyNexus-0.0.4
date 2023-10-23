neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.tebakbendera = client.tebakbendera ? client.tebakbendera : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.tebakbendera) return client.reply(m.chat, '*^soal ini belum terjawab!*', client.tebakbendera[id][0])
      let json = Func.jsonRandom('./media/games/tebakbendera2.json')
      let clue = json.name.replace(/[aiueo]/g, '_')
      let teks = `Codename5: guess flag\n*Tebak Bendera*\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Clue *${clue}*\n`
      teks += `Reply pesan ini untuk menjawab`
      client.tebakbendera[id] = [
         await client.sendFile(m.chat, json.img, '', teks, m),
         json,
         setTimeout(() => {
            if (client.tebakbendera[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.name}*`, client.tebakbendera[id][0])
            delete client.tebakbendera[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['tebakbendera'],
   category: 'games', 
   limit: true,
   group: true,
   game: true
}, __filename)