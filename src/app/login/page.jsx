'use client';

import React, { useState, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import logo from '@/assets/kayparts.png';
import {
  Mail, Lock, Eye, EyeOff, ChevronRight,
  Shield, Cloud, Terminal, AlertCircle
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);

  // Redirigir a la página que intentaban acceder, o al dashboard por defecto
  let from = '/dashboard';
  try {
    from = searchParams?.get('from') || '/dashboard';
  } catch (e) {
    console.error('Error reading search params');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login({ email, password });
      router.replace(from);
    } catch (err) {
      let msg = 'Credenciales incorrectas. Intenta de nuevo.';
      
      // Manejar estructura de validaciones de Laravel (ValidationException 422)
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
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>

      {/* ── Left side: Immersive Image ───────────────────────────────────── */}
      <div
        className="login-image-side"
        style={{
          flex: '1.2',
          position: 'relative',
          background: 'url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2070") center/cover no-repeat',
          display: 'none', // Hidden on mobile naturally if we added media queries, but keeping original style
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
        }}
      >
        {/* Style to show only on desktop */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media (min-width: 1024px) {
            .login-image-side { display: flex !important; }
          }
        `}} />
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(227,27,35,0.1) 100%)' }} />

        {/* Live feed overlay */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 10px #10B981' }} />
            <p style={{ color: 'white', fontSize: '12px', fontWeight: '800', letterSpacing: '2px' }}>SYSTEM ONLINE - NODE_TX_004</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {['LOGISTIC_CORE_INITIALIZED', 'INVENTORY_SYNC_ACTIVE', 'ENCRYPTED_AUTH_READY'].map((text, i) => (
              <motion.div
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 0.7 }}
                transition={{ delay: 0.2 + i * 0.1, repeat: Infinity, repeatType: 'reverse', duration: 2 }}
                style={{ color: '#10B981', fontSize: '10px', fontFamily: 'monospace' }}
              >
                {'>'} {text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="title-font" style={{ color: 'white', fontSize: '56px', marginBottom: '8px', lineHeight: '0.9' }}>KAYPARTS</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', letterSpacing: '3px', fontWeight: '300', marginTop: '20px' }}>PRECISION ENGINEERING SOLUTIONS</p>
          <div style={{ width: '80px', height: '4px', background: 'var(--primary)', marginTop: '24px' }} />
        </motion.div>
      </div>

      {/* ── Right side: Login Form ───────────────────────────────────────── */}
      <div
        className="login-form-side"
        style={{
          flex: '1',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          width: '100%'
        }}
      >
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} className="login-card" style={{ width: '100%', maxWidth: '440px' }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Image src={logo} alt="Kayparts Logo" style={{ height: '80px', width: 'auto', objectFit: 'contain', marginBottom: '10px' }} />
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Inicia Sesión</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Ingresa tus credenciales para continuar</p>
            </div>

            {/* Error alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#B91C1C',
                    fontSize: '13px',
                    fontWeight: '600',
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <div className="input-group">
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@kayparts.com"
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 12px 12px 40px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    opacity: loading ? 0.6 : 1,
                    color: 'black'
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div className="input-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--dark)', textTransform: 'uppercase' }}>Contraseña</label>
                <a href="#" style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase', textDecoration: 'none' }}>
                  ¿Olvidaste tu clave?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '12px 40px 12px 40px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    opacity: loading ? 0.6 : 1,
                    color: 'black'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: 'var(--primary)' }}
              />
              <label htmlFor="remember" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Recordar sesión</label>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              className="btn-primary"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              style={{
                width: '100%',
                height: '50px',
                fontSize: '14px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.8 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                    style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }}
                  />
                  Verificando...
                </>
              ) : (
                <>
                  Ingresar al Panel <ChevronRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          {/* Trust badges */}
          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '30px' }}>
            {[
              { icon: <Shield size={20} color="var(--primary)" />, label: 'SECURE ACCESS' },
              { icon: <Cloud size={20} color="var(--dark)" />,    label: 'CLOUD SYNC' },
              { icon: <Terminal size={20} color="var(--dark)" />, label: 'API V2.4' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '8px' }}>{icon}</div>
                <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--dark)' }}>{label}</p>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '1px' }}>
            © 2026 KAYPARTS
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
            <p style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sistemas Operativos - Nodo Central</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const [showFallback, setShowFallback] = React.useState(false);

  React.useEffect(() => {
    // Si después de 8 segundos React no ha renderizado el formulario completo,
    // mostramos un mensaje de ayuda o el fallback.
    const timer = setTimeout(() => setShowFallback(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Componente principal con temporizador de rescate */}
      {!showFallback ? (
        <LoginForm />
      ) : (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
          height: '100vh', padding: '20px', textAlign: 'center', backgroundColor: '#F8FAFC' 
        }}>
          <div style={{ padding: '40px', backgroundColor: 'white', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', border: '1px solid #E2E8F0' }}>
            <AlertCircle size={64} color="#EF4444" style={{ marginBottom: '24px' }} />
            <h2 style={{ fontSize: '28px', fontWeight: '900', color: 'black', marginBottom: '16px' }}>ALERTA DE SISTEMA</h2>
            <p style={{ color: '#64748B', fontSize: '16px', maxWidth: '400px', marginBottom: '32px', lineHeight: '1.6' }}>
              Hostinger está tardando demasiado en responder o hay archivos dañados en tu navegador. 
              <strong> Haz clic abajo para reparar el acceso.</strong>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={() => window.location.href = window.location.pathname + '?reset=true'}
                style={{ 
                  padding: '16px 32px', backgroundColor: '#000', color: 'white', borderRadius: '12px', 
                  fontWeight: '800', border: 'none', cursor: 'pointer', fontSize: '16px',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' 
                }}
              >
                LIMPIEZA MAESTRA Y REINTENTAR
              </button>
              <button 
                onClick={() => window.location.reload()}
                style={{ padding: '12px', color: '#64748B', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                o intentar recargar normalmente
              </button>
            </div>
          </div>
          <p style={{ marginTop: '40px', fontSize: '11px', color: '#94A3B8', fontWeight: '600', letterSpacing: '1px' }}>
            ERRORCODE: PERFORMANCE_LATENCY_DETECTION
          </p>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
