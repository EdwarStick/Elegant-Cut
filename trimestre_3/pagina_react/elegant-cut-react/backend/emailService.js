const pool = require('./config/database');
const nodemailer = require('nodemailer');

class EmailService {
  // Configurar Gmail - CORREGIDO
  static crearTransporter() {
    return nodemailer.createTransport({ // ← createTransport sin "r"
      service: 'gmail',
      auth: {
        user: 'jn147860@gmail.com', // Tu Gmail
        pass: 'tjgd gzri mlkn npew' // Contraseña de aplicación
      }
    });
  }

  // Generar código
  static generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Guardar código
  static async guardarCodigo(email, codigo, tipo) {
    try {
      const expiraEn = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      await pool.execute(
        'INSERT INTO codigos_verificacion (email, codigo, tipo, expira_en) VALUES (?, ?, ?, ?)',
        [email, codigo, tipo, expiraEn]
      );
      return true;
    } catch (error) {
      console.log('Error guardando código:', error);
      return false;
    }
  }

  // Verificar código
  static async verificarCodigo(email, codigo, tipo) {
    try {
      const [rows] = await pool.execute(
        `SELECT * FROM codigos_verificacion 
         WHERE email = ? AND codigo = ? AND tipo = ? AND usado = FALSE AND expira_en > NOW()`,
        [email, codigo, tipo]
      );

      if (rows.length === 0) {
        return { valido: false, mensaje: 'Código inválido o expirado' };
      }

      await pool.execute(
        'UPDATE codigos_verificacion SET usado = TRUE WHERE id = ?',
        [rows[0].id]
      );

      return { valido: true };
    } catch (error) {
      return { valido: false, mensaje: 'Error del servidor' };
    }
  }

  // Enviar código de recuperación
  static async enviarCodigoRecuperacion(email, codigo) {
    try {
      const transporter = this.crearTransporter();
      
      const info = await transporter.sendMail({
        from: '"ElegantCut Barbería" <jn147860@gmail.com>', // Tu Gmail
        to: email,
        subject: '🔑 Recupera tu contraseña - ElegantCut',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; text-align: center;">Recuperación de Contraseña</h2>
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; text-align: center;">
              <h3 style="color: #856404;">Tu código de verificación es:</h3>
              <div style="font-size: 32px; font-weight: bold; color: #856404; letter-spacing: 5px; margin: 20px 0;">
                ${codigo}
              </div>
              <p style="color: #856404;">Usa este código para restablecer tu contraseña</p>
              <p style="color: #856404; font-size: 14px;">⏰ Expira en 15 minutos</p>
            </div>
            <p style="color: #888; font-size: 12px; text-align: center; margin-top: 20px;">
              Si no solicitaste recuperar tu contraseña, ignora este mensaje.
            </p>
          </div>
        `
      });

      console.log('✅ Email de recuperación enviado a:', email);
      return true;

    } catch (error) {
      console.log('❌ Error enviando email:', error);
      return false;
    }
  }
}

module.exports = EmailService;