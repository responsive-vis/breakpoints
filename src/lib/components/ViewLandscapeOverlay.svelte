<script>
	export let viewLandscape;
</script>

<div
	id="landscape-overlay"
	style="width:{viewLandscape.size[0]}px; height:{viewLandscape
		.size[1]}px; background-image: url({viewLandscape.image})"
/>

<style>
	#landscape-overlay {
		position: absolute;
		display: block;
		left: 1px;
		top: 1px;
		pointer-events: none;
		opacity: 0.35;
	}
</style>
