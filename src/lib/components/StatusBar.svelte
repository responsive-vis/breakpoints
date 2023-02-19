<script>
	export let width, height;
	export let landscapeOverlay;
	export let viewLandscape;

	$: width;
	$: height;

	let divAR, divArea;

	$: divAR = Math.round((width / height) * 100) / 100;
	$: divArea = Math.round(width * height);
</script>

<div id="controls">
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
		<li />
	</ul>
	<br />
	<input type="checkbox" id="show-landscape-overlay" bind:checked={landscapeOverlay} /><label
		for="show-landscape-overlay">Show view landscape overlay</label
	>
	<button id="export-landscape" on:click={window.open(viewLandscape.image)}>Download as PNG</button>
</div>

<style>
	#controls {
		line-height: 1em;
	}
	input {
		margin: 0 5px 7px 0;
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
