import React, { useState, useEffect } from 'react';

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/appointments');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.data);
      } else {
        setError('Error al cargar citas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`¿Estás seguro de cambiar el estado a ${newStatus}?`)) return;

    try {
      const response = await fetch(`http://localhost:3001/admin/appointments/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nuevoEstado: newStatus }),
      });

      const data = await response.json();
      if (data.success) {
        fetchAppointments(); // Recargar lista
      } else {
        alert('Error al actualizar estado');
      }
    } catch (err) {
      alert('Error de conexión');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pendiente': return 'badge bg-warning text-dark';
      case 'Confirmada': return 'badge bg-primary';
      case 'Completada': return 'badge bg-success';
      case 'Cancelada': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  };

  if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  return (
    <div className="tab-content">
      <div className="tab-header d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Citas</h2>
        <button className="btn btn-primary" onClick={fetchAppointments}>
          <i className="bi bi-arrow-clockwise"></i> Actualizar
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Barbero</th>
              <th>Servicio</th>
              <th>Fecha/Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id_reservas}>
                <td>#{appt.id_reservas}</td>
                <td>
                  <div className="fw-bold">{appt.cliente_nombre}</div>
                  <small className="text-muted">{appt.cliente_telefono}</small>
                </td>
                <td>{appt.barbero_nombre}</td>
                <td>{appt.servicio_nombre}</td>
                <td>
                  <div>{new Date(appt.fecha).toLocaleDateString()}</div>
                  <small className="text-muted">{appt.hora_inicio}</small>
                </td>
                <td>
                  <span className={getStatusBadge(appt.estado)}>
                    {appt.estado}
                  </span>
                </td>
                <td>
                  <div className="btn-group btn-group-sm">
                    {appt.estado === 'Pendiente' && (
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleStatusUpdate(appt.id_reservas, 2)} // 2 = Confirmada (asumiendo ID)
                        title="Confirmar"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                    )}
                    {appt.estado !== 'Completada' && appt.estado !== 'Cancelada' && (
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleStatusUpdate(appt.id_reservas, 3)} // 3 = Completada
                        title="Completar"
                      >
                        <i className="bi bi-check-all"></i>
                      </button>
                    )}
                    {appt.estado !== 'Cancelada' && (
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleStatusUpdate(appt.id_reservas, 4)} // 4 = Cancelada
                        title="Cancelar"
                      >
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">
                  No hay citas registradas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentsTab;