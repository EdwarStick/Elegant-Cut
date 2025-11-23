import React, { useState, useEffect } from 'react';

const ClientsTab = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/clients');
      const data = await response.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="tab-content">
      <div className="tab-header mb-4">
        <h2>Gestión de Clientes</h2>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Nombre Completo</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Usuario</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id_usuario}>
                <td>{`${client.prim_nombre} ${client.seg_nombre || ''} ${client.apellido1} ${client.apellido2 || ''}`}</td>
                <td>{client.email}</td>
                <td>{client.telefono}</td>
                <td>{client.username || 'N/A'}</td>
                <td>
                  <span className={`badge ${client.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                    {client.estado === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-muted">
                  No hay clientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientsTab;