neoxr.create(async (m, {
   client,
   text,
   prefix,
   command,
   Func,
   Scraper
}) => {
   try {
      global.modelid = global.modelid ? global.modelid : []
      if (!text) return m.reply(Func.texted('bold', 'Isi textnya contoh .setmodel q'))
      let setting = global.db.setting
      const check = global.modelid.find(v => v.jid == m.sender)
      if (!check && !isNaN(text)) return m.reply(Func.texted('bold', `🚩 Your session has expired / does not exist, do another search using the keywords you want.`))
      if (check && !isNaN(text)) {
         if (Number(text) > check.results.length) return m.reply(Func.texted('bold', `🚩 Exceed amount of data.`))
         client.sendReact(m.chat, '🕒', m.key)
         setting.modelid = check.results[Number(text) - 1]
          client.sendProgress(m.chat, 'Done set ' + setting.modelid, m)
      } else {
         client.sendReact(m.chat, '🕒', m.key)
         const json = await Scraper.model()
         if (!json.status) return client.reply(m.chat, Func.jsonFormat(json), m)
         if (!check) {
            global.modelid.push({
               jid: m.sender,
               results: json.model.map(v => v),
               created_at: new Date * 1
            })
         } else check.results = json.model.map(v => v)
         let p = `Untuk set modelnya ketik *${prefix + command} number*\n`
         p += `*Example* : ${prefix + command} 1\n\n`
         json.model.map((v, i) => {
            p += `*${i+1}*. ${v}\n`
         }).join('\n\n')
         p += global.footer
         client.reply(m.chat, p, m)
      }
      setInterval(async () => {
         const session = global.modelid.find(v => v.jid == m.sender)
         if (session && new Date - session.created_at > global.timer) {
            Func.removeItem(global.modelid, session)
         }
      }, 60_000)
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['setmodel', 'model'],
   use: 'query',
   category: 'owner',
   limit: true,
   owner: true, 
   premium: false
}, __filename)