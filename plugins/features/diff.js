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
  "analog-diffusion-1.0.ckpt [9ca13f02]",
  "anythingv3_0-pruned.ckpt [2700c435]",
  "anything-v4.5-pruned.ckpt [65745d25]",
  "anythingV5_PrtRE.safetensors [893e49b9]",
  "AOM3A3_orangemixs.safetensors [9600da17]",
  "deliberate_v2.safetensors [10ec4b29]",
  "dreamlike-diffusion-1.0.safetensors [5c9fd6e0]",
  "dreamlike-diffusion-2.0.safetensors [fdcf65e7]",
  "dreamshaper_5BakedVae.safetensors [a3fbf318]",
  "dreamshaper_6BakedVae.safetensors [114c8abb]",
  "dreamshaper_7.safetensors [5cf5ae06]",
  "EimisAnimeDiffusion_V1.ckpt [4f828a15]",
  "elldreths-vivid-mix.safetensors [342d9d26]",
  "lyriel_v15.safetensors [65d547c5]",
  "lyriel_v16.safetensors [68fceea2]",
  "mechamix_v10.safetensors [ee685731]",
  "meinamix_meinaV9.safetensors [2ec66ab0]",
  "meinamix_meinaV11.safetensors [b56ce717]",
  "openjourney_V4.ckpt [ca2f377f]",
  "portraitplus_V1.0.safetensors [1400e684]",
  "Realistic_Vision_V4.0.safetensors [29a7afaa]",
  "Realistic_Vision_V5.0.safetensors [614d1063]",
  "redshift_diffusion-V10.safetensors [1400e684]",
  "revAnimated_v122.safetensors [3f4fefd9]",
  "v1-5-pruned-emaonly.ckpt [81761151]",
  "shoninsBeautiful_v10.safetensors [25d8c546]",
  "theallys-mix-ii-churned.safetensors [5d9225a4]",
  "timeless-1.0.ckpt [7c4971d4]"
])
          let json = await Scraper.text2img(text, rand, true, "DPM++ SDE Karras", "square", process.env.XPRODIAKEY)
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
   usage: ['diff'],
   use: 'query <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   premium: true,
   limit: true
}, __filename)