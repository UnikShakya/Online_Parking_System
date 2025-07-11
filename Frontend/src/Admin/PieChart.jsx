import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

function PieChartComponent() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'Four wheeler', color: '#FF5733' }, 
            { id: 1, value: 20, label: 'Two wheeler', color: '#8B5CF6' },
          ],
          valueFormatter: (item) => `${item.value}`, 
          highlightScope: { faded: 'global', highlighted: 'item' }, 
          arcLabel: 'value', 
          arcLabelMinAngle: 20, 
        },
      ]}
      width={600}
      height={400}
      slotProps={{
        legend: { position: { vertical: 'bottom', horizontal: 'right' } },
      }}
      sx={{
        '& .MuiChartsArcLabel-root': {
          fill: '#FFFFFF', 
          fontSize: '14px', 
          fontWeight: 'bold', 
        },
      }}
    />
  );
}

export default PieChartComponent;