'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Edit2, 
  Trash2, 
  Plus,
  PlusCircle, 
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
  Mail,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import carrierService from '@/services/carrierService';

const CarriersPage = () => {
  const [carriers, setCarriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    status: 'active'
  });

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await carrierService.getCarriers();
      setCarriers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching carriers:', error);
      showToast('error', 'Error al cargar transportadoras.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked ? 'active' : 'inactive' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      status: 'active'
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (carrier) => {
    setIsEditing(true);
    setCurrentId(carrier.id);
    setFormData({
      name: carrier.name,
      phone: carrier.phone || '',
      email: carrier.email || '',
      status: carrier.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('error', 'El nombre es obligatorio');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await carrierService.updateCarrier(currentId, formData);
        showToast('success', 'Transportadora actualizada exitosamente.');
      } else {
        await carrierService.createCarrier(formData);
        showToast('success', 'Transportadora creada exitosamente.');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving carrier:', error);
      let msg = 'Error al guardar la transportadora.';
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta transportadora?')) return;
    
    try {
      await carrierService.deleteCarrier(id);
      showToast('success', 'Transportadora eliminada.');
      fetchData();
    } catch (error) {
      console.error('Error deleting carrier:', error);
      showToast('error', 'Error al eliminar.');
    }
  };

  const filteredCarriers = carriers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            style={{
              position: 'fixed',
              top: '24px',
              right: '24px',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px 20px',
              borderRadius: '12px',
              backgroundColor: toast.type === 'success' ? '#ECFDF5' : '#FEF2F2',
              border: `1px solid ${toast.type === 'success' ? '#6EE7B7' : '#FECACA'}`,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              maxWidth: '400px'
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={18} color="#059669" /> : <AlertCircle size={18} color="#DC2626" />}
            <span style={{ fontSize: '13px', fontWeight: '600', color: toast.type === 'success' ? '#065F46' : '#991B1B', flex: 1 }}>
              {toast.message}
            </span>
            <X size={16} style={{ cursor: 'pointer', color: '#9CA3AF' }} onClick={() => setToast(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="title-font" style={{ fontSize: '32px', marginBottom: '8px', textTransform: 'none', letterSpacing: '0', color: 'black' }}>
            Transportadoras
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '500px' }}>
            Gestiona los operadores logísticos responsables de los despachos.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar transportadora..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <button 
             onClick={handleOpenCreateModal}
             className="btn-primary" 
             style={{ backgroundColor: '#0F172A', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '13px' }}
          >
             <Plus size={20} /> Nueva Transportadora
          </button>
          <Bell size={20} color="var(--text-muted)" />
          <Settings size={20} color="var(--text-muted)" />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      {/* Table Section */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'white' }}>
          {loading ? (
            <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
              <Loader2 size={40} className="animate-spin" color="var(--primary)" />
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>Cargando transportadoras...</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ID</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Nombre</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Contacto</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                  </tr>
              </thead>
              <tbody style={{ color: 'black' }}>
                  {filteredCarriers.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No se encontraron transportadoras.
                      </td>
                    </tr>
                  ) : filteredCarriers.map((carrier, index) => (
                      <motion.tr 
                          key={carrier.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{ borderBottom: '1px solid #F8FAFC' }}
                          className="hover-row"
                      >
                          <td style={{ padding: '16px 24px' }}>
                              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>{carrier.id}</span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', backgroundColor: '#F1F5F9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Truck size={16} color="var(--primary)" />
                                </div>
                                <p style={{ fontSize: '14px', fontWeight: '700' }}>{carrier.name}</p>
                              </div>
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-main)' }}>
                              {carrier.phone && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={12}/> {carrier.phone}</div>}
                              {carrier.email && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}><Mail size={12}/> {carrier.email}</div>}
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <span style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  padding: '6px 12px', 
                                  borderRadius: '20px', 
                                  backgroundColor: carrier.status === 'active' ? '#DCFCE7' : '#F1F5F9', 
                                  color: carrier.status === 'active' ? '#16A34A' : '#64748B',
                                  width: 'fit-content',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  textTransform: 'uppercase'
                              }}>
                                  {carrier.status === 'active' ? 'Activo' : 'Inactivo'}
                              </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                  <button onClick={() => handleOpenEditModal(carrier)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit2 size={18} /></button>
                                  <button onClick={() => handleDelete(carrier.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={18} /></button>
                              </div>
                          </td>
                      </motion.tr>
                  ))}
              </tbody>
          </table>
          )}
      </div>

      {/* Overlay Modal for CRUD */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999
          }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              style={{
                width: '460px',
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
                position: 'relative'
              }}
            >
              {/* Close Button */}
              <button 
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '24px',
                  right: '24px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8'
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: isEditing ? '#DBEAFE' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {isEditing ? <Edit2 size={20} color="#2563EB" /> : <PlusCircle size={20} color="#EF4444" />}
                </div>
                <div>
                   <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>
                     {isEditing ? 'Editar Transportadora' : 'Nueva Transportadora'}
                   </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Nombre *</label>
                   <input 
                     type="text" 
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="ej. Servientrega, TCC" 
                     required
                     style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                   />
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Teléfono</label>
                   <div style={{ position: 'relative' }}>
                     <input 
                       type="text" 
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       placeholder="ej. 3123456789" 
                       style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                     />
                     <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                   </div>
                </div>

                {/* Email */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Email</label>
                   <div style={{ position: 'relative' }}>
                     <input 
                       type="email" 
                       name="email"
                       value={formData.email}
                       onChange={handleChange}
                       placeholder="contacto@transportadora.com" 
                       style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                     />
                     <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                   </div>
                </div>

                {/* Active Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
                   <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                      <input 
                         type="checkbox" 
                         name="status"
                         checked={formData.status === 'active'}
                         onChange={handleChange}
                         style={{ opacity: 0, width: 0, height: 0 }}
                      />
                      <span style={{ 
                         position: 'absolute', 
                         cursor: 'pointer', 
                         top: 0, left: 0, right: 0, bottom: 0, 
                         backgroundColor: formData.status === 'active' ? 'var(--primary)' : '#CBD5E1', 
                         transition: '.4s', 
                         borderRadius: '24px' 
                      }}>
                         <span style={{ 
                             position: 'absolute', 
                             content: '""', 
                             height: '18px', width: '18px', 
                             left: formData.status === 'active' ? '22px' : '4px', 
                             bottom: '3px', 
                             backgroundColor: 'white', 
                             transition: '.4s', 
                             borderRadius: '50%' 
                         }}></span>
                      </span>
                   </label>
                   <span style={{ fontSize: '12px', fontWeight: '700', color: formData.status === 'active' ? 'var(--primary)' : 'var(--text-muted)' }}>
                      {formData.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                   </span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    type="button" 
                    onClick={handleCloseModal}
                    style={{
                      flex: 1,
                      height: '48px',
                      borderRadius: '24px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: 'white',
                      color: '#64748B',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="btn-primary" 
                    style={{ 
                      flex: 1.5,
                      height: '48px', 
                      borderRadius: '24px', 
                      fontSize: '13px', 
                      fontWeight: '800', 
                      opacity: submitting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                     {submitting && <Loader2 size={16} className="animate-spin" />}
                     {isEditing ? 'ACTUALIZAR' : 'GUARDAR'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CarriersPage;
