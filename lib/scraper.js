const { Scraper } = new(require('@lanbott/lanbot-js'))
let creator = 'mr.one'
const fs = require('fs'),
   FormData = require('form-data'),
   axios = require('axios'),
   cheerio = require('cheerio'),
   fetch = require('node-fetch')
const ezgif = require('./rotate')

   
Scraper.pornDetector = buffer => {
   return new Promise(async resolve => {
      try {
         let form = new FormData()
         form.append('media', buffer)
         form.append('models', 'nudity-2.0,wad,gore')
         form.append('api_user', process.env.API_USER)
         form.append('api_secret', process.env.API_SECRET)
         let result = await axios.post('https://api.sightengine.com/1.0/check.json', form, {
            headers: form.getHeaders()
         })
         if (result.status == 200) {
            if (result.data.status == 'success') {
               if (result.data.nudity.sexual_activity >= 0.50 || result.data.nudity.suggestive >= 0.50 || result.data.nudity.erotica >= 0.50) return resolve({
                  creator: global.creator,
                  status: true,
                  msg: `Nudity Content : ${(result.data.nudity.sexual_activity >= 0.50 ? result.data.nudity.sexual_activity * 100 : result.data.nudity.suggestive >= 0.50 ? result.data.nudity.suggestive * 100 :  result.data.nudity.erotica >= 0.50 ? result.data.nudity.erotica * 100 : 0)}%`
               })
               if (result.data.weapon > 0.50) return resolve({
                  creator: global.creator,
                  status: true,
                  msg: `Provocative Content : ${result.data.weapon * 100}%`
               })
            } else return resolve({
               creator: global.creator,
               status: false
            })
         } else return resolve({
            creator: global.creator,
            status: false
         })
      } catch (e) {
         return resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
}

Scraper.rotate = async (url, type) => {
    const json = await ezgif(url, type)
    return json
}

Scraper.grammar = async (text, lang = 'en-US') => {
   return new Promise(async resolve => {
      try {
         let form = new URLSearchParams
         form.append('disabledRules', 'WHITESPACE_RULE')
         form.append('allowincompleteResults', 'true')
         form.append('text', text)
         form.append('language', lang)
         const json = await (await axios.post('https://grammarchecker.io/langtool', form, {
            headers: {
               "Accept": "*/*",
             "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
               "Referer": "https://grammarchecker.io/",
               "Referrer-Policy": "strict-origin-when-cross-origin"
            }
         })).data
         if (json.matches.length >= 1) return resolve({
            creator: global.creator,
            status: false,
            msg: json.matches[0].shortMessage
         })
         resolve({
            creator: global.creator,
            status: true,
            msg: 'Correct spelling'
         })
      } catch (e) {
         console.log(e)
         resolve({
            creator: global.creator,
            status: false,
            msg: e.message
         })
      }
   })
}
Scraper.shortli = async (url) => {
    return new Promise(async resolve => {
        try {
 fetch(`https://api.shrtco.de/v2/shorten?url=${url}`, {
    headers: {
        'Content-Type': 'application/json'
    }
}).then(response => response.json())
  .then(data => {
      resolve({
          creator: global.creator,
          status: true,
          msg: data.result.full_short_link2
  });
 })
        } catch (e) {
            resolve({
                creator: global.creator,
                status: false,
                msg: "gagal!!"
            })
            }
                    })
        
 }
 
 Scraper.text2img = async (text, eff, upscale, sampler, ratio, XprodiaKey) => {
      return new Promise(async (resolve) => {
         try {
            const options = {
  method: 'POST',
  url: 'https://api.prodia.com/v1/sd/generate',
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    'X-Prodia-Key': XprodiaKey
  },
  data: {
    model: eff,
    prompt: text,
    negative_prompt: 'canvas frame, cartoon, 3d, ((disfigured)), ((bad art)), ((deformed)),((extra limbs)),((close up)),((b&w)), weird colors, blurry, (((duplicate))), ((morbid)), ((mutilated)), [out of frame], extra fingers, mutated hands, ((poorly drawn hands)), ((poorly drawn face)), (((mutation))), (((deformed))), ((ugly)), blurry, ((bad anatomy)), (((bad proportions))), ((extra limbs)), cloned face, (((disfigured))), out of frame, ugly, extra limbs, (bad anatomy), gross proportions, (malformed limbs), ((missing arms)), ((missing legs)), (((extra arms))), (((extra legs))), mutated hands, (fused fingers), (too many fingers), (((long neck))), Photoshop, video game, ugly, tiling, poorly drawn hands, poorly drawn feet, poorly drawn face, out of frame, mutation, mutated, extra limbs, extra legs, extra arms, disfigured, deformed, cross-eye, body out of frame, blurry, bad art, bad anatomy, 3d render',
    steps: 25,
    cfg_scale: 7,
    seed: -1,
    upscale: upscale,
    sampler: sampler,
    aspect_ratio: ratio
  }
}
axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
    resolve({
               creator: creator,
               status: true,
               model: eff,
               steps: 25,
               cfg_scale: 7,
               seed: -1,
               upscale: upscale,
               sampler: sampler,
               aspect_ratio: ratio, 
               msg: `https://images.prodia.xyz/${response.data.job}.png`
            })
  })
  .catch(function (error) {
    console.error(error);
    resolve({
               creator: creator,
               status: false
            })
  });
            
         } catch (e) {
            console.log(e)
            return resolve({
               creator: creator,
               status: false
            })
         }
      })
   }
   
  Scraper.wikisearch = async (query) => {
	const res = await axios.get(`https://id.m.wikipedia.org/w/index.php?search=${query}`)
	const $ = cheerio.load(res.data)
	const hasil = []
	let wiki = $('#mf-section-0').find('p').text()
	let thumb = $('#mf-section-0').find('div > div > a > img').attr('src')
	thumb = thumb ? thumb : '//pngimg.com/uploads/wikipedia/wikipedia_PNG35.png'
	thumb = 'https:' + thumb
	let judul = $('h1#section_0').text()
	hasil.push({
		wiki,
	})
	return hasil
   }
    
  Scraper.model = async (url) => {
    return new Promise(async resolve => {
const options = {
  method: 'GET',
  url: 'https://api.prodia.com/v1/models/list',
  headers: {
    accept: 'application/json',
    'X-Prodia-Key': process.env.XPRODIAKEY
  }
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
    resolve({
        creator: global.creator,
        status: true,
         model: response.data
  })
})
  .catch(function (error) {
    console.error(error);
        resolve({
            creator: global.creator,
            status: false
        })
  });
    })
}

