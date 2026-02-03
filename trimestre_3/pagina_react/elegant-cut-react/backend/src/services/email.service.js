const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'tu_correo@gmail.com',
                pass: process.env.EMAIL_PASS || 'tu_contraseña_app'
            }
        });
    }

    async sendVerificationCode(email, code) {
        try {
            console.log(`[EMAIL MOCK] Enviando código ${code} a ${email}`);

            // Si no hay credenciales reales, solo loguear (modo desarrollo)
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.log('⚠️ No hay credenciales de email configuradas. El código se muestra arriba.');
                return true;
            }

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Código de Verificación - Elegant Cut',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Verificación de Seguridad</h2>
                        <p>Tu código de verificación es:</p>
                        <h1 style="color: #4CAF50; letter-spacing: 5px;">${code}</h1>
                        <p>Este código expirará en 15 minutos.</p>
                        <p>Si no solicitaste este código, ignora este correo.</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error enviando email:', error);
            // En desarrollo retornamos true aunque falle el email real, para no bloquear
            return true;
        }
    }
}

module.exports = new EmailService();
