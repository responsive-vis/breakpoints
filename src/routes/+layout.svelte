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
	<h1>Data-Driven Breakpoints for Responsive Visualization</h1>
	<nav>
		<a href="{base}/">about</a>
		<a href="{base}/technical-details">technical details</a>
		<span id="demos">
			<a href="{base}/demos">demos:</a><a href="{base}/demos/population-map">population map</a><a
				href="{base}/demos/uk-election">uk election map</a
			><a href="{base}/demos/networks">networks</a><a href="{base}/demos/scatterplot"
				>movies scatterplot</a
			>
		</span>
	</nav>
</div>

<div id="content">
	<slot />
</div>

<style>
	:global(body) {
		background-color: #f6f6f6;
	}
	h1 {
		font-size: 2rem;
		margin: 0.4rem 0;
		background-image: linear-gradient(to right, #7a6cd7, #48d6be, #fafa5a);
		background-clip: text;
		-webkit-background-clip: text;
		-moz-background-clip: text;
		-webkit-text-fill-color: transparent;
		-moz-text-fill-color: transparent;
	}
	#header {
		display: block;
		background-color: #fff;
		padding: 1rem 1rem 0.6rem;
		box-shadow: #64646f33 0px 7px 29px 0px;
	}
	#content {
		padding: 1rem;
		font-size: 0.75rem;
	}
	nav a {
		display: inline-block;
		background-color: #eee;
		font-size: 0.75rem;
		text-transform: uppercase;
		height: 2rem;
		line-height: 2rem;
		border-radius: 1rem;
		border: 1px solid #fff;
		color: #222;
		padding: 0 0.75rem;
		text-decoration: none;
	}
	nav a:hover {
		background-color: #8493d2;
		color: #fff;
	}
	#demos a {
		border-radius: 0;
	}
	#demos a:first-child {
		border-radius: 1rem 0 0 1rem;
	}
	#demos a:last-child {
		border-radius: 0 1rem 1rem 0;
	}
</style>
