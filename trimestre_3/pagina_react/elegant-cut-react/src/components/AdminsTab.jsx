import React, { useState, useEffect } from 'react';

const AdminsTab = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: '', password: '', email: '',
        prim_nombre: '', seg_nombre: '', apellido1: '', apellido2: '', telefono: ''
    });
    const [message, setMessage] = useState({ text: '', type: '' });

    useEffect(() => { loadAdmins(); }, []);

    const loadAdmins = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3001/admin/administrators');
            const data = await response.json();
            if (data.success) setAdmins(data.data);
        } catch (error) { showMessage('Error cargando administradores', 'error'); }
        finally { setLoading(false); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/admin/administrators', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (data.success) {
                showMessage('Administrador creado exitosamente', 'success');
                closeModal();
                loadAdmins();
            } else {
                showMessage(data.error, 'error');
            }
        } catch (error) { showMessage('Error al crear administrador', 'error'); }
    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const openModal = () => {
        setFormData({
            username: '', password: '', email: '',
            prim_nombre: '', seg_nombre: '', apellido1: '', apellido2: '', telefono: ''
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="tab-content">
            <div className="tab-header">
                <h2>Gestión de Administradores</h2>
                <button className="btn btn-primary" onClick={openModal}>
                    <i className="bi bi-person-plus me-2"></i> Nuevo Admin
                </button>
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
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map(admin => (
                            <tr key={admin.id_usuario}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <div className="avatar-sm bg-danger text-white rounded-circle me-2 d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
                                            {admin.prim_nombre.charAt(0)}
                                        </div>
                                        {admin.prim_nombre} {admin.apellido1}
                                    </div>
                                </td>
                                <td>{admin.username}</td>
                                <td>{admin.email}</td>
                                <td>{admin.telefono}</td>
                                <td>
                                    <span className={`badge ${admin.estado === 1 ? 'bg-success' : 'bg-secondary'}`}>
                                        {admin.estado === 1 ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Nuevo Administrador</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Usuario</label>
                                            <input type="text" className="form-control" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Contraseña</label>
                                            <input type="password" className="form-control" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Primer Nombre</label>
                                            <input type="text" className="form-control" value={formData.prim_nombre} onChange={e => setFormData({ ...formData, prim_nombre: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Segundo Nombre</label>
                                            <input type="text" className="form-control" value={formData.seg_nombre} onChange={e => setFormData({ ...formData, seg_nombre: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Primer Apellido</label>
                                            <input type="text" className="form-control" value={formData.apellido1} onChange={e => setFormData({ ...formData, apellido1: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Segundo Apellido</label>
                                            <input type="text" className="form-control" value={formData.apellido2} onChange={e => setFormData({ ...formData, apellido2: e.target.value })} />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input type="email" className="form-control" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Teléfono</label>
                                            <input type="tel" className="form-control" value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} required />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">Crear Administrador</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminsTab;
