import React, { useState, useEffect } from 'react';

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ nombre: '', precio: '', duracion: '' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/admin/services');
      const data = await response.json();
      if (data.success) setServices(data.data);
    } catch (error) {
      showMessage('Error cargando servicios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingService
      ? `http://localhost:3001/admin/services/${editingService.id_servicio}`
      : 'http://localhost:3001/admin/services';

    const method = editingService ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        showMessage(editingService ? 'Servicio actualizado' : 'Servicio creado', 'success');
        closeModal();
        loadServices();
      } else {
        showMessage(data.error, 'error');
      }
    } catch (error) {
      showMessage('Error al guardar', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar este servicio?')) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/services/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        showMessage('Servicio eliminado', 'success');
        loadServices();
      }
    } catch (error) {
      showMessage('Error al eliminar', 'error');
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const openModal = (service = null) => {
    setEditingService(service);
    setFormData(service || { nombre: '', precio: '', duracion: '' });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({ nombre: '', precio: '', duracion: '' });
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Catálogo de Servicios</h2>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <i className="bi bi-plus-lg me-2"></i> Nuevo Servicio
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
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id_servicio}>
                <td>#{service.id_servicio}</td>
                <td>{service.nombre}</td>
                <td>${parseInt(service.precio).toLocaleString()}</td>
                <td>{service.duracion} min</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => openModal(service)}>
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(service.id_servicio)}>
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.nombre}
                      onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.precio}
                      onChange={e => setFormData({ ...formData, precio: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duración (min)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={formData.duracion}
                      onChange={e => setFormData({ ...formData, duracion: e.target.value })}
                      required
                    />
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

export default ServicesTab;