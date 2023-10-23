neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func
}) => {
   try {
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'how to create web api'), m)
      client.sendReact(m.chat, '🕒', m.key).then(() => client.reply(m.chat, '*MOHON TUNGGU*!\nBard sedang memproses jawaban!\n_semakin berat pertanyaan semakin lama responnya_', m))
      let red = '• *Model : Google Bard Ai*\n'
            red += '▰▰▰▰▰▰▰▰▰▰▰▰\n\n'
      const json = await Api.bard(text)
        let mese = `https://api.itsrose.life/tools/tts?text=${json.data.message}&voice_id=joe_biden&apikey=yourRoseKey`
                 client.sendMessage(m.chat, { audio: { url: mese}, ptt: true, mimetype: "audio/mpeg", fileName: "vn.mp3", waveform: [0,3,58,44,35,32,2,4,31,35,44,34,48,13,0,54,49,40,1,44,50,51,16,0,3,40,39,46,3,42,38,44,46,0,0,47,0,0,46,19,20,48,43,49,0,0,39,40,31,18,29,17,25,37,51,22,37,34,19,11,17,12,16,19], contextInfo: { externalAdReply: { title: red,  body: 'Bard-Ai yg bisa mengirim pesan suara', thumbnailUrl: 'https://iili.io/J2xKKb9.jpg', mediaType: 1, renderLargerThumbnail: true
      }}}, { quoted: m })
      
     /* client.sendMessageModify(m.chat, red + Func.texted('bold', json.data.message), m, {
         ads: false,
         largeThumb: true,
         thumbnail: 'https://iili.io/J2xKKb9.jpg'
      })*/
   } catch (e) {
      return client.reply(m.chat, e.message.toString(), m)
   }
}, {
   usage: ['bardvo'],
   use: 'query',
   category: 'aimenu',
   limit: true
}, __filename)