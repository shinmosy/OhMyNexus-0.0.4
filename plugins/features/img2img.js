const axios = require("axios");
const uploadImage = require('lib/system/uploadImage')
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
          let puh = `mohon tunggu, membutuhkan waktu beberapa menit🥱\n`
      	  let old = new Date()           
            if (!text) return client.reply(m.chat, Func.example(prefix, command, 'anime'), m)  
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `ðŸš© Only for photo.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let img = await q.download()
            let url = await Scraper.uploadImage(img)
            ///Post
const options = {
  method: 'POST',
  url: 'https://api.prodia.com/v1/sd/transform',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'X-Prodia-Key': process.env.XPRODIAKEY
  },
  data: {
    imageUrl: url.data.url,
    prompt: text,
    model: setting.modelid,
    denoising_strength: 0.7,
    negative_prompt: 'canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), weird colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render',
    sampler: 'DPM++ 2M Karras',
    seed: -1,
    cfg_scale: 7,
    steps: 25,
    upscale: true
  }
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
let res2 = `jika gambar tidak muncul, silahkan ambil manual *CONTOH* .get https://images.prodia.xyz/${response.data.job}.png`
client.sendProgress(m.chat, res2, m)

    setTimeout(() => {
        client.sendReact(m.chat, '✅', m.key)
    let res = `https://images.prodia.xyz/${response.data.job}.png`
    client.sendFile(m.chat, res, '', `✅Model : ${setting.modelid}`, m)
    }, 13000)
  })
  .catch(function (error) {
    console.error(error);
  });
      } catch (e) {
         console.log(e)
         client.reply(m.chat, e, m)
      }
   }, {
   usage: ['img2img'],
   use: 'reply and query <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   premium: true,
   limit: true
}, __filename)