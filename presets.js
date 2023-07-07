import { combineRgb } from '@companion-module/base'

export function updatePresets() {
	let presets = {}
	
	presets['Off'] = {
		type: 'button',
		category: 'Tally',
		name: 'Off',
		style: {
			text: 'Off',
			size: '18',
			color: combineRgb(255, 255, 255),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'tally',
						options: {
							tallyState: '0',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Red'] = {
		type: 'button',
		category: 'Tally',
		name: 'Red',
		style: {
			text: 'Red',
			size: '18',
			color: combineRgb(255, 0, 0),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'tally',
						options: {
							tallyState: '1',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	presets['Green'] = {
		type: 'button',
		category: 'Tally',
		name: 'Green',
		style: {
			text: 'Green',
			size: '18',
			color: combineRgb(0, 255, 0),
			bgcolor: combineRgb(0, 0, 0),
		},
		steps: [
			{
				down: [
					{
						actionId: 'tally',
						options: {
							tallyState: '2',
						},
					},
				],
				up: [],
			},
		],
		feedbacks: [],
	}

	this.setPresetDefinitions(presets)
}
