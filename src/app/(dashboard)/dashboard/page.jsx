'use client';

import React from 'react';
import StatsCard from '@/components/StatsCard';
import RecentOrders from '@/components/RecentOrders';
import {
  Search,
  Bell,
  Settings,
  User,
  Calendar,
  Download,
  AlertCircle,
  Clock,
  ArrowUpRight,
  BarChart3,
  ShoppingCart,
  Package,
  LogOut,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const displayName = user?.name || user?.nombre || user?.email || 'Admin Kayparts';
  const displayRole = user?.role || user?.rol || 'Head of Operations';

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Buscar pedidos, componentes..." 
            style={{ 
              width: '100%', 
              padding: '12px 12px 12px 40px', 
              borderRadius: '8px', 
              border: 'none', 
              backgroundColor: 'white', 
              boxShadow: 'var(--shadow-sm)',
              outline: 'none',
              color: 'black'
            }}
          />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative' }}>
            <Bell size={20} color="var(--text-muted)" />
            <div style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', border: '2px solid white' }}></div>
          </div>
          <Settings size={20} color="var(--text-muted)" />
          <div style={{ height: '24px', width: '1px', background: '#E2E8F0' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', fontWeight: '800' }}>{displayName}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{displayRole}</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={20} color="white" />
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '6px' }}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 className="title-font" style={{ fontSize: '28px', marginBottom: '4px' }}>Dashboard Central</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Visión técnica del rendimiento industrial de Kayparts.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', boxShadow: 'var(--shadow-sm)' }}>
            <Calendar size={18} color="var(--text-muted)" />
            Enero 2024
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
            <Download size={18} /> Exportar Reporte
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-cols-stats">
        <StatsCard label="Ventas Totales" value="$284,590.00" trend="up" trendValue="+12.5%" icon={<BarChart3 size={20} />} />
        <StatsCard label="Pedidos Pendientes" value="42" status="Urgente" icon={<ShoppingCart size={20} />} />
        <StatsCard label="Fuera de Stock" value="12" status="Re-stock" icon={<Package size={20} />} />
        <StatsCard label="Clientes Nuevos" value="156" trend="up" trendValue="Este mes" icon={<User size={20} />} />
      </div>

      {/* Main Content Area: Split */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px', marginTop: '24px' }}>
        {/* Chart Section */}
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Proyección de Ventas</h3>
             <div style={{ display: 'flex', gap: '16px', fontSize: '12px', fontWeight: '600', color: 'var(--text-muted)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }}></div> Actual
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#CBD5E1' }}></div> Anterior
               </div>
             </div>
           </div>
           
           {/* Chart Visualization */}
           <div style={{ height: '300px', width: '100%', position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px' }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                 {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: '100%', borderTop: '1px dashed #E2E8F0' }}></div>)}
              </div>
              {['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL'].map((month, i) => (
                <div key={month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', zIndex: 1 }}>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                     <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: [60, 120, 180, 140, 220, 190, 250][i] }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      style={{ width: '12px', background: 'var(--primary)', borderRadius: '4px 4px 0 0' }}
                     />
                     <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: [40, 90, 130, 110, 160, 140, 180][i] }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      style={{ width: '12px', background: '#CBD5E1', borderRadius: '4px 4px 0 0' }}
                     />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)' }}>{month}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Alerts Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Alertas Críticas</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ borderLeft: '4px solid #EF4444', backgroundColor: '#FEF2F2', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <AlertCircle size={18} color="#EF4444" />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700' }}>Cigüeñal Ford F-150</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Stock inferior al mínimo requerido (2 unidades).</p>
                  </div>
                </div>
              </div>

              <div style={{ borderLeft: '4px solid #F59E0B', backgroundColor: '#FFFBEB', padding: '16px', borderRadius: '0 8px 8px 0' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={18} color="#F59E0B" />
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: '700' }}>Retraso en Envío #4582</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Transportista reporta demora climática en aduana.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ 
            background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', 
            padding: '24px', 
            borderRadius: 'var(--radius-lg)',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Optimiza tu Inventario</h3>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', marginBottom: '20px' }}>IA sugiere aumentar pedido de filtros de aceite por alta demanda estacional.</p>
            <button style={{ 
              width: '100%', 
              backgroundColor: 'white', 
              color: 'var(--dark)', 
              border: 'none', 
              padding: '10px', 
              borderRadius: '8px', 
              fontWeight: '700', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}>
              VER RECOMENDACIÓN <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Footer Order Table */}
      <RecentOrders />
    </>
  );
};

export default DashboardPage;
