<script>
	export let data, params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	import { VegaLite } from 'svelte-vega';
	import { scaleLinear } from 'd3';
	import { dist } from '$lib/helpers.js';

	// size of container
	$: height = context.height;
	$: width = context.width;

	// size of 'data rectangle' of chart (allow space for axes)
	$: data_width = width - 50;
	$: data_height = height - 50;

	// CONDITIONS
	// compute overplotting
	const ratings = data.default
		.map((d) => {
			return [d['Rotten Tomatoes Rating'], d['IMDB Rating']];
		}) // get ratings
		.filter((d) => d[0] !== null && d[1] !== null); // filter out instances where at least one of them is null
	const radius = 3.09; // default size of vega-lite circle is 30, i.e. radius of 3.09

	function computeOverplotting(pos, r, w, h) {
		// recreate scales used internally in vega
		let x = scaleLinear().domain([0, 10]).range([0, w]);
		let y = scaleLinear().domain([0, 100]).range([0, h]);

		// apply scales
		let positions = pos.map((d) => {
			return [x(d[0]), y(d[1])];
		});
		let overplotting = 0;
		let total = 0;
		// for each complete data point, check how many others it overlaps with
		for (let i = 0; i < positions.length; i++) {
			// check only starting at the current index so we don't overcount
			// +1 to skip itself
			for (let j = i + 1; j < positions.length; j++) {
				// get distance between the two points at i and j
				let d = dist(positions[i], positions[j]);

				// get value between 0 and 1 for amount of overlap
				// 1 = identical positions; 0 = no overlap
				let overlap = d < 2 * r ? (2 * r - d) / (2 * r) : 0;
				overplotting += overlap;
				total += 1;
			}
		}
		return overplotting / total;
	}

	// console.log(ratings);

	// console.log(x, y);

	// console.log(positions);

	// console.log(overplotting);

	///////////

	let options = { renderer: 'svg' };

	$: spec = {
		...params,
		padding: { left: 5, right: 5, top: 5, bottom: 5 },
		width: data_width,
		height: data_height
	};

	$: display;

	checkConditions = function (w, h) {
		// console.log(!conditions.maxOverplotting);
		// console.log(computeOverplotting(ratings, radius, w - 500, h - 500));
		// overplotting (scatterplots)
		let c1 = conditions.maxOverplotting
			? computeOverplotting(ratings, radius, w - 500, h - 500) < conditions.maxOverplotting
			: true;
		return c1;
	};
</script>

{#if display}
	<VegaLite {data} {spec} {options} />
{/if}
