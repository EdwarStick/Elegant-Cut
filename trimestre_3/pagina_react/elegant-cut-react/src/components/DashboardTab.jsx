import React, { useState, useEffect } from 'react';

const DashboardTab = () => {
  const [stats, setStats] = useState({
    totalCitas: 0,
    ingresosHoy: 0,
    clientesNuevos: 0,
    citasPendientes: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/admin/dashboard/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="col-md-3 mb-4">
      <div className="card border-0 shadow-sm h-100">
        <div className="card-body d-flex align-items-center">
          <div className={`rounded-circle p-3 bg-${color} bg-opacity-10 text-${color} me-3`}>
            <i className={`bi ${icon} fs-3`}></i>
          </div>
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="mb-0 fw-bold">{loading ? '...' : value}</h3>
            {trend && <small className="text-success"><i className="bi bi-arrow-up"></i> {trend}</small>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard-container">
      <div className="tab-header">
        <h2>Panel de Control</h2>
        <div className="date-display text-muted">
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="row">
        <StatCard
          title="Citas Hoy"
          value={stats.totalCitas || 0}
          icon="bi-calendar-check"
          color="primary"
        />
        <StatCard
          title="Ingresos Hoy"
          value={`$${(stats.ingresosHoy || 0).toLocaleString()}`}
          icon="bi-cash-stack"
          color="success"
        />
        <StatCard
          title="Clientes Nuevos"
          value={stats.clientesNuevos || 0}
          icon="bi-people"
          color="info"
        />
        <StatCard
          title="Pendientes"
          value={stats.citasPendientes || 0}
          icon="bi-clock-history"
          color="warning"
        />
      </div>

      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Actividad Reciente</h5>
            </div>
            <div className="card-body">
              <p className="text-muted text-center py-5">Gráfico de actividad semanal (Próximamente)</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Servicios Top</h5>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Corte Clásico
                  <span className="badge bg-primary rounded-pill">14</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Barba Express
                  <span className="badge bg-primary rounded-pill">8</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Corte + Barba
                  <span className="badge bg-primary rounded-pill">5</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;