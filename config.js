import { Regex } from '@companion-module/base'

export const ConfigFields = [
	{
		type: 'static-text',
		id: 'info',
		width: 12,
		label: 'Information',
		value: 'This module will allow you to control the Tally indicator on an Arri Amira or Alexa camera',
	},
	{
		type: 'textinput',
		id: 'host',
		label: 'Device IP',
		width: 6,
		regex: Regex.IP,
		required: true,
	},
	{
		type: 'textinput',
		id: 'port',
		label: 'Device Port',
		width: 6,
		default: '40000',
		regex: Regex.PORT,
		required: true,
	},
]
