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
      client.tebakgambar = client.tebakgambar ? client.tebakgambar : {}
      if (m.quoted && m.quoted.sender != client.decodeJid(client.user.id)) return
      if (m.quoted && /Codename4: TebakGambar/i.test(m.quoted.text)) {
         if (!(id in client.tebakgambar) && /Codename4: TebakGambar/i.test(m.quoted.text)) return client.reply(m.chat, Func.texted('bold', `🚩 Soal tersebut telah berakhir, silahkan kirim _${prefixes[0]}tebakgambar_ untuk mendapatkan soal baru.`), m)
         if (m.quoted.id == client.tebakgambar[id][0].id) {
            let json = JSON.parse(JSON.stringify(client.tebakgambar[id][1]))
            if (['Timeout', ''].includes(body)) return !0
            if (body.toLowerCase() == json.jawaban.toLowerCase()) {
               await client.sendSticker(m.chat, await Func.fetchBuffer('./media/sticker/true.webp'), m, {
                  packname: global.db.setting.sk_pack,
                  author: global.db.setting.sk_author
               }).then(() => {
                  client.reply(m.chat, `*+ ${Func.formatNumber(reward)} Point*`, m)
                  users.point += reward
                  clearTimeout(client.tebakgambar[id][2])
                  delete client.tebakgambar[id]
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