<script>
	import { schemeSet3 } from 'd3';
	import { onMount } from 'svelte';

	export let viewLandscape;
	export let colors = schemeSet3;

	let dataURL, height, width;
	$: dataURL, height, width;

	onMount(() => {
		width = viewLandscape.length;
		height = viewLandscape[0].length;

		let canvas = document.createElement('canvas');
		canvas.setAttribute('width', width);
		canvas.setAttribute('height', height);

		let c = canvas.getContext('2d');

		// download.href = map.getCanvas().toDataURL();
		// download.download = "screenshot.png";
		// download.click();

		for (let x = 0; x < width; x++) {
			for (let y = 0; y < height; y++) {
				// console.log(typeof viewLandscape[x][y]);
				c.fillStyle = typeof viewLandscape[x][y] == 'number' ? colors[viewLandscape[x][y]] : '#fff';
				c.fillRect(x, y, 1, 1);
			}
		}

		dataURL = canvas.toDataURL();
	});
</script>

<div
	id="landscape-overlay"
	style="width:{width}px; height:{height}px; background-image: url({dataURL})"
/>

<style>
	#landscape-overlay {
		position: absolute;
		display: block;
		left: 1px;
		top: 1px;
		pointer-events: none;
		opacity: 0.35;
	}
</style>
