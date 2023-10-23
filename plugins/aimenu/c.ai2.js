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
      	  if (!m.quoted && !text) return client.reply(m.chat, Func.example(prefix, command, 'Halo'), m)
         
         let setting = global.db.setting
         client.sendReact(m.chat, '🕑', m.key)
         const json = await Scraper.cai(text, 'yourCharID')
         if (!json.status) return m.reply(Func.jsonFormat(json))
           let mm = '• *Model: character.ai (char Liv)*\n'
            mm += '▰▰▰▰▰▰▰▰▰▰▰▰\n\n'
      client.sendMessage(m.chat, {
      text: json.result.message,
      contextInfo: {
        externalAdReply: {
          title: mm,
          body: json.result.metadata.title,
          thumbnailUrl: 'https://iili.io/J3hanGs.jpg',
          sourceUrl: "",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })
      } catch (e) {
         console.log(e)
         client.reply(m.chat, e, m)
      }
   }, {
   usage: ['liv'],
   hidden: ['•','cai'],
   use: 'text',
   category: 'aimenu',
   limit: true
}, __filename)