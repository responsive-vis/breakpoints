<script>
	export let data;
	export let params;
	export let width;
	export let height;

	// default parameters
	params.initSize = params.initSize ? params.initSize : { w: 600, h: 400 };
	params.maxSize = params.maxSize ? params.maxSize : { w: 1000, h: 700 };
	params.minSize = params.minSize ? params.minSize : { w: 50, h: 50 };

	let conditions = Array(params.viewStates.length).fill(true); // intialise array with TRUE for each view state
	$: conditions;
	$: display = conditions.findIndex((d) => d); // find the first one where conditions are true
</script>

<div
	id="container"
	width={params.initSize.w}
	height={params.initSize.h}
	max-width={params.maxSize.w}
	max-height={params.maxSize.h}
	min-width={params.minSize.w}
	min-height={params.minSize.h}
	bind:offsetWidth={width}
	bind:offsetHeight={height}
>
	<svg width={params.maxSize.w} height={params.maxSize.h} id="svg">
		{#each params.viewStates as viewState, i}
			<svelte:component
				this={viewState.type}
				{data}
				params={viewState.params}
				context={{ width: width, height: height }}
				bind:conditions={conditions[i]}
				display={display == i}
			/>
		{/each}
	</svg>
</div>

<style>
	#container {
		overflow: hidden;
		resize: both;
		position: relative;
		border: 1px solid #ccc;
	}
</style>
