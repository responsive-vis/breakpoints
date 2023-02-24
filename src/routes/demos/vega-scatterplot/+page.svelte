<script>
	import * as data from '$lib/data/movies/movies.json';

	// import VegaLiteWrapper from '$lib/components/VegaLiteWrapper.svelte';

	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	export let width, height;
	$: width;
	$: height;

	const vl_spec_scatterplot = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: {
			name: 'default'
		},
		width: 700,
		height: 700,
		mark: 'point',
		encoding: {
			x: { field: 'IMDB Rating', type: 'quantitative' },
			y: { field: 'Rotten Tomatoes Rating', type: 'quantitative' }
		}
	};

	const vl_spec_histogram_scatter = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: {
			name: 'default'
		},
		width: 400,
		height: 400,
		mark: 'circle',
		encoding: {
			x: {
				bin: { maxbins: 10 },
				field: 'IMDB Rating'
			},
			y: {
				bin: { maxbins: 10 },
				field: 'Rotten Tomatoes Rating'
			},
			size: {
				aggregate: 'count',
				legend: { orient: 'top-left' }
			}
		}
	};

	const vl_spec_histogram_heatmap = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: {
			name: 'default'
		},
		width: 200,
		height: 200,
		mark: 'rect',
		encoding: {
			x: {
				bin: { maxbins: 60 },
				field: 'IMDB Rating',
				type: 'quantitative'
			},
			y: {
				bin: { maxbins: 40 },
				field: 'Rotten Tomatoes Rating',
				type: 'quantitative'
			},
			color: {
				aggregate: 'count',
				type: 'quantitative',
				legend: { orient: 'top-left', direction: 'vertical', gradientLength: 100 }
			}
		},
		config: {
			view: {
				stroke: 'transparent'
			}
		}
	};

	// const spec = {
	// 	minSize: { w: 200, h: 200 },
	// 	maxSize: { w: 1000, h: 1000 },
	// 	initSize: { w: 800, h: 600 },
	// 	viewStates: [
	// 		{
	// 			type: VegaLiteWrapper,
	// 			data,
	// 			params: vl_spec_scatterplot,
	// 			conditions: {
	// 				maxOverplotting: 0.003
	// 			}
	// 		},
	// 		{
	// 			type: VegaLiteWrapper,
	// 			data,
	// 			params: vl_spec_histogram_scatter,
	// 			conditions: {
	// 				minWidth: 400
	// 			}
	// 		},
	// 		{
	// 			type: VegaLiteWrapper,
	// 			data,
	// 			params: vl_spec_histogram_heatmap,
	// 			conditions: {
	// 				minWidth: 50
	// 			}
	// 		}
	// 	]
	// };

	let viewLandscape, landscapeOverlay;
	$: viewLandscape, landscapeOverlay;
</script>

Under construction

<!-- <StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />

<ResponsiveVis {spec} bind:width bind:height bind:viewLandscape>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis> -->
