'use client';

import React from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Upload, 
  Info, 
  Edit2, 
  Trash2, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  HelpCircle,
  List
} from 'lucide-react';
import { motion } from 'framer-motion';

const SubcategoriesPage = () => {
  const subcategories = [
    { id: 'SC-092', name: 'Turbochargers', detail: 'Forced induction...', parent: 'ENGINE', items: 142, image: 'https://images.unsplash.com/photo-1594970544520-20516ed52ca2?auto=format&fit=crop&q=80&w=200' },
    { id: 'SC-048', name: 'Disc Brake Pads', detail: 'Ceramic and semi-...', parent: 'BRAKING', items: 89, image: 'https://images.unsplash.com/photo-1591837334189-4211717c3656?auto=format&fit=crop&q=80&w=200' },
    { id: 'SC-115', name: 'Alternators', detail: 'High-output electric...', parent: 'ELECTRICAL', items: 0, image: 'https://images.unsplash.com/photo-1621993202323-f438eec934ff?auto=format&fit=crop&q=80&w=200' }
  ];

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <h1 className="title-font" style={{ fontSize: '28px' }}>Subcategorías</h1>
               <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }}></div>
               <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Sistemas {'>'} Categorías {'>'} <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Subcategorías</span>
               </p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Especificaciones detalladas de sub-niveles industriales.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search subcategories..." 
              style={{ 
                width: '100%', 
                padding: '10px 12px 10px 40px', 
                borderRadius: '8px', 
                border: '1px solid #E2E8F0', 
                backgroundColor: '#F8FAFC',
                outline: 'none',
                fontSize: '14px',
                color: 'black'
              }}
            />
          </div>
          <Bell size={20} color="var(--text-muted)" />
          <Settings size={20} color="var(--text-muted)" />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '32px' }}>
         {/* Left Column: Form */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass" 
             style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white' }}
            >
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <PlusCircle size={20} color="#EF4444" />
                  </div>
                  <div>
                     <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>New Subcategory</h2>
                     <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>TECHNICAL SPECIFICATIONS</p>
                  </div>
               </div>

               <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>PARENT CATEGORY</label>
                     <div style={{ position: 'relative' }}>
                        <select style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', appearance: 'none', fontWeight: '600', color: 'black' }}>
                           <option>Engine Components</option>
                           <option>Braking Systems</option>
                           <option>Electrical Parts</option>
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'black' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>SUBCATEGORY NAME</label>
                     <input type="text" placeholder="e.g. Turbochargers" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>TECHNICAL DESCRIPTION</label>
                     <textarea placeholder="Describe the mechanical specifications or application scope..." rows="4" style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', resize: 'none', color: 'black' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>VISUAL REFERENCE (IMAGE)</label>
                     <div style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', backgroundColor: '#F8FAFC', cursor: 'pointer' }}>
                        <Upload size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                        <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '2px', color: 'black' }}>Drag & drop or click to upload</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PNG, JPG UP TO 10MB</p>
                     </div>
                  </div>

                  <button className="btn-primary" style={{ width: '100%', height: '50px', borderRadius: '30px', fontSize: '14px', fontWeight: '800', fontStyle: 'italic' }}>
                     GUARDAR SUBCATEGORÍA
                  </button>
               </div>
            </motion.div>

            {/* Info Box */}
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '16px' }}
            >
               <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 size={16} color="white" />
               </div>
               <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px', color: 'black' }}>System Integrity Notice</h4>
                  <p style={{ fontSize: '11px', color: '#92400E', lineHeight: '1.4' }}>Ensure the subcategory is unique within the parent category to prevent database indexing conflicts in the global parts catalog.</p>
               </div>
            </motion.div>
         </div>

         {/* Right Column: Table */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', flex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black' }}>Existing Subcategories</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <Filter size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                     <List size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </div>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>REF / IMAGE</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SUBCATEGORY DETAILS</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PARENT</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ITEMS</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ACTIONS</th>
                     </tr>
                  </thead>
                  <tbody style={{ color: 'black' }}>
                     {subcategories.map((sub, index) => (
                        <motion.tr 
                         key={sub.id}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: index * 0.05 }}
                         style={{ borderBottom: '1px solid #F8FAFC' }}
                         className="hover-row"
                        >
                           <td style={{ padding: '16px 12px' }}>
                              <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative' }}>
                                 <img src={sub.image} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                           </td>
                           <td style={{ padding: '16px 12px' }}>
                              <p style={{ fontSize: '14px', fontWeight: '800' }}>{sub.name}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.detail}</p>
                           </td>
                           <td style={{ padding: '16px 12px' }}>
                              <span style={{ fontSize: '9px', fontWeight: '800', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#1E40AF' }}>{sub.parent}</span>
                           </td>
                           <td style={{ padding: '16px 12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                 <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: sub.items > 0 ? '#10B981' : '#EF4444' }}></div>
                                 <span style={{ fontSize: '13px', fontWeight: '800' }}>{sub.items}</span>
                              </div>
                           </td>
                           <td style={{ padding: '16px 12px' }}>
                              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                                 <Edit2 size={16} style={{ cursor: 'pointer' }} />
                                 <Trash2 size={16} style={{ cursor: 'pointer', color: '#EF4444' }} />
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                  </tbody>
               </table>

               <div style={{ marginTop: 'auto', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing 1 to 3 of 42 subcategories</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black' }}><ChevronLeft size={16} /></button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: '800', fontSize: '12px' }}>1</button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '800', fontSize: '12px', color: 'var(--text-muted)' }}>2</button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '800', fontSize: '12px', color: 'var(--text-muted)' }}>3</button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black' }}><ChevronRight size={16} /></button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Floating Help Button */}
      <div style={{ 
        position: 'fixed', 
        bottom: '40px', 
        right: '40px', 
        width: '60px', 
        height: '60px', 
        borderRadius: '50%', 
        backgroundColor: 'var(--primary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        boxShadow: '0 8px 24px rgba(227, 27, 35, 0.4)',
        cursor: 'pointer',
        zIndex: 100
      }}>
         <HelpCircle color="white" size={32} />
      </div>
    </>
  );
};

export default SubcategoriesPage;
