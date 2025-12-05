
import React, { useState, useEffect, useCallback } from 'react';

const ClientsTab = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const loadClients = useCallback(async () => {
    setLoading(true);
    try {
      const url = searchTerm
        ? `http://localhost:3001/admin/clients?search=${encodeURIComponent(searchTerm)}`
        : 'http://localhost:3001/admin/clients';
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) setClients(data.data);
    } catch (error) { showMessage('Error cargando clientes', 'error'); }
    finally { setLoading(false); }
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => { loadClients(); }, 500);
    return () => clearTimeout(timer);
  }, [loadClients]);

  const handleDeactivate = async (id) => {
    if (!window.confirm('¿Desactivar este cliente?')) return;
    try {
      const response = await fetch(`http://localhost:3001/admin/clients/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (data.success) {
        showMessage('Cliente desactivado', 'success');
        loadClients();
      }
    } catch (error) { showMessage('Error al desactivar', 'error'); }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Directorio de Clientes</h2>
        <div className="search-box">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder="Buscar por nombre, teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
          </div>
        </div>
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
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Historial</th>
              <th>Última Visita</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id_usuario}>
                <td>
                  <div className="fw-bold">{client.prim_nombre} {client.apellido1}</div>
                  <div className="small text-muted">ID: #{client.id_usuario}</div>
                </td>
                <td>
                  <div><i className="bi bi-envelope me-1"></i> {client.email || 'N/A'}</div>
                  <div><i className="bi bi-telephone me-1"></i> {client.telefono}</div>
                </td>
                <td>
                  <span className="badge bg-light text-dark border">
                    {client.total_citas} Citas
                  </span>
                </td>
                <td>
                  {client.ultima_visita ? new Date(client.ultima_visita).toLocaleDateString() : 'Nunca'}
                </td>
                <td>
                  <span className={`badge ${client.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                    {client.estado === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {client.estado === 1 && (
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeactivate(client.id_usuario)} title="Desactivar">
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
    </div>
  );
};

export default ClientsTab;
