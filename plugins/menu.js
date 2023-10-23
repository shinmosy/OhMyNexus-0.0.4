const { Converter } = new(require('@lanbott/lanbot-js'))
const { readFileSync: read, unlinkSync: remove, writeFileSync: create } = require('fs')
const path = require('path')
const { exec } = require('child_process')
const { tmpdir } = require('os')
const axios = require('axios')
const fs = require('fs')
const readmore = String.fromCharCode(8206).repeat(4001)
neoxr.create(async (m, {
   chats,
   command,
   Scraper, 
   client,
   text,
   prefix,
   Func
}) => {
   try {
   
   let Nexus = `╔. ■ .═════════════╗
╽◦ *voicechangermenu*   
┃◦ *userinfomenu*
┃◦ *textmakermenu*
┃◦ *searchingmenu*
┃◦ *ownermenu*
┃◦ *nsfwmenu*
┃◦ *miscsmenu*
┃◦ *imagemakermenu*
┃◦ *groupmenu*
┃◦ *gamemenu*
┃◦ *featuremenu*
┃◦ *adminmenu*
┃◦ *allmenu*
┃◦ *aimenu*
╿◦ *imagetoolsmenu*
╚═════════════. ■ .╝
`
                 let tek = `Nexus menu plan 📝`
                 let PO = `*MOHON TUNGGU!*\nnote: jika menu tidak muncul, mohon ulangi perintah!`
      client.reply(m.chat, PO, m).then(() => client.sendMessage(m.chat, {
      video: {url: 'https://pomf2.lain.la/f/w6vtgyn6.mp4'},
      gifPlayback: true,
      caption: Nexus,
      contextInfo: {
      externalAdReply: {
      title: tek,
      body: 'Advanced engine v3.5.1',
      thumbnailUrl: 'https://telegra.ph/file/f02511798bc638a249e5a.png',
      mediaType: 1,
      renderLargerThumbnail: true
      }}}, {quoted: m}))
           
        } catch (e) {
      client.reply(m.chat, Func.jsonFormat(e), m)
   }
}, {
   usage: ['menu'],
   hidden: ['command', 'tod', 'mek', 'help', '?', 'menutype']
}, __filename)       