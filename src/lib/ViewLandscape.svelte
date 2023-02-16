<script>
	export let vis;
	export let colors;
	// d3.schemeDark2
	colors = colors ? colors : d3.schemeSet3;

	let canvas;
	let width = vis.maxSize.w;
	let height = vis.maxSize.h;

	let c = canvas.getContext('2d');

	// download.href = map.getCanvas().toDataURL();
	// download.download = "screenshot.png";
	// download.click();
	// to open image in new tab (requires popup permission) instead:

	for (let x = 0; x < vis.maxSize.w; x++) {
		for (let y = 0; y < vis.maxSize.h; y++) {
			for (let i = 0; i < vis.viewStates.length; i++) {
				if (vis.viewStates[i].conditions({ x: x, y: y })) {
					c.fillStyle = colors[i];
					c.fillRect(x, y, 1, 1);
					break;
				}
			}
		}
	}
	// remove everything under min size
	c.fillStyle = '#fff';
	c.fillRect(0, 0, vis.minSize.w, vis.minSize.h);
</script>

<!-- <canvas {width} {height}></canvas> -->

<canvas bind:this={canvas} {width} {height} />
