const gtts = require('node-gtts')
const { tmpdir } = require('os')
const fs = require('fs')
const path = require('path')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Scraper, 
   Func
}) => {
  try {
   if (!text && !m.quoted) return client.reply(m.chat, Func.example(prefix, command, 'halo'), m)
        client.sendReact(m.chat, '🕒', m.key)
         let vnn =  await Func.fetchJson(`https://api.azz.biz.id/api/alicia?q=${text}&user=master&key=yourApiAzz`)
         let mm = '• *Model: cai_alicia (char Alicia)*\n'
            mm += '▰▰▰▰▰▰▰▰▰▰▰▰\n\n'
         let textt = `${vnn.respon}`
         let json = await Scraper.sovits(textt, 'H3fDRJjHRg7fQEqEFviU')

                 client.sendMessage(m.chat, { audio: { url: `${json.result.audio}`}, ptt: true, mimetype: "audio/mpeg", fileName: "vn.mp3", waveform: [0,3,58,44,35,32,2,4,31,35,44,34,48,13,0,54,49,40,1,44,50,51,16,0,3,40,39,46,3,42,38,44,46,0,0,47,0,0,46,19,20,48,43,49,0,0,39,40,31,18,29,17,25,37,51,22,37,34,19,11,17,12,16,19], contextInfo: { externalAdReply: { title: mm,  body: 'cai versi Alicia yg bisa mengirim pesan suara', thumbnailUrl: 'https://iili.io/JKC0KkF.jpg', mediaType: 1, renderLargerThumbnail: true
      }}}, { quoted: m })
      
      } catch (e) {
		client.reply(m.chat, `*creator*: mr.one\n*status*: false\n*message*: pertanyaan atau apikey eror\n*note*: _COBA GANTI PERTANYAAN_\n_JIKA MASIH EROR_\n_SILAHKAN LAPOR OWNER!_\n\n` + Func.jsonFormat(e), m)  
      }
   
}, {
   usage: ['cia'],
   hidden: ['~'],
   use: 'text',
   category: 'aimenu',
   limit: true
}, __filename)