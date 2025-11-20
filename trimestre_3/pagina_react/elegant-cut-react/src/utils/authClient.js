// src/utils/authClient.js

export class AuthClient {
  
  //  FUNCIÓN: Registro
  static async register(username, password, name, role = 'client') {
    try {
      console.log('Enviando registro al servidor...');
      
      const response = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, name, role }),
      });

      const data = await response.json();
      
      console.log(' Respuesta del servidor (registro):', data);
      
      if (data.success && data.token) {
        // Guardar token y datos del usuario automáticamente
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        console.log(' Registro exitoso!');
        return { success: true, user: data.user };
      } else {
        console.log(' Error en registro:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.log(' Error de conexión:', error);
      return { success: false, error: 'No se pudo conectar al servidor' };
    }
  }

  // Función para hacer login
  static async login(username, password) {
    try {
      console.log('📞 Enviando login al servidor...');
      
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      console.log('📨 Respuesta del servidor:', data);
      
      if (data.success && data.token) {
        // Guardar token y datos del usuario
        localStorage.setItem('jwt_token', data.token);
        localStorage.setItem('user_data', JSON.stringify(data.user));
        
        console.log('✅ Login exitoso!');
        return { success: true, user: data.user };
      } else {
        console.log('❌ Error en login:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.log('🚨 Error de conexión:', error);
      return { success: false, error: 'No se pudo conectar al servidor' };
    }
  }

  // ✅ FUNCIÓN AÑADIDA: Actualizar contraseña
  static async updatePassword(username, newPassword) {
    try {
      console.log('📞 Actualizando contraseña para:', username);
      
      const response = await fetch('http://localhost:3001/auth/update-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, newPassword }),
      });

      const data = await response.json();
      
      console.log('📨 Respuesta del servidor (update-password):', data);
      
      if (data.success) {
        console.log('✅ Contraseña actualizada!');
        return { success: true, message: data.message };
      } else {
        console.log('❌ Error actualizando contraseña:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.log('🚨 Error de conexión:', error);
      return { success: false, error: 'No se pudo conectar al servidor' };
    }
  }

  // Función para cerrar sesión
  static logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    console.log('👋 Sesión cerrada');
  }

  // Obtener token
  static getToken() {
    return localStorage.getItem('jwt_token');
  }

  // Obtener datos del usuario
  static getUser() {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  // Verificar si está logueado
  static isLoggedIn() {
    return this.getToken() !== null;
  }

  // Verificar si es admin
  static isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  }

  // Verificar si es barbero
  static isBarber() {
    const user = this.getUser();
    return user && user.role === 'barber';
  }

  // Verificar si es cliente
  static isClient() {
    const user = this.getUser();
    return user && user.role === 'client';
  }

  // Verificar si el token es válido
  static isTokenValid() {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  }
}