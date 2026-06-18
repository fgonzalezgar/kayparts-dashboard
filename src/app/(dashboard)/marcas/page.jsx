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
  Plus,
  PlusCircle, 
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  MapPin,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import brandService from '@/services/brandService';
import vehicleModelService from '@/services/vehicleModelService';
import { getAssetUrl } from '@/services/api';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const [brandsData, modelsData] = await Promise.all([
        brandService.getBrands(),
        vehicleModelService.getModels()
      ]);

      const resolvedBrands = Array.isArray(brandsData) ? brandsData : (brandsData?.data || []);
      const resolvedModels = Array.isArray(modelsData) ? modelsData : (modelsData?.data || []);
      
      setBrands(resolvedBrands);
      setModels(resolvedModels);
    } catch (error) {
      console.error('Error fetching data:', error);
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

  const handleOpenCreateModal = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand) => {
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
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      showToast('error', 'El nombre de la marca es obligatorio');
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
      handleCloseModal();
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

  const getBrandTag = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('toyota')) return 'PREMIUM';
    if (lowerName.includes('bmw')) return 'LUXURY';
    return null;
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
            Vehicle Brands
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '500px' }}>
            Manage the complete catalog of automotive manufacturers and their associated part ecosystems.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search brands, parts or models..." 
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
             <Plus size={20} /> Agregar Nueva Marca
          </button>
          <Bell size={20} color="var(--text-muted)" />
          <Settings size={20} color="var(--text-muted)" />
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <User size={20} color="var(--text-muted)" />
          </div>
        </div>
      </header>

      {/* Brands Grid */}
      {loading ? (
        <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
          <Loader2 size={40} className="animate-spin" color="var(--primary)" />
          <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>Cargando catálogo de marcas...</p>
        </div>
      ) : filteredBrands.length === 0 ? (
        <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E2E8F0', borderRadius: '12px' }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
            {searchQuery ? 'No se encontraron resultados' : 'No existen marcas registradas'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {filteredBrands.map((brand, index) => {
            const modelsCount = models.filter(m => m.brand_id === brand.id).length;
            const tag = getBrandTag(brand.name);
            const logoUrl = getAssetUrl(brand.image || brand.image_url || brand.image_path);
            
            return (
              <motion.div 
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass hover-card"
                style={{ 
                  borderRadius: 'var(--radius-lg)', 
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid #E2E8F0',
                  opacity: brand.is_active ? 1 : 0.7
                }}
              >
                {/* Logo Top Section */}
                <div style={{ 
                  height: '140px', 
                  backgroundColor: '#F1F5F9', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '20px',
                  position: 'relative'
                }}>
                  <div style={{ 
                    width: '74px', 
                    height: '74px', 
                    backgroundColor: 'white', 
                    borderRadius: '12px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    overflow: 'hidden',
                    position: 'relative',
                    padding: '8px'
                  }}>
                    {logoUrl ? (
                      <img src={logoUrl} alt={brand.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <Package size={28} color="#CBD5E1" />
                    )}
                  </div>
                </div>
                
                {/* Info Bottom Section */}
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>{brand.name}</h3>
                    {tag && (
                      <span style={{ 
                        fontSize: '9px', 
                        fontWeight: '800', 
                        padding: '2px 6px', 
                        borderRadius: '4px', 
                        backgroundColor: tag === 'PREMIUM' ? '#FEE2E2' : '#FEF3C7',
                        color: tag === 'PREMIUM' ? '#EF4444' : '#D97706'
                      }}>
                        {tag}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '20px' }}>
                    {brand.location || 'SIN UBICACIÓN'}
                  </p>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '20px', fontWeight: '800', color: 'black' }}>{modelsCount}</p>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700' }}>Modelos</p>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button 
                        type="button" 
                        onClick={() => handleOpenEditModal(brand)} 
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Editar"
                      >
                        <Edit2 size={13} color="var(--text-muted)" />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => handleDelete(brand.id)} 
                        style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #FEE2E2', backgroundColor: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        title="Eliminar"
                      >
                        <Trash2 size={13} color="#EF4444" />
                      </button>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        backgroundColor: '#F1F5F9', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                      }}>
                        <ChevronRight size={18} color="var(--dark)" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Add Brand Card */}
          <motion.div 
            onClick={handleOpenCreateModal}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: filteredBrands.length * 0.05 }}
            style={{ 
              borderRadius: 'var(--radius-lg)', 
              border: '2px dashed #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px',
              cursor: 'pointer',
              backgroundColor: 'rgba(248, 250, 252, 0.5)',
              minHeight: '260px'
            }}
          >
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: '#FEE2E2', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginBottom: '16px'
            }}>
              <PlusCircle size={24} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '4px', color: 'black' }}>Agregar Marca</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center' }}>
              Registrar nuevo fabricante en el catálogo
            </p>
          </motion.div>
        </div>
      )}

      {/* Catalog Summary */}
      {!loading && (
        <div className="glass" style={{ marginTop: '40px', padding: '32px', borderRadius: 'var(--radius-lg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', border: '1px solid #E2E8F0' }}>
           <div style={{ display: 'flex', gap: '60px' }}>
              <div>
                 <p style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Resumen de Catálogo</p>
                 <div style={{ display: 'flex', gap: '60px' }}>
                    <div>
                       <p style={{ fontSize: '32px', fontWeight: '800', color: 'black' }}>{brands.filter(b => b.is_active).length}</p>
                       <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Marcas Activas</p>
                    </div>
                    <div>
                       <p style={{ fontSize: '32px', fontWeight: '800', color: 'black' }}>{models.length}</p>
                       <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Modelos Totales</p>
                    </div>
                 </div>
              </div>
           </div>
           
           <div style={{ 
             backgroundColor: 'var(--primary)', 
             padding: '24px', 
             borderRadius: 'var(--radius-lg)', 
             color: 'white',
             width: '300px',
             position: 'relative',
             overflow: 'hidden'
           }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '8px' }}>Stock Crítico</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                   <p style={{ fontSize: '36px', fontWeight: '800' }}>12</p>
                   <p style={{ fontSize: '13px', fontWeight: '600', opacity: 0.9 }}>Marcas sin inventario</p>
                </div>
                <button style={{ 
                  width: '100%', 
                  backgroundColor: 'rgba(255,255,255,0.2)', 
                  border: 'none', 
                  padding: '10px', 
                  borderRadius: '8px', 
                  color: 'white', 
                  fontWeight: '700', 
                  fontSize: '11px',
                }}>
                   Ver Reporte Detallado
                </button>
              </div>
              <div style={{ 
                position: 'absolute', 
                right: '-20px', 
                bottom: '-20px', 
                opacity: 0.1 
              }}>
                 <Package size={120} />
              </div>
           </div>
        </div>
      )}

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
                     {isEditing ? 'Editar Marca' : 'Nueva Marca'}
                   </h2>
                   <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>CONFIGURACIÓN TÉCNICA</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Brand Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>NOMBRE DE LA MARCA</label>
                   <input 
                     type="text" 
                     name="name"
                     value={formData.name}
                     onChange={handleChange}
                     placeholder="ej. Toyota, Ford, BMW" 
                     required
                     style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                   />
                </div>

                {/* Location */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>UBICACIÓN / ORIGEN</label>
                   <div style={{ position: 'relative' }}>
                     <input 
                       type="text" 
                       name="location"
                       value={formData.location}
                       onChange={handleChange}
                       placeholder="ej. Aichi, Japón" 
                       style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', color: 'black', fontWeight: '600' }} 
                     />
                     <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                   </div>
                </div>

                {/* Description */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>DESCRIPCIÓN</label>
                   <textarea 
                     name="description"
                     value={formData.description}
                     onChange={handleChange}
                     placeholder="Detalles sobre la trayectoria o especialidad de la marca..." 
                     rows="3" 
                     style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC', fontSize: '14px', outline: 'none', resize: 'none', color: 'black' }} 
                   />
                </div>

                {/* Active Switch */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '4px 0' }}>
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

                {/* Logo Image */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>LOGO DE LA MARCA</label>
                   <div 
                     onClick={() => document.getElementById('image-upload-modal').click()}
                     style={{ 
                       border: '2px dashed #CBD5E1', 
                       borderRadius: '12px', 
                       padding: '24px 20px', 
                       textAlign: 'center', 
                       backgroundColor: '#F8FAFC', 
                       cursor: 'pointer',
                       position: 'relative',
                       overflow: 'hidden',
                       height: '120px',
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
                        <Upload size={20} color="var(--text-muted)" style={{ margin: '0 auto 6px' }} />
                        <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '2px', color: 'black' }}>
                          {formData.image ? formData.image.name : 'Subir logo'}
                        </p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PNG, JPG HASTA 5MB</p>
                      </div>
                      <input 
                        id="image-upload-modal"
                        type="file" 
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }} 
                      />
                   </div>
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
                     {isEditing ? 'ACTUALIZAR' : 'GUARDAR MARCA'}
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

export default BrandsPage;
