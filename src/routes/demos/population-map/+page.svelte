<script>
	import * as d3 from 'd3';
	import StatusBar from '$lib/viz/StatusBar.svelte';

	import * as data from '/src/data/world_with_continent.json';
	import ResponsiveVis from '$lib/viz/ResponsiveVis.svelte';

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

	const colorContinent = (d) =>
		d3.scaleOrdinal().domain(continents).range(continent_colors)(d.continent);
	const circleColor = (d) =>
		d3.scaleOrdinal().domain(continents).range(continent_colors)(d.properties.continent);

	// configure legend
	const legendTickValues = [1000000, 100000000, 500000000, 1000000000];
	const legendTickFormat = (d, i) => ['1 million', '100 million', '500 million', '1 billion'][i];

	let params = {
		initSize: { w: 1000, h: 600 },
		maxSize: { w: 1000, h: 700 },
		title: 'World Population by Country',
		viewStates: {
			circleMap: {
				projection: d3.geoEqualEarth().rotate([-20, 0, 0]),
				circleColor: circleColor,
				legendTickValues: legendTickValues,
				legendTickFormat: legendTickFormat,
				conditions: {
					minCircleRadius: 1,
					maxAspectRatioDiff: 1.5
				}
			}
		}
	};
	// {
	// 	type: 'circleCartogram',
	// 	params: {
	// 		projection: d3.geoEqualEarth().rotate([-20, 0, 0]),
	// 		circleColor: circleColor,
	// 		legendTickValues: legendTickValues,
	// 		legendTickFormat: legendTickFormat,
	// 		legendPosLeft: 460,
	// 		conditions: {
	// 			minCircleRadius: 1,
	// 			maxAspectRatioDiff: 1.5
	// 		}
	// 	}
	// },
	// {
	// 	type: 'geoPackedCircles',
	// 	params: {
	// 		circleColor: colorContinent,
	// 		// can probably replace with a simple mercator
	// 		projection: d3.geoEqualEarth().rotate([-20, 0, 0])
	// 	}
	// }

	// 	map: geo
	// initialise responsive vis with parameters
	// vis = responsiveVis({
	// 	viewStates: [
	// 		{
	// 			type: 'circleMap',
	// 			params: {
	// 				projection: d3.geoEqualEarth().rotate([-20, 0, 0]),
	// 				circleColor: circleColor,
	// 				legendTickValues: legendTickValues,
	// 				legendTickFormat: legendTickFormat,
	// 				conditions: {
	// 					minCircleRadius: 1,
	// 					maxAspectRatioDiff: 1.5
	// 				}
	// 			}
	// 		},
	// 		{
	// 			type: 'circleCartogram',
	// 			params: {
	// 				projection: d3.geoEqualEarth().rotate([-20, 0, 0]),
	// 				circleColor: circleColor,
	// 				legendTickValues: legendTickValues,
	// 				legendTickFormat: legendTickFormat,
	// 				legendPosLeft: 460,
	// 				conditions: {
	// 					minCircleRadius: 1,
	// 					maxAspectRatioDiff: 1.5
	// 				}
	// 			}
	// 		},
	// 		{
	// 			type: 'geoPackedCircles',
	// 			params: {
	// 				circleColor: colorContinent,
	// 				// can probably replace with a simple mercator
	// 				projection: d3.geoEqualEarth().rotate([-20, 0, 0])
	// 			}
	// 		}
	// 	],
	// 	initSize: { w: 1000, h: 600 },
	// 	title: 'World Population by Country',
	// 	map: geo
	// 	// map: data[0],
	// 	// hex: data[1],
	// 	// data: data[2],
	// 	// categories: categories,
	// 	// colors: colors,
	// 	// category_labels: category_labels,
	// 	// collection: "merged",
	// 	// map_id: (d) => d.properties.id,
	// 	// hex_id: (d) => d.key,
	// 	// data_id: (d) => d.ons_id,
	// 	// colorScale: colorScale,
	// 	// values: (d) => d.first_party,
	// 	// values: (d) => (d ? d.pct_rmn - d.pct_lev : undefined),
	// 	// name: (feature) => feature.properties.HBName,
	// });

	// create landscape overlay + export button
	// const landscape = viewLandscape(vis);
	// createExportButton(landscape);
	// createLandscapeOverlay(landscape);
</script>

<!-- <slot /> -->
<StatusBar {width} {height} />

<ResponsiveVis {data} {params} bind:width bind:height />
