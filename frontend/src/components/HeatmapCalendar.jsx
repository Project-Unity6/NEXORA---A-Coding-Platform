import React, { useMemo } from 'react';

export default function HeatmapCalendar({ year = new Date().getFullYear(), contributions = {} }) {
  const cells = useMemo(() => {
    const list = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);
    
    // We want to align columns by week.
    // Let's find out how many days we have and how they align.
    const current = new Date(startDate);
    
    // To align properly: column = Math.floor((dayOfYear + startDayOfWeek) / 7)
    const startDayOfWeek = startDate.getDay(); // 0 = Sun, 1 = Mon, etc.
    
    let dayCount = 0;
    while (current <= endDate) {
      const dateString = current.toISOString().split('T')[0];
      const count = contributions[dateString] || 0;
      
      const dayOfWeek = current.getDay();
      // Calculate column index
      const colIndex = Math.floor((dayCount + startDayOfWeek) / 7);
      
      list.push({
        date: dateString,
        count,
        x: colIndex,
        y: dayOfWeek,
      });
      
      current.setDate(current.getDate() + 1);
      dayCount++;
    }
    
    return list;
  }, [year, contributions]);

  const getColor = (count) => {
    if (count === 0) return 'var(--warm-2)';
    if (count <= 2) return 'rgba(155, 125, 71, 0.3)';
    if (count <= 5) return 'rgba(155, 125, 71, 0.55)';
    if (count <= 9) return 'rgba(155, 125, 71, 0.8)';
    return 'var(--gold)';
  };

  const months = [
    { name: 'Jan', col: 0 },
    { name: 'Feb', col: 4 },
    { name: 'Mar', col: 8 },
    { name: 'Apr', col: 13 },
    { name: 'May', col: 17 },
    { name: 'Jun', col: 22 },
    { name: 'Jul', col: 26 },
    { name: 'Aug', col: 31 },
    { name: 'Sep', col: 35 },
    { name: 'Oct', col: 40 },
    { name: 'Nov', col: 44 },
    { name: 'Dec', col: 48 },
  ];

  return (
    <div className="heatmap-container">
      <div className="heatmap-scroll">
        <svg width="760" height="120" style={{ overflow: 'visible' }}>
          {/* Month labels */}
          {months.map(m => (
            <text
              key={m.name}
              x={m.col * 14 + 20}
              y="15"
              fontSize="9"
              fill="var(--ink-4)"
              fontFamily="var(--font-mono)"
            >
              {m.name}
            </text>
          ))}

          {/* Weekday labels */}
          <text x="0" y="38" fontSize="8" fill="var(--ink-4)" fontFamily="var(--font-mono)">Mon</text>
          <text x="0" y="66" fontSize="8" fill="var(--ink-4)" fontFamily="var(--font-mono)">Wed</text>
          <text x="0" y="94" fontSize="8" fill="var(--ink-4)" fontFamily="var(--font-mono)">Fri</text>

          {/* Grid cells */}
          <g transform="translate(25, 20)">
            {cells.map(cell => (
              <rect
                key={cell.date}
                x={cell.x * 14}
                y={cell.y * 13}
                width="11"
                height="11"
                rx="2"
                ry="2"
                fill={getColor(cell.count)}
                stroke="var(--border)"
                strokeWidth="0.5"
                style={{ cursor: 'pointer' }}
              >
                <title>{`${cell.count} submissions on ${cell.date}`}</title>
              </rect>
            ))}
          </g>
        </svg>

        <div className="heatmap-meta">
          <span>{cells.reduce((sum, c) => sum + (c.count > 0 ? 1 : 0), 0)} active days in {year}</span>
          <div className="heatmap-legend">
            <span>Less</span>
            <div className="legend-box" style={{ background: 'var(--warm-2)', border: '1px solid var(--border)' }} />
            <div className="legend-box" style={{ background: 'rgba(155, 125, 71, 0.3)', border: '1px solid var(--border)' }} />
            <div className="legend-box" style={{ background: 'rgba(155, 125, 71, 0.55)', border: '1px solid var(--border)' }} />
            <div className="legend-box" style={{ background: 'rgba(155, 125, 71, 0.8)', border: '1px solid var(--border)' }} />
            <div className="legend-box" style={{ background: 'var(--gold)', border: '1px solid var(--border)' }} />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
