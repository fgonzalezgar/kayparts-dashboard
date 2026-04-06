'use client';

import React from 'react';
import { 
  Truck, 
  Search, 
  Bell, 
  User, 
  ChevronRight, 
  AlertTriangle,
  Navigation
} from 'lucide-react';
import { motion } from 'framer-motion';

const ShippingPage = () => {
  const shipments = [
    { id: 'SHP-9921', order: 'ORD-7721', destination: 'Bogotá, COL', carrier: 'DHL Express', eta: '2024-04-06', status: 'En Tránsito' },
    { id: 'SHP-1242', order: 'ORD-8842', destination: 'Medellín, COL', carrier: 'Servientrega', eta: '2024-04-05', status: 'En Reparto' },
    { id: 'SHP-3319', order: 'ORD-3129', destination: 'Cali, COL', carrier: 'FedEx', eta: '2024-04-08', status: 'Pendiente' },
    { id: 'SHP-5512', order: 'ORD-9012', destination: 'Barranquilla, COL', carrier: 'TCC', eta: '2024-04-01', status: 'Entregado' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return '#F59E0B';
      case 'En Tránsito': return '#3B82F6';
      case 'En Reparto': return '#8B5CF6';
      case 'Entregado': return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div>
            <h1 className="title-font" style={{ fontSize: '28px' }}>Logística y Envíos</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Control de distribución y tiempos de entrega global.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar guía o destino..." 
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

      {/* Shipping Status Dashboard */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
          {[
              { label: 'Pendientes', value: '12', color: '#F59E0B' },
              { label: 'En Tránsito', value: '28', color: '#3B82F6' },
              { label: 'Entregados Hoy', value: '45', color: '#10B981' },
              { label: 'Incidencias', value: '3', color: '#EF4444' }
          ].map((stat, i) => (
              <div key={i} className="glass" style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'white' }}>
                  <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>{stat.label}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <p style={{ fontSize: '32px', fontWeight: '800', color: 'black' }}>{stat.value}</p>
                      <div style={{ height: '32px', width: '4px', backgroundColor: stat.color, borderRadius: '2px' }}></div>
                  </div>
              </div>
          ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Active Shipments List */}
          <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: 'black' }}>Envíos Activos</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {shipments.map((ship, index) => (
                      <motion.div 
                          key={ship.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          style={{ 
                              padding: '20px', 
                              border: '1px solid #F1F5F9', 
                              borderRadius: '12px', 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              alignItems: 'center',
                              backgroundColor: '#F8FAFC'
                          }}
                      >
                          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                              <div style={{ 
                                  width: '48px', 
                                  height: '48px', 
                                  borderRadius: '10px', 
                                  backgroundColor: 'white', 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                              }}>
                                  <Truck size={24} color="var(--primary)" />
                              </div>
                              <div>
                                  <p style={{ fontSize: '14px', fontWeight: '800', color: 'black' }}>{ship.id}</p>
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Pedido {ship.order} • {ship.carrier}</p>
                              </div>
                          </div>
                          
                          <div style={{ textAlign: 'center' }}>
                              <p style={{ fontSize: '13px', fontWeight: '700', color: 'black' }}>{ship.destination}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ETA: {ship.eta}</p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                              <span style={{ 
                                  fontSize: '10px', 
                                  fontWeight: '800', 
                                  textTransform: 'uppercase', 
                                  padding: '4px 10px', 
                                  borderRadius: '4px', 
                                  backgroundColor: `${getStatusColor(ship.status)}15`, 
                                  color: getStatusColor(ship.status) 
                              }}>
                                  {ship.status}
                              </span>
                              <ChevronRight size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                          </div>
                      </motion.div>
                  ))}
              </div>
          </div>

          {/* Sidebar Map Reference */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', backgroundColor: 'var(--dark)', color: 'white', overflow: 'hidden', position: 'relative' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Mapa de Cobertura</h4>
                  <div style={{ height: '200px', backgroundColor: '#1E293B', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <Navigation size={64} style={{ opacity: 0.1 }} />
                      <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)', borderRadius: '50%', position: 'absolute', top: '40%', left: '30%' }}
                      />
                       <motion.div 
                          animate={{ scale: [1, 1.2, 1] }} 
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          style={{ width: '8px', height: '8px', backgroundColor: '#3B82F6', borderRadius: '50%', position: 'absolute', top: '60%', left: '70%' }}
                      />
                      <p style={{ position: 'absolute', bottom: '12px', fontSize: '10px', opacity: 0.5 }}>Industrial Real-time Tracking Active</p>
                  </div>
                  <button style={{ 
                      width: '100%', 
                      marginTop: '20px', 
                      backgroundColor: 'var(--primary)', 
                      border: 'none', 
                      padding: '12px', 
                      borderRadius: '8px', 
                      color: 'white', 
                      fontWeight: '700', 
                      fontSize: '12px',
                      cursor: 'pointer'
                  }}>
                      Rastrear por Geolocalización
                  </button>
              </div>

              <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                      <AlertTriangle size={18} color="#EF4444" />
                      <div>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: '#EF4444' }}>Retraso Detectado</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.4' }}>Envío SHP-3319 presenta demora por condiciones climáticas en Ruta Nacional.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
};

export default ShippingPage;
