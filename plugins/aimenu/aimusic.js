neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Scraper, 
   Func
}) => {
   if (!text) return client.reply(m.chat, Func.example(prefix, command, 'guitar, punk, ska style'), m)
   client.sendReact(m.chat, '🕒', m.key).then(() => client.reply(m.chat, '*Silahkan tunggu sebentar, lagu sedang di buat*\n prosesnya bisa lama', m))
   let json = await Scraper.aimusic(text)

   client.sendMessage(m.chat, { audio: { url: `${json.result.audios}` }, ptt: true, mimetype: "audio/mpeg", fileName: "vn.mp3", waveform: [0,3,58,44,35,32,2,4,31,35,44,34,48,13,0,54,49,40,1,44,50,51,16,0,3,40,39,46,3,42,38,44,46,0,0,47,0,0,46,19,20,48,43,49,0,0,39,40,31,18,29,17,25,37,51,22,37,34,19,11,17,12,16,19], contextInfo: { externalAdReply: { title: 'prompt:' + json.result.metadata.prompt, body: 'ai music generated', thumbnailUrl: 'https://iili.io/JKCKYv9.jpg', mediaType: 1, renderLargerThumbnail: true
      }}}, { quoted: m }) 


 }, { usage: ['aimusic'],
   use: 'text',
   category: 'aimenu',
   limit: true
}, __filename)