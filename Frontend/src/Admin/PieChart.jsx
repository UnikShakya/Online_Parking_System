import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

function PieChartComponent() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'Four wheeler', color: '#FF5733' }, // Green
            { id: 1, value: 20, label: 'Two wheeler', color: '#8B5CF6' }, // Blue
          ],
          valueFormatter: (item) => `${item.value}`, // Shows only the value inside
          highlightScope: { faded: 'global', highlighted: 'item' }, // Optional: Adds hover effect
          arcLabel: 'value', // Displays the value inside the pie slices
          arcLabelMinAngle: 20, // Ensures labels are shown even for small angles
        },
      ]}
      width={600}
      height={400}
      slotProps={{
        legend: { position: { vertical: 'bottom', horizontal: 'right' } },
      }}
      sx={{
        // Custom styling for the arc labels (text inside the pie)
        '& .MuiChartsArcLabel-root': {
          fill: '#FFFFFF', // White text inside the circle
          fontSize: '14px', // Adjust font size
          fontWeight: 'bold', // Make it bold for visibility
        },
      }}
    />
  );
}

export default PieChartComponent;