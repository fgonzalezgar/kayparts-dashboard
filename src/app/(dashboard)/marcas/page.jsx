'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Upload, 
  Edit2, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  HelpCircle,
  List,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  MapPin,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import brandService from '@/services/brandService';
import { getAssetUrl } from '@/services/api';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    is_active: true,
    image: null
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
      const data = await brandService.getBrands();
      if (Array.isArray(data)) {
        setBrands(data);
      } else if (data && Array.isArray(data.data)) {
        setBrands(data.data);
      } else {
        setBrands([]);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      is_active: true,
      image: null
    });
    setImagePreview(null);
    setIsEditing(false);
    setCurrentId(null);
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
        await brandService.updateBrand(currentId, formData);
        showToast('success', 'Marca actualizada exitosamente.');
      } else {
        await brandService.createBrand(formData);
        showToast('success', 'Marca creada exitosamente.');
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving brand:', error);
      let msg = 'Error al guardar la marca.';
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

  const handleEdit = (brand) => {
    setIsEditing(true);
    setCurrentId(brand.id);
    setFormData({
      name: brand.name,
      description: brand.description || '',
      location: brand.location || '',
      is_active: !!brand.is_active,
      image: null
    });
    setImagePreview(getAssetUrl(brand.image || brand.image_url || brand.image_path));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta marca?')) return;
    
    try {
      await brandService.deleteBrand(id);
      showToast('success', 'Marca eliminada.');
      fetchData();
    } catch (error) {
      console.error('Error deleting brand:', error);
      showToast('error', 'Error al eliminar la marca.');
    }
  };

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (brand.location || '').toLowerCase().includes(searchQuery.toLowerCase())
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
            {toast.type === 'success'
              ? <CheckCircle size={18} color="#059669" />
              : <AlertCircle size={18} color="#DC2626" />}
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
               <h1 className="title-font" style={{ fontSize: '28px' }}>Marcas</h1>
               <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }}></div>
               <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Sistema {'>'} <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Marcas de Vehículos</span>
               </p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestión del catálogo completo de fabricantes automotrices.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar marcas..." 
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
                     <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>{isEditing ? 'Editar Marca' : 'Nueva Marca'}</h2>
                     <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>CONFIGURACIÓN TÉCNICA</p>
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
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>NOMBRE DE LA MARCA</label>
                     <input 
                       type="text" 
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       placeholder="ej. Toyota, Ford, BMW" 
                       required
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} 
                     />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>UBICACIÓN / ORIGEN</label>
                     <div style={{ position: 'relative' }}>
                       <input 
                         type="text" 
                         name="location"
                         value={formData.location}
                         onChange={handleChange}
                         placeholder="ej. Aichi, Japón" 
                         style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} 
                       />
                       <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>DESCRIPCIÓN</label>
                     <textarea 
                       name="description"
                       value={formData.description}
                       onChange={handleChange}
                       placeholder="Detalles sobre la trayectoria o especialidad de la marca..." 
                       rows="3" 
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', resize: 'none', color: 'black' }} 
                     />
                  </div>

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
                        {formData.is_active ? 'MARCA ACTIVA' : 'MARCA INACTIVA'}
                     </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>LOGO DE LA MARCA</label>
                     <div 
                       onClick={() => document.getElementById('image-upload').click()}
                       style={{ 
                         border: '2px dashed #CBD5E1', 
                         borderRadius: '12px', 
                         padding: '30px 20px', 
                         textAlign: 'center', 
                         backgroundColor: '#F8FAFC', 
                         cursor: 'pointer',
                         position: 'relative',
                         overflow: 'hidden',
                         height: '140px',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         justifyContent: 'center'
                       }}
                     >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8 }} />
                        ) : null}
                        <div style={{ zIndex: 1, textAlign: 'center' }}>
                          <Upload size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                          <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '2px', color: 'black' }}>{formData.image ? formData.image.name : 'Subir logo'}</p>
                          <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PNG, JPG HASTA 5MB</p>
                        </div>
                        <input 
                          id="image-upload"
                          type="file" 
                          accept="image/*"
                           onChange={handleImageChange}
                          style={{ display: 'none' }} 
                        />
                     </div>
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
                     {isEditing ? 'ACTUALIZAR MARCA' : 'GUARDAR MARCA'}
                  </button>
               </form>
            </motion.div>
         </div>

         {/* Right Column: Table */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', flex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black' }}>Marcas Registradas</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <Filter size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                     <List size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </div>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>LOGO / MARCA</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>DETALLES</th>
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
                              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>Cargando marcas...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredBrands.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '100px 0' }}>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>{searchQuery ? 'No se encontraron resultados' : 'No existen marcas registradas'}</p>
                          </td>
                        </tr>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {filteredBrands.map((brand, index) => (
                             <motion.tr 
                              key={brand.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: index * 0.05 }}
                              style={{ borderBottom: '1px solid #F8FAFC', opacity: brand.is_active ? 1 : 0.6 }}
                              className="hover-row"
                             >
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                      <div style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                          {getAssetUrl(brand.image || brand.image_url || brand.image_path) ? (
                                            <img
                                              src={getAssetUrl(brand.image || brand.image_url || brand.image_path)}
                                              alt={brand.name}
                                              style={{ width: '80%', height: '80%', objectFit: 'contain' }}
                                            />
                                          ) : (
                                            <div style={{ color: '#CBD5E1' }}>
                                              <Upload size={20} />
                                            </div>
                                          )}
                                      </div>
                                      <p style={{ fontSize: '14px', fontWeight: '800' }}>{brand.name}</p>
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                                      <MapPin size={10} color="var(--text-muted)" />
                                      <p style={{ fontSize: '11px', fontWeight: '700' }}>{brand.location || 'N/A'}</p>
                                   </div>
                                   <p style={{ fontSize: '11px', color: 'var(--text-muted)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {brand.description || 'Sin descripción'}
                                   </p>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ 
                                      display: 'inline-flex', 
                                      alignItems: 'center', 
                                      gap: '6px', 
                                      padding: '4px 10px', 
                                      borderRadius: '20px', 
                                      backgroundColor: brand.is_active ? '#ECFDF5' : '#F1F5F9',
                                      color: brand.is_active ? '#059669' : '#64748B'
                                   }}>
                                      {brand.is_active ? <CheckCircle size={12} /> : <XCircle size={12} />}
                                      <span style={{ fontSize: '10px', fontWeight: '800', textTransform: 'uppercase' }}>
                                         {brand.is_active ? 'Activo' : 'Inactivo'}
                                      </span>
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                                      <Edit2 
                                        size={16} 
                                        style={{ cursor: 'pointer' }} 
                                        onClick={() => handleEdit(brand)}
                                      />
                                      <Trash2 
                                        size={16} 
                                        style={{ cursor: 'pointer', color: '#EF4444' }} 
                                        onClick={() => handleDelete(brand.id)}
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

export default BrandsPage;BrandsPage;
