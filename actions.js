export function updateActions() {
	let actions = {}
	
	actions['tally'] = {
		name: 'Set Tally',
		options: [
			{
				type: 'dropdown',
				label: 'Action',
				id: 'tallyState',
				default: '0',
				choices: [
					{ id: '0', label: 'Off' },
					{ id: '1', label: 'Red' },
					{ id: '2', label: 'Green' },
				],
			},
		],
		callback: ({ options }) => {
			if (options.tallyState != '') {
				let cmd = 'tallyengage ' + options.tallyState + '\r\n'
				this.sendCommand(cmd)
			}
		},
	}
	this.setActionDefinitions(actions)
}
