<script>
	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	import { default as marieboucher } from '$lib/data/marie-boucher/marieboucher.csv';
	import * as links from '$lib/data/les-mis/les-mis-links.json';
	import * as nodes from '$lib/data/les-mis/les-mis-links.json';

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

	let networkSpec3 = {
		data: [
			{
				name: 'nodes',
				values: nodes
			},
			{
				name: 'links',
				values: links
			}
		],
		networks: [
			{
				name: 'le-mis-network',
				nodes: 'nodes',
				links: 'links',
				directed: true,
				source_node: ['id', 'source'],
				target_node: ['id', 'target']
			}
		],
		layouts: [
			{
				name: 'le-mis-layout',
				network: 'le-mis-network',
				type: 'd3-force'
			}
		],
		vis: [
			{
				entries: 'le-mis-network.links',
				layout: 'le-mis-layout',
				mark: {
					type: 'linkpath',
					start: 'source',
					end: 'target'
				}
			},
			{
				entries: 'le-mis-network.nodes',
				layout: 'le-mis-layout',
				mark: {
					type: 'circle'
				}
			}
		]
	};

	let networkSpec4 = {
		x: 500, // makes spaces for arcs on the left

		data: [
			{
				name: 'nodes',
				values: nodes
			},
			{
				name: 'links',
				values: links
			}
		],

		networks: [
			{
				name: 'le-mis-network',
				nodes: 'nodes',
				links: 'links',
				directed: true,
				source_node: ['id', 'source'],
				target_node: ['id', 'target'],
				metrics: [{ metric: 'degree' }]
			}
		],

		scales: [
			{
				name: 'radius',
				type: 'linear',
				range: [1, 200],
				domain: { data: 'le-mis-network.nodes', field: 'degree' }
			},
			{
				name: 'color',
				type: 'linear',
				scheme: 'reds',
				domain: { data: 'le-mis-network.nodes', field: 'degree' }
			}
		],

		orderings: [
			{
				name: 'degree_order',
				data: 'le-mis-network.nodes',
				orderBy: 'degree'
			}
		],

		layouts: [
			{
				name: 'le-mis-layout',
				data: 'le-mis-network.nodes',
				pattern: 'linear',
				order: 'degree_order',
				orientation: 'vertical'
			}
		],

		vis: [
			{
				entries: 'le-mis-network.links',
				layout: 'le-mis-layout',
				mark: {
					type: 'linkpath',
					start: 'source',
					end: 'target',
					shape: 'arc',
					directionForShape: { ordering: 'degree_order' }
				}
			},

			{
				entries: 'le-mis-network.nodes',
				layout: 'le-mis-layout',

				mark: {
					type: 'circle',
					area: { field: 'degree', scale: 'radius' },
					fill: { field: 'degree', scale: 'color' },
					tooltip: { field: 'name' }
				}
			},

			{
				entries: 'le-mis-network.nodes',
				layout: 'le-mis-layout',

				mark: {
					type: 'text',
					text: { field: 'name' },
					dx: 10,
					dy: 4
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
