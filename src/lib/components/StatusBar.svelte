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
	<p>
		<em>
			Resize the container using the handle in the botton right and watch the visualization update
			(Chrome/Firefox only).
		</em>
	</p>

	<ul>
		<li>Width: {width} px</li>
		<li>Height: {height} px</li>
		<li>Aspect ratio: {divAR}</li>
		<li>Area: {divArea} px</li>
		<li />
	</ul>

	<p>
		<input type="checkbox" id="show-landscape-overlay" bind:checked={landscapeOverlay} /><label
			for="show-landscape-overlay">Show view landscape overlay</label
		>
		<button id="export-landscape" on:click={window.open(viewLandscape.image)}
			>Download as PNG</button
		>
	</p>
</div>

<style>
	#controls {
		/* line-height: 1rem; */
		margin-bottom: 0.3rem;
	}
	p,
	ul {
		margin: 0;
		line-height: 1.3rem;
	}
	input {
		margin: 0 5px 7px 0;
	}
	ul {
		list-style-type: none;
		margin: 0;
		padding: 0;
		display: inline-block;
	}
	li {
		display: inline-block;
		width: 150px;
	}
	button {
		background-color: white;
		color: black;
		border: 2px solid #bebada;
		border-radius: 2rem;
		padding: 0.25rem 0.5rem 0.15rem 0.5rem;
		font-size: 0.8rem;
		transition-duration: 0.3s;
	}
	button:hover {
		background-color: #bebada;
	}
</style>
