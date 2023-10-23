const { NeoxrCommands: Commands, Function: Func } = new(require('@lanbott/lanbot-js'))
// Owner number
global.owner = '6282177779477'
// Owner name
global.owner_name = 'addykece'
// Database name (Default: database)
global.database = 'Epsilon'
// Ram Limiter (if your server ram is 1GB put 900MB in bytes, later the server will auto restart before using 1GB ram)
global.ram_usage = 600000000
// Maximum upload file size limit (Default : 50 MB)
global.max_upload = 50
// Delay for spamming protection (Default : 3 seconds)
global.cooldown = 3
// User Limitation (Default : 25)
global.limit = 200
// Multiplier (For Leveling)
global.multiplier = 7
// User Game Limitation (Default : 50)
global.limitGame = 10000
//point user
global.point = 0
// Time to be temporarily banned and others (Default : 30 minutes)
global.timer = 1800000
// Timeout (Default : 3 minutes)
global.timeout = 180000
// Symbols that are excluded when adding a prefix (Don't change it)
global.evaluate_chars = ['=>', '~>', '<', '>', '$']
// Country code that will be automatically blocked by the system, when sending messages in private chat
global.blocks = ['212']
// Official Group
global.group_jid = '6289676358643-120363156299252520@g.us'
// Put target jid to forward friends story
global.forwards = 'yournumber@c.us'
// Get neoxr apikey by registering at https://api.neoxr.my.id
global.Api = new (require('../neoxrApi'))(process.env.API_KEY)
// Min & Max for game reward
global.min_reward = 1000000
global.max_reward = 100000000
// Timezone (Default : Asia/Jakarta)
global.timezone = 'Asia/Jakarta'
// Bot version
global.version = '3.0.1',
// Bot name
global.botname = `OhMyNexus`
// Footer text
global.footer = 'Whatsapps by addykeceッ'
// Commands
global.neoxr = Commands
// Global status
global.status = Object.freeze({
   wait: Func.texted('bold', 'Dalam Proses . . .'),
   invalid: Func.texted('bold', 'URL tidak benar!'),
   wrong: Func.texted('bold', 'Format salah!'),
   getdata: Func.texted('bold', 'Mengambil Data . . .'),
   fail: Func.texted('bold', 'Gagal Mengambil Data!'),
   error: Func.texted('bold', 'Error'),
   errorF: Func.texted('bold', 'Maaf fitur ini masih error'),
   premium: Func.texted('bold', 'Fitur ini hanya bisa untuk yang sudah berlangganan Premium'),
   owner: Func.texted('bold', 'Perintah ini khusus owner'),
   god: Func.texted('bold', 'Perintah ini hanya bisa digunakan oleh Master'),
   group: Func.texted('bold', 'Perintah ini hanya bisa dilakukan pada Grup'),
   botAdmin: Func.texted('bold','Perintah ini bisa dilakukan ketika Bot menjadi admin'),
   admin: Func.texted('bold', 'Perintah ini bisa dilakukan oleh Admin'),
   private: Func.texted('bold', 'Gunakan perintah ini di di Privasi Chat dengan Bot'),
   gameSystem: Func.texted('bold', 'Game fitur dimatikan oleh system'),
   gameInGroup: Func.texted('bold', 'Game fitur dimatikan dalam group hidupkan Ketik:\n.game on'),
   gameLevel: Func.texted('bold', 'Kamu tidak bisa bermain game karena level kamu sudah maksimal')
})