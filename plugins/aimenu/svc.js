neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Scraper, 
   Func
}) => {
   if (!text) return client.reply(m.chat, Func.example(prefix, command, 'love you'), m)
   client.sendReact(m.chat, '🕒', m.key)
   let json = await Scraper.sovits(text, 'H3fDRJjHRg7fQEqEFviU')
   let aud = `${json.result.audio}`
   client.sendMessage(m.chat, { audio: { url: aud }, ptt: true, mimetype: "audio/mpeg", fileName: "vn.mp3", waveform: [0,3,58,44,35,32,2,4,31,35,44,34,48,13,0,54,49,40,1,44,50,51,16,0,3,40,39,46,3,42,38,44,46,0,0,47,0,0,46,19,20,48,43,49,0,0,39,40,31,18,29,17,25,37,51,22,37,34,19,11,17,12,16,19] }, { quoted: m }) 


 }, { usage: ['sovits', 'svc', 'sov'],
   use: 'text',
   category: 'features',
   limit: true
}, __filename)