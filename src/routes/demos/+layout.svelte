<script>
	import { onMount } from 'svelte';

	export let width, height;
	let divAR, divArea;
	// let width, height;
	// $: width;
	// $: height;
	// $: divAR = Math.round((width / height) * 100) / 100;
	// $: divArea = Math.round(width * height);

	// onMount(() => {
	// 	console.log(height, width);
	// });
</script>

<div>
	<input type="checkbox" id="show-landscape-overlay" /><label for="show-landscape-overlay"
		>Show view landscape overlay</label
	>
	|
	<button id="export-landscape">Export view landscape</button><br />
	<em>
		Resize the container using the handle in the botton right and watch the visualization update
		(Chrome/Firefox only).
	</em>
	<br />
	<ul>
		<li>Width: {width} px</li>
		<li>Height: {height} px</li>
		<li>Aspect ratio: {divAR}</li>
		<li>Area: {divArea} px</li>
	</ul>
</div>

<div id="outer-container">
	<!-- <div slot="container" let:item>{item.text}</div> -->
	<!-- <slot bind:width bind:height /> -->
	<!-- <div id="container" bind:offsetWidth={width} bind:offsetHeight={height}> -->
	<!-- <div id="container" bind:offsetWidth={width} bind:offsetHeight={height}><slot /></div> -->
	<slot />
	<!-- </div> -->
	<div id="landscape-overlay" />
</div>

<style>
	#outer-container {
		position: relative;
	}
	/* moved to +page until i can figure this out */
	/* #container {
		overflow: hidden;
		resize: both;
		position: relative;
		border: 1px solid #ccc;
	} */
	#landscape-overlay {
		position: absolute;
		left: 1px;
		top: 1px;
		pointer-events: none;
		opacity: 0.35;
	}

	ul {
		list-style-type: none;
		margin: 5px 0;
		padding: 0;
		display: inline-block;
	}
	li {
		display: inline-block;
		width: 150px;
	}
</style>
