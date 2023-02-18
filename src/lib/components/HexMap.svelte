<script>
	export let data, params, context, conditions, checkConditions, display;

	import * as d3 from 'd3';
	import { renderHexJSON } from 'd3-hexjson';

	import { fitRect } from '$lib/helpers.js';
	import FillLegend from '$lib/components/FillLegend.svelte';
	// import Tooltip from '$lib/components/Tooltip.svelte';

	$: height = context.height;
	$: width = context.width;
	$: display;

	const hex = data.hex;
	const results = data.results;

	const hexAR = 0.8;
	const initW = 500;
	const initH = 500;

	const hexInitSize =
		initW / initH > hexAR ? { w: initW, h: initW / hexAR } : { w: initH * hexAR, h: initH };

	// Render the hexes
	const hexes = renderHexJSON(hex, hexInitSize.w, hexInitSize.h);

	// get bounds
	const flat = hexes.map((d) => d.vertices).flat();
	const x = flat.map((d) => d.x);
	const y = flat.map((d) => d.y);
	const bounds = [
		[d3.min(x), d3.min(y)],
		[d3.max(x), d3.max(y)]
	];

	// get width of first hex (which is the same as all others)
	const hexWidth = d3.max(hexes[0].vertices, (d) => d.x) - d3.min(hexes[0].vertices, (d) => d.x);

	// Add the hex codes as labels
	// hexmap
	// 	.append("text")
	// 	.append("tspan")
	// 	.attr("text-anchor", "middle")
	// 	.text(function(hex) {return hex.key;});

	// compute scale and translate
	let s, t;
	$: ({ s, t } = fitRect([hexInitSize.w, hexInitSize.h], [width, height]));

	checkConditions = function (w, h) {
		// using constants: hexAR, hexInitSize, hexWidth
		const ar = w / h;
		const s = hexAR > w / h ? w / hexInitSize.w : h / hexInitSize.h;
		return (
			hexWidth * s > params.conditions.minHexSize &&
			// aspect ratio difference
			ar / hexAR >= 1 / params.conditions.maxAspectRatioDiff &&
			ar / hexAR <= params.conditions.maxAspectRatioDiff
		);
	};

	// should remove this and move into RV component
	$: conditions = checkConditions(width, height);
</script>

<!-- only display if this view state is selected -->
{#if display}
	<g
		id="hexmap"
		class="viewState"
		transform="translate({t[0] - s * bounds[0][0]},{t[1] - s * bounds[0][1]}) scale({s})"
	>
		{#each hexes as hex}
			<g transform="translate({hex.x},{hex.y})">
				<polygon
					class="hex"
					points={hex.points}
					stroke="#fff"
					stroke-width="2"
					fill={params.colorScale(results.find((x) => x.ons_id === hex.key).first_party)}
				/>
			</g>
		{/each}
		<FillLegend
			colors={params.colors}
			labels={params.category_labels}
			title={params.title}
			x={initW}
			y="70"
			anchorX="right"
			{s}
		/>
	</g>
{/if}

<!-- // Bind the hexes to g elements of the svg and position them


		// Legend
		const legend = g
			.append('g')
			.attr('id', 'legend')
			.attr('transform', 'translate(460,30) scale(1.4)')
			.call(drawLegend, params.colors, params.category_labels, params.title);
 -->
