'use client';

import React from 'react';
import { 
  Package, 
  Truck, 
  Settings, 
  LogOut, 
  Car,
  LayoutList,
  PlusCircle,
  Layers,
  GitBranch,
  Calendar,
  Percent,
  RefreshCw
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/kayparts.png';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Menú plano superior
  const menuItems = [
    { icon: <LayoutList size={20} />, label: 'Inventario', path: '/productos' },
    { icon: <Car size={20} />, label: 'Marcas Vehículos', path: '/marcas' },
    { icon: <Package size={20} />, label: 'Marcas Productos', path: '/marcas-productos' },
    { icon: <LayoutList size={20} />, label: 'Modelos', path: '/modelos' },
    { icon: <Calendar size={20} />, label: 'Años', path: '/anos' },
    { icon: <GitBranch size={20} />, label: 'Cilindrajes', path: '/cilindrajes' },
    { icon: <Layers size={20} />, label: 'Categorías', path: '/categorias' },
    { icon: <GitBranch size={20} />, label: 'Subcategorías', path: '/subcategorias' },
    { icon: <Percent size={20} />, label: '% Impuestos', path: '/impuestos' },
    { icon: <PlusCircle size={20} />, label: 'Nuevo Producto', path: '/productos/nuevo' },
  ];

  // Elemento intermedio antes del botón de sincronización
  const shippingItem = { icon: <Truck size={20} />, label: 'Envíos', path: '/envios' };

  // Menú inferior
  const bottomItems = [
    { icon: <Settings size={20} />, label: 'Ajustes', path: '/ajustes' },
    { icon: <LogOut size={20} />, label: 'Cerrar Sesión', path: '/login' },
  ];

  const handleItemClick = (item) => {
    router.push(item.path);
  };

  const checkIsActive = (itemPath) => {
    if (itemPath === '/productos') {
      // Activo para inventario e imágenes de edición (pero no creación)
      return pathname === '/productos' || (pathname.startsWith('/productos/editar') && !pathname.startsWith('/productos/nuevo'));
    }
    return pathname === itemPath;
  };

  return (
    <div style={{ 
      width: 'var(--sidebar-width)', 
      height: '100vh', 
      backgroundColor: 'white', 
      borderRight: '1px solid #E2E8F0',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 10
    }}>
      {/* Logo */}
      <div style={{ padding: '0 24px', marginBottom: '24px', marginTop: '10px' }}>
        <Image 
          src={logo} 
          alt="Kayparts Logo" 
          width={180}
          height={45}
          style={{ 
            height: '45px', 
            width: 'auto', 
            objectFit: 'contain' 
          }} 
        />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = checkIsActive(item.path);
          return (
            <div key={item.label} style={{ marginBottom: '4px' }}>
              <div 
                onClick={() => handleItemClick(item)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? '#FEF2F2' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  fontWeight: isActive ? '700' : '500',
                  borderRight: isActive ? '3px solid var(--primary)' : 'none',
                  textTransform: 'uppercase',
                  fontSize: '11px',
                  letterSpacing: '1px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {item.icon}
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}

        {/* Separador */}
        <div style={{ margin: '16px 16px', borderTop: '1px solid #E2E8F0' }} />

        {/* Envíos */}
        <div style={{ marginBottom: '4px' }}>
          <div 
            onClick={() => handleItemClick(shippingItem)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: checkIsActive(shippingItem.path) ? '#FEF2F2' : 'transparent',
              color: checkIsActive(shippingItem.path) ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: checkIsActive(shippingItem.path) ? '700' : '500',
              borderRight: checkIsActive(shippingItem.path) ? '3px solid var(--primary)' : 'none',
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '1px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {shippingItem.icon}
              {shippingItem.label}
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Actions */}
      <div style={{ padding: '0 12px', marginTop: 'auto' }}>
        {/* Sync Inventory Button */}
        <div style={{ padding: '12px 12px 24px 12px', borderTop: '1px solid #F1F5F9' }}>
           <button style={{ 
              width: '100%', 
              backgroundColor: '#E31B23', 
              color: 'white', 
              border: 'none', 
              padding: '14px', 
              borderRadius: '12px', 
              fontWeight: '800', 
              fontSize: '13px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '10px', 
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(227, 27, 35, 0.2)',
              textTransform: 'uppercase',
              letterSpacing: '1px'
           }}>
              <RefreshCw size={18} /> Sync Inventory
           </button>
        </div>

        {bottomItems.map((item) => {
          const isActive = checkIsActive(item.path);
          return (
            <div 
              key={item.label}
              onClick={() => handleItemClick(item)}
              style={{ 
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '4px',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? '#FEF2F2' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: isActive ? '700' : '600',
                textTransform: 'uppercase',
                fontSize: '11px',
                letterSpacing: '1px'
              }}
            >
              {item.icon}
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
