/*"elon_musk",
  "steve_jobs",
  "joe_rogan",
  "taylor_swift",
  "selena_gomez",
  "meryl_streep",
  "jennifer_lawrence",
  "morgan_freeman",
  "jordan_peterson",
  "snoop_dogg",
  "rachel",
  "joe_biden",
  "donald_trump",
  "barack_obama",
  "domi",
  "bella",
  "antoni"*/

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
   if (!text && !m.quoted) return client.reply(m.chat, Func.example(prefix, command, 'how to create an api'), m)
        client.sendReact(m.chat, '🕒', m.key).then(() => client.reply(m.chat, '*MOHON TUNGGU*!\nAi sedang memproses jawaban!\n_semakin berat pertanyaan semakin lama responnya_', m))
         let json = await Scraper.cai(text, 'yourCharID')
         let mm = '• *Model: character.ai VO (char Liv)*\n'
            mm += '▰▰▰▰▰▰▰▰▰▰▰▰\n\n'
         let mese = `https://api.itsrose.life/tools/tts?text=${json.result.message}&voice_id=domi&apikey=YourRoseKey`
  
                 client.sendMessage(m.chat, { audio: { url: mese}, ptt: true, mimetype: "audio/mpeg", fileName: "vn.mp3", waveform: [0,3,58,44,35,32,2,4,31,35,44,34,48,13,0,54,49,40,1,44,50,51,16,0,3,40,39,46,3,42,38,44,46,0,0,47,0,0,46,19,20,48,43,49,0,0,39,40,31,18,29,17,25,37,51,22,37,34,19,11,17,12,16,19], contextInfo: { externalAdReply: { title: mm,  body: 'c.ai yg bisa mengirim pesan suara', thumbnailUrl: 'https://iili.io/J3hanGs.jpg', mediaType: 1, renderLargerThumbnail: true
      }}}, { quoted: m })
      
      } catch (e) {
         console.log(e)
      }
   
}, {
   usage: ['livo'],
   hidden: ['livvoice', '••', 'caivo'],
   use: 'text',
   category: 'aimenu',
   limit: true
}, __filename)