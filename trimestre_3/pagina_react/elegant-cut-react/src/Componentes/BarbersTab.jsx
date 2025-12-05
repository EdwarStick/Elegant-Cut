import React, { useState, useEffect } from 'react';

const BarbersTab = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    prim_nombre: '',
    seg_nombre: '',
    apellido1: '',
    apellido2: '',
    telefono: '',
    foto: ''
  });

  useEffect(() => {
    loadBarbers();
  }, []);

  const loadBarbers = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/barbers');
      const data = await response.json();

      if (data.success && data.data) {
        setBarbers(data.data);
      } else {
        setError('No se pudieron cargar los barberos');
      }
    } catch (err) {
      console.error('Error loading barbers:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, foto: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:3001/admin/barbers/${editingId}`
        : 'http://localhost:3001/admin/barbers';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        loadBarbers();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving barber:', error);
      alert('Error de conexión');
    }
  };

  const handleToggleStatus = async (barber) => {
    const action = barber.estado === 1 ? 'desactivar' : 'activar';
    if (!window.confirm(`¿Estás seguro de ${action} este barbero?`)) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/barbers/${barber.id_usuario}/toggle`, {
        method: 'PUT'
      });
      const data = await response.json();

      if (data.success) {
        loadBarbers();
      } else {
        alert(data.error || `Error al ${action}`);
      }
    } catch (error) {
      console.error('Error toggling barber status:', error);
      alert('Error de conexión');
    }
  };

  const handleEdit = (barber) => {
    setEditingId(barber.id_usuario);
    setFormData({
      username: barber.username,
      password: '',
      email: barber.email,
      prim_nombre: barber.prim_nombre,
      seg_nombre: barber.seg_nombre || '',
      apellido1: barber.apellido1,
      apellido2: barber.apellido2 || '',
      telefono: barber.telefono || '',
      foto: barber.foto || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      username: '',
      password: '',
      email: '',
      prim_nombre: '',
      seg_nombre: '',
      apellido1: '',
      apellido2: '',
      telefono: '',
      foto: ''
    });
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-warning m-3">{error}</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Barberos</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <i className="bi bi-plus-lg me-2"></i>Nuevo Barbero
        </button>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? 'Editar Barbero' : 'Nuevo Barbero'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-12 text-center mb-3">
                      <div className="position-relative d-inline-block">
                        {formData.foto ? (
                          <img src={formData.foto} alt="Perfil" className="rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        ) : (
                          <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '100px', height: '100px' }}>
                            <i className="bi bi-person fs-1"></i>
                          </div>
                        )}
                        <label className="btn btn-sm btn-primary position-absolute bottom-0 end-0 rounded-circle" style={{ width: '32px', height: '32px', padding: '4px' }}>
                          <i className="bi bi-camera"></i>
                          <input type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Usuario *</label>
                      <input type="text" className="form-control" required
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                        disabled={!!editingId}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Contraseña {editingId && '(Dejar en blanco para mantener)'}</label>
                      <input type="password" className="form-control"
                        required={!editingId}
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Primer Nombre *</label>
                      <input type="text" className="form-control" required
                        value={formData.prim_nombre}
                        onChange={e => setFormData({ ...formData, prim_nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Segundo Nombre</label>
                      <input type="text" className="form-control"
                        value={formData.seg_nombre}
                        onChange={e => setFormData({ ...formData, seg_nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Primer Apellido *</label>
                      <input type="text" className="form-control" required
                        value={formData.apellido1}
                        onChange={e => setFormData({ ...formData, apellido1: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Segundo Apellido</label>
                      <input type="text" className="form-control"
                        value={formData.apellido2}
                        onChange={e => setFormData({ ...formData, apellido2: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input type="email" className="form-control" required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input type="tel" className="form-control"
                        value={formData.telefono}
                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Barbero</th>
                <th>Contacto</th>
                <th>Estadísticas</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map(barber => (
                <tr key={barber.id_usuario}>
                  <td>
                    <div className="d-flex align-items-center">
                      {barber.foto ? (
                        <img src={barber.foto} alt="" className="rounded-circle me-2" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                      ) : (
                        <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '40px', height: '40px' }}>
                          <span className="small">{barber.prim_nombre[0]}</span>
                        </div>
                      )}
                      <div>
                        <div className="fw-bold">{barber.prim_nombre} {barber.apellido1}</div>
                        <div className="small text-muted">ID: #{barber.id_usuario}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div><i className="bi bi-envelope me-1"></i> {barber.email || 'N/A'}</div>
                    <div><i className="bi bi-telephone me-1"></i> {barber.telefono || 'N/A'}</div>
                  </td>
                  <td>
                    <span className="badge bg-light text-dark border me-1">
                      {barber.total_citas || 0} Citas
                    </span>
                    <span className="badge bg-light text-dark border">
                      ${(barber.ingresos_generados || 0).toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${barber.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                      {barber.estado === 1 ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" onClick={() => handleEdit(barber)} title="Editar">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className={`btn btn-outline-${barber.estado === 1 ? 'danger' : 'success'}`}
                        onClick={() => handleToggleStatus(barber)}
                        title={barber.estado === 1 ? 'Desactivar' : 'Activar'}
                      >
                        <i className={`bi bi-${barber.estado === 1 ? 'slash-circle' : 'check-circle'}`}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BarbersTab;