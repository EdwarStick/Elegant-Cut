import React, { useState, useEffect } from 'react';

const BarbersTab = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBarber, setEditingBarber] = useState(null);
  const [formData, setFormData] = useState({
    prim_nombre: '',
    seg_nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    telefono: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    fetchBarbers();
  }, []);

  const fetchBarbers = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/barbers');
      const data = await response.json();
      if (data.success) {
        setBarbers(data.data);
      }
    } catch (error) {
      console.error('Error fetching barbers:', error);
    } finally {
      setLoading(false);
    }
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

      const result = await response.json();
      if (result.success) {
        fetchBarbers();
        setShowModal(false);
        resetForm();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error al guardar barbero');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este barbero?')) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/barbers/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        fetchBarbers();
      } else {
        alert('Error al eliminar');
      }
    } catch (error) {
      alert('Error de conexión');
    }
  };

  const openEditModal = (barber) => {
    setEditingBarber(barber);
    setFormData({
      prim_nombre: barber.prim_nombre,
      seg_nombre: barber.seg_nombre || '',
      apellido1: barber.apellido1,
      apellido2: barber.apellido2 || '',
      email: barber.email,
      telefono: barber.telefono,
      username: '', // No editar username
      password: '' // No editar password directamente aquí por seguridad simple
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      prim_nombre: '',
      seg_nombre: '',
      apellido1: '',
      apellido2: '',
      email: '',
      telefono: '',
      username: '',
      password: ''
    });
    setEditingBarber(null);
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="tab-content">
      <div className="tab-header d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Barberos</h2>
        <button
          className="btn btn-primary"
          onClick={() => { resetForm(); setShowModal(true); }}
        >
          <i className="bi bi-person-plus"></i> Agregar Barbero
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map((barber) => (
              <tr key={barber.id_usuario}>
                <td>{`${barber.prim_nombre} ${barber.seg_nombre || ''} ${barber.apellido1} ${barber.apellido2 || ''}`}</td>
                <td>{barber.email}</td>
                <td>{barber.telefono}</td>
                <td>
                  <span className={`badge ${barber.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                    {barber.estado === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => openEditModal(barber)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(barber.id_usuario)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingBarber ? 'Editar Barbero' : 'Nuevo Barbero'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Primer Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.prim_nombre}
                        onChange={e => setFormData({ ...formData, prim_nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Segundo Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.seg_nombre}
                        onChange={e => setFormData({ ...formData, seg_nombre: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Primer Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.apellido1}
                        onChange={e => setFormData({ ...formData, apellido1: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Segundo Apellido</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.apellido2}
                        onChange={e => setFormData({ ...formData, apellido2: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.telefono}
                        onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                      />
                    </div>
                    {!editingBarber && (
                      <>
                        <div className="col-md-6">
                          <label className="form-label">Usuario</label>
                          <input
                            type="text"
                            className="form-control"
                            required
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Contraseña</label>
                          <input
                            type="password"
                            className="form-control"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                          />
                        </div>
                      </>
                    )}
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
    </div>
  );
};

export default BarbersTab;