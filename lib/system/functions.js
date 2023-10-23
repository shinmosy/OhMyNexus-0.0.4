const fetch = require('node-fetch'),
 FormData = require('form-data'),
 axios = require('axios'),
 { fromBuffer } = require('file-type'),
 { Function: Func } = new(require('@lanbott/lanbot-js'))
const Window = require('window');
const window = new Window()
 
Func.uploadToServer = (file, filename) => {
   return new Promise(async (resolve, reject) => {
      try {
         let form = new FormData
         form.append('berkas', file, filename)
         let json = await (await fetch(`${global.webdrive}upload.php`, {
            method: 'POST',
            body: form
         })).json()
         resolve(json)
      } catch (e) {
         console.log(e)
         return resolve({
            creator: global.creator,
            status: false
         })
      }
   })
}

Func.fibonacci = (x, y, number, opr) => {
   let value = [x, y]
   for (let i = 1; i <= number; i++) {
      const x1 = value[value.length - 2]
      const x2 = value[value.length - 1]
      value.push(eval(x1 + opr + x2))
   }
   return value
}

Func.Styles = (text, style = 1) => {
   var xStr = 'abcdefghijklmnopqrstuvwxyz1234567890'.split('')
   var yStr = Object.freeze({
      1: 'ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘqʀꜱᴛᴜᴠᴡxʏᴢ1234567890'
   })
   var replacer = []
   xStr.map((v, i) => replacer.push({
      original: v,
      convert: yStr[style].split('')[i]
   }))
   var str = text.toLowerCase().split('')
   var output = []
   str.map(v => {
      const find = replacer.find(x => x.original == v)
      find ? output.push(find.convert) : output.push(v)
   })
   return output.join('')
}

Func.arrayBufferToBase64 = (buffer) => {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return window.btoa(binary);
}