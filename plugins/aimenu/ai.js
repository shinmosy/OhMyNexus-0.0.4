const fs = require("fs");
const axios = require("axios");
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
      	  if (!m.quoted && !text) return client.reply(m.chat, Func.example(prefix, command, 'how to create an api'), m)
         if (m.quoted && !/conversation|extend/.test(m.quoted.mtype)) return m.reply(Func.texted('bold', `ðŸš© Text not found!`))
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.gpt(text)
         if (!json.status) return m.reply(Func.jsonFormat(json))
           let mm = '• *Model : GPT-3,5 Turbo*\n'
            mm += '▰▰▰▰▰▰▰▰▰▰▰▰\n\n'
         client.sendMessageModify(m.chat, mm + Func.texted('bold', json.data.message), m, {
         ads: false,
         largeThumb: true,
         thumbnail: 'https://iili.io/JdKfEgV.jpg'
      })
      } catch (e) {
         console.log(e)
         client.reply(m.chat, e, m)
      }
   }, {
   usage: ['ai', 'brainly'],
   hidden: ['chatgpt'],
   use: 'text',
   category: 'aimenu',
   premium: false,
   limit: true
}, __filename)