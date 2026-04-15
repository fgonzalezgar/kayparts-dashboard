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
  Filter,
  PlusCircle,
  List,
  Loader2,
  CheckCircle,
  AlertCircle,
  XCircle,
  Calendar,
  X,
  Truck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import vehicleModelService from '@/services/vehicleModelService';
import brandService from '@/services/brandService';
import { getAssetUrl } from '@/services/api';

const VehicleModelsPage = () => {
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  const [formData, setFormData] = useState({
    brand_id: '',
    name: '',
    description: '',
    year_from: '',
    year_to: '',
    is_active: true,
    image: null
  });

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [modelsData, brandsData] = await Promise.all([
        vehicleModelService.getModels(),
        brandService.getBrands()
      ]);
      
      setModels(Array.isArray(modelsData) ? modelsData : (modelsData?.data || []));
      setBrands(Array.isArray(brandsData) ? brandsData : (brandsData?.data || []));
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showToast('error', 'Error al cargar los datos del catálogo.');
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
      brand_id: '',
      name: '',
      description: '',
      year_from: '',
      year_to: '',
      is_active: true,
      image: null
    });
    setImagePreview(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.brand_id) {
      showToast('error', 'Nombre y Marca son obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await vehicleModelService.updateModel(currentId, formData);
        showToast('success', 'Modelo actualizado con éxito.');
      } else {
        await vehicleModelService.createModel(formData);
        showToast('success', 'Modelo creado con éxito.');
      }
      resetForm();
      const freshModels = await vehicleModelService.getModels();
      setModels(Array.isArray(freshModels) ? freshModels : (freshModels?.data || []));
    } catch (error) {
      console.error('Error saving model:', error);
      let msg = 'Error al guardar el modelo.';
      if (error.response?.data?.errors) {
        msg = Object.values(error.response.data.errors).flat()[0] || msg;
      }
      showToast('error', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (model) => {
    setIsEditing(true);
    setCurrentId(model.id);
    setFormData({
      brand_id: model.brand_id,
      name: model.name,
      description: model.description || '',
      year_from: model.year_from || '',
      year_to: model.year_to || '',
      is_active: !!model.is_active,
      image: null
    });
    setImagePreview(getAssetUrl(model.image_url || model.image_path));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este modelo?')) return;
    
    try {
      await vehicleModelService.deleteModel(id);
      showToast('success', 'Modelo eliminado.');
      setModels(prev => prev.filter(m => m.id !== id));
    } catch (error) {
      console.error('Error deleting model:', error);
      showToast('error', 'Error al eliminar el modelo.');
    }
  };

  const filteredModels = models.filter(model => 
    model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (model.brand_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
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

      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <h1 className="title-font" style={{ fontSize: '28px' }}>Modelos</h1>
               <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }}></div>
               <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Catálogo {'>'} <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Compatibilidad de Vehículos</span>
               </p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Gestión de versiones y modelos por fabricante.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar modelos o marcas..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ 
                width: '100%', padding: '10px 12px 10px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', 
                backgroundColor: '#F8FAFC', outline: 'none', fontSize: '14px', color: 'black'
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
                     <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>{isEditing ? 'Editar Modelo' : 'Nuevo Modelo'}</h2>
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
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>MARCA DEL VEHÍCULO</label>
                     <select 
                       name="brand_id" 
                       value={formData.brand_id} 
                       onChange={handleChange} 
                       required
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }}
                     >
                       <option value="">Selecciona una marca...</option>
                       {brands.map(brand => (
                         <option key={brand.id} value={brand.id}>{brand.name}</option>
                       ))}
                     </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>NOMBRE DEL MODELO</label>
                     <input 
                       type="text" name="name" value={formData.name} onChange={handleChange}
                       placeholder="ej. Hilux, F-150, Prado" required
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} 
                     />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>AÑO INICIAL</label>
                       <div style={{ position: 'relative' }}>
                         <input 
                           type="number" name="year_from" value={formData.year_from} onChange={handleChange}
                           placeholder="2015"
                           style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} 
                         />
                         <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                       </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>AÑO FINAL</label>
                       <div style={{ position: 'relative' }}>
                         <input 
                           type="number" name="year_to" value={formData.year_to} onChange={handleChange}
                           placeholder="2024"
                           style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} 
                         />
                         <Calendar size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                       </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>DETALLES / DESCRIPCIÓN</label>
                     <textarea 
                       name="description" value={formData.description} onChange={handleChange}
                       placeholder="Especificaciones de versión o compatibilidad..." rows="3" 
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', resize: 'none', color: 'black' }} 
                     />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0' }}>
                     <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                        <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} style={{ opacity: 0, width: 0, height: 0 }} />
                        <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: formData.is_active ? 'var(--primary)' : '#CBD5E1', transition: '.4s', borderRadius: '24px' }}>
                           <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: formData.is_active ? '22px' : '4px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                        </span>
                     </label>
                     <span style={{ fontSize: '12px', fontWeight: '700', color: formData.is_active ? 'var(--primary)' : 'var(--text-muted)' }}>{formData.is_active ? 'ACTIVO' : 'INACTIVO'}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>IMAGEN DEL MODELO</label>
                     <div 
                       onClick={() => document.getElementById('image-upload').click()}
                       style={{ border: '2px dashed #CBD5E1', borderRadius: '12px', padding: '30px 20px', textAlign: 'center', backgroundColor: '#F8FAFC', cursor: 'pointer', position: 'relative', overflow: 'hidden', height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                     >
                        {imagePreview ? <img src={imagePreview} alt="Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'contain', opacity: 0.8 }} /> : null}
                        <div style={{ zIndex: 1, textAlign: 'center' }}>
                          <Upload size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px' }} />
                          <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '2px', color: 'black' }}>{formData.image ? formData.image.name : 'Subir imagen'}</p>
                          <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PNG, JPG HASTA 5MB</p>
                        </div>
                        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                     </div>
                  </div>

                  <button type="submit" disabled={submitting} className="btn-primary" style={{ width: '100%', height: '50px', borderRadius: '30px', fontSize: '14px', fontWeight: '800', opacity: submitting ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                     {submitting && <Loader2 size={18} className="animate-spin" />}
                     {isEditing ? 'ACTUALIZAR MODELO' : 'GUARDAR MODELO'}
                  </button>
               </form>
            </motion.div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', flex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black' }}>Modelos Registrados</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <Filter size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                     <List size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </div>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>VISUAL</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MODELO / MARCA</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>COMPATIBILIDAD</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ACCIONES</th>
                     </tr>
                  </thead>
                  <tbody style={{ color: 'black' }}>
                      {loading ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '100px 0' }}><Loader2 size={40} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto' }} /></td></tr>
                      ) : filteredModels.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign: 'center', padding: '100px 0' }}><p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>No existen modelos registrados</p></td></tr>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {filteredModels.map((model, index) => (
                             <motion.tr key={model.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }} style={{ borderBottom: '1px solid #F8FAFC' }} className="hover-row">
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ width: '64px', height: '40px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                                      {getAssetUrl(model.image_url || model.image_path) ? (
                                        <img src={getAssetUrl(model.image_url || model.image_path)} alt={model.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                                      ) : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Truck size={20} color="#CBD5E1" /></div>}
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <p style={{ fontSize: '14px', fontWeight: '800' }}>{model.name}</p>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <span style={{ fontSize: '9px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.5px' }}>{model.brand_name}</span>
                                      <div style={{ width: '3px', height: '3px', borderRadius: '50%', backgroundColor: '#CBD5E1' }}></div>
                                      <span style={{ fontSize: '9px', fontWeight: '700', color: model.is_active ? '#059669' : '#DC2626' }}>{model.is_active ? 'ACTIVO' : 'INACTIVO'}</span>
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <Calendar size={12} color="var(--text-muted)" />
                                      <p style={{ fontSize: '12px', fontWeight: '700' }}>{model.year_from}{model.year_to ? ` — ${model.year_to}` : ' en adelante'}</p>
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                                      <Edit2 size={16} style={{ cursor: 'pointer' }} onClick={() => handleEdit(model)} />
                                      <Trash2 size={16} style={{ cursor: 'pointer', color: '#EF4444' }} onClick={() => handleDelete(model.id)} />
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

export default VehicleModelsPage;
