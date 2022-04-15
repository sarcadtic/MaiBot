const {
	default: makeWASocket,
	useSingleFileAuthState,
	DisconnectReason,
} = require('@adiwajshing/baileys')
const fs = require('fs')
const P = require('pino')
const qrcode = require('qrcode-terminal')

const { state, saveState } = useSingleFileAuthState('./session.json')

const start = () => {
	const conn = makeWASocket({
		logger: P({ level: 'silent' }),
		printQRInTerminal: true,
		auth: state,
	})
	
	conn.ev.on('connection.update', (update) => {
		const { connection, lastDisconnect } = update
		if (connection === 'close') {
			lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log('El bot ha sido desconectado')
		} else if (connection === 'open') {
			console.log('Bot conectado')
		}
	})
	
	conn.ev.on('creds.update', saveState)
}

start()
