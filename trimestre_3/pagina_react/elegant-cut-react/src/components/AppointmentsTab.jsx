const AppointmentsTab = () => {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Gestión de Citas</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle"></i> Nueva Cita
        </button>
      </div>
      {/* Tabla de citas vendrá aquí */}
    </div>
  );
};

export default AppointmentsTab;