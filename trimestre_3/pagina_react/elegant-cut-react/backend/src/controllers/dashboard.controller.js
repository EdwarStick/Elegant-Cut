const Dashboard = require('../models/Dashboard.model');

class DashboardController {
    // Obtener estadísticas generales
    static async getStats(req, res, next) {
        try {
            const stats = await Dashboard.getStats();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener datos para gráficos
    static async getChartData(req, res, next) {
        try {
            const period = req.query.period || 'week';
            const chartData = await Dashboard.getChartData(period);
            res.json({
                success: true,
                data: chartData
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener actividad reciente
    static async getActivity(req, res, next) {
        try {
            const activity = await Dashboard.getRecentActivity();
            res.json({
                success: true,
                data: activity
            });
        } catch (error) {
            next(error);
        }
    }

    // Obtener próximas citas
    static async getAppointments(req, res, next) {
        try {
            const appointments = await Dashboard.getUpcomingAppointments();
            res.json({
                success: true,
                data: appointments
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DashboardController;
