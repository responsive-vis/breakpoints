<script>
	import { base } from '$app/paths';
</script>

<svelte:head>
	<title>Constraint-Based Breakpoints | Technical Details</title>
</svelte:head>

<h2>Technical Details</h2>
<p>
	<a href="https://github.com/responsive-vis/breakpoints" target="_blank">View code on GitHub</a>
</p>

<p>
	We implemented our design framework as a Svelte component <code>&lt;ResponsiveVis /&gt;</code>.
	Designers can use the component to create a responsive visualization by supplying a specification.
	At minimum, the specification must include multiple views. For each view, the specification must
	provide (1) a Svelte component that creates this visualization and implements its view conditions,
	(2) the dataset to be visualized, and optionally, (3) parameters for the visualization and (4)
	parameters for the view conditions.
</p>

<p>
	Below, we show an annotated excerpt from the specification for the <a
		href="{base}/demos/uk-election">UK Election example</a
	>. This specification includes three views; for each view, the type of view, dataset, parameters
	(omitted here--this includes any configuration options for the visualization like color schemes),
	and conditions are specified. The full file, running the live demo, is available
	<a
		href="https://github.com/responsive-vis/breakpoints/blob/main/src/routes/demos/uk-election/%2Bpage.svelte"
		>here</a
	>.
</p>

<img src="{base}/img/codesnippet.jpg" />

<p>
	For our four examples, we implemented six Svelte components which we used to create a total of 13
	different views across four example visualization. We list these below, indicating the constraints
	implemented in each.
</p>

<ul>
	<li>
		<code>VegaLiteWrapper</code> (a wrapper for Vega-Lite)
		<ul>
			<li>
				<code>maxOverplotting</code> (measuring and limiting the amount of overplotting in a scatterplot)
			</li>
		</ul>
	</li>
	<li>
		<code>NetPanorama</code> (a wrapper for
		<a href="https://netpanorama.netlify.app" target="_blank">NetPanorama</a>, a declarative grammar
		for networks)

		<ul>
			<li>
				<code>minAdjacencyMatrixLabelSize</code> (requiring a minimum size for the labels in an adjacency
				matrix)
			</li>
			<li>
				<code>minArcDiagramLabelSize</code> (requiring a minimum size for the labels in an arc diagram)
			</li>
		</ul>
	</li>
	<li>
		<code>ChoroplethMap</code> (a choropleth map created with D3)

		<ul>
			<li>
				<code>minAreaSize</code> (specify a minimum size for the smallest area on the map)
			</li>
			<li>
				<code>maxAspectRatioDiff</code> (specify a maximum difference between the aspect ratio of the
				map and the container)
			</li>
		</ul>
	</li>
	<li>
		<code>CircleMap</code> (a proportional circle map with a Dorling cartogram option, creating with
		D3)

		<ul>
			<li>
				<code>minCircleRadius</code> (specify a minimum radius for the smallest circle on the map)
			</li>
			<li>
				<code>maxAspectRatioDiff</code> (specify a maximum difference between the aspect ratio of the
				map and the container)
			</li>
		</ul>
	</li>
	<li>
		<code>HexMap</code>
		<ul>
			<li>
				<code>minHexSize</code> (specify a minimum width for the hexagons on the map)
			</li>
			<li>
				<code>maxAspectRatioDiff</code> (specify a maximum difference between the aspect ratio of the
				map and the container)
			</li>
		</ul>
	</li>
	<li>
		<code>WaffleChart</code>
		<ul>
			<li>
				<i>No conditions.</i>
			</li>
		</ul>
	</li>
</ul>

<p>Additionally, all components support the following (device-based) conditions:</p>

<ul>
	<li><code>minWidth, minHeight</code> (absolute minimum width/height of the container)</li>
	<li><code>minAspectRatio, maxAspectRatio</code> (limiting the aspect ratio of the container)</li>
</ul>

The following table presents all conditions that we have implemented grouped by the three general
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
	code {
		font-family: monospace;
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
</style>
