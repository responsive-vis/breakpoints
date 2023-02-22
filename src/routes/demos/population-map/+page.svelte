<script>
	import * as d3 from 'd3';

	import * as data from '$lib/data/world-population/world_with_continent.json';
	import CircleMap from '$lib/components/CircleMap.svelte';

	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	export let width, height;
	$: width;
	$: height;

	// colors for circles colored by continent
	const continents = [
		'North America',
		'Asia',
		'Oceania',
		'South America',
		'Europe',
		'Africa',
		'Antarctica'
	];
	const continent_colors = d3.schemeTableau10;

	const circleColor = (d) =>
		d3.scaleOrdinal().domain(continents).range(continent_colors)(d.properties.continent);

	// configure legend
	const legend = {
		1000000: '1 million',
		100000000: '100 million',
		500000000: '500 million',
		1000000000: '1 billion'
	};
	const legendTickFormat = (d) => legend[d];
	const legendTickValues = Object.keys(legend);

	let spec = {
		initSize: { w: 1000, h: 600 },
		maxSize: { w: 1000, h: 700 },
		viewStates: [
			{
				type: CircleMap, // configured as proportional circle map
				data,
				params: {
					title: 'World Population by Country',
					projection: d3.geoEqualEarth().rotate([-20, 0, 0]),
					circleColor: circleColor,
					legendTickValues: legendTickValues,
					legendTickFormat: legendTickFormat
				},
				conditions: {
					minCircleRadius: 1,
					maxAspectRatioDiff: 1.5
				}
			},
			{
				type: CircleMap, // configured as Dorling
				data,
				params: {
					title: 'World Population by Country',
					dorling: true,
					projection: d3.geoEqualEarth().rotate([-20, 0, 0]),
					circleColor: circleColor,
					legendTickValues: legendTickValues,
					legendTickFormat: legendTickFormat
				},
				conditions: {
					minCircleRadius: 1,
					maxAspectRatioDiff: 1.5
				}
			}
		]
	};

	// {
	// 	type: 'geoPackedCircles',
	// 	params: {
	// 		circleColor: colorContinent,
	// 		// can probably replace with a simple mercator
	// 		projection: d3.geoEqualEarth().rotate([-20, 0, 0])
	// 	}
	// }

	let viewLandscape, landscapeOverlay;
	$: viewLandscape, landscapeOverlay;
</script>

<!-- <slot /> -->
<StatusBar {width} {height} bind:landscapeOverlay />

<ResponsiveVis {spec} bind:width bind:height bind:viewLandscape>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
