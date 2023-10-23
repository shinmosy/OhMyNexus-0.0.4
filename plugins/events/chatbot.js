const axios = require("axios")
const fs = require("fs")
neoxr.create(async (m, {
      client,
      body,
      chats,
      setting,
      Func,
      Scraper
   }) => {
      try { 
         if (body && !global.evaluate_chars.some(v => body.startsWith(v))) {
         let sim = await Func.removeEmojis(body)
         let simi = await Scraper.simsimiV2(sim)
         if (!m.fromMe && setting.chatbot && simi.status) return client.reply(m.chat, simi.msg, m)
         }
      } catch (e) {
         console.log(e)
      }
   }, {
   error: false,
   private: true,
   cache: true
}, __filename)
