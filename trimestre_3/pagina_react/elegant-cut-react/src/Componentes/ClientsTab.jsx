import React, { useState, useEffect } from 'react';

const ClientsTab = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/clients');
      const data = await response.json();

      if (data.success && data.data) {
        setClients(data.data);
      } else {
        setError('No se pudieron cargar los clientes');
      }
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <div className="alert alert-warning">{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Directorio de Clientes</h2>
      </div>

      {clients.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No hay clientes registrados
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Citas</th>
                  <th>Estado</th>
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
                      <div><i className="bi bi-telephone me-1"></i> {client.telefono || 'N/A'}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {client.total_citas || 0} Citas
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${client.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                        {client.estado === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsTab;