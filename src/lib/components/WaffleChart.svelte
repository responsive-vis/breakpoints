<script>
	export let data, params, conditions; // provided by responsive vis component from spec
	export let context, display; // provided by responsive vis component
	export const checkConditions = () => true; // exported for use in responsive vis component

	$: height = context.height;
	$: width = context.width;
	$: display;

	let spec = context.spec;

	const results = data.results;

	const countries = ['Scotland', 'Northern Ireland', 'Wales', 'England'].map((d) => ({
		country: d,
		data: results
			.filter((el) => el.country_name === d)
			.sort((a, b) => a.first_party > b.first_party)
	}));

	const n_categories = countries.length;
	const n_datapoints = results.length;

	function partsSums(ls) {
		let sum = 0;
		let res = [0];
		for (let i = 1; i <= ls.length; i++) {
			sum += ls[i - 1];
			res.push(sum);
		}
		return res;
	}

	// Layout
	let label = 30; // could update this step-wise?
	let margin = 5;

	let w, h, size, padding, wn, translate;
	$: w = width - margin * 2;
	$: h = height - label * n_categories - margin * 2; // 20px for each header, 5px *2 for margins
	$: size = Math.floor(Math.sqrt(((w * h) / n_datapoints) * 0.7)); // spare space
	$: padding = Math.ceil(size * 0.15);
	$: wn = Math.floor(w / (size + padding));
	$: translate = partsSums(countries.map((d) => (d.data.length / wn) * (size + padding)));

	// no conditions for now
</script>

{#if display}
	<svg width={spec.maxSize.w} height={spec.maxSize.h} id="svg">
		<g id="wafflechart" class="viewState">
			{#each countries as country, i}
				<g transform="translate(5,{translate[i] + (i + 1) * label})">
					<text font-size={label / 2} y={-0.13 * label}>{country.country}</text>
					{#each country.data as item, j}
						<rect
							width={size}
							height={size}
							x={(j % wn) * (size + padding)}
							y={Math.floor(j / wn) * (size + padding)}
							fill={params.colorScale(item.first_party)}
						/>
					{/each}
				</g>
			{/each}
		</g></svg
	>
{/if}
