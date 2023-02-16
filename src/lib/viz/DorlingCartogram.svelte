<script>
	circleCartogram = function (container, params) {
		// parameters specifically for this vis type
		let local = params.viewStates.find((d) => d.type === 'circleCartogram');
		let params_local = local.params;

		const projection = params_local.projection;

		// g for cartogram
		const g = container
			.select('#svg')
			.append('g')
			.attr('id', 'circleCartogram')
			.attr('class', 'viewState');
		const circles = g.append('g').attr('id', 'circles');
		const legend = g.append('g').attr('id', 'legend');

		// fit projection to container + geo data
		projection.fitSize([params.initSize.w, params.initSize.h], params.map);

		// circle radius for Dorling/packed circles (slightly bigger)
		const r = d3
			.scaleSqrt()
			.domain([0, d3.max(params.map.features, (d) => d.properties.POP_EST)])
			.range([0, Math.sqrt(params.initSize.w * params.initSize.h) / 10]);

		// get Dorling cartogram positions
		// adds/updates d.x and d.y
		let dorlingSimulation = d3
			.forceSimulation(params.map.features)
			.force(
				'x',
				d3.forceX((d) => projection(d.properties.centroid)[0])
			)
			.force(
				'y',
				d3.forceY((d) => projection(d.properties.centroid)[1])
			)
			.force(
				'collide',
				d3.forceCollide((d) => r(d.properties.POP_EST))
			)
			.stop();
		dorlingSimulation.tick(200);
		params.map.features.forEach(function (d) {
			d.properties.dorlingX = d.x;
			d.properties.dorlingY = d.y + 30;
		});

		// draw circles
		circles
			.selectAll('circle')
			.data(params.map.features)
			.enter()
			.append('circle')
			.attr('fill', (d) => params_local.circleColor(d))
			.attr('fill-opacity', 0.4)
			.attr('r', (d) => r(d.properties.POP_EST))
			.attr('cx', (d) => d.properties.dorlingX)
			.attr('cy', (d) => d.properties.dorlingY)
			.attr('stroke', params_local.circleColor)
			.on('mouseover', function (d) {
				d3.select('#tooltip')
					.attr('x', d3.select(this).attr('cx'))
					.attr('y', d3.select(this).attr('cy'))
					.text(d.originalTarget.__data__.properties.ADMIN);
			})
			.on('mouseout', function () {
				d3.select('#tooltip').attr('x', -100).attr('y', -100);
			});

		// get initial bbox of circles + compute aspect ratio
		const mapInitBBox = circles.node().getBBox();
		const mapAR = mapInitBBox.width / mapInitBBox.height;

		// make circles align with top left corner
		// will be centered in adapt function
		circles.attr('transform', `translate(${-mapInitBBox.x},${-mapInitBBox.y})`);

		// legend
		// let n = d3.format(".2s"); // number formatting
		let circleLegend = legendCircle()
			.scale(r)
			.tickValues(params_local.legendTickValues)
			.tickFormat(
				(d, i, e) => params_local.legendTickFormat(d, i, e)
				// do this to add label to last one
				// i === e.length - 1 ? d + " bushels of hay" : d
			)
			.tickSize(5); // defaults to 5
		legend.call(circleLegend);

		// position legend in bottom left of map area
		// get size of legend
		const legendBBox = legend.node().getBBox();
		legend.attr(
			'transform',
			`translate(${local.params.legendPosLeft},${mapInitBBox.height - legendBBox.height - 5})`
		);
		// for custom positioning
		// .attr("transform", `translate(${params_local.legendPosition[0]},${params_local.legendPosition[1]})`)

		// calculate some things for conditions
		// mapAR is a const
		let pop_vals = params.map.features.map((d) => d.properties.POP_EST);
		let lower_bound = pop_vals.sort((a, b) => a - b)[Math.floor(pop_vals.length * 0.1)];

		const adapt = function (e) {
			// compute scale + translate so that map is always at max size, centered within the container
			const s = mapAR > e.x / e.y ? e.x / mapInitBBox.width : e.y / mapInitBBox.height;
			const t =
				mapAR < e.x / e.y
					? [(e.x - s * mapInitBBox.width) / 2, 0]
					: [0, (e.y - s * mapInitBBox.height) / 2];
			// g contains map, circles, and legend
			g.attr('transform', `translate(${t[0]},${t[1]}) scale(${s})`);
			circles.attr('stroke-width', `${1 / s}px`);

			// rescale legend
			circleLegend.adapt(s);
		};

		const conditions = function (e) {
			const s = mapAR > e.x / e.y ? e.x / mapInitBBox.width : e.y / mapInitBBox.height;
			let containerAR = e.x / e.y;

			// min r - at least 90% of circles visible
			return (
				// min r - at least 90% of circles visible
				r(lower_bound) * s > local.params.conditions.minCircleRadius &&
				// aspect ratio difference - no more than 1/3 white space
				containerAR / mapAR >= 1 / local.params.conditions.maxAspectRatioDiff &&
				containerAR / mapAR <= local.params.conditions.maxAspectRatioDiff
			);
		};

		return { adapt: adapt, conditions: conditions };
	};
</script>
