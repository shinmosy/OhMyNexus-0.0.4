neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   Func
}) => {
   try {
      if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'neoxr'), m)
      client.sendReact(m.chat, '🕒', m.key)
      let json = await Api.igstalk(args[0])
      if (!json.data) return client.reply(m.chat, global.status.fail, m)
      let caption = `乂  *I G - S T A L K*\n\n`
      caption += `	◦  *Name* : ${json.data.name}\n`
      caption += `	◦  *Username* : ${json.data.username}\n`
      caption += `	◦  *Posts* : ${json.data.post}\n`
      caption += `	◦  *Followers* : ${json.data.follower}\n`
      caption += `	◦  *Followings* : ${json.data.following}\n`
      caption += `	◦  *Bio* : ${json.data.about}\n`
      caption += `	◦  *Private* : ${Func.switcher(json.data.private, '√', '×')}\n\n`
      caption += global.footer
      client.sendMessageModify(m.chat, caption, m, {
         ads: false,
         largeThumb: true,
         thumbnail: await Func.fetchBuffer(json.data.photo)
      })
   } catch (e) {
      return client.reply(m.chat, e.message.toString(), m)
   }
}, {
   usage: ['igstalk'],
   use: 'username <𝘱𝘳𝘦𝘮𝘪𝘶𝘮>',
   category: 'features',
   limit: true
}, __filename)