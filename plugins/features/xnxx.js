neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      global.xnxx = global.xnxx ? global.xnxx : []
      if (!text) return client.reply(m.chat, Func.example(prefix, command, 'lathi'), m)
      const check = global.xnxx.find(v => v.jid == m.sender)
      if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
      if (check && !isNaN(text)) {
         if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Scraper.xnxxdl(check.results[Number(text) - 1])
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         let sized = await Func.getSize(json.result.files.high)
         let chSize = Func.sizeLimit(sized, global.max_upload)
         if (chSize.oversize) return client.reply(m.chat, `💀 File size (${sized}) exceeds the maximum limit, download it by yourself via this link : ${await (await Scraper.shortli(json.result.files.high)).msg}`, m)
         client.sendFile(m.chat, json.result.files.high, 'xnxx.mp4', json.result.title, m)
      } else {
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Scraper.xnxxsearch(text)
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         if (!check) {
            global.xnxx.push({
               jid: m.sender,
               results: json.result.map(v => v.link),
               created_at: new Date * 1
            })
         } else check.results = json.result.map(v => v.link)
         let p = `To showing video use this command *${prefix + command} number*\n`
         p += `*Example* : ${prefix + command} 1\n\n`
         json.result.map((v, i) => {
            p += `*${i+1}*. ${v.title}\n`
            p += `◦ *Link* : ${v.link}\n\n`
         }).join('\n\n')
         p += global.footer
         client.reply(m.chat, p, m)
      }
      setInterval(async () => {
         const session = global.xnxx.find(v => v.jid == m.sender)
         if (session && new Date - session.created_at > global.timer) {
            Func.removeItem(global.xnxx, session)
         }
      }, 60_000)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['xnxx'],
   hidden: ['bokep'],
   use: 'query <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'nsfw',
   limit: true,
   premium: true
}, __filename)