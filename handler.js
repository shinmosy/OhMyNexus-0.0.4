"use strict";
const cron = require('node-cron'),
   fs = require('fs'),
   FormData = require('form-data'),
   axios = require('axios'),
   component = new(require('@lanbott/lanbot-js')),
   { execSync } = require('child_process'),
   { Function: Func, Logs, Scraper } = new(require('@lanbott/lanbot-js'))
require('./lib/system/functions')
const moment = require('moment-timezone')
moment.tz.setDefault(global.timezone).locale('id')
module.exports = async (client, m, store) => {
   try {
      require('./lib/system/schema')(m)
      const isOwner = [global.owner, ...global.db.setting.owners].map(v => v + '@s.whatsapp.net').includes(m.sender)
      const isPrem = (global.db.users.some(v => v.jid == m.sender) && global.db.users.find(v => v.jid == m.sender).premium) || isOwner
      const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat) : {}
      const participants = m.isGroup ? groupMetadata.participants : [] || []
      const adminList = m.isGroup ? await client.groupAdmin(m.chat) : [] || []
      const isAdmin = m.isGroup ? adminList.includes(m.sender) : false
      const isBotAdmin = m.isGroup ? adminList.includes((client.user.id.split`:` [0]) + '@s.whatsapp.net') : false
      const blockList = typeof await (await client.fetchBlocklist()) != 'undefined' ? await (await client.fetchBlocklist()) : []
      const groupSet = global.db.groups.find(v => v.jid == m.chat),
         chats = global.db.chats.find(v => v.jid == m.chat),
         users = global.db.users.find(v => v.jid == m.sender),
         setting = global.db.setting
      const body = typeof m.text == 'string' ? m.text : false
      if (setting.debug && !m.fromMe && isOwner) client.reply(m.chat, Func.jsonFormat(m), m)
      if (m.isGroup && !isBotAdmin) {
         groupSet.localonly = false
         groupSet.captcha = false
         groupSet.antibot = false
      }
      if (!m.fromMe && m.isGroup && groupSet.antibot && m.isBot && isBotAdmin && !isOwner) return m.reply(Func.texted('bold', `🚩 No other bots are allowed here.`)).then(async () => await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove'))
      if (!users) global.db.users.push({ jid: m.sender })
      if (m.isGroup && !groupSet.stay && (new Date * 1) >= groupSet.expired && groupSet.expired != 0) {
         return client.reply(m.chat, Func.texted('italic', '🚩 Bot time has expired and will leave from this group, thank you.', null, {
            mentions: participants.map(v => v.id)
         })).then(async () => {
            groupSet.expired = 0
            await Func.delay(2000).then(() => client.groupLeave(m.chat))
         })
      }
      if (users && (new Date * 1) >= users.expired && users.expired != 0) {
         return client.reply(users.jid, Func.texted('italic', '🚩 Your premium package has expired, thank you for buying and using our service.')).then(async () => {
            users.premium = false
            users.expired = 0
            users.limit = global.limit
         })
      }
      if (users) users.name = m.pushName
      if (users) users.lastseen = new Date() * 1
      if (chats) {
         chats.lastseen = new Date() * 1
         chats.chat += 1
      }
      if (m.isGroup && !m.isBot && users && users.afk > -1) {
         client.reply(m.chat, `You are back online after being offline for : ${Func.texted('bold', Func.toTime(new Date - users.afk))}\n\n➠ ${Func.texted('bold', 'Reason')} : ${users.afkReason ? users.afkReason : '-'}`, m)
         users.afk = -1
         users.afkReason = ''
         users.afkObj = {}
      }
      client.ev.on('presence.update', update => {
         const {
            id,
            presences
         } = update
         if (id.endsWith('g.us')) {
            for (let jid in presences) {
               if (!presences[jid] || jid == client.decodeJid(client.user.id)) continue
               if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && global.db.users.find(v => v.jid == jid) && global.db.users.find(v => v.jid == jid).afk > -1) {
                  client.reply(id, `System detects activity from @${jid.replace(/@.+/, '')} after being offline for : ${Func.texted('bold', Func.toTime(new Date - global.db.users.find(v => v.jid == jid).afk))}\n\n➠ ${Func.texted('bold', 'Reason')} : ${global.db.users.find(v => v.jid == jid).afkReason ? global.db.users.find(v => v.jid == jid).afkReason : '-'}`, global.db.users.find(v => v.jid == jid).afkObj)
                  global.db.users.find(v => v.jid == jid).afk = -1
                  global.db.users.find(v => v.jid == jid).afkReason = ''
                  global.db.users.find(v => v.jid == jid).afkObj = {}
               }
            }
         } else {}
      })
      if (m.isGroup && !m.fromMe) {
         let now = new Date() * 1
         if (!groupSet.member[m.sender]) {
            groupSet.member[m.sender] = {
               lastseen: now,
               warning: 0,
               chat: 1
            }
         } else {
            groupSet.member[m.sender].lastseen = now
            groupSet.member[m.sender].chat += 1
         }
      }
      if (!isOwner && !m.isGroup && !m.isBot && !m.fromMe && m.chat.endsWith('.net')) {
         if (/video|audio|image|document/.test(m.mtype) && m.mtype != 'protocolMessage') {
            let now = new Date * 1
            client.reply(global.forwards, Func.texted('bold', '[ ' + moment(now).format('DD/MM/YY') + ' ]') + ' ~ From : @' + m.sender.split`@` [0], m).then(async () => await client.copyNForward(global.forwards, m))
         }
      }
      if (!m.fromMe && !isOwner && m.isBot && m.mtype == 'audioMessage' && m.msg.ptt) return client.sendMessage(m.chat, {
         delete: {
            remoteJid: m.chat,
            fromMe: false,
            id: m.key.id,
            participant: m.sender
         }
      })
      cron.schedule('00 00 * * *', () => {
         setting.lastReset = new Date * 1
         global.db.users.filter(v => v.limit < global.limit && !v.premium).map(v => v.limit = global.limit)
         global.db.users.filter(v => v.limitGame < global.limitGame).map(v => v.limitGame = global.limitGame)
         Object.entries(global.db.statistic).map(([_, prop]) => prop.today = 0)
      }, {
         scheduled: true,
         timezone: global.timezone
      })
      const getPrefix = body ? body.charAt(0) : ''
      const prefix = (setting.multiprefix ? setting.prefix.includes(getPrefix) : setting.onlyprefix == getPrefix) ? getPrefix : undefined
      Logs(client, m, prefix) 
      if (m.isBot || m.chat.endsWith('broadcast')) return
      if (((m.isGroup && !groupSet.mute) || !m.isGroup) && !users.banned) {
         if (body && body == prefix) {
            if (m.isGroup && groupSet.mute || !isOwner) return
            let old = new Date()
            let banchat = setting.self ? true : false
            if (!banchat) {
               await client.reply(m.chat, Func.texted('bold', `Checking . . .`), m)
               return client.reply(m.chat, Func.texted('bold', `Response Speed: ${((new Date - old) * 1)}ms`), m)
            } else {
               await client.reply(m.chat, Func.texted('bold', `Checking . . .`), m)
               return client.reply(m.chat, Func.texted('bold', `Response Speed: ${((new Date - old) * 1)}ms (nonaktif)`), m)
            }
         }
      }
      const plugins = neoxr.plugins.filter(v => !setting.pluginDisable.includes(v.pluginName))
      const commands = plugins.filter(v => v.usage).map(v => v.usage).concat(plugins.filter(v => v.hidden).map(v => v.hidden)).flat(Infinity)
      const args = body && body.replace(prefix, '').split` `.filter(v => v)
      const command = args && args.shift().toLowerCase()
      const clean = body && body.replace(prefix, '').trim().split` `.slice(1)
      const text = clean ? clean.join` ` : undefined
      const prefixes = global.db.setting.multiprefix ? global.db.setting.prefix : [global.db.setting.onlyprefix]
      const matcher = Func.matcher(command, commands).filter(v => v.accuracy >= 60)
      if (prefix && !commands.includes(command) && matcher.length > 0 && !setting.self) {
         if (!m.isGroup || (m.isGroup && !groupSet.mute)) return client.reply(m.chat, `🚩 Command you are using is wrong, try the following recommendations :\n\n${matcher.map(v => '➠ *' + (prefix ? prefix : '') + v.string + '* (' + v.accuracy + '%)').join('\n')}`, m)
      }
      if (body && prefix && commands.includes(command) || body && !prefix && commands.includes(command) && setting.noprefix || body && !prefix && commands.includes(command) && global.evaluate_chars.includes(command)) {
         if (setting.error.includes(command) && (!setting.self || m.isGroup && groupSet.mute)) return client.reply(m.chat, Func.texted('bold', `🚩 Command _${(prefix ? prefix : '') + command}_ disabled.`), m)      
         try {
            if (new Date() * 1 - chats.command > (global.cooldown * 1000)) {
               chats.command = new Date() * 1
            } else {
               if (!m.fromMe && setting.antispam) return
            }
         } catch (e) {
            global.db.chats.push({
               jid: m.chat,
               chat: 1,
               lastchat: 0,
               lastseen: new Date() * 1,
               command: new Date() * 1
            })
         }
         if (commands.includes(command)) {
            users.hit += 1
            users.usebot = new Date() * 1
            Func.hitstat(command, m.sender)
         }
         if (!m.isGroup && global.blocks.some(no => m.sender.startsWith(no))) return client.updateBlockStatus(m.sender, 'block')
         neoxr.plugins.map(async cmd => {
            const turn = cmd.usage instanceof Array ? cmd.usage.includes(command) : cmd.usage instanceof String ? cmd.usage == command : false
            const turn_hidden = cmd.hidden instanceof Array ? cmd.hidden.includes(command) : cmd.hidden instanceof String ? cmd.hidden == command : false
            const name = cmd.pluginName
            if (!turn && !turn_hidden) return
            if (setting.self && !isOwner && !m.fromMe) return
            if (!m.isGroup && !['owner'].includes(name) && chats && !isPrem && !users.banned && new Date() * 1 - chats.lastchat < global.timer) return
            if (!m.isGroup && !['owner', 'confess', 'scan_jadibot', 'verify'].includes(name) && chats && !isPrem && !users.banned && setting.groupmode) return client.sendMessageModify(m.chat, `🚩 Using bot in private chat only for premium user, upgrade to premium plan only Rp. 5.000,- to get 1K limits for 1 month.\n\nIf you want to buy contact *${prefixes[0]}owner*`, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/0b32e0a0bb3b81fef9838.jpg'),
               url: setting.link
            }).then(() => chats.lastchat = new Date() * 1)
            if (!['me', 'owner', 'exec'].includes(name) && users && (users.banned || new Date - users.banTemp < global.timer)) return
            if (!['verify', 'exec'].includes(name) && !m.isGroup && users && !users.banned && !users.verified && setting.verify) users.attempt += 1
            let teks = `🚩 *[ ${users.attempt} / 5 ]* Verifikasi nomor dengan menggunakan email, 1 email untuk memverifikasi 1 nomor WhatsApp. Silahkan ikuti step by step berikut :\n\n– *STEP 1*\nGunakan perintah *${prefix ? prefix : ''}reg <email>* untuk mendapatkan kode verifikasi melalui email.\nContoh : *${prefix ? prefix : ''}reg emailmu@gmail.com*\n\n– *STEP 2*\nBuka email dan cek pesan masuk atau di folder spam, setelah kamu mendapat kode verifikasi silahkan kirim kode tersebut kepada bot.\n\n*Note* :\nMengabaikan pesan ini sebanyak *5x* kamu akan di banned dan di blokir, untuk membuka banned dan blokir dikenai biaya sebesar Rp. 10,000`
            if (users && !users.banned && !users.verified && users.attempt >= 5 && setting.verify) return client.reply(m.isGroup ? m.sender : m.chat, Func.texted('bold', `🚩 [ ${users.attempt} / 5 ] : Kamu mengabaikan pesan verifikasi tapi tenang masih ada bot lain kok, banned thanks. (^_^)`), m).then(() => {
               users.banned = true
               users.attempt = 0
               users.code = ''
               users.codeExpire = 0
               users.email = ''
               client.updateBlockStatus(m.sender, 'block')
            })
            if (!['verify', 'exec'].includes(name) && !m.isGroup && users && !users.banned && !users.verified && setting.verify) return client.sendMessageModify(m.isGroup ? m.sender : m.chat, teks, m, {
               largeThumb: true,
               thumbnail: await Func.fetchBuffer('https://telegra.ph/file/31601aee3fdf941bebbc4.jpg')
            })
            if (m.isGroup && !['activation', 'groupinfo', 'exec', 'makeAdmin'].includes(name) && groupSet.mute) return
           // if (m.isGroup && !isOwner && /chat.whatsapp.com/i.test(text)) return client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            if (cmd.owner && !isOwner) return client.reply(m.chat, global.status.owner, m)
            if (cmd.restrict && !isPrem && !isOwner && text && new RegExp('\\b' + global.db.setting.toxic.join('\\b|\\b') + '\\b').test(text.toLowerCase())) return client.reply(m.chat, `🚩 You violated the *Terms & Conditions* of using bots by using blacklisted keywords, as a penalty for your violation being blocked and banned. To unblock and unbanned you have to pay *Rp. 10,000,-*`, m).then(() => {
               users.banned = true
               client.updateBlockStatus(m.sender, 'block')
            })
            if (cmd.premium && !isPrem) return client.reply(m.chat, global.status.premium, m)
            if (cmd.limit && !cmd.game && users.limit < 1) return client.reply(m.chat, `🚩 Limit penggunaan bot mu sudah habis dan akan di reset pada pukul 00.00 WIB\n\nUntuk mendapatkan lebih banyak limit upgrade ke premium kirim *${prefixes[0]}premium*`, m).then(() => users.premium = false)
            if (cmd.limit && !cmd.game && users.limit > 0) {
               let limit = cmd.limit.constructor.name == 'Boolean' ? 1 : cmd.limit
               if (users.limit >= limit) {
                  users.limit -= limit
               } else return client.reply(m.chat, Func.texted('bold', `🚩 Your limit is not enough to use this feature.`), m)
            }
            if (cmd.limit && cmd.game && users.limitGame < 1) return client.reply(m.chat, `🚩 Your game limit has reached the limit will be reset at 00.00 WIB`, m)
            if (cmd.limit && cmd.game && users.limitGame > 0) {
               let limit = cmd.limit.constructor.name == 'Boolean' ? 1 : cmd.limit
               if (users.limitGame >= limit) {
                  users.limitGame -= limit
               } else return client.reply(m.chat, Func.texted('bold', `🚩 Your game limit is not enough to use this feature.`), m)
            }
            if (cmd.group && !m.isGroup) {
               client.reply(m.chat, global.status.group, m)
               return
            } else if (cmd.botAdmin && !isBotAdmin) {
               client.reply(m.chat, global.status.botAdmin, m)
               return
            } else if (cmd.admin && !isAdmin) {
               client.reply(m.chat, global.status.admin, m)
               return
            }
            if (cmd.private && m.isGroup) return client.reply(m.chat, global.status.private, m)
            if (cmd.game && !setting.games) {
               client.reply(m.chat, global.status.gameSystem, m)
               return
            }
            if (cmd.game && Func.level(users.point, global.multiplier)[0] >= 50) {
               client.reply(m.chat, global.status.gameLevel, m)
               return
            }
            if (cmd.game && m.isGroup && !groupSet.game) {
               client.reply(m.chat, global.status.gameInGroup, m)
               return
            }
            cmd.async(m, {
               client,
               args,
               text,
               prefix: prefix ? prefix : '',
               command,
               participants,
               blockList,
               isPrem,
               isOwner,
               isAdmin,
               isBotAdmin,
               users,
               chats,
               groupSet,
               setting,
               Func,
               Scraper,
               execSync,
               component,
               store
            })
         })
      } else {
         neoxr.plugins.filter(v => !v.usage && !v.hidden).map(async event => {
            let name = event.eventName
            if (setting.self && !isOwner && !m.fromMe) return
            if (!['system_ev'].includes(name) && users && (users.banned || new Date - users.banTemp < global.timer)) return
            if (!m.isGroup && setting.groupmode && !['system_ev', 'menfess_ev', 'chatbot', 'auto_download'].includes(name) && !isPrem) return
            if (event.download && m.isGroup && groupSet.mute) return
            if (event.owner && !isOwner) return
            if (event.group && !m.isGroup) return
            if (event.botAdmin && !isBotAdmin) return
            if (event.admin && !isAdmin) return
            if (event.private && m.isGroup) return
            if (event.limit && !event.game && users.limit < 1 && body && Func.generateLink(body) && Func.generateLink(body).some(v => Func.socmed(v))) return client.reply(m.chat, `🚩 Limit penggunaan bot mu sudah habis dan akan di reset pada pukul 00.00 WIB\n\nUntuk mendapatkan lebih banyak limit upgrade ke premium kirim *${prefixes[0]}premium*`, m).then(() => {
               users.premium = false
               users.expired = 0
            })
            if (event.limit && event.game && users.limitGame < 1 && body) return client.reply(m.chat, `🚩 Your limit game has reached the limit will be reset at 00.00 WIB.`, m)
            if (event.download && (!setting.autodownload || (body && global.evaluate_chars.some(v => body.startsWith(v))))) return
            if (event.game && !setting.games) return
            if (event.game && Func.level(users.point, global.multiplier)[0] >= 50) return
            if (event.game && m.isGroup && !groupSet.game) return
            event.async(m, {
               client,
               body,
               participants,
               prefixes,
               isOwner,
               isAdmin,
               isBotAdmin,
               users,
               chats,
               groupSet,
               groupMetadata,
               setting,
               Func,
               Scraper,
               store
            })
         })
      }
   } catch (e) {
      if (/(undefined|overlimit|timed|timeout|users|item|time)/ig.test(e.message)) return
      console.log(e)
     // if (!m.fromMe) return m.reply(Func.jsonFormat(new Error('LanBot encountered an error :' + e)))
   }
}

Func.reload(require.resolve(__filename))