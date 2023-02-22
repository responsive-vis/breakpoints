<script>
	export let data, params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export let checkConditions; // exported for use in responsive vis component

	import { VegaLite } from 'svelte-vega';

	// {#each spec.viewStates as viewState, i}
	// 		<svelte:component
	// 			this={viewState.type}
	// 			data={viewState.data}
	// 			params={viewState.params}
	// 			conditions={viewState.conditions}
	// 			context={{
	// 				width,
	// 				height,
	// 				spec
	// 			}}
	// 			display={display === i}
	// 			bind:checkConditions={checkConditions[i]}
	// 		/>
	// 	{/each}

	$: height = context.height;
	$: width = context.width;
	$: display;

	checkConditions = function (w, h) {
		return w > conditions.minWidth;
	};
</script>

{#if display}
	<VegaLite {data} spec={params} />
{/if}
