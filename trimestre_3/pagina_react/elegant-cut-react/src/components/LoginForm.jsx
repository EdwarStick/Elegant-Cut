import React, { useState } from 'react';
import { AuthClient } from '../utils/authClient';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginData, setLoginData] = useState({ usuario: '', contrasena: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    usuario: '', 
    contrasena: '',
    prim_nombre: '',
    seg_nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: ''
  });
  const [forgotPasswordData, setForgotPasswordData] = useState({ 
    usuario: '', 
    nuevaContrasena: '', 
    confirmarContrasena: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  // Función para cambiar a registro
  const switchToRegister = () => {
    setIsFlipped(true);
    setShowForgotPassword(false);
    setMessage({ text: '', type: '' });
  };

  // Función para cambiar a login
  const switchToLogin = () => {
    setIsFlipped(false);
    setShowForgotPassword(false);
    setMessage({ text: '', type: '' });
  };

  // Función para mostrar olvidé contraseña
  const showForgotPasswordForm = () => {
    setShowForgotPassword(true);
    setMessage({ text: '', type: '' });
  };

  // Mostrar mensajes
  const mostrarMensaje = (text, type) => {
    setMessage({ text, type });
  };

  // Manejar login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    mostrarMensaje('Procesando login...', 'info');

    try {
      const result = await AuthClient.login(loginData.usuario, loginData.contrasena);
      
      if (result.success) {
        mostrarMensaje('¡Login exitoso! Redirigiendo...', 'success');
        
        // Redirigir según el rol
        setTimeout(() => {
          if (result.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 1000);
      } else {
        mostrarMensaje('Error: ' + result.error, 'error');
      }
    } catch (error) {
      mostrarMensaje('Error de conexión: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Manejar registro - ACTUALIZADO
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    mostrarMensaje('Procesando registro...', 'info');

    // Validar campos obligatorios
    if (!registerData.prim_nombre || !registerData.apellido1) {
      mostrarMensaje('Por favor ingresa al menos el primer nombre y primer apellido', 'error');
      setLoading(false);
      return;
    }

    try {
      const result = await AuthClient.register({
        username: registerData.usuario,
        password: registerData.contrasena,
        email: registerData.email,
        prim_nombre: registerData.prim_nombre,
        seg_nombre: registerData.seg_nombre || '',
        apellido1: registerData.apellido1,
        apellido2: registerData.apellido2 || '',
        telefono: registerData.telefono || '',
        role: 'cliente'
      });
      
      if (result.success) {
        mostrarMensaje('¡Registro exitoso!', 'success');
        
        setTimeout(() => {
          switchToLogin();
        }, 1500);
      } else {
        mostrarMensaje('Error: ' + result.error, 'error');
      }
    } catch (error) {
      mostrarMensaje('Error de conexión: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Manejar olvidé contraseña - ACTUALIZADO
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    mostrarMensaje('Actualizando contraseña...', 'info');

    // Validaciones
    if (!forgotPasswordData.usuario) {
      mostrarMensaje('Por favor ingresa tu nombre de usuario', 'error');
      setLoading(false);
      return;
    }

    if (!forgotPasswordData.nuevaContrasena) {
      mostrarMensaje('Por favor ingresa la nueva contraseña', 'error');
      setLoading(false);
      return;
    }

    if (forgotPasswordData.nuevaContrasena !== forgotPasswordData.confirmarContrasena) {
      mostrarMensaje('Las contraseñas no coinciden', 'error');
      setLoading(false);
      return;
    }

    if (forgotPasswordData.nuevaContrasena.length < 6) {
      mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'error');
      setLoading(false);
      return;
    }

    try {
      const result = await AuthClient.forgotPassword(
        forgotPasswordData.usuario,
        forgotPasswordData.nuevaContrasena
      );
      
      if (result.success) {
        mostrarMensaje('¡Contraseña actualizada exitosamente!', 'success');
        
        // Limpiar formulario y volver al login
        setTimeout(() => {
          setForgotPasswordData({ usuario: '', nuevaContrasena: '', confirmarContrasena: '' });
          setShowForgotPassword(false);
        }, 2000);
      } else {
        mostrarMensaje('Error: ' + result.error, 'error');
      }
    } catch (error) {
      mostrarMensaje('Error de conexión: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Estilos para mensajes
  const messageStyles = {
    error: { background: '#ffebee', color: '#c62828', border: '1px solid #f44336' },
    success: { background: '#e8f5e8', color: '#2e7d32', border: '1px solid #4caf50' },
    info: { background: '#e3f2fd', color: '#1565c0', border: '1px solid #2196f3' }
  };

  return (
    <div className="login-form-container">
      <div className="book-container">
        <div className={`book ${isFlipped ? 'flipped' : ''}`}>
          
          {/* Página 1: Iniciar Sesión */}
          <div className={`page ${!isFlipped && !showForgotPassword ? 'active' : ''}`} id="login-page">
            <div className="form-box">
              <h2 className="form-title">Iniciar Sesión</h2>
              
              {/* Mensaje */}
              {message.text && (
                <div 
                  className="mensaje-login" 
                  style={{
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    ...messageStyles[message.type]
                  }}
                >
                  {message.text}
                </div>
              )}
              
              <form className="login-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="usuario" 
                    placeholder="Ingrese su nombre de usuario" 
                    required
                    className="form-input"
                    value={loginData.usuario}
                    onChange={(e) => setLoginData({...loginData, usuario: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="password" 
                    name="contrasena" 
                    placeholder="Ingrese su contraseña" 
                    required
                    className="form-input"
                    value={loginData.contrasena}
                    onChange={(e) => setLoginData({...loginData, contrasena: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Procesando...' : 'Ingresar'}
                </button>
                
                <div className="forgot-password">
                  <button 
                    type="button" 
                    className="forgot-link"
                    onClick={showForgotPasswordForm}
                    disabled={loading}
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                
                <div className="switch-form">
                  <p>¿No tienes cuenta? 
                    <button type="button" className="switch-link" onClick={switchToRegister}>
                      Regístrate aquí
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Página 2: Registro - ACTUALIZADO con más campos */}
          <div className={`page ${isFlipped ? 'active' : ''}`} id="register-page">
            <div className="form-box">
              <h2 className="form-title">Crear Cuenta</h2>
              
              {/* Mensaje */}
              {message.text && (
                <div 
                  className="mensaje-login" 
                  style={{
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    ...messageStyles[message.type]
                  }}
                >
                  {message.text}
                </div>
              )}
              
              <form className="register-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="Ingrese su correo electrónico" 
                    required
                    className="form-input"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <input 
                    type="text" 
                    name="usuario" 
                    placeholder="Nombre de usuario" 
                    required
                    className="form-input"
                    value={registerData.usuario}
                    onChange={(e) => setRegisterData({...registerData, usuario: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    name="prim_nombre" 
                    placeholder="Primer nombre *" 
                    required
                    className="form-input"
                    value={registerData.prim_nombre}
                    onChange={(e) => setRegisterData({...registerData, prim_nombre: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    name="seg_nombre" 
                    placeholder="Segundo nombre" 
                    className="form-input"
                    value={registerData.seg_nombre}
                    onChange={(e) => setRegisterData({...registerData, seg_nombre: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    name="apellido1" 
                    placeholder="Primer apellido *" 
                    required
                    className="form-input"
                    value={registerData.apellido1}
                    onChange={(e) => setRegisterData({...registerData, apellido1: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    name="apellido2" 
                    placeholder="Segundo apellido" 
                    className="form-input"
                    value={registerData.apellido2}
                    onChange={(e) => setRegisterData({...registerData, apellido2: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="text" 
                    name="telefono" 
                    placeholder="Teléfono" 
                    className="form-input"
                    value={registerData.telefono}
                    onChange={(e) => setRegisterData({...registerData, telefono: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="password" 
                    name="contrasena" 
                    placeholder="Contraseña" 
                    required
                    className="form-input"
                    value={registerData.contrasena}
                    onChange={(e) => setRegisterData({...registerData, contrasena: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Procesando...' : 'Registrar'}
                </button>
                
                <div className="switch-form">
                  <p>¿Ya tienes cuenta? 
                    <button type="button" className="switch-link" onClick={switchToLogin}>
                      Inicia sesión aquí
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Página 3: Olvidé Contraseña */}
          <div className={`page ${showForgotPassword ? 'active' : ''}`} id="forgot-password-page">
            <div className="form-box">
              <h2 className="form-title">Recuperar Contraseña</h2>
              
              {/* Mensaje */}
              {message.text && (
                <div 
                  className="mensaje-login" 
                  style={{
                    padding: '10px',
                    margin: '10px 0',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    ...messageStyles[message.type]
                  }}
                >
                  {message.text}
                </div>
              )}
              
              <form className="forgot-password-form" onSubmit={handleForgotPassword}>
                <div className="form-group">
                  <input 
                    type="text" 
                    name="usuario" 
                    placeholder="Ingrese su nombre de usuario" 
                    required
                    className="form-input"
                    value={forgotPasswordData.usuario}
                    onChange={(e) => setForgotPasswordData({...forgotPasswordData, usuario: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="password" 
                    name="nuevaContrasena" 
                    placeholder="Nueva contraseña" 
                    required
                    className="form-input"
                    value={forgotPasswordData.nuevaContrasena}
                    onChange={(e) => setForgotPasswordData({...forgotPasswordData, nuevaContrasena: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <input 
                    type="password" 
                    name="confirmarContrasena" 
                    placeholder="Confirmar nueva contraseña" 
                    required
                    className="form-input"
                    value={forgotPasswordData.confirmarContrasena}
                    onChange={(e) => setForgotPasswordData({...forgotPasswordData, confirmarContrasena: e.target.value})}
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
                
                <div className="switch-form">
                  <p>
                    <button type="button" className="switch-link" onClick={switchToLogin}>
                      Volver al login
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;