// const pool = require('./config/database'); // Ya no se usa para códigos
const nodemailer = require('nodemailer');

class EmailService {
  // Almacenamiento en memoria (Map)
  // Clave: email, Valor: { codigo, tipo, expiraEn }
  static codigosMemoria = new Map();

  // Configurar Gmail
  static crearTransporter() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  // Generar código
  static generarCodigo() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Guardar código (En memoria)
  static async guardarCodigo(email, codigo, tipo) {
    try {
      const expiraEn = Date.now() + 15 * 60 * 1000; // 15 minutos

      this.codigosMemoria.set(email, {
        codigo,
        tipo,
        expiraEn
      });

      console.log('Código guardado en memoria para:', email);
      return true;
    } catch (error) {
      console.log('Error guardando código:', error);
      return false;
    }
  }

  // Verificar código (En memoria)
  static async verificarCodigo(email, codigo, tipo) {
    try {
      const datos = this.codigosMemoria.get(email);

      // 1. Verificar si existe
      if (!datos) {
        return { valido: false, mensaje: 'Código no encontrado o expirado' };
      }

      // 2. Verificar tipo y código
      if (datos.codigo !== codigo || datos.tipo !== tipo) {
        return { valido: false, mensaje: 'Código incorrecto' };
      }

      // 3. Verificar expiración
      if (Date.now() > datos.expiraEn) {
        this.codigosMemoria.delete(email);
        return { valido: false, mensaje: 'El código ha expirado' };
      }

      // 4. Código válido -> Borrar de memoria para que no se use dos veces
      this.codigosMemoria.delete(email);

      return { valido: true };
    } catch (error) {
      console.log('Error verificando código:', error);
      return { valido: false, mensaje: 'Error del servidor' };
    }
  }

  // Enviar código de recuperación
  static async enviarCodigoRecuperacion(email, codigo) {
    try {
      const transporter = this.crearTransporter();

      const info = await transporter.sendMail({
        from: `"ElegantCut Barbería" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Recupera tu contraseña - ElegantCut',
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

      console.log('Email de recuperación enviado a:', email);
      return true;

    } catch (error) {
      console.log('Error enviando email:', error);
      return false;
    }
  }
}

module.exports = EmailService;