import React, { useState, useEffect, useCallback } from 'react';

const AppointmentsTab = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState({ text: '', type: '' });

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/admin/appointments');
      const data = await response.json();
      if (data.success) setAppointments(data.data);
    } catch (error) { showMessage('Error cargando citas', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAppointments(); }, [loadAppointments]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3001/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nuevoEstado: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        showMessage('Estado de cita actualizado', 'success');
        loadAppointments();
      }
    } catch (error) { showMessage('Error al actualizar', 'error'); }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const filteredAppointments = filter === 'all'
    ? appointments
    : appointments.filter(apt => apt.estado === filter);

  const getStatusBadge = (status) => {
    const map = {
      'Pendiente': 'bg-warning text-dark',
      'Confirmada': 'bg-info text-white',
      'Completada': 'bg-success',
      'Cancelada': 'bg-danger'
    };
    return map[status] || 'bg-secondary';
  };

  return (
    <div className="tab-content">
      <div className="tab-header d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Citas</h2>
        <div className="btn-group">
          <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('all')}>Todas</button>
          <button className={`btn ${filter === 'Pendiente' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('Pendiente')}>Pendientes</button>
          <button className={`btn ${filter === 'Completada' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setFilter('Completada')}>Completadas</button>
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
              <th>Fecha/Hora</th>
              <th>Cliente</th>
              <th>Servicio</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(apt => (
              <tr key={apt.id_reservas}>
                <td>
                  <div className="fw-bold">{new Date(apt.fecha).toLocaleDateString()}</div>
                  <div className="text-muted small">
                    {String(apt.hora_inicio).padStart(4, '0').replace(/(\d{2})(\d{2})/, '$1:$2')}
                  </div>
                </td>
                <td>{apt.cliente}</td>
                <td>{apt.servicio}</td>
                <td>${parseInt(apt.precio).toLocaleString()}</td>
                <td>
                  <span className={`badge ${getStatusBadge(apt.estado)}`}>
                    {apt.estado}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    {apt.estado === 'Pendiente' && (
                      <>
                        <button className="btn btn-sm btn-outline-success" onClick={() => handleStatusChange(apt.id_reservas, 2)} title="Completar">
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(apt.id_reservas, 3)} title="Cancelar">
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </>
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

export default AppointmentsTab;