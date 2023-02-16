<script>
	// Adapted for Svelte from https://observablehq.com/@harrystevens/circle-legend

	export let x,
		y,
		anchorX = 'left',
		anchorY = 'top', // position
		scale,
		tickValues,
		tickFormat = (d) => d,
		tickSize = 5,
		color = '#000',
		s = 1; // scale factor for resizing

	let ticks = tickValues || scale.ticks();
	ticks = ticks.slice().reverse();

	const max = ticks[0];

	let left, top;
	switch (anchorX) {
		case 'left':
			left = x;
			break;
		case 'right':
			left = x - 2 * scale(max);
			break;
		case 'center':
			left = x - scale(max);
			break;
	}
	switch (anchorY) {
		case 'top':
			top = y;
			break;
		case 'bottom':
			top = y - 2 * scale(max);
			break;
		case 'center':
			top = y - scale(max);
			break;
	}
</script>

<g transform={`translate(${[left, top]})`} stroke-width={`${1 / s}px`}>
	{#each ticks as d, i}
		<circle fill="none" stroke={color} cx={scale(max)} cy={scale(d)} r={scale(d)} />
		<line
			stroke={color}
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
