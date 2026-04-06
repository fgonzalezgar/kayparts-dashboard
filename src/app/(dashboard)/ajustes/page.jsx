'use client';

import React from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  Globe, 
  BellRing, 
  Database, 
  Shield, 
  Save, 
  Smartphone,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div>
            <h1 className="title-font" style={{ fontSize: '28px' }}>Configuración del Sistema</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Control de acceso, seguridad y preferencias del portal.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
           <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <Save size={18} /> GUARDAR CAMBIOS
           </button>
           <Bell size={20} color="var(--text-muted)" />
           <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <User size={20} color="var(--text-muted)" />
           </div>
         </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '40px' }}>
          {/* Settings Navigation */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                  { icon: <User size={18} />, label: 'Perfil de Usuario', active: true },
                  { icon: <Shield size={18} />, label: 'Seguridad y Acceso', active: false },
                  { icon: <BellRing size={18} />, label: 'Notificaciones', active: false },
                  { icon: <Globe size={18} />, label: 'Idioma y Región', active: false },
                  { icon: <Database size={18} />, label: 'Almacenamiento y API', active: false },
                  { icon: <CreditCard size={18} />, label: 'Facturación', active: false },
              ].map((item, i) => (
                  <div 
                      key={i}
                      style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          padding: '12px 16px', 
                          borderRadius: '8px', 
                          backgroundColor: item.active ? 'white' : 'transparent',
                          color: item.active ? 'var(--primary)' : 'var(--text-main)',
                          fontWeight: item.active ? '800' : '600',
                          cursor: 'pointer',
                          fontSize: '14px',
                          boxShadow: item.active ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
                      }}
                  >
                      {item.icon}
                      {item.label}
                  </div>
              ))}
          </div>

          {/* Settings Content Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass" 
                  style={{ padding: '32px', borderRadius: '16px', backgroundColor: 'white' }}
              >
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', color: 'black' }}>Preferencias de Perfil</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nombre Completo</label>
                          <input type="text" defaultValue="Admin Kayparts" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC', color: 'black' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cargo / Rol</label>
                          <input type="text" defaultValue="Head of Operations" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC', color: 'black' }} />
                      </div>
                      <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Correo Electrónico</label>
                          <input type="email" defaultValue="admin@kayparts.com" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', backgroundColor: '#F8FAFC', color: 'black' }} />
                      </div>
                  </div>
              </motion.div>

              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass" 
                  style={{ padding: '32px', borderRadius: '16px', backgroundColor: 'white' }}
              >
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', borderBottom: '1px solid #F1F5F9', paddingBottom: '16px', color: 'black' }}>Seguridad</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '16px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Smartphone size={20} color="var(--primary)" />
                              </div>
                              <div>
                                  <p style={{ fontSize: '14px', fontWeight: '800', color: 'black' }}>Autenticación de Dos Pasos (2FA)</p>
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Añade una capa extra de seguridad a tu cuenta industrial.</p>
                              </div>
                          </div>
                          <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '12px', fontWeight: '800', color: 'var(--primary)', cursor: 'pointer' }}>ACTIVAR</button>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', gap: '16px' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Lock size={20} color="var(--primary)" />
                              </div>
                              <div>
                                  <p style={{ fontSize: '14px', fontWeight: '800', color: 'black' }}>Cambiar Contraseña</p>
                                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Último cambio realizado hace 3 meses.</p>
                              </div>
                          </div>
                          <button style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontSize: '12px', fontWeight: '800', color: 'black', cursor: 'pointer' }}>ACTUALIZAR</button>
                      </div>
                  </div>
              </motion.div>
          </div>
      </div>
    </>
  );
};

export default SettingsPage;
