neoxr.create(async (m, {
   client,
   prefix,
   Func
}) => {
   try {
      client.siapakahaku = client.siapakahaku ? client.siapakahaku : {}
      let id = m.chat,
         timeout = 60000
      if (id in client.siapakahaku) return client.reply(m.chat, '*^ soal ini belum terjawab!*', client.siapakahaku[id][0])
      let json = Func.jsonRandom('./media/games/siapakahaku.json')
      let clue = json.jawaban.replace(/[aiueo]/g, '_')
      let teks = `Codename: whoami \n*Siapakah aku*\n\n`
      teks += `${json.pertanyaan}\n\n`
      teks += `Timeout : [ *${((timeout / 1000) / 60)} menit* ]\n`
      teks += `Clue : ${clue}\n`
      teks += `Reply pesan ini untuk menjawab, kirim *${prefix}who* untuk bantuan dan *${prefix}whoskip* untuk menghapus sesi.`
      client.siapakahaku[id] = [
         await client.reply(m.chat, teks, m),
         json,
         setTimeout(() => {
            if (client.siapakahaku[id]) client.reply(m.chat, `*Waktu habis!*\nJawaban : *${json.jawaban}*`, client.siapakahaku[id][0])
            delete client.siapakahaku[id]
         }, timeout)
      ]
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['siapakahaku'],
   category: 'games',
   limit: true,
   group: true,
   game: true
}, __filename)