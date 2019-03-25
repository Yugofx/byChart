import { DomBox, tail } from '../helpers';
import {
	trackPosition,
	trackResize,
	store,
	switchers,
	skeleton,
	initY,
	canvasRenderer,
	canvasWidth,
	moveCanvasX,
	yValueRangeForNSteps,
	xValueRange
} from './';
import { chartMax } from './grid';

export const draw = set => {
	const grid = yValueRangeForNSteps(6);
	const initX = xValueRange(set.x.values);

	const chartStore = store();
	chartStore.next({length: set.x.values.length});

	skeleton({
		parent: DomBox.for('.chart-wrapper'),
		title: set.title,
		gridLines: 6,
	})
		.switchToChild('.panel')
		.pushChildren(...switchers(set.line, data => chartStore.next({ data }, 'toggle')))
		.switchToParent('.chart')
		.switchToChild('.area')
		.map(area => trackPosition(area, left => chartStore.next({ left }, 'move')))
		.map(area => trackResize(area, ([width, left]) => chartStore.next({ width, left }, 'resize')))
		.switchToParent('.chart')
		.switchToChild('.monitor .map canvas')
		.map(mapCanvas => {
			canvasWidth(mapCanvas)(1);
			const render = canvasRenderer(mapCanvas, { lineWidth: 3 });
			chartStore.subscribe('toggle', (prev, next) =>
				render(next.data, chartMax(next.data, 0, next.length), next.length), true);
			return mapCanvas;
		})
		.switchToParent('.chart')
		.switchToChild('.grid-y')
		.map(yGrid => {
			const yAxis = initY(yGrid);
			chartStore.subscribe('*', (prev, next) =>
				yAxis([...tail(grid.range(next)), 0], grid.dir(next)), true);
			return yGrid;
		})
		.switchToParent('.chart')
		.switchToChild('.grid-x')
		.map(xGrid => {
			const xAxis = initX(xGrid);
			chartStore.subscribe('move', (prev, next) => xAxis.scroll(-next.left));
			chartStore.subscribe('resize', (prev, next) => xAxis.scale(next.left, next.width), true);
			return xGrid;
		})
		.switchToParent('.chart')
		.switchToChild('.view canvas')
		.map(chart => {
			const setWidth = canvasWidth(chart);
			const render = canvasRenderer(chart, { lineWidth: 2 });
			const moveTo = moveCanvasX(chart);
			chartStore.subscribe('resize', (prev, next) => {
				setWidth(next.width);
				moveTo(-next.left);
			}, true);
			chartStore.subscribe('move', (prev, next) => moveTo(-next.left));
			chartStore.subscribe('*', (prev, next) => render(next.data, grid.max(next), next.length), true);
		});
};