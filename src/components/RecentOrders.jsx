import React from 'react';
import { MoreVertical } from 'lucide-react';

const RecentOrders = () => {
  const orders = [
    { id: '#KP-8924', customer: 'Juan Rodriguez', detail: 'Taller Central Monterrey', date: '14 Ene, 2024', amount: '$1,450.00', status: 'Completado', statusColor: '#10B981', initials: 'JR' },
    { id: '#KP-8923', customer: 'Maria Cummins', detail: 'Cummins Engine Spares', date: '14 Ene, 2024', amount: '$3,820.70', status: 'En Proceso', statusColor: '#3B82F6', initials: 'MC' },
    { id: '#KP-8922', customer: 'Auto Partes SA', detail: 'Distribuidora CDMX', date: '13 Ene, 2024', amount: '$890.00', status: 'Pendiente', statusColor: '#F59E0B', initials: 'AS' },
  ];

  return (
    <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Pedidos Recientes</h3>
        <a href="#" style={{ fontSize: '12px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase', textDecoration: 'none' }}>Ver todo el historial</a>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID Pedido</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cliente</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fecha</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monto</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado</th>
              <th style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s ease', cursor: 'pointer' }} className="hover-row">
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '700' }}>{order.id}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: '#E2E8F0', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: '11px', 
                      fontWeight: '800' 
                    }}>
                      {order.initials}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: '700' }}>{order.customer}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.detail}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>{order.date}</td>
                <td style={{ padding: '16px', fontSize: '14px', fontWeight: '800' }}>{order.amount}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: '700', 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    backgroundColor: `${order.statusColor}20`, 
                    color: order.statusColor 
                  }}>
                    • {order.status}
                  </span>
                </td>
                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>
                  <MoreVertical size={18} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
