import React, { useState, useEffect } from 'react';

const SettingsTab = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [step, setStep] = useState('edit'); // 'edit', 'verify'

  // --- Profile State ---
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    prim_nombre: '',
    apellido1: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [initialData, setInitialData] = useState({});
  const [verificationCode, setVerificationCode] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [user, setUser] = useState(null);

  // --- Reports State ---
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
    if (storedUser.id_usuario) {
      const initial = {
        username: storedUser.username || '',
        email: storedUser.email || '',
        prim_nombre: storedUser.prim_nombre || '',
        apellido1: storedUser.apellido1 || '',
        telefono: storedUser.telefono || ''
      };
      setFormData(prev => ({ ...prev, ...initial }));
      setInitialData(initial);
    }
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoadingStats(true);
    try {
      const response = await fetch('http://localhost:3001/admin/dashboard/reports');
      const data = await response.json();
      if (data.success) setStats(data.data);
    } catch (e) { console.error(e); }
    finally { setLoadingStats(false); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isSensitiveChange = () => {
    return (formData.password && formData.password.length > 0) ||
      (formData.username !== initialData.username);
  };

  const initiateUpdate = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ text: 'Las contraseñas no coinciden', type: 'error' });
      return;
    }

    // Si hay cambios sensibles, pedir código
    if (isSensitiveChange()) {
      if (!formData.email) {
        setMessage({ text: 'Se requiere email para verificación', type: 'error' });
        return;
      }
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/auth/solicitar-recuperacion', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email })
        });
        const data = await response.json();
        if (data.success) {
          setStep('verify');
          setMessage({ text: 'Hemos enviado un código a tu correo: ' + formData.email, type: 'info' });
        } else {
          setMessage({ text: 'Error enviando código: ' + data.error, type: 'error' });
        }
      } catch (err) { setMessage({ text: 'Error de conexión', type: 'error' }); }
      finally { setLoading(false); }
    } else {
      // Actualización normal (sin credenciales)
      completeUpdate();
    }
  };

  const verifyAndSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Verificar Código
      const verifyResponse = await fetch('http://localhost:3001/auth/verify-code', {
        method: 'POST',
        body: JSON.stringify({ email: formData.email, codigo: verificationCode })
      });
      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        // 2. Guardar Cambios
        await completeUpdate();
        setStep('edit');
        setVerificationCode('');
      } else {
        setMessage({ text: verifyData.error || 'Código incorrecto', type: 'error' });
      }
    } catch (err) { setMessage({ text: 'Error verificando código', type: 'error' }); }
    finally { setLoading(false); }
  };

  const completeUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:3001/admin/administrators/${user.id_usuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          prim_nombre: formData.prim_nombre,
          apellido1: formData.apellido1,
          telefono: formData.telefono,
          ...(formData.password ? { password: formData.password } : {})
        })
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ text: 'Perfil actualizado correctamente', type: 'success' });
        const updatedUser = { ...user, ...formData };
        if (formData.password) delete updatedUser.password;
        delete updatedUser.confirmPassword;
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update initial data
        setInitialData({
          username: formData.username,
          email: formData.email,
          prim_nombre: formData.prim_nombre,
          apellido1: formData.apellido1,
          telefono: formData.telefono
        });
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      } else {
        setMessage({ text: data.error || 'Error al actualizar', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Error de conexión', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Configuración y Reportes</h2>

      <div className="btn-group mb-4">
        <button className={`btn ${activeTab === 'profile' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('profile')}>
          <i className="bi bi-person-gear me-2"></i> Mi Perfil
        </button>
        <button className={`btn ${activeTab === 'reports' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setActiveTab('reports')}>
          <i className="bi bi-bar-chart-line me-2"></i> Estadísticas
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            {message.text && (<div className={`alert alert-${message.type.includes('error') ? 'danger' : message.type === 'success' ? 'success' : 'info'} mb-4`}>{message.text}</div>)}

            {step === 'edit' ? (
              <form onSubmit={initiateUpdate}>
                <div className="row g-3">
                  <div className="col-12"><h5 className="text-muted">Información Personal</h5></div>
                  <div className="col-md-6"><label className="form-label">Usuario</label><input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label">Email</label><input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label">Nombre</label><input type="text" className="form-control" name="prim_nombre" value={formData.prim_nombre} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label">Apellido</label><input type="text" className="form-control" name="apellido1" value={formData.apellido1} onChange={handleChange} required /></div>
                  <div className="col-md-6"><label className="form-label">Teléfono</label><input type="tel" className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} /></div>

                  <div className="col-12 mt-4"><h5 className="text-muted">Seguridad</h5></div>
                  <div className="alert alert-warning small"><i className="bi bi-shield-lock me-1"></i> Cambiar usuario o contraseña requiere verificación por email.</div>
                  <div className="col-md-6"><label className="form-label">Nueva Contraseña</label><input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} placeholder="******" /></div>
                  <div className="col-md-6"><label className="form-label">Confirmar Contraseña</label><input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="******" /></div>

                  <div className="col-12 mt-4 text-end"><button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Procesando...' : 'Guardar Cambios'}</button></div>
                </div>
              </form>
            ) : (
              <form onSubmit={verifyAndSave}>
                <div className="text-center py-4">
                  <i className="bi bi-envelope-check display-1 text-primary mb-3"></i>
                  <h4>Verificación Requerida</h4>
                  <p className="text-muted">Hemos enviado un código a <strong>{formData.email}</strong></p>
                  <div className="d-flex justify-content-center my-4">
                    <input
                      type="text"
                      className="form-control form-control-lg text-center"
                      style={{ maxWidth: '200px', letterSpacing: '5px' }}
                      placeholder="000000"
                      maxLength="6"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success px-5" disabled={loading}>{loading ? 'Verificando...' : 'Confirmar y Guardar'}</button>
                  <button type="button" className="btn btn-link mt-3 d-block mx-auto" onClick={() => setStep('edit')}>Cancelar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="card border-0 shadow-sm">
          <div className="card-body p-4">
            <h5 className="mb-4">Reporte de Crecimiento</h5>
            {loadingStats ? <div className="spinner-border text-primary"></div> : stats ? (
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="p-3 border rounded bg-light text-center">
                    <h3 className="text-primary display-6">{stats.newClientsCurrentMonth}</h3>
                    <p className="text-muted mb-0">Clientes Nuevos (Este Mes)</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded bg-light text-center">
                    <h3 className="text-secondary display-6">{stats.newClientsLastMonth}</h3>
                    <p className="text-muted mb-0">Clientes Nuevos (Mes Pasado)</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="p-3 border rounded bg-light text-center">
                    <h3 className="text-success display-6">{stats.totalActiveClients}</h3>
                    <p className="text-muted mb-0">Total Clientes Activos</p>
                  </div>
                </div>
              </div>
            ) : <p>No hay datos disponibles.</p>}
          </div>
        </div>
      )}
    </div>
  );
};
export default SettingsTab;