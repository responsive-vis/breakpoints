<script>
	import { base } from '$app/paths';
</script>

<svelte:head>
	<style>
		* {
			font-family: sans-serif;
		}

		body,
		html {
			margin: 0;
			padding: 0;
		}
	</style>
</svelte:head>

<div id="header">
	<h1>Data-driven Breakpoints for Responsive Visualization</h1>
	<nav>
		<a href="{base}/">about</a> //
		<a href="{base}/demos/population-map">population map</a> /
		<a href="{base}/demos/uk-election">uk election map</a> /
		<a href="{base}/demos/network">networks</a> /
		<a href="{base}/demos/vega-scatterplot">movies scatterplot</a>
	</nav>
</div>

<div id="content">
	<slot />
</div>

<style>
	:global(body) {
		background-color: #eee;
	}
	h1 {
		font-size: 1.2rem;
		margin: 0.4rem 0;
	}
	#header {
		background-image: linear-gradient(to right, #bebada, #8dd3c7, #ffffb3);
		display: block;
		padding: 0.7rem;
	}
	#content {
		padding: 0.7rem;
	}
</style>
