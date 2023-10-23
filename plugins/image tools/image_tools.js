const toJpg = require('lib/toJpg')
neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      if (command == 'snobg') {
         let exif = global.db.setting
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
              client.sendProgress(m.chat, 'proses memakan waktu lama mohon bersabar 😴', m) 
               let img = await client.downloadMediaMessage(q)
               let url = await Scraper.uploadImage(img)
               let remove = await Api.nobg(url.data.url)
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               await client.sendSticker(m.chat, await Func.fetchBuffer(remove.data.no_background), m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (/image\/(jpe?g|png)/.test(mime)) {
              client.sendProgress(m.chat, 'proses memakan waktu lama mohon bersabar 😴', m)  
               let img = await q.download()
               let url = await Scraper.uploadImage(img)
               let remove = await Api.nobg(url.data.url)
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               await client.sendSticker(m.chat, await Func.fetchBuffer(remove.data.no_background), m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/image\/webp/.test(mime)) {
               client.sendProgress(m.chat, 'proses memakan waktu lama mohon bersabar 😴', m) 
               let json = await toJpg(await (await Scraper.uploadImage(await q.download())).data.url)
               if (!json.status) return m.reply(Func.jsonFormat(json))
               let remove = await Api.nobg(json.data.url)
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               await client.sendSticker(m.chat, await Func.fetchBuffer(remove.data.no_background), m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         }
      } else if (command == 'nobg') {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let old = new Date()
               client.sendProgress(m.chat, 'proses memakan waktu lama mohon bersabar 😴', m) 
               let img = await client.downloadMediaMessage(q)
               let url = await Scraper.uploadImage(img)
               let remove = await Api.nobg(url.data.url)
               if (!remove.status) return m.reply(Func.jsonFormat(remove))
               client.sendFile(m.chat, remove.data.no_background, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            let old = new Date()
            client.sendProgress(m.chat, 'proses memakan waktu lama mohon bersabar 😴', m) 
            let img = await q.download()
            let url = await Scraper.uploadImage(img)
            let remove = await Api.nobg(url.data.url)
            if (!remove.status) return m.reply(Func.jsonFormat(remove))
            client.sendFile(m.chat, remove.data.no_background, '', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } else if (command == 'smeme') {
         let exif = global.db.setting
         if (!text) return client.reply(m.chat, Func.example(prefix, command, 'Hi | Dude'), m)
         client.sendReact(m.chat, '🕒', m.key)
         client.reply(m.chat, 'terkadang waktu memproses sangat lama!!', m) 
         let [top, bottom] = text.split`|`
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let img = await client.downloadMediaMessage(q)
               let json = await Scraper.uploadImage(img)
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               await client.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               let json = await Scraper.uploadImageV2(img)
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               await client.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else if (/image\/webp/.test(mime)) {
                client.reply(m.chat, 'terkadang waktu memproses sangat lama!!', m) 
               let json = await toJpg(await (await Scraper.uploadImageV2(await q.download())).data.url)
               if (!json.status) return m.reply(Func.jsonFormat(json))
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               await client.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         }
      } else if (command == 'ocr') {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (!/image/.test(type)) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            client.sendReact(m.chat, '🕒', m.key)
            client.reply(m.chat, 'terkadang waktu memproses sangat lama!!', m)  
            const json = await Scraper.uploadImage(img)
            const result = await Api.ocr(json.data.url)
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.reply(m.chat, result.data.text, m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            let img = await q.download()
            if (!img) return client.reply(m.chat, Func.texted('bold', `🚩 Give a caption or reply to the photo with the ${prefix + command} command`), m)
            client.sendReact(m.chat, '🕒', m.key)
             client.reply(m.chat, 'terkadang waktu memproses sangat lama!!', m) 
            const json = await Scraper.uploadImage(img)
            const result = await Api.ocr(json.data.url)
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.reply(m.chat, result.data.text, m)
         }
      } else if (command == 'remini') {
         const scale = 2
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               client.sendProgress(m.chat, 'proses memakan waktu lama mohon bersabar 😴', m) 
               let old = new Date()
               let img = await client.downloadMediaMessage(q)
               let image = await Scraper.uploadImage(img)
               let result = await Api.remini(image.data.url)
               if (!result.status) return m.reply(Func.jsonFormat(result))
               client.sendFile(m.chat, result.data.url, 'image.jpg', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            client.sendProgress(m.chat, 'proses memakan waktu lama mohon bersabar 😴', m) 
            let old = new Date()
            let img = await q.download()
            let image = await Scraper.uploadImage(img)
            let result = await Api.remini(image.data.url)
            if (!result.status) return m.reply(Func.jsonFormat(result))
            client.sendFile(m.chat, result.data.url, 'image.jpg', `🍟 *Process* : ${((new Date - old) * 1)} ms`, m)
         }
      } else if (command == 'face') {
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               client.sendReact(m.chat, '🕒', m.key)
               client.reply(m.chat, 'terkadang waktu memproses sangat lama!!', m) 
               let img = await client.downloadMediaMessage(q)
               let image = await Scraper.uploadImage(img)
               let json = await Api.ageDetector(image.data.url)
               if (!json.status) return m.reply(Func.jsonFormat(json))
               m.reply(`✅ *Result* : ${Func.ucword(json.data.gender)} (${json.data.age} y.o)`)
            } else client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Func.texted('bold', `🚩 Only for photo.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            client.reply(m.chat, 'terkadang waktu memproses sangat lama!!', m) 
            let img = await q.download()
            let image = await Scraper.uploadImage(img)
            let json = await Api.ageDetector(image.data.url)
            if (!json.status) return m.reply(Func.jsonFormat(json))
            m.reply(`✅ *Result* : ${Func.ucword(json.data.gender)} (${json.data.age} y.o)`)
         }
      }
   } catch (e) {
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['face', 'snobg', 'nobg', 'smeme', 'ocr', 'remini'],
   hidden: ['face'],
   use: 'reply photo',
   category: 'image tools',
   limit: true
}, __filename)