<script>
	export let data;
	export let params;
	export let width;
	export let height;

	import CircleMap from './CircleMap.svelte';

	let circleMapParams = params.viewStates.circleMap;

	// default parameters
	params.initSize = params.initSize ? params.initSize : { w: 600, h: 400 };
	params.maxSize = params.maxSize ? params.maxSize : { w: 1000, h: 700 };
	params.minSize = params.minSize ? params.minSize : { w: 50, h: 50 };
	params.container = params.container ? params.container : '#container';
	// throw warning if viewStates is undefined
</script>

<!-- hard coding the circle map for now -->

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
		<CircleMap {data} {params} context={{ width: width, height: height }} />
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
