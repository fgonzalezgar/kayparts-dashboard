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
  Truck,
  Package,
  Calendar,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dispatchService from '@/services/dispatchService';
import carrierService from '@/services/carrierService';
import orderService from '@/services/orderService';

const DispatchesPage = () => {
  const [dispatches, setDispatches] = useState([]);
  const [carriers, setCarriers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    order_id: '',
    carrier_id: '',
    tracking_number: '',
    responsible_person: '',
    status: 'pending',
    dispatch_date: '',
    notes: ''
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
      const [dispatchesData, carriersData, ordersData] = await Promise.all([
        dispatchService.getDispatches(),
        carrierService.getCarriers(),
        orderService.getOrders()
      ]);
      setDispatches(Array.isArray(dispatchesData) ? dispatchesData : []);
      setCarriers(Array.isArray(carriersData) ? carriersData : []);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('error', 'Error al cargar información.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      order_id: '',
      carrier_id: '',
      tracking_number: '',
      responsible_person: '',
      status: 'pending',
      dispatch_date: new Date().toISOString().split('T')[0],
      notes: ''
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (dispatch) => {
    setIsEditing(true);
    setCurrentId(dispatch.id);
    setFormData({
      order_id: dispatch.order_id,
      carrier_id: dispatch.carrier_id,
      tracking_number: dispatch.tracking_number,
      responsible_person: dispatch.responsible_person,
      status: dispatch.status || 'pending',
      dispatch_date: dispatch.dispatch_date ? new Date(dispatch.dispatch_date).toISOString().split('T')[0] : '',
      notes: dispatch.notes || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.order_id || !formData.carrier_id || !formData.tracking_number || !formData.responsible_person) {
      showToast('error', 'Por favor completa los campos obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await dispatchService.updateDispatch(currentId, formData);
        showToast('success', 'Envío actualizado exitosamente.');
      } else {
        await dispatchService.createDispatch(formData);
        showToast('success', 'Envío generado exitosamente.');
      }
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error('Error saving dispatch:', error);
      let msg = 'Error al generar el envío.';
      if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este registro de envío?')) return;
    
    try {
      await dispatchService.deleteDispatch(id);
      showToast('success', 'Registro eliminado.');
      fetchData();
    } catch (error) {
      console.error('Error deleting dispatch:', error);
      showToast('error', 'Error al eliminar.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: '#FEF3C7', color: '#D97706', label: 'Pendiente' };
      case 'shipped': return { bg: '#DBEAFE', color: '#2563EB', label: 'Enviado' };
      case 'delivered': return { bg: '#DCFCE7', color: '#16A34A', label: 'Entregado' };
      case 'returned': return { bg: '#FEE2E2', color: '#DC2626', label: 'Devuelto' };
      default: return { bg: '#F1F5F9', color: '#64748B', label: 'Desconocido' };
    }
  };

  const filteredDispatches = dispatches.filter(d => 
    (d.tracking_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.order?.order_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.responsible_person || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            Envíos y Despachos
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '500px' }}>
            Genera guías de envío y administra el proceso logístico de los pedidos.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar guía o pedido..." 
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
             <Plus size={20} /> Generar Envío
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
              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>Cargando despachos...</p>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                  <tr style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Pedido</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Transportadora</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Guía (Tracking)</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Fecha</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado</th>
                      <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                  </tr>
              </thead>
              <tbody style={{ color: 'black' }}>
                  {filteredDispatches.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No se encontraron envíos generados.
                      </td>
                    </tr>
                  ) : filteredDispatches.map((dispatch, index) => {
                      const status = getStatusStyle(dispatch.status);
                      return (
                      <motion.tr 
                          key={dispatch.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          style={{ borderBottom: '1px solid #F8FAFC' }}
                          className="hover-row"
                      >
                          <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Package size={16} color="var(--primary)" />
                                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>
                                  {dispatch.order?.order_number || `ID: ${dispatch.order_id}`}
                                </span>
                              </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Truck size={14} color="var(--text-muted)" />
                                <p style={{ fontSize: '13px', fontWeight: '700' }}>{dispatch.carrier?.name || 'Desconocida'}</p>
                              </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <p style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'monospace' }}>{dispatch.tracking_number}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Resp: {dispatch.responsible_person}</p>
                          </td>
                          <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-main)' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={14} color="var(--text-muted)" />
                                {dispatch.dispatch_date ? new Date(dispatch.dispatch_date).toLocaleDateString() : 'N/A'}
                              </div>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <span style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '6px', 
                                  padding: '6px 12px', 
                                  borderRadius: '20px', 
                                  backgroundColor: status.bg, 
                                  color: status.color,
                                  width: 'fit-content',
                                  fontSize: '11px',
                                  fontWeight: '800',
                                  textTransform: 'uppercase'
                              }}>
                                  {status.label}
                              </span>
                          </td>
                          <td style={{ padding: '16px 24px' }}>
                              <div style={{ display: 'flex', gap: '12px' }}>
                                  <button onClick={() => handleOpenEditModal(dispatch)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><Edit2 size={18} /></button>
                                  <button onClick={() => handleDelete(dispatch.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}><Trash2 size={18} /></button>
                              </div>
                          </td>
                      </motion.tr>
                    );
                  })}
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
                width: '560px',
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '32px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                border: '1px solid #E2E8F0',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
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
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: isEditing ? '#DBEAFE' : '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {isEditing ? <Edit2 size={20} color="#2563EB" /> : <PlusCircle size={20} color="#0EA5E9" />}
                </div>
                <div>
                   <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>
                     {isEditing ? 'Editar Envío' : 'Generar Nuevo Envío'}
                   </h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* Order */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Pedido Asociado *</label>
                     <select 
                       name="order_id"
                       value={formData.order_id}
                       onChange={handleChange}
                       required
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                     >
                        <option value="">Selecciona un Pedido...</option>
                        {orders.map(o => (
                          <option key={o.id} value={o.id}>{o.order_number} ({o.customer_name})</option>
                        ))}
                     </select>
                  </div>

                  {/* Carrier */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Transportadora *</label>
                     <select 
                       name="carrier_id"
                       value={formData.carrier_id}
                       onChange={handleChange}
                       required
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                     >
                        <option value="">Selecciona Transportadora...</option>
                        {carriers.filter(c => c.status === 'active').map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                     </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                  {/* Tracking Number */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Número de Guía / Tracking *</label>
                     <div style={{ position: 'relative' }}>
                       <input 
                         type="text" 
                         name="tracking_number"
                         value={formData.tracking_number}
                         onChange={handleChange}
                         placeholder="ej. GUIA-00123" 
                         required
                         style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                       />
                       <FileText size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     </div>
                  </div>

                  {/* Dispatch Date */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Fecha de Despacho</label>
                     <input 
                       type="date" 
                       name="dispatch_date"
                       value={formData.dispatch_date}
                       onChange={handleChange}
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                     />
                  </div>
                </div>

                {/* Responsible Person */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Persona Responsable *</label>
                   <input 
                     type="text" 
                     name="responsible_person"
                     value={formData.responsible_person}
                     onChange={handleChange}
                     placeholder="Nombre de quien entrega a transportadora" 
                     required
                     style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                   />
                </div>

                {/* Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Estado del Envío</label>
                   <select 
                     name="status"
                     value={formData.status}
                     onChange={handleChange}
                     style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                   >
                      <option value="pending">Pendiente</option>
                      <option value="shipped">Enviado</option>
                      <option value="delivered">Entregado</option>
                      <option value="returned">Devuelto</option>
                   </select>
                </div>

                {/* Notes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Notas u Observaciones</label>
                   <textarea 
                     name="notes"
                     value={formData.notes}
                     onChange={handleChange}
                     placeholder="Instrucciones especiales..." 
                     rows="2"
                     style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600', resize: 'none' }} 
                   ></textarea>
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
                     {isEditing ? 'ACTUALIZAR ENVÍO' : 'GENERAR ENVÍO'}
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

export default DispatchesPage;
