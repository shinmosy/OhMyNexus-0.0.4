neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      global.apkmod = global.apkmod ? global.apkmod : []
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lathi'), m)
      const check = global.apkmod.find(v => v.jid == m.sender)
      if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
      if (check && !isNaN(text)) {
         if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.apkmod(check.query, Number(text))
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let caption = `乂  *A P K M O D*\n\n`
         for (let key in json.data)
            if (!/thumbnail/i.test(key)) caption += `	◦  *${Func.ucword(key)}* : ${json.data[key]}\n`
         caption += `\n${global.footer}`
         let chSize = Func.sizeLimit(json.data.size, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `💀 File size (${json.data.size}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shorten(json.file.url)).data.url}`, m)
         client.sendMessageModify(m.chat, caption, m, {
            ads: false,
            largeThumb: true,
            thumbnail: json.data.thumbnail
         }).then(async () => {
            client.sendFile(m.chat, json.file.url, json.file.filename, '', m)
         })
      } else {
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Api.apkmod(text)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         if (!check) {
            global.apkmod.push({
               jid: m.sender,
               query: text,
               results: json.data.map(v => v.url),
               created_at: new Date * 1
            })
         } else check.results = json.data.map(v => v.url)
         let p = `To download apkmods use this command *${prefix + command} number*\n`
         p += `*Example* : ${prefix + command} 1\n\n`
         json.data.map((v, i) => {
            p += `*${i+1}*. ${v.name}\n`
            p += `◦ *Version* : ${v.version}\n`
            p += `◦ *Mod* : ${v.mod}\n\n`
         }).join('\n\n')
         p += global.footer
         client.reply(m.chat, p, m)
      }
      setInterval(async () => {
         const session = global.apkmod.find(v => v.jid == m.sender)
         if (session && new Date - session.created_at > global.timeout) {
            Func.removeItem(global.apkmod, session)
         }
      }, 60_000)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['apkmod'],
   hidden: ['getapkmod'],
   use: 'query',
   category: 'features',
   limit: true
}, __filename)