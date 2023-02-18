<script>
	export let x = -100;
	export let y = -100;
	export let content = '';
	export let fontsize;
</script>

<text
	{x}
	{y}
	font-size={fontsize}
	text-anchor="middle"
	dominant-baseline="middle"
	pointer-events="none">{content}</text
>
