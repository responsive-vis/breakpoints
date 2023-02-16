// Centroid of features, to place circles at
// from https://observablehq.com/@harrystevens/dorling-cartogram
// Find the centroid of the largest polygon
const centroid = (feature) => {
	const geometry = feature.geometry;
	if (geometry.type === 'Polygon') {
		return d3.geoCentroid(feature);
	} else {
		let largestPolygon = {},
			largestArea = 0;
		geometry.coordinates.forEach((coordinates) => {
			const polygon = { type: 'Polygon', coordinates },
				area = d3.geoArea(polygon);
			if (area > largestArea) {
				largestPolygon = polygon;
				largestArea = area;
			}
		});
		return d3.geoCentroid(largestPolygon);
	}
};

export { centroid };
