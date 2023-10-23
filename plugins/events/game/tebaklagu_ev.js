//https://api.neoxr.eu/api/whatsong?apikey=wnqssF
neoxr.create(async (m, {
   client,
   body,
   users,
   prefixes,
   Scraper,
   Func
}) => {
   try {
      var id = m.chat
      var reward = Func.randomInt(global.min_reward, global.max_reward)
      client.tebaklagu = client.tebaklagu ? client.tebaklagu : {}
      if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
      if (m.quoted && /Codename6: whatsong/i.test(m.quoted.text)) {
         if (!(id in client.tebaklagu) && /Codename6: whatsong/i.test(m.quoted.text)) return m.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}tebaklagu_ untuk mendapatkan soal baru.`))
         if (m.quoted.id == client.tebaklagu[id][0].id) {
            let json = JSON.parse(JSON.stringify(client.tebaklagu[id][1]))
            if (['Timeout', ''].includes(body)) return !0
            if (body.toLowerCase() == json.title.toLowerCase()) {
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `*+ ${Func.formatNumber(reward)} Point*`, m)
                  users.point += reward
                  clearTimeout(client.tebaklagu[id][2])
                  delete client.tebaklagu[id]
               })
            } else {
               if (users.point == 0) return client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               })
               users.point < reward ? users.point = 0 : users.point -= reward
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/false.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `*- ${Func.formatNumber(reward)} Point*`, m)
               })
            }
         }
      }
   } catch (e) {
      console.log(e)
      return client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   error: false,
   group: true,
   game: true
}, __filename)