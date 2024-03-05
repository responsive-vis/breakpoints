<script>
	import { base } from '$app/paths';
	import ComponentDetails from '$lib/components/ComponentDetails.svelte';
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | About</title>
</svelte:head>

<h2>About</h2>
<p>
	This website contains interactive example visualizations to demonstrate constraint-based
	breakpoints. Explore our <a href="{base}/demos">interactive demos</a>!
</p>

<p>Here's a short video that shows all example visualizations:</p>

<!-- <video controls src="{base}/demovideo.mp4" type="video/mp4" width="960px" height="540px" /> -->

<h2>Code Specification</h2>
<p>
	<a href="https://github.com/responsive-vis/breakpoints" target="_blank">View code on GitHub</a>
</p>

<p>
	We implemented our design framework as a Svelte component <code>&lt;ResponsiveVis /&gt;</code>.
	Designers can use the component to create a responsive visualization by supplying a specification.
	At minimum, the specification must include multiple views. For each view, the specification must
	provide (1) a Svelte component that creates this visualization and implements its view
	constraints, (2) the dataset to be visualized, and optionally, (3) parameters for the
	visualization and (4) parameters for the view constraints.
</p>

<p>
	Below, we show an annotated excerpt from the specification for the <a
		href="{base}/demos/uk-election">UK Election example</a
	>. This specification includes three views; for each view, the type of view, dataset, parameters
	(omitted here--this includes any configuration options for the visualization like color schemes),
	and constraints are specified. The full file, running the live demo, is available
	<a
		href="https://github.com/responsive-vis/breakpoints/blob/main/src/routes/demos/uk-election/%2Bpage.svelte"
		>here</a
	>.
</p>

<img src="{base}/img/code_snippet.png" />

<h2>Implemented Visualization Components</h2>

<p>
	For our four examples, we implemented six Svelte components which we used to create a total of 13
	different views across four example visualizations. We list these below, indicating the
	constraints implemented in each.
</p>

<ComponentDetails
	title="VegaLiteWrapper"
	description="A wrapper for Vega-Lite."
	screenshots={[
		'scatterplot',
		'heatmap',
		'barchart_americas',
		'barchart_world',
		'barchart2_americas',
		'barchart2_world'
	]}
	githubLink="https://github.com/responsive-vis/breakpoints/blob/main/src/lib/components/VegaLiteWrapper.svelte"
	examples={['scatterplot', 'population-map']}
>
	<li>
		<code>maxOverplotting</code>: measures and limits the amount of overplotting in a scatterplot.
		In this example, we quantify overplotting by first computing how many pairs of circles overlap
		in the scatterplot, i.e., we check for each possible pair of circles whether they overlap or
		not. We record overlap as a value between 0 and 1 for each of these pairs, where 1 indicates
		identical positions and 0 indicates no overlap. We then sum all these values and divide that by
		the number of possible pairs (a number equivalent to all circles fully overlapping).
	</li>
</ComponentDetails>

<ComponentDetails
	title="NetPanorama"
	description="A wrapper for
			<a href='https://netpanorama.netlify.app' target='_blank'>NetPanorama</a>, a declarative
			grammar for networks."
	screenshots={['arcdiagram_lesmis', 'matrix_lesmis', 'nodelink_lesmis']}
	githubLink="https://github.com/responsive-vis/breakpoints/blob/main/src/lib/components/NetPanorama.svelte"
	examples={['networks']}
>
	<li>
		<code>minAdjacencyMatrixLabelSize</code>: requires a minimum size for the labels in an adjacency
		matrix, to be provided in px. Setting a minimum size for the labels automatically creates a
		minimum size for each matrix cell.
	</li>
	<li>
		<code>minArcDiagramLabelSize</code>: requires a minimum size for the labels in an arc diagram,
		to be provided in px. Setting a minimum size for the labels automatically creates a minimum
		distance between the nodes.
	</li>
</ComponentDetails>

