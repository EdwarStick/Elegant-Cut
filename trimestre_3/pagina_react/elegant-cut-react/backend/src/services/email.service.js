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
        // ... (existing code for verification) ... 
        try {
            console.log(`[EMAIL MOCK] Enviando código ${code} a ${email}`);

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
            return true;
        }
    }

    async sendPqrsConfirmation(email, userName, radicado, type) {
        try {
            console.log(`[EMAIL] Enviando confirmación PQRS ${radicado} a ${email}`);

            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.log('⚠️ No hay credenciales de email. Simulación exitosa.');
                return true;
            }

            const subjectType = type.charAt(0).toUpperCase() + type.slice(1);
            const message = type === 'peticion' ? '¡Tu petición fue exitosa!' :
                type === 'queja' ? '¡Tu queja fue exitosa!' :
                    `Tu ${type} ha sido radicada exitosamente.`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Confirmación de PQRS - ${radicado}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
                        <h2 style="color: #BC2041;">Elegant Cut</h2>
                        <h3>${message}</h3>
                        <p>Hola <strong>${userName}</strong>,</p>
                        <p>Hemos recibido tu solicitud correctamente.</p>
                        <p><strong>Número de Radicado:</strong> ${radicado}</p>
                        <p>Puedes consultar el estado de tu solicitud en nuestra plataforma web en la sección "Consultar Estado" usando este número.</p>
                        <br>
                        <p>Gracias por contactarnos.</p>
                    </div>
                `
            };

            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error enviando email confirmación PQRS:', error);
            return true; // No bloquear el flujo si falla el email
        }
    }
}

module.exports = new EmailService();
