<script context="module">
	// netpanorama needs a div id to render the network vis into
	// this generates a unique id if this Svelte component is used multiple times on the same page
	// id's will not be reused and keep going up if components are mounted/destroyed repeatedly
	let i = 0;
	const id = function () {
		let name = 'netpanorama-div-' + i;
		i += 1;
		return name;
	};
</script>

<script>
	// export let data
	export let params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	import { onMount, tick } from 'svelte';
	import { base } from '$app/paths';
	import { waitFor } from '$lib/helpers.js';

	$: height = context.height;
	$: width = context.width;
	$: display;

	$: spec = params.spec;
	$: spec.x = spec.x ? spec.x : 0;
	$: spec.y = spec.y ? spec.y : 0;

	// suppress console logs (the library logs a lot)
	// console.log = function () {};

	// get unique id for div
	const div = id();

	// hacky way to make the sizing work
	let svg, g;
	$: svg && (svg.style['max-width'] = null);
	$: svg && (svg.style['max-height'] = null);
	$: g &&
		g.setAttribute(
			'transform',
			'translate(0,0) scale(' +
				Math.min(height / (spec.height + spec.y), width / (spec.width + spec.x)) +
				')'
		);

	let mounted = false;
	onMount(() => {
		mounted = true;
		// NetPanoramaTemplateViewer.render(spec, {}, div);

		// // hacky way to make the sizing work
		// waitFor((_) => document.querySelector('#' + div + ' svg.marks')).then((_) => {
		// 	svg = document.querySelector('#' + div + ' svg.marks');
		// 	g = document.querySelector('#' + div + ' svg.marks > g');
		// });
	});

	$: if (mounted) {
		render(spec);
	}
	async function render(spec) {
		// render! only once on mount + when spec is updated for any reason
		NetPanoramaTemplateViewer.render(spec, {}, div);
		// hacky way to make the sizing work
		await tick();

		waitFor((_) => document.querySelector('#' + div + ' svg.marks')).then((_) => {
			svg = document.querySelector('#' + div + ' svg.marks');
			g = document.querySelector('#' + div + ' svg.marks > g');
		});
	}

	checkConditions = function (w, h) {
		let c = [
			conditions.minWidth ? w > conditions.minWidth : true,
			conditions.minAspectRatio ? w / h > conditions.minAspectRatio : true
		];
		return c.every(Boolean);
	};
</script>

<svelte:head>
	<!-- importing via import in the script doesn't work because window is not defined at that point -->
	<script src="{base}/netpanorama-template-viewer/bundle.js"></script>
</svelte:head>

<!-- N.B. The closing tags are necessary - making these divs self-closing will cause errors -->
<!-- prettier-ignore -->
<div id={div} style='display: {display? 'block' : 'none'}' ></div>
