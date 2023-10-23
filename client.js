"use strict";
require('./lib/system/config'), require('events').EventEmitter.defaultMaxListeners = 15
const { Extra, Function: Func, MongoDB, PostgreSQL } = new(require('@lanbott/lanbot-js'))
const { Socket, Serialize, Scandir } = Extra
const pino = require('pino'),
   spinnies = new (require('spinnies'))(),
   qrcode = require('qrcode-terminal'),
   stable = require('json-stable-stringify'),
   fs = require('fs'),
   chalk = require('chalk'),
   baileys = fs.existsSync('./node_modules/baileys') ? 'baileys' : fs.existsSync('./node_modules/@adiwajshing/baileys') ? '@adiwajshing/baileys' : 'bails'
const { DisconnectReason, useMultiFileAuthState, makeInMemoryStore, msgRetryCounterMap, delay, PHONENUMBER_MCC } = require(baileys)
if (process.env.DATABASE_URL && /mongo/.test(process.env.DATABASE_URL)) MongoDB.db = global.database
const machine = (process.env.DATABASE_URL && /mongo/.test(process.env.DATABASE_URL)) ? MongoDB : (process.env.DATABASE_URL && /postgres/.test(process.env.DATABASE_URL)) ? PostgreSQL : new(require('./lib/system/localdb'))(global.database)

const store = makeInMemoryStore({
   logger: pino().child({
      level: 'silent',
      stream: 'store'
   })
})

