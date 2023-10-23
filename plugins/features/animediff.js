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
      	  let old = new Date()           
            if (!text) return client.reply(m.chat, Func.example(prefix, command, 'evil cat'), m)             
            client.sendReact(m.chat, '🕑', m.key)
          let rand = Func.random([
  "anythingv3_0-pruned.ckpt [2700c435]",
  "anything-v4.5-pruned.ckpt [65745d25]",
  "anythingV5_PrtRE.safetensors [893e49b9]",
  "EimisAnimeDiffusion_V1.ckpt [4f828a15]",
  "dreamshaper_5BakedVae.safetensors [a3fbf318]",
  "dreamshaper_6BakedVae.safetensors [114c8abb]",
  "dreamshaper_7.safetensors [5cf5ae06]",
  "mechamix_v10.safetensors [ee685731]",
  "meinamix_meinaV9.safetensors [2ec66ab0]",
  "meinamix_meinaV11.safetensors [b56ce717]"
])
          let json = await Scraper.text2img(text, rand, true, 'DPM++ SDE Karras', 'landscape', process.env.XPRODIAKEY)
          if (!json.status) return 'Error guys'
          let msg = `${json.msg}`
          let mu = `*NOTE* : _JIKA GAMBAR TIDAK MUNCUL SILAHKAN AMBIL MANUAL_\n`
          mu += `*CONTOH* .get ${json.msg}\n\n`
          client.sendProgress(m.chat, mu + Func.jsonFormat(json), m)
          setTimeout(() => {
          client.sendReact(m.chat, '✅', m.key)
          client.sendFile(m.chat, msg, '', `🚩Model : ${rand}`, m)
          }, 15000)
      } catch (e) {
         console.log(e)
         client.reply(m.chat, e, m)
      }
   }, {
   usage: ['animediff'],
   use: 'query',
   category: 'features',
   premium: false,
   limit: true
}, __filename)