'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Filter, 
  Download, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Truck,
  Eye,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const OrdersPage = () => {
  const orders = [
    { id: 'ORD-7721', customer: 'Mecánica Rápida S.A.', date: '2024-04-04', total: '$1,240.00', status: 'En Proceso', priority: 'Media' },
    { id: 'ORD-8842', customer: 'Ind. Automotriz VIP', date: '2024-04-03', total: '$4,500.00', status: 'Enviado', priority: 'Alta' },
    { id: 'ORD-3129', customer: 'Taller Los Amigos', date: '2024-04-03', total: '$180.00', status: 'Pendiente', priority: 'Baja' },
    { id: 'ORD-9012', customer: 'Distribuidora Norte', date: '2024-04-02', total: '$8,950.00', status: 'Entregado', priority: 'Alta' },
    { id: 'ORD-4456', customer: 'Flotas del Sur', date: '2024-04-01', total: '$2,320.00', status: 'Cancelado', priority: 'Media' },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pendiente': return { bg: '#FEF3C7', color: '#D97706', icon: <Clock size={14} /> };
      case 'En Proceso': return { bg: '#DBEAFE', color: '#2563EB', icon: <Clock size={14} /> };
      case 'Enviado': return { bg: '#E0F2FE', color: '#0EA5E9', icon: <Truck size={14} /> };
      case 'Entregado': return { bg: '#DCFCE7', color: '#16A34A', icon: <CheckCircle2 size={14} /> };
      case 'Cancelado': return { bg: '#FEE2E2', color: '#DC2626', icon: <AlertCircle size={14} /> };
      default: return { bg: '#F1F5F9', color: '#64748B', icon: <Clock size={14} /> };
    }
  };

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div>
            <h1 className="title-font" style={{ fontSize: '28px' }}>Gestión de Pedidos</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Seguimiento en tiempo real de transacciones industriales.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar pedido o cliente..." 
              style={{ 
                width: '100%', 
                padding: '10px 12px 10px 40px', 
                borderRadius: '8px', 
                border: '1px solid #E2E8F0', 
                backgroundColor: 'white',
                outline: 'none',
                fontSize: '14px',
                color: 'black'
              }}
            />
          </div>
          <Bell size={20} color="var(--text-muted)" />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
          <button className="btn-primary">
              + NUEVO PEDIDO
          </button>
          <button style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'black' }}>
              <Download size={18} /> Exportar CSV
          </button>
          <div style={{ flex: 1 }}></div>
          <button style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'black' }}>
              <Filter size={18} /> Filtros Avanzados
          </button>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID Pedido</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cliente</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fecha</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                  </tr>
              </thead>
              <tbody style={{ color: 'black' }}>
                  {orders.map((order, index) => {
                      const statusStyle = getStatusStyle(order.status);
                      return (
                          <motion.tr 
                              key={order.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              style={{ borderBottom: '1px solid #F8FAFC' }}
                              className="hover-row"
                          >
                              <td style={{ padding: '16px 24px' }}>
                                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>{order.id}</span>
                              </td>
                              <td style={{ padding: '16px 24px' }}>
                                  <p style={{ fontSize: '14px', fontWeight: '700' }}>{order.customer}</p>
                                  <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PRIORIDAD: {order.priority}</p>
                              </td>
                              <td style={{ padding: '16px 24px', fontSize: '14px', color: 'black' }}>
                                  {order.date}
                              </td>
                              <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '800' }}>
                                  {order.total}
                              </td>
                              <td style={{ padding: '16px 24px' }}>
                                  <span style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '6px', 
                                      padding: '6px 12px', 
                                      borderRadius: '20px', 
                                      backgroundColor: statusStyle.bg, 
                                      color: statusStyle.color,
                                      width: 'fit-content',
                                      fontSize: '11px',
                                      fontWeight: '800',
                                      textTransform: 'uppercase'
                                  }}>
                                      {statusStyle.icon}
                                      {order.status}
                                  </span>
                              </td>
                              <td style={{ padding: '16px 24px' }}>
                                  <div style={{ display: 'flex', gap: '12px' }}>
                                      <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Eye size={18} /></button>
                                      <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><FileText size={18} /></button>
                                  </div>
                              </td>
                          </motion.tr>
                      );
                  })}
              </tbody>
          </table>
          <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mostrando 5 de 1,240 pedidos</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer', color: 'black' }}>Anterior</button>
                  <button style={{ padding: '4px 12px', borderRadius: '4px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: '800' }}>1</button>
                  <button style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer', color: 'black' }}>Siguiente</button>
              </div>
          </div>
      </div>
    </>
  );
};

export default OrdersPage;
