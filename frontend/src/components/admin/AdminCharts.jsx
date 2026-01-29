import React, { useState } from 'react';

// Helper to generate smooth SVG path
const getSmoothPath = (points, height, width) => {
    if (points.length === 0) return "";
    
    // Points are already normalized to 0-100 range in the component
    // We need to map them to the SVG viewbox (0 0 100 100)
    // Note: In SVG, y=0 is top, so we invert y.
    
    const data = points.map(p => [p.x, p.y]);
    
    if (data.length === 1) return `M ${data[0][0]} ${data[0][1]} L ${width} ${data[0][1]}`;

    let d = `M ${data[0][0]} ${data[0][1]}`;
    
    for (let i = 0; i < data.length - 1; i++) {
        const x0 = i > 0 ? data[i - 1][0] : data[i][0];
        const y0 = i > 0 ? data[i - 1][1] : data[i][1];
        const x1 = data[i][0];
        const y1 = data[i][1];
        const x2 = data[i + 1][0];
        const y2 = data[i + 1][1];
        const x3 = i !== data.length - 2 ? data[i + 2][0] : x2;
        const y3 = i !== data.length - 2 ? data[i + 2][1] : y2;

        const cp1x = x1 + (x2 - x0) / 6;
        const cp1y = y1 + (y2 - y0) / 6;
        const cp2x = x2 - (x3 - x1) / 6;
        const cp2y = y2 - (y3 - y1) / 6;

        d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
    }
    return d;
};

