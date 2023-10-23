const moment = require('moment-timezone')
moment.locale('en')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      if (['hentai'].includes(command)) { 
          client.sendReact(m.chat, '🔎', m.key)
          let json = await Func.fetchJson(`https://api.waifu.im/search?included_tags=hentai`)
          client.sendFile(m.chat, json.images[0].url, '', 'Sangean aowkwkwkwk', m)         
      } else if (['ero'].includes(command)) { 
          client.sendReact(m.chat, '🔎', m.key)
          let json = await Func.fetchJson(`https://api.waifu.im/search?included_tags=ero`)
          client.sendFile(m.chat, json.images[0].url, '', 'Sangean aowkwkwkwk', m)         
      } else if (['ass'].includes(command)) { 
          client.sendReact(m.chat, '🔎', m.key)
          let json = await Func.fetchJson(`https://api.waifu.im/search?included_tags=ass`)
          client.sendFile(m.chat, json.images[0].url, '', 'Sangean aowkwkwkwk', m)         
      } else if (['milf'].includes(command)) { 
          client.sendReact(m.chat, '🔎', m.key)
          let json = await Func.fetchJson(`https://api.waifu.im/search?included_tags=milf`)
          client.sendFile(m.chat, json.images[0].url, '', 'Sangean aowkwkwkwk', m)         
      } else if (['oral'].includes(command)) { 
          client.sendReact(m.chat, '🔎', m.key)
          let json = await Func.fetchJson(`https://api.waifu.im/search?included_tags=oral`)
          client.sendFile(m.chat, json.images[0].url, '', 'Sangean aowkwkwkwk', m)         
      } else if (['paizuri'].includes(command)) { 
          client.sendReact(m.chat, '🔎', m.key)
          let json = await Func.fetchJson(`https://api.waifu.im/search?included_tags=paizuri`)
          client.sendFile(m.chat, json.images[0].url, '', 'Sangean aowkwkwkwk', m)         
      } else if (['ecchi'].includes(command)) { 
          client.sendReact(m.chat, '🔎', m.key)
          let json = await Func.fetchJson(`https://api.waifu.im/search?included_tags=ecchi`)
          client.sendFile(m.chat, json.images[0].url, '', 'Sangean aowkwkwkwk', m)         
      } else if (['hentaivid'].includes(command)) {
          let json = await Scraper.hentaivid()
          for (let i = 0; i < 2; i++) {
              var rand = Math.floor(json.length * Math.random())
              client.sendFile(m.chat, json[rand].video_2, 'hentaivid.mp4', `• Title: ${json[rand].title}\n• Category: ${json[rand].category}\nShare: ${json[rand].share_count}\n• Views: ${json[rand].views_count}`, m)
              await Func.delay(2500)
          }
      } 
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['hentai', 'ero', 'ass', 'milf', 'oral', 'paizuri', 'ecchi', 'hentaivid'],
   use: 'query <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'nsfw',
   premium: true,
   limit: true
}, __filename)