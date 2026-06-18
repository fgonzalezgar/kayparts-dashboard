'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Edit2, 
  Trash2, 
  PlusCircle, 
  List, 
  Loader2, 
  CheckCircle, 
  AlertCircle, 
  X,
  XCircle,
  Percent,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import taxService from '@/services/taxService';

const TaxesPage = () => {
  const [taxes, setTaxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    rate: '',
    is_active: true
  });

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await taxService.getTaxes();
      setTaxes(Array.isArray(data) ? data : (data?.data || []));
    } catch (error) {
      console.error('Error fetching taxes:', error);
      showToast('error', 'Error al cargar los impuestos.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rate: '',
      is_active: true
    });
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('error', 'El nombre del impuesto es obligatorio');
      return;
    }
    if (formData.rate === '') {
      showToast('error', 'La tasa del impuesto es obligatoria');
      return;
    }

    const rateVal = parseFloat(formData.rate);
    if (isNaN(rateVal) || rateVal < 0) {
      showToast('error', 'La tasa debe ser un número mayor o igual a 0');
      return;
    }

    const submitData = {
      name: formData.name,
      rate: rateVal,
      is_active: !!formData.is_active
    };

    try {
      setSubmitting(true);
      if (isEditing) {
        await taxService.updateTax(currentId, submitData);
        showToast('success', 'Impuesto actualizado exitosamente.');
      } else {
        await taxService.createTax(submitData);
        showToast('success', 'Impuesto registrado exitosamente.');
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving tax:', error);
      let msg = 'Error al guardar el impuesto.';
      if (error.response?.data?.errors) {
        msg = Object.values(error.response.data.errors).flat()[0] || msg;
      } else if (error.response?.data?.message) {
        msg = error.response.data.message;
      }
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (taxObj) => {
    setIsEditing(true);
    setCurrentId(taxObj.id);
    setFormData({
      name: taxObj.name,
      rate: taxObj.rate.toString(),
      is_active: !!taxObj.is_active
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este impuesto?')) return;
    
    try {
      await taxService.deleteTax(id);
      showToast('success', 'Impuesto eliminado.');
      fetchData();
    } catch (error) {
      console.error('Error deleting tax:', error);
      showToast('error', 'Error al eliminar el impuesto.');
    }
  };

  const filteredTaxes = taxes.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
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
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <h1 className="title-font" style={{ fontSize: '28px' }}>Impuestos</h1>
               <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }}></div>
               <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Sistema {'>'} <span style={{ color: 'var(--primary)', fontWeight: '700' }}>% Impuestos</span>
               </p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestión de impuestos y tasas aplicables a los productos.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar impuesto..." 
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
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: isEditing ? '#DBEAFE' : '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {isEditing ? <Edit2 size={20} color="#2563EB" /> : <PlusCircle size={20} color="#EF4444" />}
                  </div>
                  <div style={{ flex: 1 }}>
                     <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>{isEditing ? 'Editar Impuesto' : 'Nuevo Impuesto'}</h2>
                     <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>CONFIGURACIÓN IMPOSITIVA</p>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={resetForm}
                      style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', border: '1px solid #E2E8F0', cursor: 'pointer' }}
                    >
                      CANCELAR
                    </button>
                  )}
               </div>

               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>NOMBRE DEL IMPUESTO</label>
                     <div style={{ position: 'relative' }}>
                       <input 
                         type="text" 
                         name="name"
                         value={formData.name}
                         onChange={handleChange}
                         placeholder="ej. IVA 19%, RETEFUENTE, EXENTO" 
                         required
                         style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                       />
                       <DollarSign size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>TASA (%)</label>
                     <div style={{ position: 'relative' }}>
                       <input 
                         type="number" 
                         name="rate"
                         value={formData.rate}
                         onChange={handleChange}
                         placeholder="ej. 19.00, 5.00, 0" 
                         step="0.01"
                         min="0"
                         required
                         style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                       />
                       <Percent size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     </div>
                  </div>

                  {/* Toggle Switch */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                     <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input 
                           type="checkbox" 
                           name="is_active"
                           checked={formData.is_active}
                           onChange={handleChange}
                           style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{ 
                           position: 'absolute', 
                           cursor: 'pointer', 
                           top: 0, left: 0, right: 0, bottom: 0, 
                           backgroundColor: formData.is_active ? 'var(--primary)' : '#CBD5E1', 
                           transition: '.4s', 
                           borderRadius: '24px' 
                        }}>
                           <span style={{ 
                               position: 'absolute', 
                               content: '""', 
                               height: '18px', width: '18px', 
                               left: formData.is_active ? '22px' : '4px', 
                               bottom: '3px', 
                               backgroundColor: 'white', 
                               transition: '.4s', 
                               borderRadius: '50%' 
                           }}></span>
                        </span>
                     </label>
                     <span style={{ fontSize: '12px', fontWeight: '700', color: formData.is_active ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {formData.is_active ? 'IMPUESTO ACTIVO' : 'IMPUESTO INACTIVO'}
                     </span>
                  </div>

                  <button 
                    type="submit"
                    disabled={submitting}
                    className="btn-primary" 
                    style={{ 
                      width: '100%', 
                      height: '50px', 
                      borderRadius: '30px', 
                      fontSize: '14px', 
                      fontWeight: '800', 
                      opacity: submitting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                     {submitting && <Loader2 size={18} className="animate-spin" />}
                     {isEditing ? 'ACTUALIZAR IMPUESTO' : 'GUARDAR IMPUESTO'}
                  </button>
               </form>
            </motion.div>
         </div>

         {/* Right Column: Table */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', flex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black' }}>Impuestos Registrados</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <List size={18} color="var(--text-muted)" />
                  </div>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>IMPUESTO / TASA</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>VALOR</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ESTADO</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ACCIONES</th>
                     </tr>
                  </thead>
                  <tbody style={{ color: 'black' }}>
                      {loading ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '100px 0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                              <Loader2 size={40} className="animate-spin" color="var(--primary)" />
                              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>Cargando impuestos...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredTaxes.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '100px 0' }}>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>{searchQuery ? 'No se encontraron resultados' : 'No existen impuestos registrados'}</p>
                          </td>
                        </tr>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {filteredTaxes.map((item, index) => (
                             <motion.tr 
                              key={item.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: index * 0.05 }}
                              style={{ borderBottom: '1px solid #F8FAFC', opacity: item.is_active ? 1 : 0.6 }}
                              className="hover-row"
                             >
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                         <Percent size={20} />
                                      </div>
                                      <p style={{ fontSize: '16px', fontWeight: '800' }}>{item.name}</p>
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <p style={{ fontSize: '16px', fontWeight: '800' }}>{parseFloat(item.rate).toFixed(2)}%</p>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      gap: '6px', 
                                      padding: '4px 10px', 
                                      borderRadius: '20px', 
                                      backgroundColor: item.is_active ? '#ECFDF5' : '#F1F5F9',
                                      color: item.is_active ? '#059669' : '#64748B'
                                   }}>
                                      {item.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                      <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>
                                         {item.is_active ? 'Activo' : 'Inactivo'}
                                      </span>
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                                      <Edit2 
                                        size={16} 
                                        style={{ cursor: 'pointer' }} 
                                        onClick={() => handleEdit(item)}
                                      />
                                      <Trash2 
                                        size={16} 
                                        style={{ cursor: 'pointer', color: '#EF4444' }} 
                                        onClick={() => handleDelete(item.id)}
                                      />
                                   </div>
                                </td>
                             </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                   </tbody>
               </table>
            </div>
         </div>
      </div>
    </>
  );
};

export default TaxesPage;
