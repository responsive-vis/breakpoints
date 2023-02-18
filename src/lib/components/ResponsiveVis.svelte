<script>
	import { range } from 'd3';

	export let data;
	export let params;
	export let width;
	export let height;
	export let viewLandscape;

	// default parameters
	params.initSize = params.initSize ? params.initSize : { w: 600, h: 400 };
	params.maxSize = params.maxSize ? params.maxSize : { w: 1000, h: 700 };
	params.minSize = params.minSize ? params.minSize : { w: 50, h: 50 };

	let conditions = Array(params.viewStates.length).fill(true); // intialise array with TRUE for each view state
	$: conditions;
	$: display = conditions.findIndex((d) => d); // find the first one where conditions are true

	let checkConditions = Array(params.viewStates.length).fill(undefined);
	$: checkConditions;
	// $: console.log(checkConditions);
	$: viewLandscape;
	// $: console.log(viewLandscape);

	$: if (checkConditions.every(Boolean)) {
		viewLandscape = range(params.maxSize.w).map((x) => {
			return range(params.maxSize.h).map((y) => {
				for (let i = 0; i < params.viewStates.length; i++) {
					if (checkConditions[i](x, y)) {
						return i;
					}
				}
			});
		});
	}
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
