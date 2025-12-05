import React, { useState, useEffect } from 'react';

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const url = filter === 'all'
        ? 'http://localhost:3001/admin/appointments'
        : `http://localhost:3001/admin/appointments?status=${filter}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.data) {
        setAppointments(data.data);
      } else {
        setError('No se pudieron cargar las citas');
      }
    } catch (err) {
      console.error('Error loading appointments:', err);
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      1: { class: 'bg-warning', text: 'Pendiente' },
      2: { class: 'bg-success', text: 'Completada' },
      3: { class: 'bg-danger', text: 'Cancelada' }
    };
    return badges[status] || { class: 'bg-secondary', text: 'Desconocido' };
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
        <h2>Gestión de Citas</h2>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button
            className={`btn btn-sm ${filter === '1' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setFilter('1')}
          >
            Pendientes
          </button>
          <button
            className={`btn btn-sm ${filter === '2' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFilter('2')}
          >
            Completadas
          </button>
          <button
            className={`btn btn-sm ${filter === '3' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilter('3')}
          >
            Canceladas
          </button>
        </div>
      </div>

      {appointments.length === 0 ? (
        <div className="alert alert-info">
          <i className="bi bi-info-circle me-2"></i>
          No hay citas {filter !== 'all' ? 'con este estado' : 'registradas'}
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Cliente</th>
                  <th>Barbero</th>
                  <th>Fecha y Hora</th>
                  <th>Servicios</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map(apt => (
                  <tr key={apt.id_reserva}>
                    <td>{apt.cliente_nombre || 'N/A'}</td>
                    <td>{apt.barbero_nombre || 'N/A'}</td>
                    <td>
                      <div>{new Date(apt.fecha).toLocaleDateString('es-CO')}</div>
                      <div className="small text-muted">{apt.hora_inicio}</div>
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {apt.servicios || 'Sin servicios'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(apt.id_estado_cita).class}`}>
                        {getStatusBadge(apt.id_estado_cita).text}
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

export default AppointmentsTab;