const connect = async () => { 
   const { state, saveCreds } = await useMultiFileAuthState('session')
   global.db = {users:[], chats:[], groups:[], bots:[], files:[], statistic:{}, sticker:{}, menfess:{}, captcha:{}, setting:{}, ...(await machine.fetch() ||{})}
   await machine.save(global.db)
   
   const config = JSON.parse(fs.readFileSync('./pairing.json', 'utf-8'))
   global.client = Socket({
      logger: pino({
         level: 'silent'
      }),
      printQRInTerminal: (config.pairing && config.pairing.state && config.pairing.number) ? false : true,
      patchMessageBeforeSending: (message) => {
         const requiresPatch = !!(
            message.buttonsMessage ||
            message.templateMessage ||
            message.listMessage
         );
         if (requiresPatch) {
            message = {
               viewOnceMessage: {
                  message: {
                     messageContextInfo: {
                        deviceListMetadataVersion: 2,
                        deviceListMetadata: {},
                     },
                     ...message,
                  },
               },
            };
         }
         return message;
      },
      browser: ['Chrome (Linux)', '', ''],
      auth: state,
      getMessage: async (key) => {
         if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg.message || undefined
         }
         return {
            conversation: 'hello'
         }
      },
      // To see the latest version : https://web.whatsapp.com/check-update?version=1&platform=web
      version: [2, 2323, 4]
   })

   store.bind(client.ev)
   spinnies.add('start', {
      text: 'Connecting . . .'
   })

   if (config.pairing && config.pairing.state && !client.authState.creds.registered) {
      var phoneNumber = config.pairing.number
      if (!Object.keys(PHONENUMBER_MCC).some(v => String(phoneNumber).startsWith(v))) {
         spinnies.fail('start', {
            text: `Invalid number, start with country code (Example : 62xxx)`
         })
         process.exit(0)
      }
      setTimeout(async () => {
         try {
            let code = await client.requestPairingCode(phoneNumber)
            code = code.match(/.{1,4}/g)?.join("-") || code
            console.log(chalk.black(chalk.bgGreen(` Your Pairing Code `)), ' : ' + chalk.black(chalk.white(code)))
         } catch {}
      }, 3000)
   }

   client.ev.on('connection.update', async (update) => {
      const {
         connection,
         lastDisconnect,
         qr
      } = update
      if (connection === 'open') {
         spinnies.succeed('start', {
            text: `Connected, you login as ${client.user.name || client.user.verifiedName || 'WhatsApp Bot'}`
         })
         await delay(1000)
         spinnies.add('start', {
            text: 'Load Plugins . . .'
         })
         const plugins = await Scandir('./plugins')
         plugins.filter(v => v.endsWith('.js')).map(file => require(file))
         await delay(1000)
         spinnies.succeed('start', {
            text: `${plugins.length} Plugins loaded`
         })
      } else if (connection === 'close') {
         if (lastDisconnect.error.output.statusCode == DisconnectReason.loggedOut) {
            spinnies.fail('start', {
               text: `Can't connect to Web Socket`
            })
            await machine.save()
            process.exit(0)
         } else {
            connect().catch(() => connect())
         }
      }
   })

   client.ev.on('creds.update', saveCreds)
   client.ev.on('messages.upsert', async chatUpdate => {
      try {
         let m = chatUpdate.messages[0]
         if (!m.message) return
         Serialize(client, m)
         require('./lib/system/schema')(m)
         if (!global.db.setting.online) client.sendPresenceUpdate('unavailable', m.chat)
         if (global.db.setting.online) {
            client.sendPresenceUpdate('available', m.chat)
            client.readMessages([m.key])
         }
         require('./lib/system/sys.js')(client), require('./lib/scraper'), require('./handler')(client, m, store)
      } catch (e) {
         console.log(e)
      }
   })

   client.ev.on('group-participants.update', async (room) => {
      let meta = await (await client.groupMetadata(room.id))
      let member = room.participants[0]
      let text_welcome = `Thanks +tag for joining into +grup group.`
      let text_left = `Good bye +tag :)`
      let groupSet = global.db.groups.find(v => v.jid == room.id)
      let pic
      try {
         pic = await Func.fetchBuffer(await client.profilePictureUrl(member, 'image'))
      } catch {
         pic = await Func.fetchBuffer(await client.profilePictureUrl(room.id, 'image'))
      }
      if (room.action == 'add') {
         if (groupSet && groupSet.localonly) {
            if (global.db.users.some(v => v.jid == member) && !global.db.users.find(v => v.jid == member).whitelist && !member.startsWith('62') || !member.startsWith('62')) {
               client.reply(room.id, Func.texted('bold', `Sorry @${member.split`@`[0]}, this group is only for indonesian people and you will removed automatically.`))
               client.updateBlockStatus(member, 'block')
               return await Func.delay(2000).then(() => client.groupParticipantsUpdate(room.id, [member], 'remove'))
            }
         }
         if (groupSet && groupSet.captcha) {
            const captcha = require('@lanbott/captcha')
            let newCaptcha = captcha()
            let image = Buffer.from(newCaptcha.image.split(',')[1], 'base64')
            let caption = `Hai @${member.split('@')[0]} 👋🏻\n`
            caption += `Selamat datang di grup ${meta.subject} sebelum melakukan aktifitas didalam grup lakukan VERIFIKASI dengan mengirimkan KODE CAPTCHA pada gambar diatas.\n\n`
            caption += `Timeout : [ 1 menit ]`
            global.db.captcha = global.db.captcha ? global.db.captcha : {}
            global.db.captcha[member] = {
               chat: await client.sendMessageModify(room.id, caption, null, {
                  largeThumb: true,
                  thumbnail: image,
                  url: global.db.setting.link
               }),
               to: member,
               groupId: room.id,
               code: newCaptcha.value,
               wrong: 0,
               timeout: setTimeout(() => {
                  if (global.db.captcha[member]) return client.reply(room.id, Func.texted('bold', `🚩 Member : [ @${member.split`@`[0]} ] did not verify.`)).then(async () => {
                     client.groupParticipantsUpdate(room.id, [member], 'remove')
                     delete global.db.captcha[member]
                  })
               }, 60_000)
            }
         }
         let txt = (groupSet.text_welcome != '' ? groupSet.text_welcome : text_welcome).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet && !groupSet.captcha && groupSet.welcome) client.sendMessageModify(room.id, txt, null, {
            largeThumb: true,
            thumbnail: pic,
            url: global.db.setting.link
         })
      } else if (room.action == 'remove') {
         let txt = (groupSet.text_left != '' ? groupSet.text_left : text_left).replace('+tag', `@${member.split`@`[0]}`).replace('+grup', `${meta.subject}`)
         if (groupSet.left) client.sendMessageModify(room.id, txt, null, {
            largeThumb: true,
            thumbnail: pic,
            url: global.db.setting.link
         })
      }
   })

   client.ws.on('CB:call', async json => {
      if (json.content[0].tag == 'offer') {
         let object = json.content[0].attrs['call-creator']
         await Func.delay(2000)
         await client.updateBlockStatus(object, 'block')
      }
   })

   client.ev.on('contacts.update', update => {
      for (let contact of update) {
         let id = client.decodeJid(contact.id)
         if (store && store.contacts) store.contacts[id] = {
            id,
            name: contact.notify
         }
      }
   })

   const ramCheck = setInterval(() => {
      var ramUsage = process.memoryUsage().rss
      if (ramUsage >= global.ram_usage) {
         clearInterval(ramCheck)
         process.send('reset')
      }
   }, 60 * 1000)

   setInterval(async () => {
      const tmpFiles = fs.readdirSync('./temp')
      if (tmpFiles.length > 0) {
         tmpFiles.map(v => fs.unlinkSync('./temp/' + v))
      }
      const storeFile = await Func.getFile('./session/neoxr_store.json')
      let chSize = Func.sizeLimit(storeFile.size, 2)
      if (chSize.oversize) {
         // fs.writeFileSync('./session/neoxr_store.json', stable({"chats":[],"contacts":{},"messages":{}}))
      }
   }, 60 * 1000 * 3)

   setInterval(async () => {
      if (global.db) await machine.save(global.db)
   }, 10_000)

   return client
}

connect().catch(() => connect())