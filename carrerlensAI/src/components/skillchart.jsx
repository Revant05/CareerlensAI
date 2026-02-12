import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Python', value: 25 },
  { name: 'JavaScript', value: 20 },
  { name: 'SQL', value: 20 },
  { name: 'Project Management', value: 20 },
  { name: 'UI/UX Design', value: 15 },
];

const COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd'];

import './skillchart.css';

const SkillChart = () => {
  return (
    <div className="mini-chart-container">
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => `${value}%`}
            contentStyle={{
              backgroundColor: '#1e293b',
              border: '1px solid #3b82f6',
              borderRadius: '8px',
              color: '#fff'
            }}
            itemStyle={{ color: '#fff' }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">My Progress</span>
          <span className="stat-value">78%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Complete Score</span>
          <span className="stat-value complete">92%</span>
        </div>
      </div>
    </div>
  );
};

export default SkillChart;