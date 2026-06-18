'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Filter, 
  Download, 
  MoreVertical, 
  AlertTriangle, 
  CheckCircle2, 
  Package,
  ArrowUpDown,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '@/services/productService';

const ProductsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (term = '') => {
    try {
      setLoading(true);
      const data = await productService.getProducts(term);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly to avoid excessive API requests
    const delayDebounce = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${name}"?`)) {
      try {
        await productService.deleteProduct(id);
        fetchProducts(searchTerm);
      } catch (error) {
        alert('Error al eliminar el producto: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const getProductStatus = (stock) => {
    if (stock === 0) {
      return { status: 'Agotado', color: '#7F1D1D' };
    } else if (stock <= 5) {
      return { status: 'Crítico', color: '#EF4444' };
    } else if (stock <= 10) {
      return { status: 'Bajo', color: '#F59E0B' };
    } else {
      return { status: 'Optimo', color: '#10B981' };
    }
  };

  return (
    <>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
         <div>
            <h1 className="title-font" style={{ fontSize: '28px' }}>Gestión de Inventario</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Control centralizado de componentes industriales.</p>
         </div>
         
         <div style={{ display: 'flex', gap: '16px' }}>
             <button 
               onClick={() => router.push('/productos/nuevo')}
               className="btn-primary pulse-primary"
             >
                <Plus size={20} /> NUEVO COMPONENTE
             </button>
            <button style={{ 
               backgroundColor: 'white', 
               border: '1px solid #E2E8F0', 
               padding: '12px', 
               borderRadius: '8px', 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center',
               cursor: 'pointer' 
            }}>
               <Download size={20} color="var(--text-muted)" />
            </button>
         </div>
      </header>

      {/* Filters & Search */}
      <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-lg)', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
         <div style={{ position: 'relative', flex: 1 }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nombre o SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '12px 12px 12px 40px', 
                borderRadius: '8px', 
                border: '1px solid #E2E8F0', 
                backgroundColor: '#F8FAFC',
                outline: 'none',
                fontSize: '14px',
                color: 'black'
              }}
            />
         </div>
         
         <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: 'black' }}>
               <Filter size={18} color="var(--text-muted)" /> Categoría
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: 'black' }}>
               <ArrowUpDown size={18} color="var(--text-muted)" /> Ordenar
            </div>
         </div>
      </div>

      {/* Inventory Table */}
      <div className="glass" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
         {loading && products.length === 0 ? (
           <div style={{ padding: '40px', textAlign: 'center', color: 'black', fontWeight: '600' }}>Cargando inventario...</div>
         ) : products.length === 0 ? (
           <div style={{ padding: '40px', textAlign: 'center', color: 'black', fontWeight: '600' }}>No se encontraron productos.</div>
         ) : (
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                 <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Detalle del Producto</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categoría</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stock</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precio Unit.</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Estado</th>
                    <th style={{ padding: '16px 24px', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acciones</th>
                 </tr>
              </thead>
              <tbody style={{ color: 'black' }}>
                 <AnimatePresence>
                    {products.map((item, index) => {
                       const { status, color } = getProductStatus(item.stock);
                       return (
                          <motion.tr 
                           key={item.id}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           exit={{ opacity: 0, x: -20 }}
                           transition={{ delay: index * 0.05 }}
                           className="hover-row"
                           style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: 'white' }}
                          >
                             <td style={{ padding: '20px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                   <div style={{ width: '48px', height: '48px', backgroundColor: '#F1F5F9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                      {item.main_image ? (
                                        <img src={item.main_image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                      ) : (
                                        <Package size={24} color="var(--dark)" />
                                      )}
                                   </div>
                                   <div>
                                      <p style={{ fontSize: '15px', fontWeight: '700' }}>{item.name}</p>
                                      <p style={{ fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1px' }}>{item.sku}</p>
                                   </div>
                                </div>
                             </td>
                             <td style={{ padding: '20px 24px' }}>
                                <span style={{ fontSize: '13px', fontWeight: '600', backgroundColor: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
                                   {item.category?.name || 'Sin categoría'}
                                </span>
                             </td>
                             <td style={{ padding: '20px 24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                   <div style={{ 
                                      width: '40px', 
                                      height: '6px', 
                                      backgroundColor: '#E2E8F0', 
                                      borderRadius: '10px',
                                      overflow: 'hidden'
                                   }}>
                                      <div style={{ 
                                         width: `${Math.min((item.stock / 20) * 100, 100)}%`, 
                                         height: '100%', 
                                         backgroundColor: color 
                                      }}></div>
                                   </div>
                                   <span style={{ fontSize: '14px', fontWeight: '700' }}>{item.stock}</span>
                                </div>
                             </td>
                             <td style={{ padding: '20px 24px', fontSize: '15px', fontWeight: '800' }}>
                                ${parseFloat(item.price).toLocaleString()}
                             </td>
                             <td style={{ padding: '20px 24px' }}>
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px', 
                                    padding: '6px 12px', 
                                    borderRadius: '20px', 
                                    backgroundColor: `${color}15`,
                                    color: color,
                                    width: 'fit-content'
                                 }}>
                                    {status === 'Crítico' || status === 'Agotado' ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />}
                                    <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>{status}</span>
                                 </div>
                             </td>
                             <td style={{ padding: '20px 24px' }}>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                   <button 
                                     onClick={() => router.push(`/productos/editar/?id=${item.id}`)}
                                     style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                                   >
                                      <Edit2 size={16} color="var(--text-muted)" />
                                   </button>
                                   <button 
                                     onClick={() => handleDelete(item.id, item.name)}
                                     style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                                   >
                                      <Trash2 size={16} color="#EF4444" />
                                   </button>
                                   <button style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}>
                                      <MoreVertical size={16} color="var(--text-muted)" />
                                   </button>
                                </div>
                             </td>
                          </motion.tr>
                       );
                    })}
                 </AnimatePresence>
              </tbody>
           </table>
         )}
      </div>
    </>
  );
};

export default ProductsPage;
