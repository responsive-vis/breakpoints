<script>
	let hidden = false;

	function hideBanner() {
		hidden = true;
	}
</script>

<div class:hidden>
	We're working on an updated version of this library! Check it out on <a
		href="https://github.com/sarah37/svelte-responsive-vis">GitHub</a
	>
	and <a href="https://www.npmjs.com/package/svelte-responsive-vis">npm</a>.
	<button on:click={hideBanner}>×</button>
</div>

<style>
	div {
		background-color: #fffcca;
		border-bottom: 1px solid #222;
		position: sticky;
		top: 0;
		width: 100%;
		padding: 5px;
		text-align: center;
		box-sizing: border-box;
	}
	div.hidden {
		display: none;
	}

	button {
		position: absolute;
		right: 10px;
		font-weight: bold;
		border: none;
		background: transparent;
	}
</style>
