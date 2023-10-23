const moment = require('moment-timezone')
moment.locale('en')
let fetch = require('node-fetch')
let googleIt = require('google-it')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      if (command == 'chord') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lathi'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let json = await Api.chord(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         client.reply(m.chat, json.data.chord, m)
      } else if (command == 'pinterest') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'cat'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         let json = await Api.pinterest(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            client.sendFile(m.chat, json.data[rand].url, '', `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(2000)
         }
      } else if (command == 'art') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'evil cat'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         let json = await Api.diffusion(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            client.sendFile(m.chat, json.data[rand].url, json.data[rand].filename, `🍟 *Fetching* : ${((new Date - old) * 1)} ms`, m)
            await Func.delay(2000)
         }
      } else if (command == 'gempa') {
          client.sendReact(m.chat, '🕒', m.key)
         let json = await Api.gempa()
        if (!json.status) return client.reply(m.chat, global.status.fail, m)
         let gem = `*INFO GEMPA TERKINI*\n\n`
             gem += `*WAKTU* : ${json.data.waktu}\n`
             gem += `*LINTANG* : ${json.data.lintang}\n`
             gem += `*BUJUR* : ${json.data.bujur}\n`
             gem += `*MAGNITUDO* : ${json.data.magnitudo}\n`
             gem += `*KEDALAMAN* : ${json.data.kedalaman}\n`
             gem += `*WILAYAH* : ${json.data.wilayah}\n\n`
             gem += global.footer
         client.sendFile(m.chat, `${json.data.map}`, 'map.jpg', gem, m)

      } else if (command == 'google') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'cat'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let url = 'https://google.com/search?q=' + encodeURIComponent(text)
         let search = await googleIt({ query: text })
         let msg = search.map(({ title, link, snippet}) => {
         return `*${title}*\n_${link}_\n_${snippet}_`
         }).join`\n\n`
         client.sendMessageModify(m.chat, url + '\n\n' + msg + '\n' + global.footer, m, {
            ads: false,
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/d7b761ea856b5ba7b0713.jpg')
         })
      } else if (command == 'goimg') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'cat'), m)
         let json = await Api.google(text, true)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         for (let i = 0; i < 5; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            let caption = `乂  *G O O G L E - I M A G E*\n\n`
            caption += `	◦ *Title* : ${json.data[i].origin.title}\n`
            caption += `	◦ *Dimensions* : ${json.data[i].width} × ${json.data[i].height}\n\n`
            caption += global.footer
            client.sendFile(m.chat, json.data[rand].url, '', caption, m)
            await Func.delay(2500)
         }
      } else if (command == 'npm') {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'queue'), m)
         client.sendReact(m.chat, '🕒', m.key)
         let json = await Api.npm(text)
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         let teks = `乂  *N P M J S*\n\n`
         json.data.map((v, i) => {
            teks += '*' + (i + 1) + '. ' + v.name + '*\n'
            teks += '	◦  *Version* : ' + v.version + '\n'
            teks += '	◦  *Description* : ' + v.description + '\n'
            teks += '	◦  *Author* : @' + v.publisher.username + '\n'
            teks += '	◦  *Published* : ' + moment(v.date).format('dddd, DD/MM/YYYY hh:mm') + '\n'
            teks += '	◦  *Link* : ' + v.links.npm + '\n\n'
         })
         client.sendMessageModify(m.chat, teks + global.footer, m, {
            ads: false,
            largeThumb: true,
            thumbnail: await Func.fetchBuffer('https://telegra.ph/file/c416638747ec63d97d20b.jpg')
         })
      } else if (['wp', 'wallpaper'].includes(command)) {
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'sea'), m)
         let json = await Api.wallpaper(text)
         if (!json.status) return client.reply(m.chat, json.msg, m)
         for (let i = 0; i < 5; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            client.sendFile(m.chat, json.data[rand].url, '', json.data[rand].title, m)
            await Func.delay(2500)
         }
      } else if (['quotesanime'].includes(command)) {
          let json = await Scraper.quotesanime()
          let rand = Math.floor(json.length * Math.random())      
          client.sendMessageModify(m.chat, 'Nama: ' + json[rand].karakter + '\n' + 'Anime: ' +  json[rand].anime + '\n' + 'Episode: ' + json[rand].episode + '\n' + 'Quotes: ' + json[rand].quotes, m, {
               ads: true,
               largeThumb: true,
               thumbnail: await Func.fetchBuffer(json[rand].gambar)
            })
      }  else if (['nickml'].includes(command)) {
          if (!text) return client.reply(m.chat, Func.example(prefix, command, '123445677(83878)'), m)
          let json = await Func.fetchJson(`https://v1.apigames.id/merchant/M230803UZPP7140MF/cek-username/mobilelegend?user_id=${text}&signature=b4a3ccc46452f72e07104ebbea9ed04e`)
          if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
          client.sendProgress(m.chat, json.data.username, m)
      } else if (['artinama'].includes(command)) {
          if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lanbot'), m)
          let arti = await Scraper.artinama(text)
          client.sendProgress(m.chat, arti, m)
      }  else if (['wiki','wikipedia'].includes(command)) {
          let json = await Scraper.wikisearch(text)    
           if (!text) return client.reply(m.chat, Func.example(prefix, command, 'jokowi'), m)
           let mi = '*W I K I P E D I A🔍*\n'
           client.sendReact(m.chat, '🕒', m.key)
           if (!json.status) return client.sendMessageModify(m.chat, mi + Func.jsonFormat(json), m, {
          ads: true, 
          largeThumb: true,
          thumbnail: await Func.fetchBuffer('https://iili.io/JdFX0Ff.jpg') 
          })
          
     }
      
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['art', 'artinama', 'quotesanime', 'npm', 'chord', 'gempa', 'pinterest', 'google', 'goimg', 'wallpaper', 'nickml', 'wiki', 'wikipedia'],
   hidden: ['wp'],
   use: 'query',
   category: 'searching',
   limit: true
}, __filename)