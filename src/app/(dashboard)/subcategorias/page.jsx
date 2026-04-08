'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  Upload, 
  Edit2, 
  Trash2, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  PlusCircle,
  HelpCircle,
  List,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import subcategoryService from '@/services/subcategoryService';
import categoryService from '@/services/categoryService';
import { ASSETS_BASE_URL } from '@/services/api';

const SubcategoriesPage = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    category_id: '',
    name: '',
    description: '',
    image: null
  });

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch categories (parent) independently
    try {
      const catsData = await categoryService.getCategories();
      console.log('Categories loaded in component:', catsData);
      
      // Strict array check to ensure the select can render
      if (Array.isArray(catsData)) {
        setCategories(catsData);
      } else if (catsData && Array.isArray(catsData.data)) {
        setCategories(catsData.data);
      } else {
        console.warn('Categories data is not an array:', catsData);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Optional: set a local error state to show in the UI
    }

    // Fetch subcategories independently
    try {
      const subsData = await subcategoryService.getSubcategories();
      console.log('Subcategories loaded in component:', subsData);
      
      if (Array.isArray(subsData)) {
        setSubcategories(subsData);
      } else if (subsData && Array.isArray(subsData.data)) {
        setSubcategories(subsData.data);
      } else {
        setSubcategories([]);
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      // We don't alert here to avoid blocking the UI
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
      category_id: '',
      name: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setIsEditing(false);
    setCurrentId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id || !formData.name) {
      alert('Categoría y nombre son obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      if (isEditing) {
        await subcategoryService.updateSubcategory(currentId, formData);
      } else {
        await subcategoryService.createSubcategory(formData);
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error saving subcategory:', error);
      alert('Error al guardar la subcategoría.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (sub) => {
    setIsEditing(true);
    setCurrentId(sub.id);
    setFormData({
      category_id: sub.category_id,
      name: sub.name,
      description: sub.description || '',
      image: null
    });
    setImagePreview(sub.image_url ? `${ASSETS_BASE_URL}storage/${sub.image_url}` : null);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta subcategoría?')) return;
    
    try {
      setLoading(true);
      await subcategoryService.deleteSubcategory(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      alert('Error al eliminar la subcategoría.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSubcategories = subcategories.filter(sub => 
    sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.category?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
               <h1 className="title-font" style={{ fontSize: '28px' }}>Subcategorías</h1>
               <div style={{ height: '24px', width: '1px', backgroundColor: '#E2E8F0' }}></div>
               <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Sistemas {'>'} Categorías {'>'} <span style={{ color: 'var(--primary)', fontWeight: '700' }}>Subcategorías</span>
               </p>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Especificaciones detalladas de sub-niveles industriales.</p>
         </div>
         
         <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Search subcategories..." 
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
                     <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'black' }}>{isEditing ? 'Edit Subcategory' : 'New Subcategory'}</h2>
                     <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>TECHNICAL SPECIFICATIONS</p>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={resetForm}
                      style={{ padding: '4px 12px', borderRadius: '4px', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', border: '1px solid #E2E8F0', cursor: 'pointer' }}
                    >
                      CANCEL
                    </button>
                  )}
               </div>

               <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>PARENT CATEGORY</label>
                     <div style={{ position: 'relative' }}>
                        <select 
                          name="category_id"
                          value={formData.category_id}
                          onChange={handleChange}
                          required
                          style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', appearance: 'none', fontWeight: '600', color: 'black' }}
                        >
                           <option value="">Select a category</option>
                           {categories.map(cat => (
                             <option key={cat.id} value={cat.id}>{cat.name}</option>
                           ))}
                        </select>
                        <ChevronDown size={16} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'black' }} />
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>SUBCATEGORY NAME</label>
                     <input 
                       type="text" 
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       placeholder="e.g. Turbochargers" 
                       required
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', color: 'black' }} 
                     />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>TECHNICAL DESCRIPTION</label>
                     <textarea 
                       name="description"
                       value={formData.description}
                       onChange={handleChange}
                       placeholder="Describe the mechanical specifications or application scope..." 
                       rows="4" 
                       style={{ width: '100%', padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: '#F0F7FF', fontSize: '14px', outline: 'none', resize: 'none', color: 'black' }} 
                     />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>VISUAL REFERENCE (IMAGE)</label>
                     <div 
                       onClick={() => document.getElementById('image-upload').click()}
                       style={{ 
                         border: '2px dashed #CBD5E1', 
                         borderRadius: '12px', 
                         padding: '40px 20px', 
                         textAlign: 'center', 
                         backgroundColor: '#F8FAFC', 
                         cursor: 'pointer',
                         position: 'relative',
                         overflow: 'hidden',
                         height: '160px',
                         display: 'flex',
                         flexDirection: 'column',
                         alignItems: 'center',
                         justifyContent: 'center'
                       }}
                     >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
                        ) : null}
                        <Upload size={24} color="var(--text-muted)" style={{ margin: '0 auto 8px', zIndex: 1 }} />
                        <p style={{ fontSize: '12px', fontWeight: '700', marginBottom: '2px', color: 'black', zIndex: 1 }}>{formData.image ? formData.image.name : 'Drag & drop or click to upload'}</p>
                        <p style={{ fontSize: '10px', color: 'var(--text-muted)', zIndex: 1 }}>PNG, JPG UP TO 10MB</p>
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
                      fontStyle: 'italic',
                      opacity: submitting ? 0.7 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                     {submitting && <Loader2 size={18} className="animate-spin" />}
                     {isEditing ? 'ACTUALIZAR SUBCATEGORÍA' : 'GUARDAR SUBCATEGORÍA'}
                  </button>
               </form>
            </motion.div>

            {/* Info Box */}
            <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             style={{ backgroundColor: '#FEF3C7', border: '1px solid #F59E0B', padding: '24px', borderRadius: 'var(--radius-lg)', display: 'flex', gap: '16px' }}
            >
               <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Edit2 size={16} color="white" />
               </div>
               <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '4px', color: 'black' }}>System Integrity Notice</h4>
                  <p style={{ fontSize: '11px', color: '#92400E', lineHeight: '1.4' }}>Ensure the subcategory is unique within the parent category to prevent database indexing conflicts in the global parts catalog.</p>
               </div>
            </motion.div>
         </div>

         {/* Right Column: Table */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass" style={{ padding: '32px', borderRadius: 'var(--radius-lg)', backgroundColor: 'white', flex: 1 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'black' }}>Existing Subcategories</h2>
                  <div style={{ display: 'flex', gap: '12px' }}>
                     <Filter size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                     <List size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </div>
               </div>

               <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                     <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>REF / IMAGE</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>SUBCATEGORY DETAILS</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>PARENT</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ITEMS</th>
                        <th style={{ padding: '16px 12px', fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ACTIONS</th>
                     </tr>
                  </thead>
                  <tbody style={{ color: 'black' }}>
                      {loading ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '100px 0' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                              <Loader2 size={40} className="animate-spin" color="var(--primary)" />
                              <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>Cargando subcategorías...</p>
                            </div>
                          </td>
                        </tr>
                      ) : filteredSubcategories.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '100px 0' }}>
                            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-muted)' }}>No se encontraron subcategorías.</p>
                          </td>
                        </tr>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {filteredSubcategories.map((sub, index) => (
                             <motion.tr 
                              key={sub.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ delay: index * 0.05 }}
                              style={{ borderBottom: '1px solid #F8FAFC' }}
                              className="hover-row"
                             >
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ width: '44px', height: '44px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E2E8F0', position: 'relative', backgroundColor: '#F1F5F9' }}>
                                      {sub.image_url ? (
                                        <img src={`${ASSETS_BASE_URL}storage/${sub.image_url}`} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#CBD5E1' }}>
                                          <Upload size={16} />
                                        </div>
                                      )}
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <p style={{ fontSize: '14px', fontWeight: '800' }}>{sub.name}</p>
                                   <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{sub.description || 'Sin descripción'}</p>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <span style={{ fontSize: '9px', fontWeight: '800', padding: '4px 10px', borderRadius: '4px', backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
                                     {sub.category?.name || 'N/A'}
                                   </span>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: (sub.products_count || 0) > 0 ? '#10B981' : '#EF4444' }}></div>
                                      <span style={{ fontSize: '13px', fontWeight: '800' }}>{sub.products_count || 0}</span>
                                   </div>
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                   <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)' }}>
                                      <Edit2 
                                        size={16} 
                                        style={{ cursor: 'pointer' }} 
                                        onClick={() => handleEdit(sub)}
                                      />
                                      <Trash2 
                                        size={16} 
                                        style={{ cursor: 'pointer', color: '#EF4444' }} 
                                        onClick={() => handleDelete(sub.id)}
                                      />
                                   </div>
                                </td>
                             </motion.tr>
                          ))}
                        </AnimatePresence>
                      )}
                   </tbody>
               </table>

               <div style={{ marginTop: 'auto', paddingTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing 1 to 3 of 42 subcategories</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black' }}><ChevronLeft size={16} /></button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary)', color: 'white', fontWeight: '800', fontSize: '12px' }}>1</button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '800', fontSize: '12px', color: 'var(--text-muted)' }}>2</button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', fontWeight: '800', fontSize: '12px', color: 'var(--text-muted)' }}>3</button>
                     <button style={{ width: '32px', height: '32px', borderRadius: '6px', border: '1px solid #E2E8F0', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'black' }}><ChevronRight size={16} /></button>
                  </div>
               </div>
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

export default SubcategoriesPage;
