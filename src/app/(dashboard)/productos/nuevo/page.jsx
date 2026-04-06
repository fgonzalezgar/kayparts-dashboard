'use client';

import React from 'react';
import { 
  Save, 
  X, 
  Upload,
  DollarSign,
  Layers,
  Settings,
  ChevronDown,
  Box,
  Truck,
  PlusCircle,
  Zap,
  Camera
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const CreateProductPage = () => {
  const router = useRouter();

  const sectionLabelStyle = {
    fontSize: '11px',
    fontWeight: '800',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#F0F7FF',
    fontSize: '14px',
    outline: 'none',
    fontWeight: '600',
    color: 'black'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer'
  };

  return (
    <>
      {/* Breadcrumbs & Header */}
      <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>PRODUCTOS</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>CREAR NUEVO</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="title-font" style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A' }}>Ficha Técnica de Producto</h1>
              <div style={{ display: 'flex', gap: '16px' }}>
                  <button style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>
                      Guardar Borrador
                  </button>
                  <button className="btn-primary" style={{ padding: '12px 24px', borderRadius: '12px' }}>
                      Publicar Producto
                  </button>
              </div>
          </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) 2fr', gap: '40px' }}>
         {/* LEFT COLUMN: Media & Specs */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* IMAGE GALLERY */}
            <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass" 
             style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'white' }}
            >
                <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#475569', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Galería de Imágenes <span style={{ float: 'right', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '10px' }}>3/6 Max</span></h3>
                
                <div style={{ position: 'relative', width: '100%', marginBottom: '16px', borderRadius: '16px', overflow: 'hidden' }}>
                    <img src="https://images.unsplash.com/photo-1594970544520-20516ed52ca2?auto=format&fit=crop&q=80&w=600" alt="Product" style={{ width: '100%', height: '240px', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#E31B23', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '800' }}>PRINCIPAL</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    <div style={{ border: '2px dashed #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center', opacity: 0.5 }}>
                      <Camera size={20} color="var(--text-muted)" style={{ margin: '0 auto 4px' }} />
                      <p style={{ fontSize: '9px', fontWeight: '800', color: 'black' }}>LATERAL</p>
                    </div>
                    <div style={{ border: '2px dashed #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center', opacity: 0.5 }}>
                      <Camera size={20} color="var(--text-muted)" style={{ margin: '0 auto 4px' }} />
                      <p style={{ fontSize: '9px', fontWeight: '800', color: 'black' }}>EMPAQUE</p>
                    </div>
                    <div style={{ border: '2px dashed #E2E8F0', borderRadius: '12px', padding: '12px', textAlign: 'center', opacity: 0.5 }}>
                      <PlusCircle size={20} color="var(--text-muted)" style={{ margin: '0 auto 4px' }} />
                      <p style={{ fontSize: '9px', fontWeight: '800', color: 'black' }}>OTRA</p>
                    </div>
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '16px', textAlign: 'center' }}>Formatos permitidos: JPG, PNG, WEBP. Max 5MB por archivo.</p>
            </motion.div>

            {/* TECHNICAL SPECS */}
            <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="glass" 
             style={{ padding: '32px', borderRadius: '24px', backgroundColor: '#F0F7FF' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <Zap size={20} color="var(--primary)" />
                    <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Especificaciones Técnicas</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={sectionLabelStyle}>Material de Construcción</label>
                        <input type="text" placeholder="Ej. Acero Inoxidable T304" style={{ ...inputStyle, backgroundColor: 'white' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Dimensiones (mm)</label>
                          <input type="text" placeholder="120 x 45 x 30" style={{ ...inputStyle, backgroundColor: 'white' }} />
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Peso (kg)</label>
                          <input type="text" placeholder="2.5" style={{ ...inputStyle, backgroundColor: 'white' }} />
                      </div>
                    </div>
                    <div>
                        <label style={sectionLabelStyle}>Compatibilidad Vehicular (Modelos/VIN)</label>
                        <textarea rows="3" placeholder="BMW M3 (2015-2021), Toyota Supra MKV..." style={{ ...inputStyle, backgroundColor: 'white', resize: 'none' }} />
                    </div>
                </div>
            </motion.div>
         </div>

         {/* RIGHT COLUMN: General Info */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="glass" 
             style={{ padding: '40px', borderRadius: '24px', backgroundColor: 'white' }}
            >
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>Información General del Producto</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    <div>
                        <label style={sectionLabelStyle}>Nombre Comercial del Producto</label>
                        <input type="text" defaultValue="Bomba de Inyección Common Rail - High Pressure" style={{ ...inputStyle, fontSize: '18px', padding: '0', backgroundColor: 'transparent', borderRadius: '0', borderBottom: '2px solid #E2E8F0', color: '#64748B' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Marca de Vehículo *</label>
                          <div style={{ position: 'relative' }}>
                              <select style={selectStyle}><option>Seleccionar marca...</option></select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Modelo de Vehículo *</label>
                          <div style={{ position: 'relative' }}>
                              <select style={selectStyle}><option>Seleccionar modelo...</option></select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Categoría *</label>
                          <div style={{ position: 'relative' }}>
                              <select style={selectStyle}><option>Seleccionar categoría...</option></select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Subcategoría *</label>
                          <div style={{ position: 'relative' }}>
                              <select style={selectStyle}><option>Seleccionar subcategoría...</option></select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Marca del Producto / Fabricante *</label>
                          <div style={{ position: 'relative' }}>
                              <select style={selectStyle}><option>Seleccionar fabricante...</option></select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Garantía (Meses)</label>
                          <input type="text" defaultValue="12" style={inputStyle} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                       <div>
                          <label style={sectionLabelStyle}>Código SKU / Parte</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <Box size={18} style={{ position: 'absolute', left: '14px', opacity: 0.2, color: 'black' }} />
                              <input type="text" defaultValue="KP-882-XT" style={{ ...inputStyle, paddingLeft: '44px' }} />
                          </div>
                       </div>
                    </div>

                    {/* PRICING & STOCK BOX */}
                    <div style={{ backgroundColor: '#F8FAFC', padding: '32px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Precio Unitario (USD)</label>
                          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                              <span style={{ fontSize: '24px', fontWeight: '800', color: '#94A3B8' }}>$</span>
                              <span style={{ fontSize: '40px', fontWeight: '900', color: '#CBD5E1', lineHeight: '0.8' }}>0.00</span>
                          </div>
                      </div>
                      <div style={{ position: 'relative' }}>
                          <label style={sectionLabelStyle}>Stock Inicial</label>
                          <span style={{ fontSize: '40px', fontWeight: '900', color: '#CBD5E1', lineHeight: '0.8' }}>0</span>
                          <Box size={24} style={{ position: 'absolute', right: '0', bottom: '4px', opacity: 0.1, color: 'black' }} />
                      </div>
                    </div>

                    <div>
                        <label style={sectionLabelStyle}>Descripción Detallada</label>
                        <textarea rows="4" placeholder="Describa las características principales del producto y recomendaciones de uso..." style={{ ...inputStyle, resize: 'none' }} />
                    </div>
                </div>
            </motion.div>

            {/* SEO BOX */}
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.2 }}
             style={{ 
               backgroundColor: '#1E293B', 
               padding: '24px', 
               borderRadius: '16px', 
               display: 'flex', 
               justifyContent: 'space-between', 
               alignItems: 'center',
               color: 'white'
             }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(227,27,35,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap color="#E31B23" fill="#E31B23" />
                    </div>
                    <div>
                        <h4 style={{ fontSize: '14px', fontWeight: '800' }}>Optimización SEO</h4>
                        <p style={{ fontSize: '11px', opacity: 0.6 }}>El título y descripción cumplen con los estándares de búsqueda.</p>
                    </div>
                </div>
                <span style={{ backgroundColor: '#064E3B', color: '#10B981', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', fontWeight: '800' }}>Excelente</span>
            </motion.div>
         </div>
      </div>
    </>
  );
};

export default CreateProductPage;
