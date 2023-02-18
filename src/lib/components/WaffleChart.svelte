<script>
	// waffle chart
	viewStates.wafflechart = function (container, params) {
		const g = container
			.select('#svg')
			.append('g')
			.attr('id', 'wafflechart')
			.attr('class', 'viewState');

		const countries = ['Scotland', 'Northern Ireland', 'Wales', 'England'].map((d) => ({
			country: d,
			data: params.data
				.filter((el) => el.country_name === d)
				.sort((a, b) => a.first_party > b.first_party)
		}));

		const n_categories = countries.length;
		const n_datapoints = params.data.length;

		let country = g.selectAll('g').data(countries).enter().append('g');

		let headers = country.append('text').text((d) => d.country);

		let squares = country
			.selectAll('rect')
			.data((d) => d.data)
			.enter()
			.append('rect')
			.attr('fill', (d) => params.colorScale(d.first_party));

		function partsSums(ls) {
			let sum = 0;
			let res = [0];
			for (let i = 1; i <= ls.length; i++) {
				sum += ls[i - 1];
				res.push(sum);
			}
			return res;
		}

		const adapt = function (e) {
			// compute new sizes/grid
			let label = 30; // could update this step-wise?
			let margin = 5;
			let w = e.x - margin * 2;
			let h = e.y - label * n_categories - margin * 2; // 20px for each header, 5px *2 for margins
			let size = Math.floor(Math.sqrt(((w * h) / n_datapoints) * 0.7)); // spare space
			let padding = Math.ceil(size * 0.15);
			let wn = Math.floor(w / (size + padding));

			let translate = partsSums(countries.map((d) => (d.data.length / wn) * (size + padding)));

			// update chart
			country.attr('transform', (d, i) => `translate(5,${translate[i] + (i + 1) * label})`);
			headers.attr('font-size', label / 2).attr('y', -0.13 * label);
			squares
				// .transition()
				// .duration(50)
				.attr('width', size)
				.attr('height', size)
				.attr('x', (d, i) => (i % wn) * (size + padding))
				.attr('y', (d, i) => Math.floor(i / wn) * (size + padding));
		};

		const conditions = function () {
			return true;
		};

		return { adapt: adapt, conditions: conditions };
	};
</script>
