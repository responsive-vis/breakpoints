<script>
	import * as d3 from 'd3';

	import * as map from '$lib/data/uk-election/merged.json';
	import * as hex from '$lib/data/uk-election/test.hex.json';
	import { default as results } from '$lib/data/uk-election/HoC-GE2019-results-by-constituency-csv.csv';

	import ChoroplethMap from '$lib/components/ChoroplethMap.svelte';
	import HexMap from '$lib/components/HexMap.svelte';
	import WaffleChart from '$lib/components/WaffleChart.svelte';

	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	export let width, height;
	$: width;
	$: height;

	const categories = [
		'Con',
		'Lab',
		'SNP',
		'LD',
		'DUP',
		'SF',
		'PC',
		'SDLP',
		'Green',
		'Alliance',
		'Spk'
	];
	const colors = [
		'#0575c9',
		'#e91d0e',
		'#f8ed2e',
		'#efac18',
		'#b51c4b',
		'#159b78',
		'#13e594',
		'#224922',
		'#5fb25f',
		'#d6b429',
		'#d4cfbe'
	];
	const category_labels = [
		'Conservative',
		'Labour',
		'Scottish National Party',
		'Liberal Democrat',
		'Democratic Unionist Party',
		'Sinn Féin',
		'Plaid Cymru',
		'Social Democratic & Labour',
		'Green',
		'Alliance Party',
		'Speaker'
	];

	let colorScale = d3.scaleOrdinal().domain(categories).range(colors);

	let data = { map, hex, results };

	let params = {
		viewStates: [
			{
				type: ChoroplethMap,
				params: {
					colors: colors,
					category_labels: category_labels,
					title: 'UK General Election 2019',
					projection: d3.geoAlbers().rotate([0, 0]),
					map_id: (d) => d.properties.id,
					data_id: (d) => d.ons_id,
					colorScale: colorScale,
					values: (d) => d.first_party,
					conditions: {
						minAreaSize: 2,
						maxAspectRatioDiff: 2
					}
				}
			},
			{
				type: HexMap,
				params: {
					colors: colors,
					category_labels: category_labels,
					title: 'UK General Election 2019',
					colorScale: colorScale,
					conditions: {
						minHexSize: 5,
						maxAspectRatioDiff: 2
					}
				}
			},
			{ type: WaffleChart, params: { colorScale } }
		],
		initSize: { w: 700, h: 700 },
		minSize: { w: 150, h: 150 },

		// map: data[0],
		// hex: data[1],
		// data: data[2],
		categories: categories,

		collection: 'merged',

		hex_id: (d) => d.key

		// values: (d) => (d ? d.pct_rmn - d.pct_lev : undefined),
		// name: (feature) => feature.properties.HBName,
	};

	let viewLandscape, landscapeOverlay;
	$: viewLandscape, landscapeOverlay;
</script>

<StatusBar {width} {height} bind:landscapeOverlay />

<ResponsiveVis {data} {params} bind:width bind:height bind:viewLandscape>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
