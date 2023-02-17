<script>
	export let width, height;

	$: width;
	$: height;

	let divAR, divArea;

	$: divAR = Math.round((width / height) * 100) / 100;
	$: divArea = Math.round(width * height);
</script>

<div id="controls">
	<!-- <button id="export-landscape">Export view landscape</button><br /> -->
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
	<input type="checkbox" id="show-landscape-overlay" /><label for="show-landscape-overlay"
		>Show view landscape overlay</label
	>
</div>

<div id="outer-container">
	<slot />
	<div id="landscape-overlay" />
</div>

<style>
	#outer-container {
		position: relative;
	}
	#landscape-overlay {
		position: absolute;
		left: 1px;
		top: 1px;
		pointer-events: none;
		opacity: 0.35;
	}
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