<ComponentDetails
	title="ChoroplethMap"
	description="A choropleth map created with D3."
	screenshots={['choropleth_uk']}
	githubLink="https://github.com/responsive-vis/breakpoints/blob/main/src/lib/components/ChoroplethMap.svelte"
	examples={['uk-election']}
>
	<li>
		<code>minAreaSize</code>: specify a minimum size for the smallest area on the map. We identify
		the smallest area on the map and check if its area is above the specified size in px.
	</li>
	<li>
		<code>maxAspectRatioDiff</code>: specify a maximum difference between the aspect ratio of the
		map and the container. We determine the natural aspect ratio of the map, and compare this to the
		current aspect ratio of the container. We then check if the container is wider or narrower than
		the map by more than the specified percentage.
	</li>
</ComponentDetails>

<ComponentDetails
	title="CircleMap"
	description="A proportional circle map with a Dorling cartogram option, created with D3."
	screenshots={['circle_map_americas', 'circle_map_world', 'dorling_americas', 'dorling_world']}
	githubLink="https://github.com/responsive-vis/breakpoints/blob/main/src/lib/components/CircleMap.svelte"
	examples={['population-map']}
>
	<li>
		<code>minCircleRadius</code>: specify a minimum radius for the smallest circle on the map. We
		identify the smallest circle on the map and check if it is above the specified minimum radius.
	</li>
	<li>
		<code>maxAspectRatioDiff</code>: specify a maximum difference between the aspect ratio of the
		map and the container. We determine the natural aspect ratio of the map, and compare this to the
		current aspect ratio of the container. We then check if the container is wider or narrower than
		the map by more than the specified percentage.
	</li>
</ComponentDetails>

<ComponentDetails
	title="HexMap"
	description="A hexagonal grid map created with D3 and the d3-hexjson library."
	screenshots={['hexmap_uk']}
	githubLink="https://github.com/responsive-vis/breakpoints/blob/main/src/lib/components/HexMap.svelte"
	examples={['uk-election']}
>
	<li>
		<code>minHexSize</code>: specify a minimum width for the hexagons on the map. All hexagons are
		the same size, so we check if their width is above the provided minimum width.
	</li>
	<li>
		<code>maxAspectRatioDiff</code>: specify a maximum difference between the aspect ratio of the
		map and the container. We determine the natural aspect ratio of the map, and compare this to the
		current aspect ratio of the container. We then check if the container is wider or narrower than
		the map by more than the specified percentage.
	</li>
</ComponentDetails>

<ComponentDetails
	title="WaffleChart"
	description="A waffle-chart-like visualization created with D3."
	screenshots={['waffle_uk', 'waffle2_uk']}
	githubLink="https://github.com/responsive-vis/breakpoints/blob/main/src/lib/components/WaffleChart.svelte"
	examples={['uk-election']}
>
	<li>
		<i>No constraints.</i>
	</li>
</ComponentDetails>

<h2>Overview by Constraint Type</h2>

The following table presents all constraints that we have implemented grouped by the three general
types we introduce in the paper:
<table>
	<tr>
		<th>Size</th><th>Overlap</th><th>Aspect Ratio</th>
	</tr>
	<tr
		><td
			><code
				>minAdjacencyMatrixLabelSize<br /> minArcDiagramLabelSize<br /> minAreaSize<br />
				minCircleRadius<br />minHexSize
			</code></td
		><td><code>maxOverplotting</code></td><td
			><code>minAspectRatio<br />maxAspectRatio<br />maxAspectRatioDiff</code></td
		></tr
	>
</table>

<style>
	p {
		max-width: 900px;
	}

	table {
		text-align: left;
		margin: 10px 0;
	}
	th,
	td {
		padding: 3px 4px;
	}
	th {
		background-color: #eee;
	}
	td {
		background-color: #fff;
	}

	img {
		max-width: 600px;
	}

	code {
		font-family: monospace;
	}
</style>
