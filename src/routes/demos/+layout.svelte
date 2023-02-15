<script>
	let divWidth, divHeight;
	$: divAR = Math.round((divWidth / divHeight) * 100) / 100;
	$: divArea = Math.round(divWidth * divHeight);
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
		<li>Width: {divWidth} px</li>
		<li>Height: {divHeight} px</li>
		<li>Aspect ratio: {divAR}</li>
		<li>Area: {divArea} px</li>
	</ul>
</div>

<div id="outer-container">
	<div id="container" bind:offsetWidth={divWidth} bind:offsetHeight={divHeight}>
		<slot />
	</div>
	<div id="landscape-overlay" />
</div>

<style>
	#outer-container {
		position: relative;
	}
	#container {
		overflow: hidden;
		resize: both;
		position: relative;
		border: 1px solid #ccc;
	}
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
