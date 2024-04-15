// Separate PieChartComponent.js file
import React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

const PieChartComponent = ({ userDistributionData }) => {
	return (
		<PieChart
			series={[
				{
					data: userDistributionData,
					innerRadius: 30,
					outerRadius: 100,
					paddingAngle: 5,
					cornerRadius: 5,
					startAngle: -90,
					endAngle: 180,
					cx: 150,
					cy: 150,
				},
			]}
		/>
	);
};

export default PieChartComponent;
