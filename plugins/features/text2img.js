const axios = require("axios")
neoxr.create(async (m, {
      client,
      chats,
      command,
      prefix,
      text,
      Func,
      Scraper
   }) => {
      try { 
     	 let setting = global.db.setting
    	 let old = new Date()           
          if (!text) return client.reply(m.chat, Func.example(prefix, command, '1girl'), m)             
          client.sendReact(m.chat, '🕑', m.key)
          let json = await Scraper.text2img(text, setting.modelid, true, setting.sampler, setting.ratio, process.env.XPRODIAKEY)
          if (!json.status) return 'Error guys'
          let msg = `${json.msg}`
          let mu = `*NOTE* : _JIKA GAMBAR TIDAK MUNCUL SILAHKAN AMBIL MANUAL_\n`
          mu += `*CONTOH* .get ${json.msg}\n\n`
          client.sendProgress(m.chat, mu + Func.jsonFormat(json), m)
          setTimeout(() => {
          client.sendReact(m.chat, '✅', m.key)
          client.sendFile(m.chat, msg, '', `✅Model : ${setting.modelid}`, m)
          }, 15000)
      } catch (e) {
         console.log(e)
         client.reply(m.chat, e, m)
      }
   }, {
   usage: ['text2img'],
   use: 'query <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   premium: true,
   limit: true
}, __filename)