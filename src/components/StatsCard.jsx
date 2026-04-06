import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ icon, label, value, trend, trendValue, status }) => {
  return (
    <div className="glass" style={{ 
      padding: '24px', 
      borderRadius: 'var(--radius-lg)', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '12px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          backgroundColor: '#F3F4F6', 
          width: '44px', 
          height: '44px', 
          borderRadius: '10px', 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--dark)'
        }}>
          {icon}
        </div>
        {status && (
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            padding: '4px 8px', 
            borderRadius: '4px',
            backgroundColor: status === 'Urgente' ? '#FEE2E2' : '#FEF3C7',
            color: status === 'Urgente' ? '#EF4444' : '#D97706'
          }}>
            {status}
          </span>
        )}
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700', color: trend === 'up' ? '#10B981' : '#EF4444' }}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {trendValue}
          </div>
        )}
      </div>

      <div>
        <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</p>
        <h3 style={{ fontSize: '28px', fontWeight: '800', marginTop: '4px' }}>{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
