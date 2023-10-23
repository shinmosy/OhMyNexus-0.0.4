neoxr.create(async (m, {
   client,
   args,
   prefix,
   command,
   Func
}) => {
   try {
      if (!args || !args[0]) return client.reply(m.chat, Func.example(prefix, command, 'hosico_cat'), m)
      client.sendReact(m.chat, '🕒', m.key)
      let json = await Api.ttstalk(args[0])
      if (!json.data) return client.reply(m.chat, global.status.fail, m)
      let caption = `乂  *T T - S T A L K*\n\n`
      caption += `	◦  *Name* : ${json.data.nickname}\n`
      caption += `	◦  *Username* : ${json.data.username}\n`
      //caption += `	◦  *Posts* : ${json.data.posts}\n`
      caption += `	◦  *Likes* : ${json.data.likes}\n`
      caption += `	◦  *Followers* : ${json.data.followers}\n`
      caption += `	◦  *Followings* : ${json.data.following}\n`
      caption += `	◦  *Bio* : ${json.data.bio}\n`
      caption += `	◦  *Private* : ${json.data.private ? '√' : '×'}\n`
      caption += `	◦  *Verified* : ${json.data.verified ? '√' : '×'}\n\n`
      caption += global.footer
      client.sendFile(m.chat, json.data.avatar, 'image.jpg', caption, m)
   } catch (e) {
      return client.reply(m.chat, e.message.toString(), m)
   }
}, {
   usage: ['ttstalk'],
   hidden: ['tiktokstalk'],
   use: 'username',
   category: 'features',
   limit: true
}, __filename)