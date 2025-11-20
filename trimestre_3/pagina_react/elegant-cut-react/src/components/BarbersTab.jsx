const BarbersTab = () => {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Gestión de Barberos</h2>
        <button className="btn btn-primary">
          <i className="bi bi-person-plus"></i> Agregar Barbero
        </button>
      </div>
      {/* Lista de barberos vendrá aquí */}
    </div>
  );
};

export default BarbersTab;