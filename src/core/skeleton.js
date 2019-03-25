import { DomBox } from '../helpers/DomBox';

export const skeleton = ({parent, title, gridLines}) =>
	DomBox.from('div').addClasses('chart')
		.pushChildren(
			DomBox.from('h1').addClasses('title')
				.setAttribute('padding-horizontal', true)
				.setText(title),
			DomBox.from('div').addClasses('view')
				.setAttribute('padding-horizontal', true)
				.pushChildren(
					DomBox.from('canvas').setAttribute('height', 500),
					DomBox.from('div').addClasses('grid')
						.setAttribute('padding-horizontal', true)
						.pushChildren(
							DomBox.from('div').addClasses('grid-y')
								.pushChildren(
									...Array.from({length: gridLines},
										() => DomBox.from('div').addClasses('grid-y-row'))
								),
							DomBox.from('div').addClasses('grid-x'),
						)
				),
			DomBox.from('div').addClasses('monitor')
				.setAttribute('padding-horizontal', true)
				.pushChildren(
					DomBox.from('div').addClasses('map')
						.pushChildren(
							DomBox.from('canvas').setAttribute('height', 125),
							DomBox.from('div').addClasses('viewport')
								.pushChildren(
									DomBox.from('div').addClasses('area')
										.pushChildren(
											DomBox.from('div').addClasses('area-resize'),
											DomBox.from('div').addClasses('area-resize'),
										)
								)
						)
				),
			DomBox.from('div').addClasses('panel')
				.setAttribute('padding-horizontal', true)
		)
	.insertIn(parent);