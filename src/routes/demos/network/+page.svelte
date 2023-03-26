<script>
	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	import { default as marieboucher } from '$lib/data/marie-boucher/marieboucher.csv';
	import NetPanorama from '$lib/components/NetPanorama.svelte';

	export let width, height;
	$: width;
	$: height;

	// console.log(marieboucher);

	let networkSpec1 = {
		data: [
			{
				name: 'marieboucher',
				values: marieboucher
			}
		],

		networks: [
			{
				name: 'network',
				parts: [
					{
						data: 'marieboucher',
						yieldsLinks: [
							{
								source_id: { field: 'Name1' },
								source_node_type: 'person',
								source_id_field: 'id',

								target_id: { field: 'Name2' },
								target_node_type: 'person',
								target_id_field: 'id',

								data: ['*']
							}
						]
					}
				],
				transform: [{ type: 'metric', metric: 'degree' }]
			}
		],

		layouts: [
			{
				name: 'layout',
				network: 'network',
				type: 'webcola',
				avoidOverlap: true
			}
		],

		scales: [
			{
				name: 'radius',
				type: 'linear',
				range: [1, 500],
				domain: { data: 'network.nodes', field: 'degree' }
			},
			{
				name: 'color',
				type: 'linear',
				scheme: 'reds',
				domain: { data: 'network.nodes', field: 'degree' }
			}
		],

		vis: [
			{
				entries: 'network.links',
				layout: 'layout',
				mark: {
					type: 'linkpath',
					start: 'source',
					end: 'target'
				}
			},
			{
				entries: 'network.nodes',
				layout: 'layout',
				mark: {
					type: 'circle',
					area: { field: 'degree', scale: 'radius' },
					fill: { field: 'degree', scale: 'color' },
					tooltip: { expression: "datum.id + ' (degree ' + datum.degree + ')' " }
				}
			}
		]
	};

	let spec = {
		views: [
			{
				type: NetPanorama,
				data: null, // data is included in params
				params: networkSpec1,
				conditions: {}
			}
		]
	};

	let viewLandscape, landscapeOverlay;
	$: viewLandscape, landscapeOverlay;
</script>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />

<ResponsiveVis {spec} bind:width bind:height bind:viewLandscape>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
