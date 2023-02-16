<script>
	export let data;
	export let params;
	export let context;
	export let conditions;

	// let width,height;
	$: height = context.height;
	$: width = context.width;

	import * as d3 from 'd3';
	import { onMount } from 'svelte';

	import Tooltip from './Tooltip.svelte';
	import CircleLegend from '$lib/viz/CircleLegend.svelte';
	// import CircleLegend from './CircleLegend.svelte';

	let params_local = params.viewStates.circleMap;

	let map, circles;

	// fit projection to container + geo data
	const projection = params_local.projection;
	projection.fitSize([params.initSize.w, params.initSize.h], data);
	const path = d3.geoPath(projection);

	const bounds = path.bounds(data);
	const mapAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);

	const mapInitSize =
		params.initSize.w / params.initSize.h < mapAR
			? { width: params.initSize.w, height: params.initSize.w / mapAR }
			: { width: params.initSize.h * mapAR, height: params.initSize.h };

	// circle radius for prop circle map
	const r = d3
		.scaleSqrt()
		.domain([0, d3.max(data.features, (d) => d.properties.POP_EST)])
		.range([0, Math.sqrt(params.initSize.w * params.initSize.h) / 13]);

	// Tooltip
	let x, y, content;
	$: x, y, content;
	function handleMouseover(event, feature) {
		x = projection(feature.properties.centroid)[0];
		y = projection(feature.properties.centroid)[1];
		content = feature.properties.ADMIN;
	}
	function handleMouseout(event) {
		x = -100;
		y = -100;
		content = '';
	}

	// compute scale + translate so that map is always at max size, centered within the container
	$: s = mapAR > width / height ? width / mapInitSize.width : height / mapInitSize.height;
	$: t =
		mapAR < width / height
			? [(width - s * mapInitSize.width) / 2, 0]
			: [0, (height - s * mapInitSize.height) / 2];

	// calculate some things for conditions
	let pop_vals = data.features.map((d) => d.properties.POP_EST);
	let lower_bound = pop_vals.sort((a, b) => a - b)[Math.floor(pop_vals.length * 0.1)];
	$: containerAR = width / height;

	$: conditions =
		r(lower_bound) * s > params_local.conditions.minCircleRadius && // min r - at least 90% of circles visible
		containerAR / mapAR >= 1 / params_local.conditions.maxAspectRatioDiff && // aspect ratio difference - no more than 1/3 white space
		containerAR / mapAR <= params_local.conditions.maxAspectRatioDiff;

	// position legend in bottom left of map area
	// get size of legend
	// const legendBBox = legend.node().getBBox();
	// legend.attr('transform', `translate(${5},${mapInitBBox.height - legendBBox.height - 5})`);
	// for custom positioning
	// .attr("transform", `translate(${params_local.legendPosition[0]},${params_local.legendPosition[1]})`)
</script>

<g class="circleMap viewState" transform="translate({t[0]},{t[1]}) scale({s})">
	<!-- transform to make map + circles align with top left corner; will be centered in adapt function -->
	<g id="map" bind:this={map} transform="translate({-bounds[0][0]}, {-bounds[0][1]})">
		{#each data.features as feature}
			<path
				class="country"
				id={feature.properties.ISO_A3}
				d={path(feature)}
				fill="#f5f5f5"
				stroke="#e0e0e0"
				stroke-width="{0.7 / s}px"
			/>
		{/each}
	</g>
	<g id="circles" bind:this={circles} transform="translate({-bounds[0][0]}, {-bounds[0][1]})">
		{#each data.features as feature}
			<circle
				r={r(feature.properties.POP_EST)}
				cx={projection(feature.properties.centroid)[0]}
				cy={projection(feature.properties.centroid)[1]}
				fill={params_local.circleColor(feature)}
				fill-opacity="0.4"
				stroke-width="{1 / s}px"
				on:focus={(e) => handleMouseover(e, feature)}
				on:mouseover={(e) => handleMouseover(e, feature)}
				on:mouseout={handleMouseout}
				on:blur={handleMouseout}
			/>
		{/each}
	</g>
	<CircleLegend
		x={5 - bounds[0][0]}
		y={mapInitSize.height - bounds[0][1]}
		anchorX="left"
		anchorY="bottom"
		scale={r}
		tickValues={params_local.legendTickValues}
		tickFormat={params_local.legendTickFormat}
		s={1}
	/>
	<Tooltip bind:x bind:y bind:content />
</g>

<!-- circles
.selectAll('circle')
.data(data.features)
.enter()
.append('circle')
.attr('r', (d) => r(d.properties.POP_EST))
.attr('cx', (d) => projection(d.properties.centroid)[0])
.attr('cy', (d) => projection(d.properties.centroid)[1])
.attr('fill', params_local.circleColor)
.attr('fill-opacity', 0.4)
.attr('stroke', params_local.circleColor)
.on('mouseover', function (d) {
    d3.select('#tooltip')
        .attr('x', d3.select(this).attr('cx'))
        .attr('y', d3.select(this).attr('cy'))
        .text(d.originalTarget.__data__.properties.ADMIN);
})
.on('mouseout', function () {
    d3.select('#tooltip').attr('x', -100).attr('y', -100);
}); -->
