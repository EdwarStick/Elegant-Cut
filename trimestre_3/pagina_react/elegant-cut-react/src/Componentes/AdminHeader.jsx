const AdminHeader = () => {
  return (
    <header className="admin-header">
      <div className="header-left">
        <h1>Panel de Administración</h1>
      </div>
      <div className="header-right">
        <div className="user-info">
          <img 
            src="https://ui-avatars.com/api/?name=Admin+User&background=0D8ABC&color=fff" 
            alt="Admin" 
            className="user-avatar"
          />
          <span className="user-name">Administrador</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;