export const BarChart = ({ data, height = 200, color = '#4f46e5' }) => {
    const maxVal = Math.max(...data.map(d => d.value)) || 1;
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div style={{ height: `${height}px`, width: '100%', display: 'flex', alignItems: 'flex-end', gap: '8px', paddingBottom: '20px' }}>
            {data.map((d, i) => (
                <div key={i} 
                    style={{ 
                        flex: 1, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        height: '100%',
                        position: 'relative',
                        cursor: 'pointer'
                    }}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    {/* Tooltip */}
                    {hoveredIndex === i && (
                        <div style={{
                            position: 'absolute',
                            top: '-35px',
                            background: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            whiteSpace: 'nowrap',
                            zIndex: 10,
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <strong>{d.label}</strong>: {d.value}
                        </div>
                    )}

                    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div style={{ 
                            width: '70%', 
                            height: `${(d.value / maxVal) * 100}%`, 
                            background: hoveredIndex === i ? `linear-gradient(180deg, ${color} 0%, ${color}88 100%)` : color,
                            borderRadius: '6px 6px 0 0',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            opacity: hoveredIndex !== null && hoveredIndex !== i ? 0.6 : 1,
                            boxShadow: hoveredIndex === i ? `0 0 15px ${color}66` : 'none'
                        }}></div>
                    </div>
                    <div style={{ 
                        fontSize: '0.7rem', 
                        color: hoveredIndex === i ? 'var(--text-main)' : 'var(--text-muted)', 
                        marginTop: '8px', 
                        fontWeight: hoveredIndex === i ? '600' : '400',
                        transition: 'color 0.2s'
                    }}>
                        {d.label}
                    </div>
                </div>
            ))}
        </div>
    );
};

export const LineChart = ({ data, height = 200, color = '#10b981' }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    
    if (!data || data.length < 2) {
        return <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Not enough data</div>;
    }

    const maxVal = Math.max(...data.map(d => d.value)) || 1;
    const minVal = Math.min(...data.map(d => d.value)) || 0;
    const range = maxVal - minVal || 1;
    
    // Normalize points to 0-100 coordinate space
    const points = data.map((d, i) => ({
        x: (i / (data.length - 1)) * 100,
        y: 100 - ((d.value - minVal) / range) * 80 - 10, // Keep some padding
        value: d.value,
        label: d.label
    }));

    const pathD = getSmoothPath(points, 100, 100);
    const fillPathD = `${pathD} L 100 100 L 0 100 Z`;

    return (
        <div style={{ height: `${height}px`, width: '100%', position: 'relative' }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                
                {/* Area Fill */}
                <path d={fillPathD} fill={`url(#gradient-${color})`} style={{ transition: 'd 0.5s ease' }} />
                
                {/* Line */}
                <path d={pathD} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" style={{ transition: 'd 0.5s ease' }} />
                
                {/* Interactive Points */}
                {points.map((p, i) => (
                    <g key={i} 
                       onMouseEnter={() => setHoveredPoint(i)}
                       onMouseLeave={() => setHoveredPoint(null)}
                       style={{ cursor: 'pointer' }}
                    >
                        <circle 
                            cx={p.x} 
                            cy={p.y} 
                            r={hoveredPoint === i ? 6 : 0} 
                            fill={color} 
                            stroke="var(--bg-card)" 
                            strokeWidth="2" 
                            vectorEffect="non-scaling-stroke"
                            style={{ transition: 'r 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
                        />
                        {/* Invisible hit area */}
                        <circle cx={p.x} cy={p.y} r="10" fill="transparent" vectorEffect="non-scaling-stroke" />
                    </g>
                ))}
            </svg>
            
            {/* Tooltip */}
            {hoveredPoint !== null && (
                <div style={{
                    position: 'absolute',
                    left: `${points[hoveredPoint].x}%`,
                    top: `${points[hoveredPoint].y}%`,
                    transform: 'translate(-50%, -45px)',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    whiteSpace: 'nowrap',
                    zIndex: 20,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    pointerEvents: 'none'
                }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{points[hoveredPoint].value} GP</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{points[hoveredPoint].label}</div>
                </div>
            )}
            
            {/* X-Axis Labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', padding: '0 10px' }}>
                {data.filter((_, i) => i === 0 || i === data.length - 1 || i === Math.floor(data.length / 2)).map((d, i) => (
                    <span key={i} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{d.label}</span>
                ))}
            </div>
        </div>
    );
};

export const PieChart = ({ data, size = 220 }) => {
    const total = data.reduce((acc, cur) => acc + cur.value, 0) || 1;
    let cumulativePercent = 0;
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const getCoordinatesForPercent = (percent, radius = 1) => {
        const x = radius * Math.cos(2 * Math.PI * percent);
        const y = radius * Math.sin(2 * Math.PI * percent);
        return [x, y];
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: `${size}px`, height: `${size}px`, position: 'relative' }}>
                <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    {data.map((slice, i) => {
                        const startPercent = cumulativePercent;
                        const slicePercent = slice.value / total;
                        cumulativePercent += slicePercent;
                        const endPercent = cumulativePercent;

                        const [startX, startY] = getCoordinatesForPercent(startPercent, 1);
                        const [endX, endY] = getCoordinatesForPercent(endPercent, 1);
                        
                        const innerRadius = 0.6;
                        const [innerStartX, innerStartY] = getCoordinatesForPercent(startPercent, innerRadius);
                        const [innerEndX, innerEndY] = getCoordinatesForPercent(endPercent, innerRadius);

                        const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

                        const pathData = [
                            `M ${startX} ${startY}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            `L ${innerEndX} ${innerEndY}`,
                            `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}`,
                            `Z`
                        ].join(' ');

                        return (
                            <g key={i} 
                               onMouseEnter={() => setHoveredIndex(i)}
                               onMouseLeave={() => setHoveredIndex(null)}
                               style={{ cursor: 'pointer' }}
                            >
                                <path 
                                    d={pathData} 
                                    fill={slice.color} 
                                    stroke="var(--bg-card)" 
                                    strokeWidth="0.02"
                                    style={{
                                        transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                        transform: hoveredIndex === i ? 'scale(1.05)' : 'scale(1)',
                                        transformOrigin: 'center'
                                    }}
                                />
                            </g>
                        );
                    })}
                    {/* Center Text */}
                    
                    {/* Center Text */}
                    <text x="0" y="0.1" textAnchor="middle" fill="var(--text-main)" fontSize="0.25" style={{ transform: 'rotate(90deg)' }} fontWeight="bold">
                        {hoveredIndex !== null ? data[hoveredIndex].value : total}
                    </text>
                    <text x="0" y="0.3" textAnchor="middle" fill="var(--text-muted)" fontSize="0.12" style={{ transform: 'rotate(90deg)' }}>
                        {hoveredIndex !== null ? data[hoveredIndex].label : 'Total'}
                    </text>
                </svg>
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                {data.map((d, i) => (
                    <div 
                        key={i} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            fontSize: '0.85rem', 
                            color: hoveredIndex === i ? 'var(--text-main)' : 'var(--text-muted)',
                            transition: 'color 0.2s',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: hoveredIndex === i ? 'var(--bg-card-hover)' : 'transparent'
                        }}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <span style={{ width: '8px', height: '8px', background: d.color, borderRadius: '50%', marginRight: '8px' }}></span>
                        {d.label}
                    </div>
                ))}
            </div>
        </div>
    );
};
