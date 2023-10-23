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
          let q = m.quoted ? m.quoted : m
          let mime = (q.msg || q).mimetype || ''
          if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
          if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
          client.sendReact(m.chat, '🕒', m.key)
          let img = await q.download()
          let url = await Scraper.uploadImage(img)
          let json = await Scraper.controlnet(text, setting.nprompt, url.data.url, setting.model, setting.module, setting.sampler, setting.height, setting.width, process.env.XPRODIAKEY)
          if (!json.status) return 'Error guys'
          client.sendProgress(m.chat, Func.jsonFormat(json), m)
          setTimeout(() => {
          client.sendReact(m.chat, '✅', m.key)
          client.sendFile(m.chat, json.msg, '', `✅Model : ${setting.model}`, m)
          }, 15000)
      } catch (e) {
         console.log(e)
         client.reply(m.chat, e, m)
      }
   }, {
   usage: ['controlnet'],
   use: 'query & reply foto <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   premium: true,
   limit: true
}, __filename)