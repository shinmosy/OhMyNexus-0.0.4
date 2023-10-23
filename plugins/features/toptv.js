neoxr.create(async (m, {
      client,
      chats,
      command,
      prefix,
      text,
      Func
   }) => {
      try { 
     let exif = global.db.setting
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/video/.test(type)) {
           	client.sendReact(m.chat, '🕒', m.key)
               let buffer = await client.downloadMediaMessage(q)
               client.sendPtv(m.chat, buffer)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for video.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply video.`), m)
            if (!/video/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for video.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let buffer = await q.download()
            client.sendPtv(m.chat, buffer)
         }
      } catch (e) {
         console.log(e)
      }
   }, {
   usage: ['toptv'],
   hidden: ['toptv'],
   use: 'reply video <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   premium: true,
   limit: true
}, __filename)