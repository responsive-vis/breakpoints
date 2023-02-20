<script>
	import { range, schemeSet3 } from 'd3';
	import { onMount } from 'svelte';
	import { waitFor } from '$lib/helpers.js';

	export let spec; // must be provided and contains data and parameters for each view state
	export let width, height, viewLandscape; // can optionally be used on the page via e.g. bind:width={...}

	// set color scheme for view landscape
	const vlColors = schemeSet3;

	// default parameters
	spec.initSize = spec.initSize ? spec.initSize : { w: 600, h: 400 };
	spec.maxSize = spec.maxSize ? spec.maxSize : { w: 1000, h: 700 };
	spec.minSize = spec.minSize ? spec.minSize : { w: 50, h: 50 };

	let conditions = Array(spec.viewStates.length).fill(true); // intialise array with TRUE for each view state
	$: conditions;
	$: display = conditions.findIndex((d) => d); // find the first one where conditions are true

	let checkConditions = Array(spec.viewStates.length).fill(undefined);
	$: checkConditions;
	$: viewLandscape;

	// get view landscape when things are first mounted/rendered
	onMount(() => {
		// make sure all conditions functions are loaded
		waitFor((_) => checkConditions.every(Boolean)).then((_) => {
			let w = spec.maxSize.w;
			let h = spec.maxSize.h;

			// get an array of max width by max height that records which view state is displayed at each size
			let arr = range(spec.maxSize.w).map((x) => {
				return range(spec.maxSize.h).map((y) => {
					for (let i = 0; i < spec.viewStates.length; i++) {
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
			for (let x = 0; x < w; x++) {
				for (let y = 0; y < h; y++) {
					c.fillStyle = typeof arr[x][y] == 'number' ? vlColors[arr[x][y]] : '#fff';
					c.fillRect(x, y, 1, 1);
				}
			}

			let dataURL = canvas.toDataURL();

			viewLandscape = { data: arr, image: dataURL, size: [w, h] };
		});
	});
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
		{#each spec.viewStates as viewState, i}
			<svelte:component
				this={viewState.type}
				data={viewState.data}
				params={viewState.params}
				context={{
					width,
					height,
					spec
				}}
				bind:conditions={conditions[i]}
				bind:checkConditions={checkConditions[i]}
				display={display == i}
			/>
		{/each}
	</div>
	<!-- for optional overlay -->
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
	}
</style>