Scraper.rmbg = async (imageUrl) => {
    return new Promise(async resolve => {
        request.post({
            url: 'https://api.remove.bg/v1.0/removebg',
            formData: {
              image_url: imageUrl,
              size: 'auto',
            },
            headers: {
              'X-Api-Key': process.env.RMBGAPI
            },
            encoding: null
          }, function(error, response, body) {
            if(error) return console.error('Request failed:', error);
            if(response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
            let base64Image = new Buffer.from(body).toString('base64')
            resolve({
                status: true,
                image: base64Image
            })
          });
    })
}

Scraper.cai = async (text, chara) => {
    return new Promise(async resolve => {
const payloads = {
  message: text,
  character_id: chara
}

axios
	.request({
		baseURL: "https://api.itsrose.life",
		url: "/cai/chat",
		method: "POST",
		params: {
			apikey: process.env.ROSEKEY,
		},
		data: payloads,
	})
	.then((data) => {
		resolve(data.data)
	})
	.catch((error) => {
		console.log(error);
	});
    })
}

Scraper.deepFake = async (face, style) => {
    return new Promise(async resolve => {
        const payloads = {
  "init_image": face,
  "style": style
}

axios
	.request({
		baseURL: "https://api.itsrose.life",
		url: "/deep_fake/video",
		method: "POST",
		params: {
			apikey: process.env.ROSEKEY,
		},
		data: payloads,
	})
	.then((data) => {
		resolve(data.data)
	})
	.catch((error) => {
		console.log(error);
	});
    })
}
Scraper.sovits = async (text, model) => {
    return new Promise(async resolve => {
        const payloads = {
	text: text,
	model_id: model,
	cut_text: true,
}

axios
	.request({
		baseURL: "https://api.itsrose.life",
		url: "/sovits/inference",
		method: "POST",
		params: {
			apikey: process.env.ROSEKEY,
		},
		data: payloads,
	})
	.then((data) => {
		resolve(data.data)
	})
	.catch((e) => {
		console.log(e)
		   resolve({
               creator: 'mr.one',
               msg: e.response.data, 
               note: '*COBA GANTI PERTANYAAN, JIKA MASIH EROR SILAHKAN LAPOR OWNER!'
            })
	});
    })
}

Scraper.sovitsvoice = async (voiceID, inputText) => {
    return new Promise(async resolve => {
        const payloads = {
	   youtube_url: inputText,
       voice_id: voiceID,
}

axios
	.request({
		baseURL: "https://api.itsrose.life",
		url: "/sovits/inference_voice",
		method: "POST",
		params: {
			apikey: process.env.ROSEKEY,
		},
		data: payloads,
	})
	.then((data) => {
		resolve(data.data)
	})
	.catch((e) => {
		console.log(e)
		   resolve({
               status: false,
               msg: e.response.data
            })
	});
    })
}
Scraper.aimusic  = async (isprompt) => {
return new Promise(async resolve => {
        const payloads = {
        prompt: isprompt,
        duration: 30,
}
axios
	.request({
		baseURL: "https://api.itsrose.life",
		url: "/audio/music_ai",
		method: "POST",
		params: {
			apikey: process.env.ROSEKEY,
		},
		data: payloads,
	}).then((data) => {
		resolve(data.data)
	})
	.catch((e) => {
		console.log(e)
		   resolve({
               status: false,
               msg: e.response.data
            })
	});

        })
}
// https://api.azz.biz.id/api/alicia?q=nama%20mu%20siapa&user=one&key=mangea    
