import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'static-text',
		id: 'info',
		label: 'Information',
		value: 'This module will allow you to control the Tally indicator on an Arri Amira or Alexa camera',
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'Device IP',
		regex: Regex.HOSTNAME,
		required: true,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Device Port',
		default: '40000',
		regex: Regex.PORT,
		required: true,
	},
]
