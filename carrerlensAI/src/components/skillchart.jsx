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
    </div>
  );
};

export default SkillChart;