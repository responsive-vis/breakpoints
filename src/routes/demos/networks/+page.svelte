<script>
	import StatusBar from '$lib/components/StatusBar.svelte';
	import ViewLandscapeOverlay from '$lib/components/ViewLandscapeOverlay.svelte';
	import ResponsiveVis from '$lib/components/ResponsiveVis.svelte';

	import { default as marieboucher } from '$lib/data/marie-boucher/marieboucher.csv';
	import * as links from '$lib/data/les-mis/les-mis-links.json';
	import * as nodes from '$lib/data/les-mis/les-mis-nodes.json';

	import NetPanorama from '$lib/components/NetPanorama.svelte';

	export let width, height;
	$: width;
	$: height;

	// user can select a dataset using the dropdown menu
	const datasets = {
		marieboucher: {
			label: 'Marie Boucher',
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
			]
		},
		lesmis: {
			label: 'Les Mis',
			data: [
				{
					name: 'nodes',
					values: nodes.default
				},
				{
					name: 'links',
					values: links.default
				}
			],
			networks: [
				{
					name: 'network',
					nodes: 'nodes',
					links: 'links',
					directed: true,
					source_node: ['id', 'source'],
					target_node: ['id', 'target'],
					metrics: [{ metric: 'degree' }]
				}
			]
		}
	};
	const datasetsKeys = Object.keys(datasets);
	let selectedDataset = 'lesmis';
	$: console.log('Dataset updated: ', selectedDataset);

	// based on: https://netpanorama-editor.netlify.app/#marie-boucher
	$: spec_nodelink = {
		data: datasets[selectedDataset].data,
		networks: datasets[selectedDataset].networks,
		layouts: [
			{
				name: 'layout',
				network: 'network',
				type: 'd3-force'
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

	// based on: https://netpanorama-editor.netlify.app/#arc-diagram
	$: spec_arcdiagram = {
		x: 500, // makes spaces for arcs on the left
		data: datasets[selectedDataset].data,
		networks: datasets[selectedDataset].networks,
		scales: [
			{
				name: 'radius',
				type: 'linear',
				range: [1, 200],
				domain: { data: 'network.nodes', field: 'degree' }
			},
			{
				name: 'color',
				type: 'linear',
				scheme: 'reds',
				domain: { data: 'network.nodes', field: 'degree' }
			}
		],
		orderings: [
			{
				name: 'degree_order',
				data: 'network.nodes',
				orderBy: 'degree'
			}
		],
		layouts: [
			{
				name: 'layout',
				data: 'network.nodes',
				pattern: 'linear',
				order: 'degree_order',
				orientation: 'vertical'
			}
		],
		vis: [
			{
				entries: 'network.links',
				layout: 'layout',
				mark: {
					type: 'linkpath',
					start: 'source',
					end: 'target',
					shape: 'arc',
					directionForShape: { ordering: 'degree_order' }
				}
			},
			{
				entries: 'network.nodes',
				layout: 'layout',

				mark: {
					type: 'circle',
					area: { field: 'degree', scale: 'radius' },
					fill: { field: 'degree', scale: 'color' },
					tooltip: { field: 'name' }
				}
			},
			{
				entries: 'network.nodes',
				layout: 'layout',

				mark: {
					type: 'text',
					text: { field: 'name' },
					dx: 10,
					dy: 4
				}
			}
		]
	};

	$: spec = {
		views: [
			{
				type: NetPanorama,
				data: null, // data is included in params
				params: { data: selectedDataset, spec: spec_nodelink },
				conditions: { minWidth: 600 }
			},
			{
				type: NetPanorama,
				data: null, // data is included in params
				params: { data: selectedDataset, spec: spec_arcdiagram },
				conditions: {}
			}
		]
	};

	// $: selectedSpec = specs[selectedDataset];
	// $: selectedDataset;

	let viewLandscape, landscapeOverlay;
	$: viewLandscape, landscapeOverlay;
</script>

<StatusBar {width} {height} bind:landscapeOverlay bind:viewLandscape />
<span style="color: red">Under construction...</span><br />
Select dataset:
<select bind:value={selectedDataset}>
	{#each datasetsKeys as dataset}
		<option value={dataset}>
			{datasets[dataset].label}
		</option>
	{/each}
</select>

<ResponsiveVis {spec} bind:width bind:height bind:viewLandscape>
	{#if viewLandscape && landscapeOverlay}
		<ViewLandscapeOverlay {viewLandscape} />
	{/if}
</ResponsiveVis>
