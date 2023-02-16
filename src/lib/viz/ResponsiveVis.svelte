<script>
	export let data;
	export let params;
	import CircleMap from './CircleMap.svelte';

	let circleMapParams = params.viewStates.circleMap;

	// default parameters
	params.initSize = params.initSize ? params.initSize : { w: 600, h: 400 };
	params.maxSize = params.maxSize ? params.maxSize : { w: 1000, h: 700 };
	params.minSize = params.minSize ? params.minSize : { w: 50, h: 50 };
	params.container = params.container ? params.container : '#container';
	// throw warning if viewStates is undefined

	const con = d3
		.select(params.container)
		.style('width', params.initSize.w + 'px')
		.style('height', params.initSize.h + 'px')
		.style('max-width', params.maxSize.w + 'px')
		.style('max-height', params.maxSize.h + 'px')
		.style('min-width', params.minSize.w + 'px')
		.style('min-height', params.minSize.h + 'px');
</script>

<!-- hard coding the circle map for now -->
<!-- 
<svg width={params.maxSize.w} height={params.maxSize.h} id='svg'>
	<CircleMap {data} params_local={circleMapParams} {params} />
</svg> -->
