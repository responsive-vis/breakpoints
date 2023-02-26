<script>
	import * as d3 from 'd3';

	import * as data from '$lib/data/world-population/world_with_continent.json';

	import CircleMap from '$lib/components/CircleMap.svelte';
	import VegaLiteWrapper from '$lib/components/VegaLiteWrapper.svelte';

	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	export let width, height;
	$: width;
	$: height;

	// colors for circles/bars colored by continent
	const continents = [
		'North America',
		'Asia',
		'Oceania',
		'South America',
		'Europe',
		'Africa'
		// 'Antarctica'
	];
	const continent_colors = d3.schemeTableau10;

	const circleColor = (d) =>
		d3.scaleOrdinal().domain(continents).range(continent_colors)(d.properties.continent);

	// configure circle legend
	const legend = {
		1000000: '1 million',
		100000000: '100 million',
		500000000: '500 million',
		1000000000: '1 billion'
	};
	const legendTickFormat = (d) => legend[d];
	const legendTickValues = Object.keys(legend);

	// prep data for bar chart
	let barData = {
		default: data.features
			.map((d) => {
				return {
					adm: replace(d.properties.ADMIN),
					pop: d.properties.POP_EST,
					continent: d.properties.continent
				};
			})
			.sort((a, b) => b.pop - a.pop) // sort by population (descending order)
			.map((d, i) => {
				return { ...d, i }; // add index (for filtering most populous countries)
			})
	};
	// abbreviate some long country names to limit the space required for axes
	function replace(adm) {
		switch (adm) {
			case 'United States of America':
				return 'USA';
			case 'United Republic of Tanzania':
				return 'Tanzania';
			case 'Democratic Republic of the Congo':
				return 'DR Congo';
			default:
				return adm;
		}
	}

	// Vega Lite spec for bar charts (vertical + horizontal)
	let vl_barchart_vertical = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: { name: 'default' },
		height: { step: 17 },
		mark: 'bar',
		encoding: {
			x: {
				field: 'adm',
				type: 'ordinal',
				sort: '-y',
				axis: {
					labelAngle: -45,
					title: 'Country'
				}
			},
			y: {
				field: 'pop',
				type: 'quantitative',
				axis: {
					format: '.2s',
					title: 'Population'
				}
			},
			color: {
				field: 'continent',
				scale: { range: continent_colors, domain: continents },
				legend: { orient: 'top-right', title: null, offset: 5 }
			}
		}
	};
	let vl_barchart_horizontal = {
		$schema: 'https://vega.github.io/schema/vega-lite/v5.json',
		data: { name: 'default' },
		height: { step: 17 },
		mark: 'bar',
		encoding: {
			x: {
				field: 'pop',
				type: 'quantitative',
				axis: {
					format: '.2s',
					title: 'Population'
				}
			},
			y: {
				field: 'adm',
				type: 'ordinal',
				sort: '-x',
				axis: {
					labelAngle: 0,
					title: 'Country'
				}
			},
			color: {
				field: 'continent',
				scale: { range: continent_colors, domain: continents },
				legend: { orient: 'bottom-right', title: null, offset: 5 }
			}
		}
	};

	let spec = {
		initSize: { w: 1000, h: 600 },
		maxSize: { w: 1000, h: 700 },
		minSize: { w: 200, h: 200 },
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
					maxAspectRatioDiff: 3
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
					maxAspectRatioDiff: 3
				}
			},
			{
				type: VegaLiteWrapper,
				data: barData,
				params: {
					spec: vl_barchart_vertical,
					filter: (w, h) => {
						return `datum.i < ${(w - 20) / 20}`;
					}
				},
				conditions: {
					minAspectRatio: 1 // landscape format
				}
			},
			{
				type: VegaLiteWrapper,
				data: barData,
				params: {
					spec: vl_barchart_horizontal,
					filter: (w, h) => {
						return `datum.i < ${(h - 20) / 20}`;
					}
				},
				conditions: {}
			}
		]
	};

	let viewLandscape, landscapeOverlay;
	$: viewLandscape, landscapeOverlay;
</script>

<!-- <slot /> -->
<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />

<ResponsiveVis {spec} bind:width bind:height bind:viewLandscape>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
