const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { id: 'servicios', icon: 'bi-scissors', label: 'Servicios' },
    { id: 'barberos', icon: 'bi-person-badge', label: 'Barberos' },
    { id: 'citas', icon: 'bi-calendar-check', label: 'Citas' },
    { id: 'clientes', icon: 'bi-people', label: 'Clientes' },
    { id: 'configuracion', icon: 'bi-gear', label: 'Configuración' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2><i className="bi bi-scissors"></i> ElegantCut</h2>
        <p className="text-muted">Panel de Administración</p>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.id}>
            <a 
              href="/" 
              className={activeTab === item.id ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                setActiveTab(item.id);
              }}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;