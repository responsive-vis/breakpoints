<script>
	import { range, schemeSet3 } from 'd3';
	import { onMount } from 'svelte';
	import { waitFor } from '$lib/helpers.js';

	export let data, params, width, height, viewLandscape;

	// set color scheme for view landscape
	const vlColors = schemeSet3;

	// default parameters
	params.initSize = params.initSize ? params.initSize : { w: 600, h: 400 };
	params.maxSize = params.maxSize ? params.maxSize : { w: 1000, h: 700 };
	params.minSize = params.minSize ? params.minSize : { w: 50, h: 50 };

	let conditions = Array(params.viewStates.length).fill(true); // intialise array with TRUE for each view state
	$: conditions;
	$: display = conditions.findIndex((d) => d); // find the first one where conditions are true

	let checkConditions = Array(params.viewStates.length).fill(undefined);
	$: checkConditions;
	$: viewLandscape;

	// get view landscape when things are first mounted/rendered
	onMount(() => {
		// make sure all conditions functions are loaded
		waitFor((_) => checkConditions.every(Boolean)).then((_) => {
			let arr = range(params.maxSize.w).map((x) => {
				return range(params.maxSize.h).map((y) => {
					for (let i = 0; i < params.viewStates.length; i++) {
						if (checkConditions[i](x, y)) {
							return i;
						}
					}
				});
			});
			let w = arr.length;
			let h = arr[0].length;

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

			viewLandscape = { data: arr, image: dataURL };
		});
	});

	// $: if (checkConditions.every(Boolean)) {
	// }
</script>

<div id="outer-container">
	<div
		id="container"
		style="width:{params.initSize.w}px; height:{params.initSize.h}px; max-width:{params.maxSize
			.w}px; max-height:{params.maxSize.h}px; min-width:{params.minSize.w}px; min-height:{params
			.minSize.h}px"
		bind:offsetWidth={width}
		bind:offsetHeight={height}
	>
		<svg width={params.maxSize.w} height={params.maxSize.h} id="svg">
			{#each params.viewStates as viewState, i}
				<svelte:component
					this={viewState.type}
					{data}
					params={viewState.params}
					context={{
						width: width,
						height: height,
						maxWidth: params.maxSize.w,
						maxHeight: params.maxSize.h
					}}
					bind:conditions={conditions[i]}
					bind:checkConditions={checkConditions[i]}
					display={display == i}
				/>
			{/each}
		</svg>
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
