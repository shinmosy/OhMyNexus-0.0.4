const canvacord = require('canvacord')
neoxr.create(async (m, {
   client,
   users,
   Func
}) => {
   try {
      pic = await client.profilePictureUrl(m.sender, 'image')
   } catch {
      pic = 'https://telegra.ph/file/8937de46430b0e4141a1c.jpg'
   }
   const point = global.db.users.sort((a, b) => b.point - a.point).map(v => v.jid)
   const rank = new canvacord.Rank()
      .setRank(point.indexOf(m.sender) + 1)
      .setLevel(Func.level(users.point)[0])
      .setAvatar(pic)
      .setCurrentXP(users.point)
      .setRequiredXP(Func.level(users.point)[1])
      .setStatus('online')
      .setProgressBar('#FFFFFF', 'COLOR')
      .setUsername(m.pushName)
      .setDiscriminator(Func.randomInt(1000, 9999))
   client.sendFile(m.chat, await rank.build(), 'level.jpg', Func.texted('bold', `🚩 To raise the level you have to get more points, you can get points by playing games.`), m)
}, {
   usage: ['level'],
   category: 'user info'
}, __filename)