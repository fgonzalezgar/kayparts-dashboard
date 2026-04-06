'use client';

import React from 'react';
import { 
  Users, 
  Search, 
  Bell, 
  User, 
  MapPin, 
  CreditCard, 
  History,
  MoreVertical,
  Briefcase
} from 'lucide-react';
import { motion } from 'framer-motion';

const CustomersPage = () => {
  const customers = [
    { name: 'Talleres Mecánicos del Norte', contact: 'Carlos Rodriguez', email: 'crodriguez@talleresnorte.com', location: 'Monterrey, MX', type: 'Industrial', spent: '$12,450.00' },
    { name: 'Flotas Logísticas S.A.', contact: 'Elena Gómez', email: 'egomez@flotaslog.com', location: 'Ciudad de México, MX', type: 'Corporativo', spent: '$45,820.00' },
    { name: 'Autopartes Express', contact: 'Juan Pérez', email: 'jperez@autoexpress.com', location: 'Guadalajara, MX', type: 'Distribuidor', spent: '$8,120.00' },
    { name: 'Servicio Mecánico Integral', contact: 'Ricardo Silva', email: 'rsilva@smi.com', location: 'Querétaro, MX', type: 'Industrial', spent: '$15,300.00' },
  ];

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div>
            <h1 className="title-font" style={{ fontSize: '28px' }}>Gestión de Clientes</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>CRM especializado en relaciones comerciales industriales.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar cliente o representante..." 
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
          <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', fontWeight: '700', color: 'black' }}>
                  <Users size={16} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '8px' }} /> 1,280 Clientes Totales
              </div>
              <div style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', fontWeight: '700', color: 'black' }}>
                  <Briefcase size={16} color="var(--primary)" style={{ verticalAlign: 'middle', marginRight: '8px' }} /> 45 Clientes Corporativos
              </div>
          </div>
          <button className="btn-primary">
              + NUEVO CLIENTE
          </button>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'white' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Cliente / Empresa</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contacto</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ubicación</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categoría</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Inversión</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                  </tr>
              </thead>
              <tbody style={{ color: 'black' }}>
                  {customers.map((customer, index) => (
                      <motion.tr 
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{ borderBottom: '1px solid #F8FAFC' }}
                          className="hover-row"
                      >
                          <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(227, 27, 35, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <Briefcase size={16} color="var(--primary)" />
                                  </div>
                                  <span style={{ fontSize: '14px', fontWeight: '800', color: 'black' }}>{customer.name}</span>
                              </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <p style={{ fontSize: '14px', fontWeight: '600' }}>{customer.contact}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{customer.email}</p>
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '13px', color: 'black' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin size={14} color="var(--text-muted)" /> {customer.location}
                              </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <span style={{ 
                                  fontSize: '10px', 
                                  fontWeight: '800', 
                                  padding: '4px 8px', 
                                  borderRadius: '4px', 
                                  backgroundColor: customer.type === 'Corporativo' ? '#FEE2E2' : '#F1F5F9', 
                                  color: customer.type === 'Corporativo' ? '#EF4444' : '#475569',
                                  textTransform: 'uppercase'
                              }}>
                                  {customer.type}
                              </span>
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '800', color: 'var(--dark)' }}>
                              {customer.spent}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><History size={18} /></button>
                                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><CreditCard size={18} /></button>
                                  <button style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><MoreVertical size={18} /></button>
                              </div>
                          </td>
                      </motion.tr>
                  ))}
              </tbody>
          </table>
      </div>
    </>
  );
};

export default CustomersPage;
