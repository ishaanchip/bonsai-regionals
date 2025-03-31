import React, { PureComponent } from "react";
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts";

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g pointerEvents="none">
        <text x={cx} y={cy} dy={-8} textAnchor="middle" className="piechart-info piechart-job"   style={payload.name.length > 18 ? { fontSize: '13px' } : {fontSize:'16px'}}>
            {payload.name}
        </text>
      <text x={cx} y={cy} dy={12} textAnchor="middle" className="piechart-info">
        ${payload.value}
      </text>
      <text x={cx} y={cy} dy={32} textAnchor="middle" className="piechart-info">
        {`${(percent * 100).toFixed(2)}%`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill="#6A8455" 
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill="#6A8455" 
      />

    </g>
  );
};

class CustomPieChart extends PureComponent {
  state = {
    activeIndex: 0,
  };

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { data, width = 400, height = 400 } = this.props; // Accept props for data, width, and height

    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={width} height={height}>
          <Pie
            activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={120}
            outerRadius={150}
            fill="rgb(161, 95, 55)"
            dataKey="value"
            onMouseEnter={this.onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}

export default CustomPieChart;