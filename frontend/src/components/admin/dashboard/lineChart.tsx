import React from 'react';
import { Line } from '@ant-design/charts';
import { Spin } from 'antd';

interface DataPoint {
  [key: string]: string | number;
}

interface LineChartProps {
  data: DataPoint[];
  xField: string;
  yField: string;
  seriesField?: string;
  height?: number;
  loading?: boolean;
  title?: string;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  xField,
  yField,
  seriesField,
  height = 300,
  loading = false,
  title,
}) => {
  const config = {
    data,
    xField,
    yField,
    seriesField,
    colorField: seriesField,
    height,
    smooth: true,
    animation: {
      appear: {
        animation: 'path-in',
        duration: 1000,
      },
    },
    tooltip: {
      showMarkers: true,
    },
    title: {
      visible: Boolean(title),
      text: title,
    },
    point: {
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#5B8FF9',
        lineWidth: 2,
      },
    },
  };

  if (loading) {
    return <Spin />;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div style={{ width: '100%' }}>
      <Line {...config} />
    </div>
  );
};

export default LineChart; 