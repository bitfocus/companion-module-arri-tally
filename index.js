// Arri Amira and Alexa Tally
import { InstanceBase, InstanceStatus, runEntrypoint, TCPHelper, UDPHelper } from '@companion-module/base'
import { ConfigFields } from './config.js'
import { updateActions } from './actions.js'

class ArriTally extends InstanceBase {
	constructor(internal) {
		super(internal)
	
		this.updateActions = updateActions.bind(this)
		// this.updateVariables = updateVariables.bind(this)
	}
	
	async init(config) {
		this.config = config

		this.updateActions()

		await this.configUpdated(config)
	}

	async configUpdated(config) {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.config = config

		this.init_tcp()
		this.init_tcp_variables()

	}

	async destroy() {
		if (this.socket) {
			this.socket.destroy()
		} else if (this.udp) {
			this.udp.destroy()
		} else {
			this.updateStatus(InstanceStatus.Disconnected)
		}
	}

	getConfigFields() {
		return ConfigFields
	}

	init_tcp() {
		console.log('initTCP ' + this.config.host + ':' + this.config.port)
		
		if (this.socket) {
			this.socket.destroy()
			delete this.socket
		}

		this.updateStatus(InstanceStatus.Connecting)

		if (this.config.host) {
			this.socket = new TCPHelper(this.config.host, this.config.port)

			this.socket.on('status_change', (status, message) => {
				this.updateStatus(status, message)
			})

			this.socket.on('error', (err) => {
				this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
				this.log('error', 'Network error: ' + err.message)
			})

			this.socket.on('data', (data) => {
				let dataResponse = data
				dataResponse = data.toString()
				this.log('debug', dataResponse)
				this.setVariableValues({ tcp_response: dataResponse.replace(/(\r\n|\n|\r)/gm, " ") })
			})
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}
	}
	
	sendCommand(cmd) {
		if (cmd !== undefined) {
			if (this.socket !== undefined && this.socket.isConnected) {
				this.log('debug', 'sending: ' + cmd)
				this.socket.send(cmd)
			} else {
				this.log('warn', 'Socket not connected')
			}
		}
	}

	init_tcp_variables() {
		this.setVariableDefinitions([{ name: 'Last Response', variableId: 'tcp_response' }])
		this.setVariableValues({ tcp_response: '' })
	}
}

runEntrypoint(ArriTally, [])

