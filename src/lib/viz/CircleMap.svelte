<script>
	export let data;
	export let params;

	import * as d3 from 'd3';
	import { onMount } from 'svelte';
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
			? [params.initSize.w, params.initSize.w / mapAR]
			: [params.initSize.h * mapAR, params.initSize.h];

	// circle radius for prop circle map
	const r = d3
		.scaleSqrt()
		.domain([0, d3.max(data.features, (d) => d.properties.POP_EST)])
		.range([0, Math.sqrt(params.initSize.w * params.initSize.h) / 13]);

	onMount(() => {
		// get initial bbox of map + compute aspect ratio
		// const mapInitBBox = d3.select(map).node().getBBox();
		// console.log(mapInitBBox);
		// const mapAR = mapInitBBox.width / mapInitBBox.height;

		// draw circles
		// circles
		// 	.selectAll('circle')
		// 	.data(data.features)
		// 	.enter()
		// 	.append('circle')
		// 	.attr('r', (d) => r(d.properties.POP_EST))
		// 	.attr('cx', (d) => projection(d.properties.centroid)[0])
		// 	.attr('cy', (d) => projection(d.properties.centroid)[1])
		// 	.attr('fill', params_local.circleColor)
		// 	.attr('fill-opacity', 0.4)
		// 	.attr('stroke', params_local.circleColor)
		// 	.on('mouseover', function (d) {
		// 		d3.select('#tooltip')
		// 			.attr('x', d3.select(this).attr('cx'))
		// 			.attr('y', d3.select(this).attr('cy'))
		// 			.text(d.originalTarget.__data__.properties.ADMIN);
		// 	})
		// 	.on('mouseout', function () {
		// 		d3.select('#tooltip').attr('x', -100).attr('y', -100);
		// 	});

		// legend
		// let n = d3.format(".2s"); // number formatting
		// let circleLegend = legendCircle()
		// 	.scale(r)
		// 	.tickValues(params_local.legendTickValues)
		// 	.tickFormat(
		// 		(d, i, e) => params_local.legendTickFormat(d, i, e)
		// 		// do this to add label to last one
		// 		// i === e.length - 1 ? d + " bushels of hay" : d
		// 	)
		// 	.tickSize(5); // defaults to 5

		// legend.call(circleLegend);

		// position legend in bottom left of map area
		// get size of legend
		// const legendBBox = legend.node().getBBox();
		// legend.attr('transform', `translate(${5},${mapInitBBox.height - legendBBox.height - 5})`);
		// for custom positioning
		// .attr("transform", `translate(${params_local.legendPosition[0]},${params_local.legendPosition[1]})`)

		// calculate some things for conditions
		let pop_vals = data.features.map((d) => d.properties.POP_EST);
		let lower_bound = pop_vals.sort((a, b) => a - b)[Math.floor(pop_vals.length * 0.1)];

		// 	const adapt = function (e) {
		// 		// compute scale + translate so that map is always at max size, centered within the container
		// 		const s = mapAR > e.x / e.y ? e.x / mapInitBBox.width : e.y / mapInitBBox.height;
		// 		const t =
		// 			mapAR < e.x / e.y
		// 				? [(e.x - s * mapInitBBox.width) / 2, 0]
		// 				: [0, (e.y - s * mapInitBBox.height) / 2];
		// 		// g contains map, circles, and legend
		// 		g.attr('transform', `translate(${t[0]},${t[1]}) scale(${s})`);
		// 		map.attr('stroke-width', `${0.7 / s}px`);
		// 		circles.attr('stroke-width', `${1 / s}px`);

		// 		// rescale legend
		// 		circleLegend.adapt(s);
		// 	};

		// 	const conditions = function (e) {
		// 		let s = mapAR > e.x / e.y ? e.x / mapInitBBox.width : e.y / mapInitBBox.height;
		// 		let containerAR = e.x / e.y;

		// 		return (
		// 			// min r - at least 90% of circles visible
		// 			r(lower_bound) * s > local.params.conditions.minCircleRadius &&
		// 			// aspect ratio difference - no more than 1/3 white space
		// 			containerAR / mapAR >= 1 / local.params.conditions.maxAspectRatioDiff &&
		// 			containerAR / mapAR <= local.params.conditions.maxAspectRatioDiff
		// 		);
		// 	};
	});
	// return { adapt: adapt, conditions: conditions };
	// };
</script>

<g class="circleMap viewState">
	<!-- transform to make map + circles align with top left corner; will be centered in adapt function -->
	<g id="map" bind:this={map} transform="translate({-bounds[0][0]}, {-bounds[0][1]})">
		{#each data.features as feature}
			<path
				class="country"
				id={feature.properties.ISO_A3}
				d={path(feature)}
				fill="#f5f5f5"
				stroke="#e0e0e0"
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
			/>
		{/each}
	</g>
	<g id="legend" />
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
