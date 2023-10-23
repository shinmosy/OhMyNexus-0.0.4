neoxr.create(async (m, {
   client,
   body,
   users,
   prefixes,
   Func
}) => {
   try {
      var id = m.chat
      var reward = Func.randomInt(global.min_reward, global.max_reward)
      client.caklontong = client.caklontong ? client.caklontong : {}
      if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
      if (m.quoted && /Codename3: Lontong/i.test(m.quoted.text)) {
         if (!(id in client.caklontong) && /Codename3: Lontong/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}caklontong_ untuk mendapatkan soal baru.`), m)
         if (m.quoted.id == client.caklontong[id][0].id) {
            let json = JSON.parse(JSON.stringify(client.caklontong[id][1]))
            if (['Timeout', ''].includes(body)) return !0
            if (body.toLowerCase() == json.jawaban.toLowerCase()) {
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `*+ ${Func.formatNumber(reward)} Point*`, m)
                  users.point += reward
                  clearTimeout(client.caklontong[id][2])
                  delete client.caklontong[id]
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