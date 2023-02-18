<script>
	export let data;
	export let params;
	export let context;
	export let conditions;
	export let calculateConditions;
	export let display;

	$: height = context.height;
	$: width = context.width;
	$: display;

	import * as d3 from 'd3';

	import Tooltip from '$lib/components/Tooltip.svelte';
	import CircleLegend from '$lib/components/CircleLegend.svelte';

	let map, circles;

	// fit projection to container + geo data
	const initW = 500;
	const initH = 500;
	const projection = params.projection;
	projection.fitSize([initW, initH], data);
	const path = d3.geoPath(projection);

	const bounds = path.bounds(data);
	const mapAR = (bounds[1][0] - bounds[0][0]) / (bounds[1][1] - bounds[0][1]);

	const mapInitSize =
		initW / initH < mapAR
			? { width: initW, height: initW / mapAR }
			: { width: initH * mapAR, height: initH };

	// circle radius (slightly bigger for Dorling)
	const r = d3
		.scaleSqrt()
		.domain([0, d3.max(data.features, (d) => d.properties.POP_EST)])
		.range([0, Math.sqrt(initW * initH) / (params.dorling ? 12 : 14)]);

	if (params.dorling) {
		// get Dorling cartogram positions
		// adds/updates d.x and d.y
		let dorlingSimulation = d3
			.forceSimulation(data.features)
			.force(
				'x',
				d3.forceX((d) => projection(d.properties.centroid)[0])
			)
			.force(
				'y',
				d3.forceY((d) => projection(d.properties.centroid)[1])
			)
			.force(
				'collide',
				d3.forceCollide((d) => r(d.properties.POP_EST))
			)
			.stop();
		dorlingSimulation.tick(200);
		data.features.forEach(function (d) {
			d.properties.dorlingX = d.x;
			d.properties.dorlingY = d.y;
		});
	}

	// Tooltip
	let x, y, content;
	$: x, y, content;
	function handleMouseover(event, feature) {
		x = params.dorling ? feature.properties.dorlingX : projection(feature.properties.centroid)[0];
		y = params.dorling ? feature.properties.dorlingY : projection(feature.properties.centroid)[1];
		content = feature.properties.ADMIN;
	}
	function handleMouseout(event) {
		x = -100;
		y = -100;
		content = '';
	}

	// compute scale + translate so that map is always at max size, centered within the container
	let s = 1;
	$: s = mapAR > width / height ? width / mapInitSize.width : height / mapInitSize.height;
	$: t =
		mapAR < width / height
			? [(width - s * mapInitSize.width) / 2, 0]
			: [0, (height - s * mapInitSize.height) / 2];

	// calculate some things for conditions
	const pop_vals = data.features.map((d) => d.properties.POP_EST);
	const lower_bound = pop_vals.sort((a, b) => a - b)[Math.floor(pop_vals.length * 0.1)];
	$: containerAR = width / height;

	$: conditions =
		r(lower_bound) * s > params.conditions.minCircleRadius && // min r - at least 90% of circles visible
		containerAR / mapAR >= 1 / params.conditions.maxAspectRatioDiff && // aspect ratio difference - no more than 1/3 white space
		containerAR / mapAR <= params.conditions.maxAspectRatioDiff;

	calculateConditions = function (w, h) {
		let s = mapAR > w / h ? w / mapInitSize.width : h / mapInitSize.height;
		return (
			r(lower_bound) * s > params.conditions.minCircleRadius && // min r - at least 90% of circles visible
			w / h / mapAR >= 1 / params.conditions.maxAspectRatioDiff && // aspect ratio difference - no more than 1/3 white space
			w / h / mapAR <= params.conditions.maxAspectRatioDiff
		);
	};
</script>

<!-- only display if this view state is selected -->
{#if display}
	<g
		class="circleMap viewState"
		transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})"
	>
		<!-- transform to make map + circles align with top left corner; will be centered in adapt function -->
		<g id="map" bind:this={map}>
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
		<g id="circles" bind:this={circles}>
			{#each data.features as feature}
				<circle
					r={r(feature.properties.POP_EST)}
					cx={params.dorling
						? feature.properties.dorlingX
						: projection(feature.properties.centroid)[0]}
					cy={params.dorling
						? feature.properties.dorlingY
						: projection(feature.properties.centroid)[1]}
					fill={params.circleColor(feature)}
					stroke={params.circleColor(feature)}
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
			x={5 + bounds[0][0]}
			y={mapInitSize.height + bounds[0][1] - 5}
			anchorX="left"
			anchorY="bottom"
			scale={r}
			tickValues={params.legendTickValues}
			tickFormat={params.legendTickFormat}
			{s}
		/>
		<Tooltip bind:x bind:y bind:content fontsize={12 / s} />
	</g>
{/if}
