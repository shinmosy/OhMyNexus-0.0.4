const makemeazombie = require('makemeazombie');
const zombie = new makemeazombie();
const uploadImage = require('lib/system/uploadImage')
neoxr.create(async (m, {
      client,
      chats,
      command,
      prefix,
      text,
      Func
   }) => {
      try { 
let old = new Date()           
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || ''
if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
client.sendReact(m.chat, '🕒', m.key)
let img = await q.download()
let url = await uploadImage(img)
zombie.transform({
    photo: url,
})
.then(data => {

    client.sendFile(m.chat, Buffer.from(data, 'base64'), '.jpg', `🚩 *Fetching* : ${((new Date - old) * 1)} ms`, m)
})
.catch(err => {
    console.log('Error', err);
    client.reply(m.chat, err, m)
})
      } catch (e) {
         console.log(e)
      }
   }, {
   usage: ['tozombie'],
   hidden: ['tozombie'],
   use: 'reply image <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   premium: false,
   limit: true
}, __filename)