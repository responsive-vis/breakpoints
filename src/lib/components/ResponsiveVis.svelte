<script>
	import { range, schemeSet3 } from 'd3';
	import { onMount } from 'svelte';
	import { waitFor } from '$lib/helpers.js';

	export let spec; // must be provided and contains data and parameters for each view state
	export let computeViewLandscape = true;
	export let width, height, viewLandscape; // can optionally be used on the page via e.g. bind:width={...}
	export let vlInterval = 1; // how detailed should the view landscape be calculated

	// set color scheme for view landscape
	const vlColors = schemeSet3;

	// default parameters
	$: spec.initSize = spec.initSize ? spec.initSize : { w: 600, h: 400 };
	$: spec.maxSize = spec.maxSize ? spec.maxSize : { w: 1000, h: 700 };
	$: spec.minSize = spec.minSize ? spec.minSize : { w: 50, h: 50 };

	let checkConditions = Array(spec.views.length).fill(undefined);
	$: checkConditions;

	let conditions = Array(spec.views.length).fill(true); // intialise array with TRUE for each view state
	$: conditions = conditions.map((d, i) => {
		return typeof checkConditions[i] === 'function' ? checkConditions[i](width, height) : true;
	});
	$: display = conditions.findIndex((d) => d); // find the first one where conditions are true

	let mounted = false;
	$: mounted;
	onMount(() => {
		mounted = true;
	});

	$: if (mounted && computeViewLandscape && checkConditions.every(Boolean)) {
		// make sure all conditions functions are loaded
		// waitFor((_) => checkConditions.every(Boolean)).then((_) => {
		let w = spec.maxSize.w;
		let h = spec.maxSize.h;

		// get an array of max width by max height that records which view state is displayed at each size
		let arr = range(0, w, vlInterval).map((x) => {
			return range(0, h, vlInterval).map((y) => {
				for (let i = 0; i < spec.views.length; i++) {
					if (checkConditions[i](x, y)) {
						return i;
					}
				}
			});
		});

		// draw this array on a canvas
		let canvas = document.createElement('canvas');
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);

		let c = canvas.getContext('2d');
		for (let x = 0; x < arr.length; x++) {
			for (let y = 0; y < arr[0].length; y++) {
				c.fillStyle = typeof arr[x][y] == 'number' ? vlColors[arr[x][y]] : '#fff';
				c.fillRect(x * vlInterval, y * vlInterval, vlInterval, vlInterval);
			}
		}

		let dataURL = canvas.toDataURL();

		viewLandscape = { mode: 'dynamic', dataArray: arr, dataURL, size: [w, h] };
	}
</script>

<div id="outer-container">
	<div
		id="container"
		style="width:{spec.initSize.w}px; height:{spec.initSize.h}px; max-width:{spec.maxSize
			.w}px; max-height:{spec.maxSize.h}px; min-width:{spec.minSize.w}px; min-height:{spec.minSize
			.h}px"
		bind:offsetWidth={width}
		bind:offsetHeight={height}
	>
		{#each spec.views as view, i}
			<svelte:component
				this={view.type}
				data={view.data}
				params={view.params}
				conditions={view.conditions}
				context={{
					width,
					height,
					spec
				}}
				display={display === i}
				bind:checkConditions={checkConditions[i]}
			/>
		{/each}
	</div>
	<!-- slot for optional overlay -->
	<slot />
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
		background-color: #fff;
	}
</style>
