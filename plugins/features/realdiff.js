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
  "Realistic_Vision_V1.4-pruned-fp16.safetensors [8d21810b]",
  "Realistic_Vision_V2.0.safetensors [79587710]",
  "Realistic_Vision_V4.0.safetensors [29a7afaa]",
  "lyriel_v15.safetensors [65d547c5]",
  "lyriel_v16.safetensors [68fceea2]",
  "AOM3A3_orangemixs.safetensors [9600da17]",
  "redshift_diffusion-V10.safetensors [1400e684]",
  "revAnimated_v122.safetensors [3f4fefd9]",
  "sdv1_4.ckpt [7460a6fa]",
  "v1-5-pruned-emaonly.ckpt [81761151]",
  "shoninsBeautiful_v10.safetensors [25d8c546]",
  "theallys-mix-ii-churned.safetensors [5d9225a4]",
  "timeless-1.0.ckpt [7c4971d4]",
  "deliberate_v2.safetensors [10ec4b29]",
  "Realistic_Vision_V5.0.safetensors [614d1063]"
])
          let json = await Scraper.text2img(text, rand, true, "DPM++ SDE Karras", "landscape", process.env.XPRODIAKEY)
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
   usage: ['realdiff'],
   use: 'query <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   premium: true,
   limit: true
}, __filename)