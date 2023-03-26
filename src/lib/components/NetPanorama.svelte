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

	import { onMount } from 'svelte';
	import { base } from '$app/paths';

	$: height = context.height;
	$: width = context.width;
	$: display;

	// let spec = context.spec;
	// let netPanoramaSpec = params;

	$: spec = {
		...params.spec,
		width: width,
		height: height
	};

	// suppress console logs (the library logs a lot)
	// console.log = function () {};

	// get unique id for div
	const div = id();

	// doing it in this roundabout way so it rerenders if things change after it's first mounted
	let mounted = false;
	$: mounted;
	onMount(() => {
		mounted = true;
	});

	$: if (mounted) {
		NetPanoramaTemplateViewer.render(spec, {}, div);
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

{#if display}
	<!-- N.B. The closing tags are necessary - making these divs self-closing will cause errors -->
	<!-- prettier-ignore -->
	<div id={div} ></div>
	<!-- style="width: 100%; position: relative; top: 0px;" -->
{/if}
