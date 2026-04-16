import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useAuth } from '../context/AuthContext';
import './skillchart.css';

const COLORS = ['#3b82f6', '#2563eb', '#1d4ed8', '#60a5fa', '#93c5fd', '#a855f7', '#ec4899'];


const SkillChart = () => {
  const { user } = useAuth();
  
  // Transform user assessments into chart data
  const getChartData = () => {
    if (!user || !user.assessments || user.assessments.length === 0) {
      return [
        { name: 'No Data Yet', value: 100 }
      ];
    }

    // Group by category and take highest score for each
    const categories = {};
    user.assessments.forEach(asmt => {
      const cat = asmt.category || 'General';
      const score = asmt.aiInsights?.technicalScore || asmt.score || 0;
      if (!categories[cat] || score > categories[cat]) {
        categories[cat] = score;
      }
    });

    return Object.keys(categories).map(name => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: categories[name]
    }));
  };

  const chartData = getChartData();
  
  // Calculate Dynamic Progress
  const calculateProgress = () => {
    if (!user) return 0;
    const items = [
      user.headline,
      user.aspiration,
      user.isVerifiedPhone,
      user.education?.length > 0,
      user.swot?.strengths?.length > 0,
      user.resume
    ];
    return Math.round((items.filter(Boolean).length / items.length) * 100);
  };

  // Calculate Average Score
  const calculateCompleteScore = () => {
    if (!user || !user.assessments || user.assessments.length === 0) return 0;
    const total = user.assessments.reduce((sum, a) => sum + (a.aiInsights?.technicalScore || a.score || 0), 0);
    return Math.round(total / user.assessments.length);
  };

  const progress = calculateProgress();
  const avgScore = calculateCompleteScore();

  return (
    <div className="mini-chart-container">
      <ResponsiveContainer width="100%" height={150}>
        <PieChart>
          <Pie
            data={chartData}
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
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
          <span className="stat-value">{progress}%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Skill Accuracy</span>
          <span className="stat-value complete">{avgScore}%</span>
        </div>
      </div>
    </div>
  );
};

export default SkillChart;