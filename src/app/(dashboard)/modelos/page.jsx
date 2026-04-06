'use client';

import React from 'react';
import { 
  Plus, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const ModelsPage = () => {
  const models = [
    { name: 'Hilux', detail: 'REVO Edition', brand: 'TOYOTA', brandColor: '#E2E8F0', range: '2015 — 2024', status: 'ACTIVE', check: true, img: 'https://images.unsplash.com/photo-1594970544520-20516ed52ca2?auto=format&fit=crop&q=80&w=300' },
    { name: 'F-150', detail: 'Raptor / Lariat', brand: 'FORD', brandColor: '#E2E8F0', range: '2018 — 2023', status: 'ACTIVE', check: false, img: 'https://images.unsplash.com/photo-1591837334189-4211717c3656?auto=format&fit=crop&q=80&w=300' },
    { name: 'NP300', detail: 'Frontier', brand: 'NISSAN', brandColor: '#E2E8F0', range: '2016 — 2024', status: 'ACTIVE', check: true, img: 'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&q=80&w=300' },
    { name: 'Silverado', detail: 'LTZ / High Country', brand: 'CHEVROLET', brandColor: '#E2E8F0', range: '2019 — 2024', status: 'PENDING REVIEW', check: false, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=300' },
  ];

  return (
    <>
      {/* Title Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
         <div>
            <h1 className="title-font" style={{ fontSize: '32px', marginBottom: '8px', textTransform: 'none', letterSpacing: '0' }}>Gestión de Modelos</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Configure and manage vehicle compatibility catalog</p>
         </div>
         <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px' }}>
            <Plus size={20} /> Nuevo Modelo
         </button>
      </div>

      {/* Filters Section */}
      <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'minmax(200px, 1fr) minmax(140px, 0.5fr) minmax(140px, 0.5fr) auto', gap: '16px', alignItems: 'flex-end', backgroundColor: 'rgba(241, 245, 249, 0.5)' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Filtrar por Marca</label>
            <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '600', fontSize: '13px', color: 'black' }}>
               <option>Todas las Marcas</option>
               <option>Toyota</option>
               <option>Ford</option>
               <option>Nissan</option>
               <option>Chevrolet</option>
            </select>
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Rango de Años</label>
            <input type="number" placeholder="Desde" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '600', fontSize: '13px', color: 'black' }} />
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>&nbsp;</label>
            <input type="number" placeholder="Hasta" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '600', fontSize: '13px', color: 'black' }} />
         </div>
         
         <button style={{ backgroundColor: 'white', border: '1px solid #E2E8F0', padding: '12px 24px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', color: 'var(--primary)', cursor: 'pointer' }}>
            Aplicar Filtros
         </button>
      </div>

      {/* Models Table */}
      <div className="glass" style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
               <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <th style={{ padding: '20px 24px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Visual</th>
                  <th style={{ padding: '20px 24px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Modelo</th>
                  <th style={{ padding: '20px 24px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Marca</th>
                  <th style={{ padding: '20px 24px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Compatibilidad</th>
                  <th style={{ padding: '20px 24px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado</th>
                  <th style={{ padding: '20px 24px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
               </tr>
            </thead>
            <tbody style={{ color: 'black' }}>
               {models.map((model, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #F8FAFC' }} className="hover-row">
                     <td style={{ padding: '16px 24px' }}>
                        <div style={{ width: '80px', height: '50px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#F1F5F9', position: 'relative' }}>
                           <img src={model.img} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <p style={{ fontSize: '15px', fontWeight: '800' }}>{model.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{model.detail}</p>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '800', padding: '4px 10px', borderRadius: '20px', backgroundColor: '#E2E8F0', color: '#475569' }}>
                           {model.brand}
                        </span>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                           <p style={{ fontSize: '14px', fontWeight: '600' }}>{model.range}</p>
                           {model.check && <CheckCircle2 size={14} color="#D97706" style={{ opacity: 0.8 }} />}
                        </div>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <span style={{ 
                          fontSize: '9px', 
                          fontWeight: '800', 
                          padding: '4px 10px', 
                          borderRadius: '4px', 
                          backgroundColor: model.status === 'ACTIVE' ? '#DCFCE7' : '#FEF3C7', 
                          color: model.status === 'ACTIVE' ? '#15803D' : '#D97706',
                          textTransform: 'uppercase'
                        }}>
                           {model.status}
                        </span>
                     </td>
                     <td style={{ padding: '16px 24px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                           <button style={{ border: 'none', backgroundColor: 'transparent', padding: '8px', cursor: 'pointer' }}><Settings size={16} color="var(--text-muted)" /></button>
                        </div>
                     </td>
                  </tr>
               ))}
            </tbody>
         </table>
         
         <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Showing 4 of 128 models</p>
            <div style={{ display: 'flex', gap: '4px' }}>
               <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}><ChevronLeft size={16} color="var(--text-muted)" /></button>
               <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>1</button>
               <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', color: 'var(--text-muted)', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>2</button>
               <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', color: 'var(--text-muted)', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>3</button>
               <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', cursor: 'pointer' }}><ChevronRight size={16} color="var(--text-muted)" /></button>
            </div>
         </div>
      </div>

      {/* Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginTop: '32px' }}>
         <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
               <p style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: 'black' }}>3,450</p>
               <p style={{ fontSize: '11px', fontWeight: '800', color: '#3B82F6', textTransform: 'uppercase' }}>Total SKU Compatibility</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', color: '#3B82F6' }}>+12%</div>
         </div>
         
         <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
               <p style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', color: 'black' }}>128</p>
               <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>Registered Models</p>
            </div>
            <div style={{ backgroundColor: '#FEF3C7', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '800', color: '#D97706' }}>42 Needs Correction</div>
         </div>
         
         <div style={{ backgroundColor: '#0F172A', padding: '24px', borderRadius: 'var(--radius-lg)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
               <p style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Catalog Sync Status</p>
               <p style={{ fontSize: '11px', opacity: 0.6, marginBottom: '16px' }}>Last update: 14 mins ago</p>
               <div style={{ width: '100%', height: '4px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--primary)', borderRadius: '2px' }}></div>
               </div>
            </div>
         </div>
      </div>
    </>
  );
};

export default ModelsPage;
