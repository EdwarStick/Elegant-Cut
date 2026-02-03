import React, { useState, useEffect } from 'react';

const BarbersTab = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      console.error('Error:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (!window.confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} este barbero?`)) return;
    try {
      const response = await fetch(`http://localhost:3001/admin/barbers/${id}/toggle`, { method: 'PUT' });
      const data = await response.json();
      if (data.success) {
        setBarbers(barbers.map(b =>
          b.id_usuario === id ? { ...b, estado: data.newStatus } : b
        ));
      } else {
        alert('Error al cambiar estado');
      }
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  if (error) return <div className="alert alert-warning m-3">{error}</div>;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Barberos</h2>
        <button className="btn btn-primary">
          <i className="bi bi-person-plus me-2"></i> Nuevo Barbero
        </button>
      </div>
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Barbero</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map(barber => (
                <tr key={barber.id_usuario}>
                  <td>
                    <div className="fw-bold">{barber.prim_nombre} {barber.apellido1}</div>
                    <div className="small text-muted">{barber.email}</div>
                  </td>
                  <td>{barber.telefono || 'N/A'}</td>
                  <td>
                    <span className={`badge ${barber.estado ? 'bg-success' : 'bg-danger'}`}>
                      {barber.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${barber.estado ? 'btn-outline-danger' : 'btn-outline-success'}`}
                      onClick={() => handleToggleStatus(barber.id_usuario, barber.estado)}
                      title={barber.estado ? "Desactivar" : "Activar"}
                    >
                      <i className={`bi ${barber.estado ? 'bi-person-slash' : 'bi-person-check'}`}></i>
                    </button>
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