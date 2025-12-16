import React, { useState, useEffect } from 'react';

const BarbersTab = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    prim_nombre: '', seg_nombre: '', apellido1: '', apellido2: '', telefono: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => { loadBarbers(); }, []);

  const loadBarbers = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/admin/barbers');
      const data = await response.json();
      if (data.success) setBarbers(data.data);
    } catch (error) { showMessage('Error cargando barberos', 'error'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingBarber
      ? `http://localhost:3001/admin/barbers/${editingBarber.id_usuario}`
      : 'http://localhost:3001/admin/barbers';

    const method = editingBarber ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        showMessage(editingBarber ? 'Barbero actualizado' : 'Barbero creado', 'success');
        closeModal();
        loadBarbers();
      } else {
        showMessage(data.error, 'error');
      }
    } catch (error) { showMessage('Error al guardar', 'error'); }
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('¿Desactivar este barbero?')) return;
    try {
      const response = await fetch(`http://localhost:3001/admin/barbers/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        showMessage('Barbero desactivado', 'success');
        loadBarbers();
      }
    } catch (error) { showMessage('Error al desactivar', 'error'); }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const openModal = (barber = null) => {
    setEditingBarber(barber);
    setFormData(barber || {
      username: '', password: '', email: '',
      prim_nombre: '', seg_nombre: '', apellido1: '', apellido2: '', telefono: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBarber(null);
  };

  return (
    <div className="tab-content">
      <div className="tab-header d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Barberos</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <i className="bi bi-person-plus me-2"></i> Nuevo Barbero
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} mb-4`}>
          {message.text}
        </div>
      )}

      <div className="table-responsive">
        <table className="crud-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Contacto</th>
              <th>Citas Atendidas</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map(barber => (
              <tr key={barber.id_usuario}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="avatar-sm bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                      {barber.prim_nombre.charAt(0)}
                    </div>
                    {barber.prim_nombre} {barber.apellido1}
                  </div>
                </td>
                <td>{barber.username}</td>
                <td>
                  <div className="small text-muted">{barber.email}</div>
                  <div className="small">{barber.telefono}</div>
                </td>
                <td><span className="badge bg-info">{barber.total_citas || 0}</span></td>
                <td>
                  <span className={`badge ${barber.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                    {barber.estado === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(barber)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    {barber.estado === 1 && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeactivate(barber.id_usuario)}>
                        <i className="bi bi-person-x"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Usuario</label>
                      <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required disabled={!!editingBarber} />
                    </div>
                    {!editingBarber && (
                      <div className="col-md-6">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                      </div>
                    )}
                    <div className="col-md-6">
                      <label className="form-label">Primer Nombre</label>
                      <input type="text" className="form-control" value={formData.prim_nombre} onChange={e => setFormData({ ...formData, prim_nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Segundo Nombre</label>
                      <input type="text" className="form-control" value={formData.seg_nombre} onChange={e => setFormData({ ...formData, seg_nombre: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Primer Apellido</label>
                      <input type="text" className="form-control" value={formData.apellido1} onChange={e => setFormData({ ...formData, apellido1: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Segundo Apellido</label>
                      <input type="text" className="form-control" value={formData.apellido2} onChange={e => setFormData({ ...formData, apellido2: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input type="tel" className="form-control" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} required />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarbersTab;