const Client = require('../Modelos/Client');
const Barber = require('../Modelos/Barber');
const Appointment = require('../Modelos/Appointment');
const Dashboard = require('../Modelos/Dashboard');
const Service = require('../Modelos/Service');
const User = require('../Modelos/User');

async function handleAdminRoutes(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const path = url.pathname;
    const method = req.method;

    console.log(` Admin Route: ${method} ${path}`);

    try {
        // ==========================================
        // DASHBOARD
        // ==========================================
        if (path === '/admin/dashboard/stats' && method === 'GET') {
            const stats = await Dashboard.getStats();
            return sendResponse(res, 200, { success: true, data: stats });
        }

        if (path === '/admin/dashboard/chart-data' && method === 'GET') {
            const period = url.searchParams.get('period') || 'week';
            const chartData = await Dashboard.getChartData(period);
            return sendResponse(res, 200, { success: true, data: chartData });
        }

        if (path === '/admin/dashboard/activity' && method === 'GET') {
            const activity = await Dashboard.getRecentActivity();
            return sendResponse(res, 200, { success: true, data: activity });
        }

        if (path === '/admin/dashboard/appointments' && method === 'GET') {
            const appointments = await Dashboard.getUpcomingAppointments();
            return sendResponse(res, 200, { success: true, data: appointments });
        }

        if (path === '/admin/dashboard/reports' && method === 'GET') {
            const stats = await Dashboard.getMonthlyStats();
            return sendResponse(res, 200, { success: true, data: stats });
        }

        // ==========================================
        // CLIENTES
        // ==========================================
        if (path === '/admin/clients' && method === 'GET') {
            const search = url.searchParams.get('search') || '';
            const page = parseInt(url.searchParams.get('page')) || 1;
            const clients = await Client.getAll(search, page);
            return sendResponse(res, 200, { success: true, data: clients });
        }

        if (path.match(/^\/admin\/clients\/\d+$/)) {
            const id = path.split('/')[3];

            if (method === 'GET') {
                const client = await Client.getById(id);
                if (!client) return sendResponse(res, 404, { success: false, error: 'Cliente no encontrado' });
                return sendResponse(res, 200, { success: true, data: client });
            }

            if (method === 'PUT') {
                const body = await getBody(req);
                const updated = await Client.update(id, JSON.parse(body));
                if (!updated) return sendResponse(res, 404, { success: false, error: 'Cliente no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Cliente actualizado' });
            }

            if (method === 'DELETE') {
                const deactivated = await Client.deactivate(id);
                if (!deactivated) return sendResponse(res, 404, { success: false, error: 'Cliente no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Cliente desactivado' });
            }
        }

        // ==========================================
        // BARBEROS
        // ==========================================
        if (path === '/admin/barbers') {
            if (method === 'GET') {
                const barbers = await Barber.getAll();
                return sendResponse(res, 200, { success: true, data: barbers });
            }
            if (method === 'POST') {
                const body = await getBody(req);
                const id = await Barber.create(JSON.parse(body));
                return sendResponse(res, 201, { success: true, message: 'Barbero creado', id });
            }
        }

        if (path.match(/^\/admin\/barbers\/\d+$/)) {
            const id = path.split('/')[3];

            if (method === 'PUT') {
                const body = await getBody(req);
                const updated = await Barber.update(id, JSON.parse(body));
                if (!updated) return sendResponse(res, 404, { success: false, error: 'Barbero no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Barbero actualizado' });
            }

            if (method === 'DELETE') {
                const deactivated = await User.deactivate(id);
                if (!deactivated) return sendResponse(res, 404, { success: false, error: 'Barbero no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Barbero desactivado' });
            }
        }

        if (path.match(/^\/admin\/barbers\/\d+\/toggle$/) && method === 'PUT') {
            const id = path.split('/')[3];
            const result = await Barber.toggleStatus(id);
            if (!result) return sendResponse(res, 404, { success: false, error: 'Barbero no encontrado' });
            return sendResponse(res, 200, { success: true, message: 'Estado actualizado', newStatus: result.newStatus });
        }

        if (path.match(/^\/admin\/barbers\/\d+\/stats$/) && method === 'GET') {
            const id = path.split('/')[3];
            const stats = await Barber.getStats(id);
            return sendResponse(res, 200, { success: true, data: stats });
        }

        // ==========================================
        // ADMINISTRADORES
        // ==========================================
        if (path === '/admin/administrators') {
            if (method === 'GET') {
                // Rol 1 = Administrador
                const admins = await User.findAllByRole(1);
                return sendResponse(res, 200, { success: true, data: admins });
            }
            if (method === 'POST') {
                const body = await getBody(req);
                const userData = JSON.parse(body);
                // Asegurar que se crea como admin
                const id = await User.create({ ...userData, roleName: 'administrador' });
                return sendResponse(res, 201, { success: true, message: 'Administrador creado', id });
            }
        }

        if (path.match(/^\/admin\/administrators\/\d+$/)) {
            const id = path.split('/')[3];

            if (method === 'PUT') {
                const body = await getBody(req);
                const userData = JSON.parse(body);

                const updated = await User.update(id, userData);

                if (userData.password) {
                    await User.updatePasswordById(id, userData.password);
                }

                if (!updated && !userData.password) return sendResponse(res, 404, { success: false, error: 'Administrador no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Administrador actualizado' });
            }

            if (method === 'DELETE') {
                const deactivated = await User.deactivate(id);
                if (!deactivated) return sendResponse(res, 404, { success: false, error: 'Administrador no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Administrador eliminado' });
            }
        }

        if (path.match(/^\/admin\/administrators\/\d+\/toggle$/) && method === 'PUT') {
            const id = path.split('/')[3];
            const result = await User.toggleStatus(id);
            if (!result) return sendResponse(res, 404, { success: false, error: 'Usuario no encontrado' });
            return sendResponse(res, 200, { success: true, message: 'Estado actualizado', newStatus: result.newStatus });
        }

        // ==========================================
        // CITAS (APPOINTMENTS)
        // ==========================================
        if (path === '/admin/appointments') {
            if (method === 'GET') {
                const appointments = await Appointment.getAll();
                return sendResponse(res, 200, { success: true, data: appointments });
            }
        }

        if (path.match(/^\/admin\/appointments\/\d+$/) && method === 'PUT') {
            const id = path.split('/')[3];
            const body = await getBody(req);
            const { nuevoEstado } = JSON.parse(body);

            const updated = await Appointment.updateStatus(id, nuevoEstado);
            if (!updated) return sendResponse(res, 404, { success: false, error: 'Cita no encontrada' });
            return sendResponse(res, 200, { success: true, message: 'Estado actualizado' });
        }

        // ==========================================
        // SERVICIOS
        // ==========================================
        if (path === '/admin/services') {
            if (method === 'GET') {
                const services = await Service.getAll();
                return sendResponse(res, 200, { success: true, data: services });
            }
            if (method === 'POST') {
                const body = await getBody(req);
                const id = await Service.create(JSON.parse(body));
                return sendResponse(res, 201, { success: true, message: 'Servicio creado', id });
            }
        }

        if (path.match(/^\/admin\/services\/\d+$/)) {
            const id = path.split('/')[3];

            if (method === 'PUT') {
                const body = await getBody(req);
                const updated = await Service.update(id, JSON.parse(body));
                if (!updated) return sendResponse(res, 404, { success: false, error: 'Servicio no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Servicio actualizado' });
            }

            if (method === 'DELETE') {
                const deleted = await Service.delete(id);
                if (!deleted) return sendResponse(res, 404, { success: false, error: 'Servicio no encontrado' });
                return sendResponse(res, 200, { success: true, message: 'Servicio eliminado' });
            }
        }

        // Si no coincide ninguna ruta
        return false; // Indica que no se manejó la ruta aquí

    } catch (error) {
        console.error('💥 Admin Route Error:', error);
        return sendResponse(res, 500, { success: false, error: error.message || 'Error interno del servidor' });
    }
}

// Helpers
function sendResponse(res, statusCode, data) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
    return true; // Indica que la respuesta fue enviada
}

function getBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => resolve(body));
        req.on('error', reject);
    });
}

module.exports = handleAdminRoutes;
