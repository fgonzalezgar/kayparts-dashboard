'use client';

import React from 'react';
import { 
  Search, 
  Plus, 
  ChevronRight, 
  Bell, 
  Settings, 
  User,
  PlusCircle,
  Package
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const BrandsPage = () => {
  const brands = [
    { name: 'Toyota', location: 'Aichi, Japan', models: 42, tag: 'PREMIUM', logo: 'https://logo.clearbit.com/toyota.com' },
    { name: 'Ford', location: 'Michigan, USA', models: 38, logo: 'https://logo.clearbit.com/ford.com' },
    { name: 'Chevrolet', location: 'Michigan, USA', models: 56, logo: 'https://logo.clearbit.com/chevrolet.com' },
    { name: 'Honda', location: 'Tokyo, Japan', models: 29, logo: 'https://logo.clearbit.com/honda.com' },
    { name: 'BMW', location: 'Bavaria, Germany', models: 64, tag: 'LUXURY', logo: 'https://logo.clearbit.com/bmw.com' },
    { name: 'Volkswagen', location: 'Lower Saxony, Germany', models: 47, logo: 'https://logo.clearbit.com/vw.com' },
    { name: 'Nissan', location: 'Yokohama, Japan', models: 31, logo: 'https://logo.clearbit.com/nissan-global.com' },
  ];

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
          <input 
            type="text" 
            placeholder="Search brands, parts or models..." 
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
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '12px' }}>
            Sync Inventory
          </button>
          <Bell size={20} color="var(--text-muted)" />
          <Settings size={20} color="var(--text-muted)" />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      {/* Title Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 className="title-font" style={{ fontSize: '32px', marginBottom: '8px', textTransform: 'none', letterSpacing: '0' }}>Vehicle Brands</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '500px' }}>
            Manage the complete catalog of automotive manufacturers and their associated part ecosystems.
          </p>
        </div>
        <button className="btn-primary" style={{ backgroundColor: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={20} /> Agregar Nueva Marca
        </button>
      </div>

      {/* Brands Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {brands.map((brand, index) => (
          <motion.div 
            key={brand.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass"
            style={{ 
              borderRadius: 'var(--radius-lg)', 
              overflow: 'hidden',
              backgroundColor: 'white',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ 
              height: '140px', 
              backgroundColor: '#F1F5F9', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '20px'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <img unoptimized="true" src={brand.logo} alt={brand.name} style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
              </div>
            </div>
            
            <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>{brand.name}</h3>
                {brand.tag && (
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: '800', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    backgroundColor: brand.tag === 'PREMIUM' ? '#FEE2E2' : '#FEF3C7',
                    color: brand.tag === 'PREMIUM' ? '#EF4444' : '#D97706'
                  }}>
                    {brand.tag}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                {brand.location}
              </p>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: '800', color: 'black' }}>{brand.models}</p>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Modelos</p>
                </div>
                <div style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '8px', 
                  backgroundColor: '#F1F5F9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}>
                  <ChevronRight size={18} color="var(--dark)" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Brand Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: brands.length * 0.05 }}
          style={{ 
            borderRadius: 'var(--radius-lg)', 
            border: '2px dashed #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            cursor: 'pointer',
            backgroundColor: 'rgba(248, 250, 252, 0.5)'
          }}
        >
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            backgroundColor: '#FEE2E2', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <PlusCircle size={24} color="#EF4444" />
          </div>
          <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px', color: 'black' }}>Agregar Marca</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
            Registrar nuevo fabricante en el catálogo
          </p>
        </motion.div>
      </div>

      {/* Catalog Summary */}
      <div className="glass" style={{ marginTop: '40px', padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
         <div style={{ display: 'flex', gap: '60px' }}>
            <div>
               <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Resumen de Catálogo</p>
               <div style={{ display: 'flex', gap: '40px' }}>
                  <div>
                     <p style={{ fontSize: '32px', fontWeight: '800', color: 'black' }}>124</p>
                     <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Marcas Activas</p>
                  </div>
                  <div>
                     <p style={{ fontSize: '32px', fontWeight: '800', color: 'black' }}>1,842</p>
                     <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Modelos Totales</p>
                  </div>
               </div>
            </div>
         </div>
         
         <div style={{ 
           backgroundColor: 'var(--primary)', 
           padding: '24px', 
           borderRadius: 'var(--radius-lg)', 
           color: 'white',
           width: '300px',
           position: 'relative',
           overflow: 'hidden'
         }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Stock Crítico</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                 <p style={{ fontSize: '36px', fontWeight: '800' }}>12</p>
                 <p style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>Marcas sin inventario</p>
              </div>
              <button style={{ 
                width: '100%', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                border: 'none', 
                padding: '10px', 
                borderRadius: '8px', 
                color: 'white', 
                fontWeight: '700', 
                fontSize: '11px',
                cursor: 'pointer'
              }}>
                 Ver Reporte Detallado
              </button>
            </div>
            <div style={{ 
              position: 'absolute', 
              right: '-20px', 
              bottom: '-20px', 
              opacity: 0.1 
            }}>
               <Package size={120} />
            </div>
         </div>
      </div>
    </>
  );
};

export default BrandsPage;
