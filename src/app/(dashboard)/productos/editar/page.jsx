'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Save, 
  X, 
  Upload,
  DollarSign,
  Layers,
  Settings,
  ChevronDown,
  Box,
  Truck,
  PlusCircle,
  Zap,
  Camera,
  Trash2
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import productService from '@/services/productService';
import subcategoryService from '@/services/subcategoryService';

const EditProductForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  // ── State variables for selects & option lists ─────────────────────────────
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [productBrands, setProductBrands] = useState([]);
  const [vehicleBrands, setVehicleBrands] = useState([]);
  const [vehicleModels, setVehicleModels] = useState([]);
  const [vehicleYears, setVehicleYears] = useState([]);
  const [vehicleDisplacements, setVehicleDisplacements] = useState([]);
  const [taxes, setTaxes] = useState([]);

  // ── Form value states ──────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [productBrandId, setProductBrandId] = useState('');
  const [vehicleBrandId, setVehicleBrandId] = useState('');
  const [vehicleModelId, setVehicleModelId] = useState('');
  
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedDisplacements, setSelectedDisplacements] = useState([]);
  
  const [position, setPosition] = useState('');
  const [side, setSide] = useState('');
  const [transmission, setTransmission] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  const [isFeatured, setIsFeatured] = useState(false);

  // Technical Criteria
  const [criteria, setCriteria] = useState([]);

  // Image Gallery Slots
  const imageSlots = ['LATERAL', 'EMPAQUE', 'FRONTAL', 'TRASERA', 'MOTOR', 'DETALLE'];
  const [files, setFiles] = useState({}); // { SLOT_NAME: File }
  const [previews, setPreviews] = useState({}); // { SLOT_NAME: url_string }
  const [primarySlot, setPrimarySlot] = useState('FRONTAL');
  
  // Loading status
  const [loadingProduct, setLoadingProduct] = useState(true);

  // Load initial options and product details
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch static dropdowns
        const [cats, pBrands, vBrands, years, disps, taxList] = await Promise.all([
          productService.getSelectCategories(),
          productService.getSelectProductBrands(),
          productService.getSelectVehicleBrands(),
          productService.getSelectVehicleYears(),
          productService.getSelectVehicleDisplacements(),
          productService.getTaxes()
        ]);
        setCategories(cats);
        setProductBrands(pBrands);
        setVehicleBrands(vBrands);
        setVehicleYears(years);
        setVehicleDisplacements(disps);
        setTaxes(taxList);

        if (id) {
          // Fetch product details
          const product = await productService.getProduct(id);
          
          setName(product.name || '');
          setSku(product.sku || '');
          setPrice(product.price ? product.price.toString() : '');
          setStock(product.stock ? product.stock.toString() : '0');
          setPosition(product.position || '');
          setSide(product.side || '');
          setTransmission(product.transmission || '');
          setDescription(product.description || '');
          setIsFeatured(!!product.is_featured);

          // Populate category & subcategories
          if (product.category?.id) {
            const catStr = product.category.id.toString();
            setCategoryId(catStr);
            const subs = await subcategoryService.getSubcategories(catStr);
            setSubcategories(subs);
            if (product.subcategory?.id) {
              setSubcategoryId(product.subcategory.id.toString());
            }
          }

          // Populate manufacturer
          if (product.brand?.id) {
            setProductBrandId(product.brand.id.toString());
          }

          // Populate vehicle model & make
          if (product.vehicle_models && product.vehicle_models.length > 0) {
            const firstModel = product.vehicle_models[0];
            const brandStr = firstModel.brand_id.toString();
            setVehicleBrandId(brandStr);
            const models = await productService.getSelectVehicleModels(brandStr);
            setVehicleModels(models);
            setVehicleModelId(firstModel.id.toString());
          }

          // Populate years, displacements & taxes
          if (product.vehicle_years) {
            setSelectedYears(product.vehicle_years.map(y => y.id.toString()));
          }
          if (product.vehicle_displacements) {
            setSelectedDisplacements(product.vehicle_displacements.map(d => d.id.toString()));
          }
          if (product.taxes) {
            setSelectedTaxes(product.taxes.map(t => t.id.toString()));
          }

          // Populate criteria
          if (product.criteria && product.criteria.length > 0) {
            setCriteria(product.criteria.map(c => ({ key: c.key, value: c.value })));
          } else {
            setCriteria([
              { key: 'Lado de montaje', value: '' },
              { key: 'Tipo de amortiguador', value: '' },
              { key: 'Tipo de sujeción', value: '' }
            ]);
          }

          // Populate images previews
          if (product.images && product.images.length > 0) {
            const loadedPreviews = {};
            product.images.forEach(img => {
              if (img.label && img.image_url) {
                loadedPreviews[img.label] = img.image_url;
                if (img.is_primary) {
                  setPrimarySlot(img.label);
                }
              }
            });
            setPreviews(loadedPreviews);
          }
        }
      } catch (error) {
        console.error('Error preloading product data:', error);
      } finally {
        setLoadingProduct(false);
      }
    };
    
    loadData();
  }, [id]);

  // Fetch subcategories when Category changes
  const handleCategoryChange = async (catId) => {
    setCategoryId(catId);
    setSubcategoryId('');
    if (catId) {
      try {
        const subs = await subcategoryService.getSubcategories(catId);
        setSubcategories(subs);
      } catch (error) {
        console.error('Error fetching subcategories:', error);
      }
    } else {
      setSubcategories([]);
    }
  };

  // Fetch vehicle models when Brand changes
  const handleVehicleBrandChange = async (brandId) => {
    setVehicleBrandId(brandId);
    setVehicleModelId('');
    if (brandId) {
      try {
        const models = await productService.getSelectVehicleModels(brandId);
        setVehicleModels(models);
      } catch (error) {
        console.error('Error fetching vehicle models:', error);
      }
    } else {
      setVehicleModels([]);
    }
  };

  // Toggle helpers
  const toggleYear = (yearId) => {
    setSelectedYears(prev => 
      prev.includes(yearId.toString()) ? prev.filter(y => y !== yearId.toString()) : [...prev, yearId.toString()]
    );
  };

  const toggleDisplacement = (dispId) => {
    setSelectedDisplacements(prev => 
      prev.includes(dispId.toString()) ? prev.filter(d => d !== dispId.toString()) : [...prev, dispId.toString()]
    );
  };

  const toggleTax = (taxId) => {
    setSelectedTaxes(prev => 
      prev.includes(taxId.toString()) ? prev.filter(t => t !== taxId.toString()) : [...prev, taxId.toString()]
    );
  };

  // Criteria actions
  const handleCriteriaChange = (index, field, value) => {
    const updated = [...criteria];
    updated[index][field] = value;
    setCriteria(updated);
  };

  const addCriterion = () => {
    setCriteria([...criteria, { key: '', value: '' }]);
  };

  const removeCriterion = (index) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  // Image actions
  const handleFileChange = (slot, e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles(prev => ({ ...prev, [slot]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [slot]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (slot) => {
    const newFiles = { ...files };
    delete newFiles[slot];
    setFiles(newFiles);

    const newPreviews = { ...previews };
    delete newPreviews[slot];
    setPreviews(newPreviews);

    if (primarySlot === slot) {
      const remainingSlots = Object.keys(newPreviews);
      setPrimarySlot(remainingSlots.length > 0 ? remainingSlots[0] : 'FRONTAL');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name) return alert('El nombre comercial del producto es obligatorio.');
    if (!categoryId) return alert('La categoría es obligatoria.');
    if (!vehicleModelId) return alert('El modelo de vehículo es obligatorio.');
    if (!sku) return alert('El código SKU / Parte es obligatorio.');
    if (!price) return alert('El precio unitario es obligatorio.');

    const formData = new FormData();
    formData.append('_method', 'PUT'); // Laravel bypass for multipart PUT requests
    formData.append('sku', sku);
    formData.append('name', name);
    formData.append('description', description || '');
    formData.append('price', price);
    formData.append('stock', stock || 0);
    formData.append('category_id', categoryId);
    
    if (subcategoryId) formData.append('subcategory_id', subcategoryId);
    else formData.append('subcategory_id', '');
    
    if (productBrandId) formData.append('brand_id', productBrandId);
    else formData.append('brand_id', '');

    formData.append('status', 'active');
    formData.append('condition', 'new');
    formData.append('position', position || '');
    formData.append('side', side || '');
    formData.append('transmission', transmission || '');
    formData.append('is_featured', isFeatured ? 1 : 0);

    // Pivot list IDs as JSON
    formData.append('model_ids', JSON.stringify([parseInt(vehicleModelId)]));
    formData.append('vehicle_year_ids', JSON.stringify(selectedYears.map(id => parseInt(id))));
    formData.append('vehicle_displacement_ids', JSON.stringify(selectedDisplacements.map(id => parseInt(id))));
    formData.append('tax_ids', JSON.stringify(selectedTaxes.map(id => parseInt(id))));

    // Criteria as JSON
    const filteredCriteria = criteria.filter(c => c.key.trim() && c.value.trim());
    formData.append('criteria', JSON.stringify(filteredCriteria));

    // Images loop
    let principalIndex = -1;
    let idx = 0;
    
    // We only send files that are newly uploaded (File instances)
    imageSlots.forEach((slot) => {
      if (files[slot] instanceof File) {
        formData.append('images[]', files[slot]);
        formData.append('image_labels[]', slot);
        if (slot === primarySlot) {
          principalIndex = idx;
        }
        idx++;
      }
    });

    if (principalIndex !== -1) {
      formData.append('principal_image_index', principalIndex);
    }

    try {
      await productService.updateProduct(id, formData);
      router.push('/productos');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar producto: ' + (error.response?.data?.message || error.message));
    }
  };

  // Styles
  const sectionLabelStyle = {
    fontSize: '11px',
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    backgroundColor: '#F8FAFC',
    fontSize: '14px',
    outline: 'none',
    fontWeight: '600',
    color: 'black'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    cursor: 'pointer'
  };

  if (loadingProduct) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: 'black', fontWeight: '700', fontSize: '18px' }}>
        Cargando detalles del producto...
      </div>
    );
  }

  return (
    <form onSubmit={handleUpdate}>
      {/* Breadcrumbs & Header */}
      <header style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px' }}>PRODUCTOS</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/</span>
              <span style={{ fontSize: '10px', fontWeight: '800', color: 'var(--text-muted)', letterSpacing: '1px' }}>EDITAR FICHA</span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h1 className="title-font" style={{ fontSize: '32px', fontWeight: '900', color: '#0F172A' }}>
                EDITAR: {name.toUpperCase()}
              </h1>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <button 
                    type="button"
                    onClick={() => router.push('/productos')}
                    style={{ background: 'none', border: 'none', color: '#64748B', fontWeight: '700', cursor: 'pointer', fontSize: '14px' }}
                  >
                      Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    style={{ padding: '12px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                      <Save size={18} /> GUARDAR CAMBIOS
                  </button>
              </div>
          </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1.2fr) 2fr', gap: '40px' }}>
         {/* LEFT COLUMN: Media & Specs */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {/* IMAGE GALLERY */}
            <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="glass" 
             style={{ padding: '24px', borderRadius: '24px', backgroundColor: 'white' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Galería de Imágenes</h3>
                  <span style={{ backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', color: 'black' }}>
                    {Object.keys(previews).length}/6 Max
                  </span>
                </div>
                
                {/* Primary Preview */}
                <div style={{ position: 'relative', width: '100%', marginBottom: '16px', borderRadius: '16px', overflow: 'hidden', height: '240px', backgroundColor: '#F8FAFC', border: '1px dashed #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    {previews[primarySlot] ? (
                      <>
                        <img src={previews[primarySlot]} alt="Product Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#E31B23', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', letterSpacing: '1px' }}>
                          PRINCIPAL ({primarySlot})
                        </div>
                      </>
                    ) : (
                      <>
                        <Camera size={48} color="#94A3B8" style={{ marginBottom: '12px' }} />
                        <p style={{ fontSize: '14px', color: '#64748B', fontWeight: '600' }}>Sin imágenes seleccionadas</p>
                      </>
                    )}
                </div>

                {/* Slots Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                    {imageSlots.map((slot) => {
                      const hasImage = !!previews[slot];
                      return (
                        <div 
                          key={slot}
                          onClick={() => {
                            if (hasImage) setPrimarySlot(slot);
                          }}
                          style={{ 
                            border: primarySlot === slot ? '2px solid #E31B23' : '1px solid #E2E8F0', 
                            borderRadius: '12px', 
                            padding: '8px', 
                            textAlign: 'center', 
                            backgroundColor: primarySlot === slot ? '#FEF2F2' : '#F8FAFC',
                            position: 'relative',
                            cursor: 'pointer',
                            height: '80px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {hasImage ? (
                            <>
                              <img src={previews[slot]} alt={slot} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeFile(slot);
                                }}
                                style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#EF4444', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                              >
                                <X size={12} />
                              </button>
                            </>
                          ) : (
                            <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }}>
                              <input 
                                type="file" 
                                accept="image/*" 
                                onChange={(e) => handleFileChange(slot, e)} 
                                style={{ display: 'none' }} 
                              />
                              <Upload size={16} color="#94A3B8" style={{ marginBottom: '4px' }} />
                              <span style={{ fontSize: '9px', fontWeight: '800', color: '#64748B' }}>{slot}</span>
                            </label>
                          )}
                        </div>
                      );
                    })}
                </div>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '16px', textAlign: 'center' }}>Formatos permitidos: JPG, PNG, WEBP. Max 5MB por archivo.</p>
            </motion.div>

            {/* TECHNICAL SPECS (CRITERIOS TÉCNICOS) */}
            <motion.div 
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.1 }}
             className="glass" 
             style={{ padding: '24px', borderRadius: '24px', backgroundColor: '#F0F7FF' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={20} color="var(--primary)" />
                      <h3 style={{ fontSize: '12px', fontWeight: '800', color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '1px' }}>Criterios Técnicos</h3>
                    </div>
                    <button 
                      type="button" 
                      onClick={addCriterion}
                      style={{ border: 'none', background: 'none', color: '#1E40AF', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '700' }}
                    >
                      <PlusCircle size={16} /> Agregar
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {criteria.map((item, index) => (
                      <div key={index} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                         <input 
                           type="text" 
                           placeholder="Criterio (ej. Lado)" 
                           value={item.key} 
                           onChange={(e) => handleCriteriaChange(index, 'key', e.target.value)}
                           style={{ ...inputStyle, padding: '10px', backgroundColor: 'white' }} 
                         />
                         <input 
                           type="text" 
                           placeholder="Valor" 
                           value={item.value} 
                           onChange={(e) => handleCriteriaChange(index, 'value', e.target.value)}
                           style={{ ...inputStyle, padding: '10px', backgroundColor: 'white' }} 
                         />
                         <button 
                           type="button" 
                           onClick={() => removeCriterion(index)}
                           style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#EF4444' }}
                         >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    ))}
                </div>
            </motion.div>
         </div>

         {/* RIGHT COLUMN: General Info */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="glass" 
             style={{ padding: '40px', borderRadius: '24px', backgroundColor: 'white' }}
            >
                <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '1px' }}>Información General del Producto</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div>
                        <label style={sectionLabelStyle}>Nombre Comercial del Producto *</label>
                        <input 
                          type="text" 
                          placeholder="Nombre comercial del producto..." 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          style={{ ...inputStyle, fontSize: '16px', color: 'black' }} 
                          required
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Marca de Vehículo *</label>
                          <div style={{ position: 'relative' }}>
                              <select 
                                value={vehicleBrandId} 
                                onChange={(e) => handleVehicleBrandChange(e.target.value)}
                                style={selectStyle}
                                required
                              >
                                  <option value="">Seleccionar marca...</option>
                                  {vehicleBrands.map(b => <option key={b.id} value={b.id.toString()}>{b.name}</option>)}
                              </select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Modelo de Vehículo *</label>
                          <div style={{ position: 'relative' }}>
                              <select 
                                value={vehicleModelId} 
                                onChange={(e) => setVehicleModelId(e.target.value)}
                                style={selectStyle}
                                disabled={!vehicleBrandId}
                                required
                              >
                                  <option value="">{vehicleBrandId ? 'Seleccionar modelo...' : 'Seleccione una marca'}</option>
                                  {vehicleModels.map(m => <option key={m.id} value={m.id.toString()}>{m.name}</option>)}
                              </select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                    </div>

                    <div>
                      <label style={sectionLabelStyle}>Años Compatibles *</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        {vehicleYears.length === 0 ? (
                          <span style={{ fontSize: '13px', color: '#94A3B8' }}>Cargando años...</span>
                        ) : vehicleYears.map(y => {
                          const isSelected = selectedYears.includes(y.id.toString());
                          return (
                            <button
                              type="button"
                              key={y.id}
                              onClick={() => toggleYear(y.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: isSelected ? '#DBEAFE' : 'white',
                                color: isSelected ? '#1E40AF' : '#64748B',
                                border: isSelected ? '1px solid #3B82F6' : '1px solid #E2E8F0'
                              }}
                            >
                              {y.year}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label style={sectionLabelStyle}>Cilindraje *</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                        {vehicleDisplacements.length === 0 ? (
                          <span style={{ fontSize: '13px', color: '#94A3B8' }}>Cargando cilindrajes...</span>
                        ) : vehicleDisplacements.map(d => {
                          const isSelected = selectedDisplacements.includes(d.id.toString());
                          return (
                            <button
                              type="button"
                              key={d.id}
                              onClick={() => toggleDisplacement(d.id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: '700',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: isSelected ? '#DBEAFE' : 'white',
                                color: isSelected ? '#1E40AF' : '#64748B',
                                border: isSelected ? '1px solid #3B82F6' : '1px solid #E2E8F0'
                              }}
                            >
                              {d.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Categoría *</label>
                          <div style={{ position: 'relative' }}>
                              <select 
                                value={categoryId} 
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                style={selectStyle}
                                required
                              >
                                  <option value="">Seleccionar categoría...</option>
                                  {categories.map(c => <option key={c.id} value={c.id.toString()}>{c.name}</option>)}
                              </select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Subcategoría</label>
                          <div style={{ position: 'relative' }}>
                              <select 
                                value={subcategoryId} 
                                onChange={(e) => setSubcategoryId(e.target.value)}
                                style={selectStyle}
                                disabled={!categoryId}
                              >
                                  <option value="">{categoryId ? 'Seleccionar subcategoría...' : 'Seleccione una categoría'}</option>
                                  {subcategories.map(s => <option key={s.id} value={s.id.toString()}>{s.name}</option>)}
                              </select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Marca del Producto / Fabricante *</label>
                          <div style={{ position: 'relative' }}>
                              <select 
                                value={productBrandId} 
                                onChange={(e) => setProductBrandId(e.target.value)}
                                style={selectStyle}
                                required
                              >
                                  <option value="">Seleccionar fabricante...</option>
                                  {productBrands.map(pb => <option key={pb.id} value={pb.id.toString()}>{pb.name}</option>)}
                              </select>
                              <ChevronDown size={18} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.4, color: 'black' }} />
                          </div>
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Código SKU / Parte *</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <Box size={18} style={{ position: 'absolute', left: '14px', opacity: 0.2, color: 'black' }} />
                              <input 
                                type="text" 
                                placeholder="Código SKU o número de parte..."
                                value={sku} 
                                onChange={(e) => setSku(e.target.value)}
                                style={{ ...inputStyle, paddingLeft: '44px' }} 
                                required
                              />
                          </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Posición</label>
                          <input 
                            type="text" 
                            placeholder="ej. DELANTERO" 
                            value={position} 
                            onChange={(e) => setPosition(e.target.value)}
                            style={inputStyle} 
                          />
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Lado</label>
                          <input 
                            type="text" 
                            placeholder="ej. DERECHO" 
                            value={side} 
                            onChange={(e) => setSide(e.target.value)}
                            style={inputStyle} 
                          />
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Transmisión</label>
                          <input 
                            type="text" 
                            placeholder="ej. MANUAL" 
                            value={transmission} 
                            onChange={(e) => setTransmission(e.target.value)}
                            style={inputStyle} 
                          />
                      </div>
                    </div>

                    {/* PRICING & STOCK BOX */}
                    <div style={{ backgroundColor: '#F8FAFC', padding: '24px', borderRadius: '16px', border: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                      <div>
                          <label style={sectionLabelStyle}>Precio Unitario *</label>
                          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                              <span style={{ position: 'absolute', left: '14px', fontSize: '18px', fontWeight: '800', color: '#94A3B8' }}>$</span>
                              <input 
                                type="number" 
                                placeholder="0.00"
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)}
                                style={{ ...inputStyle, paddingLeft: '30px', backgroundColor: 'white' }} 
                                required
                              />
                          </div>
                      </div>
                      <div>
                          <label style={sectionLabelStyle}>Stock Inicial *</label>
                          <input 
                            type="number" 
                            placeholder="0"
                            value={stock} 
                            onChange={(e) => setStock(e.target.value)}
                            style={{ ...inputStyle, backgroundColor: 'white' }} 
                            required
                          />
                      </div>
                    </div>

                    <div>
                      <label style={sectionLabelStyle}>Impuestos Aplicables</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {taxes.map(t => {
                          const isSelected = selectedTaxes.includes(t.id.toString());
                          return (
                            <button
                              type="button"
                              key={t.id}
                              onClick={() => toggleTax(t.id)}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '800',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                backgroundColor: isSelected ? '#FEF2F2' : '#F8FAFC',
                                color: isSelected ? '#E31B23' : '#64748B',
                                border: isSelected ? '1.5px solid #E31B23' : '1px solid #E2E8F0'
                              }}
                            >
                              ✓ {t.name} ({parseFloat(t.rate).toFixed(2)}%)
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input 
                          type="checkbox" 
                          id="is_featured" 
                          checked={isFeatured} 
                          onChange={(e) => setIsFeatured(e.target.checked)} 
                          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                        <label htmlFor="is_featured" style={{ fontSize: '13px', fontWeight: '700', color: '#1E293B', cursor: 'pointer' }}>
                          Destacar producto en la tienda principal
                        </label>
                    </div>

                    <div>
                        <label style={sectionLabelStyle}>Descripción Detallada</label>
                        <textarea 
                          rows="4" 
                          placeholder="Describa las características principales del producto y recomendaciones de uso..." 
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          style={{ ...inputStyle, resize: 'none' }} 
                        />
                    </div>
                </div>
            </motion.div>
         </div>
      </div>
    </form>
  );
};

const EditProductPage = () => {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #E2E8F0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <EditProductForm />
    </Suspense>
  );
};

export default EditProductPage;

