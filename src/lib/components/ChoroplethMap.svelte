<script>
	export let data, params, context; // provided by responsive vis component
	export let conditions, checkConditions, display; // exported for use in responsive vis component

	import * as d3 from 'd3';
	import * as topojson from 'topojson-client';

	import { fitRect, getAreaSize } from '$lib/helpers.js';
	import FillLegend from '$lib/components/FillLegend.svelte';
	// import Tooltip from '$lib/components/Tooltip.svelte';

	$: height = context.height;
	$: width = context.width;
	$: display;

	const spec = context.spec;

	const topo = data.map;
	const results = data.results;

	// prepare data: convert topojson to geojson (individual area polygons)
	const geo = topojson.feature(topo, topo.objects.merged); //params.collection
	// create mesh for drawing outlines
	const mesh = topojson.mesh(topo);

	// fit projection to container + geo data
	const initW = 500;
	const initH = 500;
	const projection = params.projection;
	projection.fitSize([initW, initH], mesh);
	const path = d3.geoPath(projection);

	// get bounds
	const bounds = path.bounds(mesh);
	const mapAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);

	const mapInitSize =
		initW / initH < mapAR
			? { width: initW, height: initW / mapAR }
			: { width: initH * mapAR, height: initH };

	// get area sizes
	geo.features.forEach((feature) => {
		feature.area = getAreaSize(feature, path);
		return feature;
	});

	// get smallest area
	let filterFunc =
		typeof params.conditions.minAreaFilter === 'function'
			? params.conditions.minAreaFilter
			: (d) => true;
	const minArea = d3.min(geo.features.filter(filterFunc), (d) => d.area);

	// compute scale and translate
	let s, t;
	$: ({ s, t } = fitRect([mapInitSize.width, mapInitSize.height], [width, height]));

	// $: console.log(s, minArea);

	checkConditions = function (w, h) {
		// using constants: mapAR, mapInitSize, minArea
		let ar = w / h; // aspect ratio of container
		let s = mapAR > w / h ? w / mapInitSize.width : h / mapInitSize.height;
		return (
			minArea * Math.pow(s, 2) > params.conditions.minAreaSize &&
			// aspect ratio difference
			ar / mapAR >= 1 / params.conditions.maxAspectRatioDiff &&
			ar / mapAR <= params.conditions.maxAspectRatioDiff
		);
	};

	// should remove this and move into RV component
	$: conditions = checkConditions(width, height);
</script>

<!-- only display if this view state is selected -->
{#if display}
	<svg width={spec.maxSize.w} height={spec.maxSize.h} id="svg">
		<g
			id="choropleth"
			class="viewState"
			transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})"
		>
			<g id="polygons">
				{#each geo.features as feature}
					<path
						class="area"
						id={params.map_id(feature)}
						d={path(feature)}
						fill={params.colorScale(
							results.find((x) => x.ons_id === feature.properties.id).first_party
						)}
					/>
				{/each}
			</g>
			<g id="mesh">
				<path
					class="mapMesh"
					d={path(mesh)}
					fill="transparent"
					stroke="#fff"
					stroke-width="{0.5 / s}px"
				/>
			</g>
			<FillLegend
				colors={params.colors}
				labels={params.category_labels}
				title={params.title}
				x={initW}
				y="70"
				anchorX="right"
				{s}
			/>
		</g></svg
	>
{/if}
