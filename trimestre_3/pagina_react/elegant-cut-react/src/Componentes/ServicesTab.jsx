import React, { useState, useEffect } from 'react';

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre_servicio: '',
    precio: '',
    duracion_minutos: '',
    descripcion: '',
    imagen_pro: ''
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/services');
      const data = await response.json();

      if (data.success && data.data) {
        setServices(data.data);
      } else {
        setError('No se pudieron cargar los servicios');
      }
    } catch (err) {
      console.error('Error loading services:', err);
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
        setFormData({ ...formData, imagen_pro: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `http://localhost:3001/admin/services/${editingId}`
        : 'http://localhost:3001/admin/services';

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        loadServices();
        setShowModal(false);
        resetForm();
      } else {
        alert(data.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este servicio?')) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/services/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();

      if (data.success) {
        loadServices();
      } else {
        alert(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error de conexión');
    }
  };

  const handleEdit = (service) => {
    setEditingId(service.id_servicio);
    setFormData({
      nombre_servicio: service.nombre_servicio,
      precio: service.precio,
      duracion_minutos: service.duracion_minutos,
      descripcion: service.descripcion || '',
      imagen_pro: service.imagen_pro || ''
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      nombre_servicio: '',
      precio: '',
      duracion_minutos: '',
      descripcion: '',
      imagen_pro: ''
    });
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-warning m-3">{error}</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Catálogo de Servicios</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          <i className="bi bi-plus-lg me-2"></i>Nuevo Servicio
        </button>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3 text-center">
                    <div className="position-relative d-inline-block">
                      {formData.imagen_pro ? (
                        <img src={formData.imagen_pro} alt="Servicio" className="rounded" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                      ) : (
                        <div className="rounded bg-light d-flex align-items-center justify-content-center border" style={{ width: '100%', height: '150px' }}>
                          <div className="text-center text-muted">
                            <i className="bi bi-image fs-1"></i>
                            <p className="small mb-0">Sin imagen</p>
                          </div>
                        </div>
                      )}
                      <label className="btn btn-sm btn-primary position-absolute bottom-0 end-0 m-2">
                        <i className="bi bi-camera me-1"></i> Cambiar
                        <input type="file" accept="image/*" className="d-none" onChange={handleFileChange} />
                      </label>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Nombre del Servicio *</label>
                    <input type="text" className="form-control" required
                      value={formData.nombre_servicio}
                      onChange={e => setFormData({ ...formData, nombre_servicio: e.target.value })}
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label">Precio *</label>
                      <div className="input-group">
                        <span className="input-group-text">$</span>
                        <input type="number" className="form-control" required
                          value={formData.precio}
                          onChange={e => setFormData({ ...formData, precio: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="form-label">Duración (min) *</label>
                      <input type="number" className="form-control" required
                        value={formData.duracion_minutos}
                        onChange={e => setFormData({ ...formData, duracion_minutos: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" rows="3"
                      value={formData.descripcion}
                      onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                    ></textarea>
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
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th style={{ minWidth: '200px' }}>Servicio</th>
                <th>Precio</th>
                <th>Duración</th>
                <th className="d-none d-md-table-cell">Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map(service => (
                <tr key={service.id_servicio}>
                  <td>
                    <div className="d-flex align-items-center">
                      {service.imagen_pro ? (
                        <img src={service.imagen_pro} alt="" className="rounded me-2" style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                      ) : (
                        <div className="rounded bg-secondary text-white d-flex align-items-center justify-content-center me-2" style={{ width: '50px', height: '50px' }}>
                          <i className="bi bi-scissors"></i>
                        </div>
                      )}
                      <div>
                        <div className="fw-bold">{service.nombre_servicio}</div>
                        <div className="small text-muted d-md-none text-truncate" style={{ maxWidth: '150px' }}>{service.descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td>${parseFloat(service.precio).toLocaleString()}</td>
                  <td>{service.duracion_minutos} min</td>
                  <td className="d-none d-md-table-cell">
                    <div className="text-truncate" style={{ maxWidth: '250px' }}>
                      {service.descripcion}
                    </div>
                  </td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-outline-primary" onClick={() => handleEdit(service)}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => handleDelete(service.id_servicio)}>
                        <i className="bi bi-trash"></i>
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

export default ServicesTab;