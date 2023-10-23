const os = require('os')
neoxr.create(async (m, {
   client,
   command,
   text,
   Func,
   Scraper
}) => {
   try {
      if (command == 'runtime' || command == 'run') return m.reply(`*Running for : [ ${Func.toTime(process.uptime() * 1000)} ]*`)
      if (command == 'server') {
         const json = await Func.fetchJson('http://ip-api.com/json')
         delete json.status
         let caption = `乂  *S E R V E R*\n\n`
         caption += `┌  ◦  OS : ${os.type()} (${os.arch()} / ${os.release()})\n`
         caption += `│  ◦  Ram : ${Func.formatSize(process.memoryUsage().rss)} / ${Func.formatSize(os.totalmem())}\n`
         for (let key in json) caption += `│  ◦  ${Func.ucword(key)} : ${json[key]}\n`
         caption += `│  ◦  Uptime : ${Func.toTime(os.uptime * 1000)}\n`
         caption += `└  ◦  Processor : ${os.cpus()[0].model}\n\n`
         caption += global.footer
         client.sendMessageModify(m.chat, caption, m, {
            ads: false,
            largeThumb: true,
            thumbnail: global.db.setting.cover
         })
      }
      if (/check(api)?/.test(command)) {
         let json = await Api.check()
         await client.reply(m.chat, Func.jsonFormat(json.data), m)
      }
      if (command == 'owner') return client.sendContact(m.chat, [{
         name: global.owner_name,
         number: global.owner,
         about: 'Owner & Creator'
      }], m, {
         org: 'Liv Network',
         website: 'Livai.life',
         email: 'anilovaofc123@gmail.com'
      }) 
     if (command == 'tourl') {
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 File not found!`), m)
         client.sendReact(m.chat, '🕒', m.key)
         const file = await q.download()
         const json = await Scraper.uploadImage(file)
         m.reply('Ini linknya: ' + json.data.url)
      } 
      if (command == 'shortlink') {
          if (!text) return client.reply('ketik yang bener bre')
          let json = await Scraper.shortli(text)
          client.reply(m.chat, 'Nih Linknya Bro: ' + json.msg, m)
      }
            if (command == 'zonerapi') {
            let mek = `Number: 1356

Status: true

Name: okelah

Akun: vip

Limit: unlimited

message: Cool

Creator: @TegarPriyadi
`
            client.reply(m.chat, mek, m)
            }
   } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['checkapi', 'runtime', 'server', 'shortlink','zonerapi'],
   hidden: ['owner', 'api', 'run', 'tourl'],
   category: 'miscs'
}, __filename)