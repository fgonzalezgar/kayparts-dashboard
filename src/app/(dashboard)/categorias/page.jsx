'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Info, 
  LayoutGrid, 
  List,
  Save,
  Trash2,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import categoryService from '@/services/categoryService';
import { ASSETS_BASE_URL } from '@/services/api';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!name.trim()) {
      setError('El nombre de la categoría es requerido.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await categoryService.createCategory({
        name,
        description,
        image: imageFile
      });
      
      // Clear form
      setName('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Refresh list
      await fetchCategories();
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      let msg = 'Error al crear la categoría.';
      if (err.response?.data?.errors) {
        const firstField = Object.keys(err.response.data.errors)[0];
        if (firstField && err.response.data.errors[firstField].length > 0) {
          msg = err.response.data.errors[firstField][0];
        }
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Desea eliminar esta categoría por completo?')) {
      try {
        await categoryService.deleteCategory(id);
        setCategories(categories.filter(cat => cat.id !== id));
      } catch (err) {
        console.error('Error deleting category:', err);
        alert('Ocurrió un error al intentar eliminar la categoría.');
      }
    }
  };

  return (
    <>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 className="title-font" style={{ fontSize: '28px' }}>Categorías</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Organización técnica de componentes industriales.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search components..." 
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
            <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: 'black' }}>Nueva Categoría</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>Configure technical product groupings</p>
            
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ backgroundColor: '#FEF2F2', borderLeft: '4px solid #EF4444', padding: '12px', borderRadius: '6px', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}
                >
                  <AlertCircle size={16} color="#EF4444" style={{ marginTop: '2px' }} />
                  <p style={{ fontSize: '12px', color: '#B91C1C', fontWeight: '600', lineHeight: '1.4' }}>{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="e.g. Engine Components" 
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} 
                />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Technical specifications and range details..." 
                  rows="4" 
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', resize: 'none', color: 'black' }} 
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Category Thumbnail</label>
                
                <div style={{ backgroundColor: '#F1F5F9', padding: '20px', borderRadius: '12px', border: '2px dashed #CBD5E1' }} onDragOver={handleDragOver} onDrop={handleDrop}>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ marginBottom: '15px', width: '100%', color: 'black' }}
                  />
                  <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E2E8F0', borderRadius: '8px', backgroundColor: 'white' }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain' }} />
                    ) : (
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Vista previa de imagen</p>
                    )}
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="btn-primary" 
                style={{ height: '50px', fontSize: '14px', width: '100%', borderRadius: '30px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {isSubmitting ? 'Guardando...' : 'Guardar Categoría'}
              </button>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ backgroundColor: '#EDF5FF', padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '16px' }}
          >
            <div style={{ minWidth: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FDBA74', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Info size={18} color="white" />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: '700', marginBottom: '4px', color: 'black' }}>Integración en Tiempo Real</p>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>Las categorías se comunican directamente con la REST API oficial.</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Collection Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
             <div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', color: 'black' }}>Colecciones Activas</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Catalogo sincronizado</p>
             </div>
             <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', cursor: 'pointer' }}><LayoutGrid size={18} color="black" /></div>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', cursor: 'pointer' }}><List size={18} color="var(--text-muted)" /></div>
             </div>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', height: '300px', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
              <Loader2 size={32} color="var(--primary)" className="animate-spin" />
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Cargando categorías...</p>
            </div>
          ) : categories.length === 0 ? (
            <div style={{ display: 'flex', height: '200px', alignItems: 'center', justifyContent: 'center', border: '2px dashed #E2E8F0', borderRadius: '12px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>No existen categorías registradas.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)', gap: '24px' }}>
               {categories.map((cat, index) => (
                 <motion.div 
                   key={cat.id || index}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: index * 0.05 }}
                   className="glass"
                   style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}
                 >
                    <div style={{ height: '160px', position: 'relative', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
                       {(() => {
                         const rawUrl = cat.image_url || cat.image;
                         if (!rawUrl) {
                           return (
                             <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                               <LayoutGrid size={32} color="#CBD5E1" opacity={0.5} />
                             </div>
                           );
                         }

                         let finalUrl = String(rawUrl);

                         // 1. Convert local domains to production asset domain
                         if (finalUrl.includes('localhost') || finalUrl.includes('127.0.0.1')) {
                           finalUrl = finalUrl.replace(/http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/*/, ASSETS_BASE_URL);
                         }

                         // 2. Handle relative paths or path corrections
                         if (!finalUrl.startsWith('http')) {
                           // Remove leading slashes and segments that might be duplicated
                           const cleanPath = finalUrl
                             .replace(/^\/+/, '')
                             .replace('public/', '')
                             .replace('uploads/', '')
                             .replace('categories/', '')
                             .replace('storage/', '');
                           
                           finalUrl = `${ASSETS_BASE_URL}uploads/categories/${cleanPath}`;
                         } else {
                           // If it already has a protocol, ensure it's using the /public/ path
                           if (finalUrl.includes('/storage/')) {
                              finalUrl = finalUrl.replace('/storage/', '/public/uploads/');
                           }
                           if (finalUrl.includes('/uploads/') && !finalUrl.includes('/public/')) {
                              finalUrl = finalUrl.replace('/uploads/', '/public/uploads/');
                           }
                           // Ensure it has /categories/
                           if (finalUrl.includes('/uploads/') && !finalUrl.includes('/categories/')) {
                             finalUrl = finalUrl.replace('/uploads/', '/uploads/categories/');
                           }
                         }

                         return (
                           <img 
                             src={finalUrl} 
                             alt={cat.name} 
                             title={`URL: ${finalUrl}`}
                             style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                             onError={(e) => {
                               e.target.onerror = null;
                               // Smart Fallback Trace: If the primary fails, try to remove /public/ as a last resort
                               if (finalUrl.includes('/public/')) {
                                  const fallbackUrl = finalUrl.replace('/public/', '/');
                                  e.target.src = fallbackUrl;
                                  return;
                               }
                               const shortUrl = finalUrl.length > 35 ? '...' + finalUrl.substring(finalUrl.length - 35) : finalUrl;
                               e.target.src = `https://placehold.co/600x400/F1F5F9/94A3B8?text=${encodeURIComponent('404 FALLO EN:\n' + shortUrl)}`;
                             }}
                           />
                         );
                       })()}

                       <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }}></div>
                    </div>
                    <div style={{ padding: '20px', position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>ID: {cat.id}</span>
                          <span style={{ fontSize: '10px', fontWeight: '800', padding: '4px 8px', borderRadius: '20px', backgroundColor: '#FFEDD5', color: '#9A3412' }}>{cat.products_count || 0} PROD</span>
                       </div>
                       <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', color: 'black' }}>{cat.name}</h3>
                       <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '24px', flex: 1 }}>
                         {cat.description || 'Sin descripción'}
                       </p>
                       <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                          <button 
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--text-main)', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', cursor: 'pointer' }}
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => handleDelete(cat.id)}
                            style={{ backgroundColor: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', cursor: 'pointer' }}
                          >
                            <Trash2 size={12} /> Eliminar
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
