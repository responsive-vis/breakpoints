<script>
	import { base } from '$app/paths';
</script>

<div id="header">
	<h1>Data-driven Breakpoints for Responsive Visualization</h1>
	<nav>
		<a href="{base}/">about</a> //
		<a href="{base}/demos/population-map">population map</a> /
		<a href="{base}/demos/uk-election">uk election</a>
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
		background-image: linear-gradient(to right, #bebada, #8dd3c7, #ffffb3);
		display: block;
		padding: 10px;
	}
	#content {
		padding: 10px;
	}
</style>
