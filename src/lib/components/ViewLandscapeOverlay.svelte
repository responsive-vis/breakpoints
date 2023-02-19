<script>
	export let viewLandscape, width, height;
</script>

<div
	id="landscape-overlay"
	style="width:{width}px; height:{height}px; background-image: url({viewLandscape.image})"
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
