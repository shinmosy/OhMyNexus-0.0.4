const moment = require('moment-timezone')
moment.locale('en')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   participants,
   command,
   Func,
   Scraper
}) => {
   try {
      if (command == 'apakah') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'aku ganteng'), m)
         let jawab = Func.random(['Iya', 'Tidak', 'Mungkin', 'Iya', 'Tidak', 'Mungkin', 'Pake nanya', 'Pake nanya'])
         client.reply(m.chat, jawab, m)
      } else if (command == 'kapan') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'aku menikah'), m)
         let jawab = Func.randomInt(1, 101)
         let waktu = Func.random(['Detik', 'Menit', 'Jam', 'Hari', 'Minggu', 'Bulan', 'Tahun', 'Lustrum', 'Windu', 'Dekade', 'Abad', 'Milenium'])
         let hasil = `${jawab} ${waktu} Lagi..`
         client.reply(m.chat, hasil, m)
      } else if (command == 'siapa') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, '@tag'), m)
         let member = participants.map(u => u.id)
         var tag1 = member[Math.floor(member.length * Math.random())]
         client.reply(m.chat, `*Siapa ${text}*\n*Jawaban:* @${tag1.replace(/@.+/, '')}`)
          }
      } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }

}, {
   usage: ['apakah', 'kapan', 'siapa'],
   use: 'text',
   category: 'features',
   limit: false
}, __filename)