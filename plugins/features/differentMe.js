const toJpg = require('lib/toJpg')
const axios = require("axios");
const fs = require("fs");
const FormData = require('form-data')

neoxr.create(async (m, {
      client,
      chats,
      command,
      prefix,
      text,
      Func,
      Scraper
   }) => {
      try { 
      	  let old = new Date()           
            if (!text) return client.reply(m.chat, Func.example(prefix, command, 'evil cat'), m)     
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Func.texted('bold', `🚩 Reply photo.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            let img = await q.download()
            
const queryParams = {
	style: text,
	json: true, // get json response instead of image bufferhttps://xzn.wtf/api/aitoonme?url=https://telegra.ph/file/890e70a7397b2e94db57f.png&apikey=onepunya
};

const form = new FormData();
form.append("file", img, "image.png");
// async/await
const { data } = await axios
	.request({
		baseURL: "https://api.itsrose.life",
		url: "/image/diffusion/txt2img",
		method: "POST",
		params: {
			...queryParams,
			apikey: 'Rk-f891079589ac250be221f1e3',
		},
		data: form,
	})
	.catch((e) => e?.["response"]);
const { status, message } = data; // any statusCode

if (!status) {
	
return client.reply(m.chat, message, m)
}
const { result } = data;
console.log(result);
          
     client.sendFile(m.chat, Buffer.from(result.base64Image, 'base64'), '.jpg', `ðŸŸ *Fetching* : ${((new Date - old) * 1)} ms`, m)

                
      } catch (e) {
         console.log(e)
         client.reply(m.chat, e, m)
      }
   }, {
   usage: ['txt'],
   hidden: ['diffme'],
   use: 'query',
   category: 'features',
   premium: true,
   limit: true
}, __filename)