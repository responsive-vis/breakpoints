<script>
	import { onMount } from 'svelte';

	export let x,
		y,
		anchorX = 'left',
		anchorY = 'top', // position
		s = 1,
		colors,
		labels,
		title = '';

	let g, size;
	let left = 0,
		top = 0;
	$: left, top;

	onMount(() => {
		size = g.getBBox();

		left = anchorX == 'left' ? x : anchorX == 'right' ? x - size.width : x - 0.5 * size.width;
		top = anchorY == 'top' ? y : anchorY == 'bottom' ? y - size.height : y - 0.5 * size.height;
	});
</script>

<g bind:this={g} transform="translate({left}, {top})">
	<text font-weight="bold" font-size="{14 / s}px" y="-5">{title}</text>
	{#each colors as color, i}
		<g transform="translate(0,{(i * 18) / s})">
			<rect width={16 / s} height={16 / s} fill={color} />
			<text x={20 / s} y={12 / s} font-size="{12 / s}px">{labels[i]}</text>
		</g>
	{/each}
</g>

<!-- 
            g.attr('transform', `translate(${t[0]},${t[1]}) scale(${s})`);
-->
