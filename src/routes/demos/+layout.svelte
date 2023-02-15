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
		<li>Width: <span id="widthOutput" />px</li>
		<li>Height: <span id="heightOutput" />px</li>
		<li>Aspect ratio: <span id="arOutput" /></li>
		<li>Area: <span id="areaOutput" />px</li>
	</ul>
</div>

<div id="outer-container">
	<div id="container">
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
