const { Converter } = new(require('@lanbott/lanbot-js'))
const { readFileSync: read, unlinkSync: remove, writeFileSync: create } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { tmpdir } = require('os')
neoxr.create(async (m, {
   client,
   command,
   Func,
   Scraper
}) => {
   try {
      if (m.quoted && typeof m.quoted.buttons != 'undefined' && typeof m.quoted.videoMessage != 'undefined') {
         client.sendReact(m.chat, '🕒', m.key)
         const media = await client.saveMediaMessage(m.quoted.videoMessage)
         const result = Func.filename('mp3')
         exec(`ffmpeg -i ${media} ${result}`, async (err, stderr, stdout) => {
            remove(media)
            if (err) return client.reply(m.chat, Func.texted('bold', `🚩 Conversion failed.`), m)
            let buff = read(result)
            if (/tomp3|toaudio/.test(command)) return client.sendFile(m.chat, buff, 'audio.mp3', '', m).then(() => remove(result))
            if (/tovn/.test(command)) return client.sendFile(m.chat, buff, 'audio.mp3', '', m, {
               ptt: true
            }).then(() => remove(result))
         })
      } else {
         let q = m.quoted ? m.quoted : m
         let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
         if (/audio|video/.test(mime)) {
            client.sendReact(m.chat, '🕒', m.key)
            const buff = await Converter.toAudio(await q.download(), 'mp3')
            if (/tomp3|toaudio/.test(command)) return client.sendFile(m.chat, buff, 'audio.mp3', '', m)
            if (/tovn/.test(command)) {
               const json = await Scraper.uploadImageV2(buff)
               client.sendMessage(m.chat, { audio: { url: json.data.url }, ptt: true, mimetype: "audio/mpeg", fileName: "vn.mp3", waveform: [0,10,0,190,0] }, { quoted: m })
            }
         } else {
            client.reply(m.chat, Func.texted('bold', `🚩 This feature only for audio / video.`), m)
         }
      }
   } catch (e) {
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['tomp3', 'tovn'],
   hidden: ['toaudio'],
   use: 'reply media',
   category: 'features',
   limit: true
}, __filename)