<script>
	// Adapted for Svelte from https://observablehq.com/@harrystevens/circle-legend

	export let x = 0,
		y = 0, // position
		scale,
		tickValues,
		tickFormat = (d) => d,
		tickSize = 5,
		s = 1; // scale factor for resizing

	let ticks = tickValues || scale.ticks();
	ticks = ticks.slice().reverse();

	const max = ticks[0];
</script>

<g transform={`translate(${[x, y]})`} stroke-width={`${1 / s}px`}>
	{#each ticks as d, i}
		<circle fill="none" stroke="currentColor" cx={scale(max)} cy={scale(d)} r={scale(d)} />
		<line
			stroke="currentColor"
			stroke-dasharray={`${4 / s}, ${2 / s}`}
			x1={scale(max)}
			x2={tickSize + scale(max) * 2}
			y1={scale(d) * 2}
			y2={scale(d) * 2}
		/>
		<text
			font-family="'Helvetica Neue', sans-serif"
			font-size={11 / s}
			dominant-baseline="central"
			x={tickSize + scale(max) * 2}
			y={scale(d) * 2}>{tickFormat(d, i)}</text
		>
	{/each}
</g>
