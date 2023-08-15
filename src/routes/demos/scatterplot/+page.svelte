<script>
	import * as data from '$lib/data/movies/movies.json';

	import { base } from '$app/paths';

	import VegaLiteWrapper from '$lib/components/VegaLiteWrapper.svelte';

	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	export let width, height;
	$: width;
	$: height;

	const vl_spec_scatterplot = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: {
			values: data.default
		},
		mark: 'point',
		encoding: {
			x: { field: 'IMDB Rating', type: 'quantitative' },
			y: { field: 'Rotten Tomatoes Rating', type: 'quantitative' }
		}
	};

	const vl_spec_histogram_heatmap = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: {
			values: data.default
		},
		mark: 'rect',
		encoding: {
			x: {
				bin: { maxbins: 60 },
				field: 'IMDB Rating',
				type: 'quantitative',
				axis: { title: 'IMDB Rating' }
			},
			y: {
				bin: { maxbins: 40 },
				field: 'Rotten Tomatoes Rating',
				type: 'quantitative',
				axis: { title: 'Rotten Tomatoes Rating' }
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

	const spec = {
		minSize: { w: 200, h: 200 },
		maxSize: { w: 1000, h: 800 },
		initSize: { w: 800, h: 600 },
		views: [
			{
				type: VegaLiteWrapper,
				data,
				params: { spec: vl_spec_scatterplot },
				conditions: {
					maxOverplotting: 0.009
					// minWidth: 400
				}
			},
			// {
			// 	type: VegaLiteWrapper,
			// 	data,
			// 	params: { spec: vl_spec_histogram_scatter },
			// 	conditions: {
			// 		minWidth: 400
			// 	}
			// },
			{
				type: VegaLiteWrapper,
				data,
				params: { spec: vl_spec_histogram_heatmap },
				conditions: {
					// minWidth: 50
				}
			}
		]
	};

	let viewLandscape = {
		mode: 'static',
		imgSrc: `${base}/img/scatterplot_view_landscape.png`,
		size: [spec.maxSize.w, spec.maxSize.h]
	};
	let landscapeOverlay;
	$: landscapeOverlay;
</script>

<svelte:head>
	<title>Data-Driven Breakpoints | Movies Scatterplot</title>
</svelte:head>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />

<ResponsiveVis {spec} computeViewLandscape={false} bind:width bind:height bind:viewLandscape>
	{#if landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
