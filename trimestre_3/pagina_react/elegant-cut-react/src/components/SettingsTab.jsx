import React from 'react';

const SettingsTab = () => {
  return (
    <div className="tab-content">
      <div className="tab-header">
        <h2>Configuración del Sistema</h2>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0"><i className="bi bi-shop me-2 text-primary"></i>Información de la Barbería</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="text-muted small">Nombre del Negocio</label>
                <div className="fw-bold">Elegant Cut Barbershop</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Dirección</label>
                <div>Calle 123 #45-67, Bogotá</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Teléfono</label>
                <div>+57 300 123 4567</div>
              </div>
              <div className="mb-3">
                <label className="text-muted small">Email de Contacto</label>
                <div>info@elegantcut.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0"><i className="bi bi-clock me-2 text-success"></i>Horarios de Atención</h5>
            </div>
            <div className="card-body">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>Lunes - Viernes</td>
                    <td className="text-end fw-bold">8:00 AM - 7:00 PM</td>
                  </tr>
                  <tr>
                    <td>Sábado</td>
                    <td className="text-end fw-bold">9:00 AM - 6:00 PM</td>
                  </tr>
                  <tr>
                    <td>Domingo</td>
                    <td className="text-end text-danger">Cerrado</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0"><i className="bi bi-shield-lock me-2 text-warning"></i>Roles y Permisos</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Rol</th>
                      <th>Nivel de Acceso</th>
                      <th>Usuarios Activos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className="badge bg-danger">Administrador</span></td>
                      <td>Acceso Total (Configuración, Usuarios, Reportes)</td>
                      <td>1</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-primary">Barbero</span></td>
                      <td>Gestión de Citas Propias, Ver Horarios</td>
                      <td>5</td>
                    </tr>
                    <tr>
                      <td><span className="badge bg-success">Cliente</span></td>
                      <td>Agendar Citas, Ver Historial, Perfil</td>
                      <td>120+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;