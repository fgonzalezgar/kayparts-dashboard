'use client';

import React, { useState } from 'react';
import { 
  BarChart3,
  ShoppingCart,
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
  RefreshCw,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import logo from '@/assets/kayparts.png';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  // Define if the products submenu is open based on current path
  const subMenuPaths = [
    '/productos',
    '/marcas',
    '/marcas-productos',
    '/modelos',
    '/anos',
    '/cilindrajes',
    '/categorias',
    '/subcategorias',
    '/impuestos'
  ];
  
  const [isProductsOpen, setIsProductsOpen] = useState(
    subMenuPaths.some(p => pathname.startsWith(p))
  );

  const menuItems = [
    { icon: <BarChart3 size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ShoppingCart size={20} />, label: 'Pedidos', path: '/pedidos' },
    { 
      icon: <Package size={20} />, 
      label: 'Productos', 
      path: '/productos',
      hasSubmenu: true,
      subItems: [
        { icon: <LayoutList size={16} />, label: 'Inventario', path: '/productos' },
        { icon: <Car size={16} />, label: 'Marcas Vehículos', path: '/marcas' },
        { icon: <Package size={16} />, label: 'Marcas Productos', path: '/marcas-productos' },
        { icon: <LayoutList size={16} />, label: 'Modelos', path: '/modelos' },
        { icon: <Calendar size={16} />, label: 'Años', path: '/anos' },
        { icon: <GitBranch size={16} />, label: 'Cilindrajes', path: '/cilindrajes' },
        { icon: <Layers size={16} />, label: 'Categorías', path: '/categorias' },
        { icon: <GitBranch size={16} />, label: 'Subcategorías', path: '/subcategorias' },
        { icon: <Percent size={16} />, label: '% Impuestos', path: '/impuestos' },
        { icon: <PlusCircle size={16} />, label: 'Nuevo Producto', path: '/productos/nuevo' },
      ]
    },
  ];

  const shippingItem = { icon: <Truck size={20} />, label: 'Envíos', path: '/envios' };
  const carrierItem = { icon: <Truck size={20} />, label: 'Transportadoras', path: '/transportadoras' };

  const bottomItems = [
    { icon: <Settings size={20} />, label: 'Ajustes', path: '/ajustes' },
    { icon: <LogOut size={20} />, label: 'Cerrar Sesión', path: '/login' },
  ];

  const handleItemClick = (item) => {
    if (item.hasSubmenu) {
      setIsProductsOpen(!isProductsOpen);
    } else {
      router.push(item.path);
    }
  };

  const checkIsActive = (itemPath, isSubItem = false) => {
    if (itemPath === '/productos' && isSubItem) {
      // Inventory is active on /productos exactly or when editing (but not /productos/nuevo which is Nuevo Producto)
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
      <div style={{ padding: '0 24px', marginBottom: '32px', marginTop: '10px' }}>
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
          const isActive = !item.hasSubmenu && checkIsActive(item.path);
          return (
            <div key={item.label} style={{ marginBottom: '4px' }}>
              <div 
                onClick={() => handleItemClick(item)}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 16px',
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
                {item.hasSubmenu && (
                  isProductsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                )}
              </div>

              {/* Sub-menu items */}
              {item.hasSubmenu && isProductsOpen && (
                <div style={{ marginTop: '4px', paddingLeft: '12px' }}>
                  {item.subItems.map((subItem) => {
                    const isSubActive = checkIsActive(subItem.path, true);
                    return (
                      <div
                        key={subItem.label}
                        onClick={() => router.push(subItem.path)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 16px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '10px',
                          fontWeight: isSubActive ? '700' : '600',
                          color: isSubActive ? 'var(--primary)' : 'var(--text-muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          transition: 'all 0.2s ease',
                          backgroundColor: isSubActive ? '#FEF2F2' : 'transparent',
                        }}
                      >
                        {subItem.icon}
                        {subItem.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Separator */}
        <div style={{ margin: '16px 16px', borderTop: '1px solid #E2E8F0' }} />

        {/* Envíos */}
        <div style={{ marginBottom: '4px' }}>
          <div 
            onClick={() => router.push(shippingItem.path)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
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

        {/* Transportadoras */}
        <div style={{ marginBottom: '4px' }}>
          <div 
            onClick={() => router.push(carrierItem.path)}
            style={{ 
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              backgroundColor: checkIsActive(carrierItem.path) ? '#FEF2F2' : 'transparent',
              color: checkIsActive(carrierItem.path) ? 'var(--primary)' : 'var(--text-main)',
              fontWeight: checkIsActive(carrierItem.path) ? '700' : '500',
              borderRight: checkIsActive(carrierItem.path) ? '3px solid var(--primary)' : 'none',
              textTransform: 'uppercase',
              fontSize: '11px',
              letterSpacing: '1px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {carrierItem.icon}
              {carrierItem.label}
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
              onClick={() => router.push(item.path)}
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
