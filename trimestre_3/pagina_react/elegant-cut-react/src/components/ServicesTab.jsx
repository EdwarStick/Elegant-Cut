import React, { useState, useEffect } from 'react';

const ServicesTab = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    duracion: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/admin/services');
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
      } else {
        showMessage('Error cargando servicios', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        nombre: service.nombre,
        precio: service.precio,
        duracion: service.duracion
      });
    } else {
      setEditingService(null);
      setFormData({
        nombre: '',
        precio: '',
        duracion: ''
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      nombre: '',
      precio: '',
      duracion: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nombre || !formData.precio || !formData.duracion) {
      showMessage('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const url = editingService 
        ? `http://localhost:3001/admin/services/${editingService.id_servicio}`
        : 'http://localhost:3001/admin/services';
      
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage(
          editingService ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente',
          'success'
        );
        closeModal();
        loadServices();
      } else {
        showMessage(data.error || 'Error guardando servicio', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/admin/services/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        showMessage('Servicio eliminado exitosamente', 'success');
        loadServices();
      } else {
        showMessage(data.error || 'Error eliminando servicio', 'error');
      }
    } catch (error) {
      console.error('Error:', error);
      showMessage('Error de conexión', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const messageStyles = {
    error: { background: '#ffebee', color: '#c62828', border: '1px solid #f44336' },
    success: { background: '#e8f5e8', color: '#2e7d32', border: '1px solid #4caf50' },
    info: { background: '#e3f2fd', color: '#1565c0', border: '1px solid #2196f3' }
  };

  return (
    <div className="tab-content" id="servicios">
      {/* Header */}
      <div className="tab-header">
        <h2>Gestión de Servicios</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => openModal()}
          disabled={loading}
        >
          <i className="bi bi-plus-circle"></i> Agregar Servicio
        </button>
      </div>

      {/* Mensaje */}
      {message.text && (
        <div 
          className="alert-message" 
          style={{
            padding: '12px',
            margin: '15px 0',
            borderRadius: '6px',
            textAlign: 'center',
            fontWeight: 'bold',
            ...messageStyles[message.type]
          }}
        >
          {message.text}
        </div>
      )}

      {/* Tabla de Servicios */}
      <div className="table-container">
        {loading && services.length === 0 ? (
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p>Cargando servicios...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="no-data">
            <i className="bi bi-scissors"></i>
            <h4>No hay servicios registrados</h4>
            <p>Comienza agregando tu primer servicio</p>
            <button 
              className="btn btn-primary mt-3"
              onClick={() => openModal()}
            >
              <i className="bi bi-plus-circle"></i> Agregar Primer Servicio
            </button>
          </div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Duración</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id_servicio}>
                  <td>#{service.id_servicio}</td>
                  <td>
                    <strong>{service.nombre}</strong>
                  </td>
                  <td>
                    {service.descripcion || (
                      <span className="text-muted">Sin descripción</span>
                    )}
                  </td>
                  <td>
                    <span className="badge bg-secondary">
                      {service.duracion} min
                    </span>
                  </td>
                  <td>
                    <strong>{formatCurrency(service.precio)}</strong>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openModal(service)}
                        disabled={loading}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(service.id_servicio)}
                        disabled={loading}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal para Agregar/Editar Servicio */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {editingService ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={closeModal}
                disabled={loading}
              ></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre del Servicio *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                    disabled={loading}
                    placeholder="Ej: Corte Clásico Caballero"
                  />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Precio ($) *</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={formData.precio}
                        onChange={(e) => setFormData({...formData, precio: e.target.value})}
                        required
                        disabled={loading}
                        min="0"
                        step="100"
                        placeholder="18000"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">Duración (minutos) *</label>
                      <input 
                        type="number" 
                        className="form-control"
                        value={formData.duracion}
                        onChange={(e) => setFormData({...formData, duracion: e.target.value})}
                        required
                        disabled={loading}
                        min="5"
                        step="5"
                        placeholder="30"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Descripción (opcional)</label>
                  <textarea 
                    className="form-control"
                    rows="3"
                    placeholder="Descripción detallada del servicio..."
                    value={formData.descripcion || ''}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    disabled={loading}
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      {editingService ? 'Actualizando...' : 'Creando...'}
                    </>
                  ) : (
                    editingService ? 'Actualizar Servicio' : 'Crear Servicio'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesTab;