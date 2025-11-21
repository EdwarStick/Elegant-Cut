import React, { useState, useEffect } from 'react';

const DashboardTab = () => {
  const [stats, setStats] = useState({
    totalClientes: 0,
    citasHoy: 0,
    ingresosHoy: 0,
    ratingPromedio: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar estadísticas
      const statsResponse = await fetch('http://localhost:3001/admin/dashboard/stats');
      const statsData = await statsResponse.json();
      if (statsData.success) setStats(statsData.data);

      // Cargar actividad reciente
      const activityResponse = await fetch('http://localhost:3001/admin/dashboard/activity');
      const activityData = await activityResponse.json();
      if (activityData.success) setRecentActivity(activityData.data);

      // Cargar próximas citas
      const appointmentsResponse = await fetch('http://localhost:3001/admin/dashboard/appointments');
      const appointmentsData = await appointmentsResponse.json();
      if (appointmentsData.success) setUpcomingAppointments(appointmentsData.data);

    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
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

  const formatTime = (minutesAgo) => {
    if (minutesAgo < 60) return `Hace ${minutesAgo} min`;
    if (minutesAgo < 1440) return `Hace ${Math.floor(minutesAgo / 60)} h`;
    return `Hace ${Math.floor(minutesAgo / 1440)} d`;
  };

  const formatHora = (horaInicio) => {
    // Convertir minutos a formato HH:MM
    const horas = Math.floor(horaInicio / 60);
    const minutos = horaInicio % 60;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="tab-content active">
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content active">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3498db, #2980b9)' }}>
            <i className="bi bi-people"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.totalClientes}</h3>
            <p>Clientes Registrados</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #2ecc71, #27ae60)' }}>
            <i className="bi bi-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.citasHoy}</h3>
            <p>Citas Hoy</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
            <i className="bi bi-currency-dollar"></i>
          </div>
          <div className="stat-info">
            <h3>{formatCurrency(stats.ingresosHoy)}</h3>
            <p>Ingresos del Día</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
            <i className="bi bi-star"></i>
          </div>
          <div className="stat-info">
            <h3>{stats.ratingPromedio}</h3>
            <p>Rating Promedio</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Actividad Reciente */}
        <div className="recent-activity">
          <div className="section-header">
            <h3>Actividad Reciente</h3>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={loadDashboardData}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
          
          <div className="activity-list">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className="activity-icon">
                    <i className={`bi bi-${activity.tipo === 'cita' ? 'calendar-plus' : 'person-plus'}`}></i>
                  </div>
                  <div className="activity-content">
                    <p>
                      <strong>{activity.cliente}</strong> - {activity.servicio}
                    </p>
                    <span className="activity-time">
                      {formatTime(activity.minutos_hace)}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <i className="bi bi-inbox"></i>
                <p>No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>

        {/* Próximas Citas */}
        <div className="upcoming-appointments">
          <div className="section-header">
            <h3>Próximas Citas</h3>
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={loadDashboardData}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
          
          <div className="appointments-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment, index) => (
                <div key={index} className="appointment-item">
                  <div className="appointment-time">
                    {formatHora(appointment.hora_inicio)}
                  </div>
                  <div className="appointment-details">
                    <strong>{appointment.cliente}</strong>
                    <span>{appointment.servicio}</span>
                    <small>{formatCurrency(appointment.precio)}</small>
                  </div>
                  <div className="appointment-date">
                    {new Date(appointment.fecha).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short'
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">
                <i className="bi bi-calendar-x"></i>
                <p>No hay citas programadas</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;