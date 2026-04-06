'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  User, 
  Plus, 
  MoreVertical, 
  Zap,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const SuppliersPage = () => {
  const suppliers = [
    { name: 'Suministros Globales S.A.', category: 'Partes de Motor', status: 'Certificado', rating: 4.8, performance: '98%', logo: 'https://logo.clearbit.com/bosch.com' },
    { name: 'Importaciones Automotrices LTDA', category: 'Frenos y Suspensión', status: 'Verificado', rating: 4.5, performance: '92%', logo: 'https://logo.clearbit.com/brembo.com' },
    { name: 'Industrial Parts Co.', category: 'Transmisión', status: 'Certificado', rating: 4.9, performance: '99%', logo: 'https://logo.clearbit.com/zf.com' },
    { name: 'Mecánica Pro S.A.S.', category: 'Mantenimiento Elect.', status: 'Standby', rating: 3.2, performance: '75%', logo: 'https://logo.clearbit.com/denso.com' },
  ];

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div>
            <h1 className="title-font" style={{ fontSize: '28px' }}>Directorio de Proveedores</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestión técnica del ecosistema de abastecimiento industrial.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o categoría..." 
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>Proveedores Activos ({suppliers.length})</h3>
          <button className="btn-primary">
              <Plus size={20} /> AGREGAR PROVEEDOR
          </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {suppliers.map((supplier, index) => (
              <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass"
                  style={{ padding: '24px', borderRadius: '16px', backgroundColor: 'white', display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ width: '56px', height: '56px', border: '1px solid #F1F5F9', borderRadius: '12px', overflow: 'hidden', padding: '10px', backgroundColor: '#F8FAFC', position: 'relative' }}>
                          <img src={supplier.logo} alt={supplier.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ 
                              fontSize: '9px', 
                              fontWeight: '800', 
                              padding: '4px 8px', 
                              borderRadius: '4px', 
                              backgroundColor: supplier.status === 'Certificado' ? '#DCFCE7' : '#EFF6FF', 
                              color: supplier.status === 'Certificado' ? '#15803D' : '#1E40AF',
                              textTransform: 'uppercase'
                          }}>
                              {supplier.status}
                          </span>
                          <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                      </div>
                  </div>

                  <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px', color: 'black' }}>{supplier.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>{supplier.category}</p>
                      
                      <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                          <div>
                              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>Rating</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '800', color: 'black' }}>
                                  <Star size={14} color="#D97706" fill="#D97706" /> {supplier.rating}
                              </div>
                          </div>
                          <div>
                              <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '2px' }}>Performance</p>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: '800', color: supplier.performance > '90%' ? '#10B981' : '#F59E0B' }}>
                                  <Zap size={14} fill="currentColor" /> {supplier.performance}
                              </div>
                          </div>
                      </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                      <button style={{ flex: 1, backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', color: 'var(--text-main)', fontSize: '11px', fontWeight: '800', padding: '10px', borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase' }}>
                          Historial
                      </button>
                      <button style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontSize: '11px', fontWeight: '800', padding: '10px', borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase' }}>
                          Contacto
                      </button>
                  </div>
              </motion.div>
          ))}

          <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ 
                  borderRadius: '16px', 
                  border: '2px dashed #E2E8F0', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '40px', 
                  backgroundColor: 'rgba(248, 250, 252, 0.5)',
                  cursor: 'pointer'
              }}
          >
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Plus size={24} color="var(--text-muted)" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)' }}>Agregar Socio Estratégico</p>
          </motion.div>
      </div>
    </>
  );
};

export default SuppliersPage;
