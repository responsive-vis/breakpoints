<script>
	import { base } from '$app/paths';
</script>

<div id="header">
	<h1>Data-driven Breakpoints for Responsive Visualization</h1>
	<nav>
		<a href="{base}/">about</a> //
		<a href="{base}/demos/population-map">population map</a>
	</nav>
</div>

<div id="content">
	<slot />
</div>

<style>
	h1 {
		font-size: larger;
		margin: 5px 0;
	}
	#header {
		background-color: rgb(247, 247, 210);
		display: block;
		padding: 10px;
	}
	#content {
		padding: 10px;
	}
</style>
