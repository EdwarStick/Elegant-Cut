import React, { useState } from 'react';
import '../Estilos/pqrs/pqrs.css';

export default function Pqrs() {
  const [formData, setFormData] = useState({
    requestType: '',
    userName: '',
    userId: '',
    userEmail: '',
    userPhone: '',
    subject: '',
    description: '',
    responseMedium: 'email'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/pqrs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`PQRS enviada con éxito. Su radicado es: ${result.radicado}`);
        setFormData({
          requestType: '',
          userName: '',
          userId: '',
          userEmail: '',
          userPhone: '',
          subject: '',
          description: '',
          responseMedium: 'email'
        });
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión al enviar la PQRS');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <main>
        <div className="Botones-pqrs">
          <button className="tab-btn active" data-tab="form-tab">Nueva PQRS</button>
          <button className="tab-btn" data-tab="track-tab">Consultar Estado</button>
          <button className="tab-btn" data-tab="history-tab">Historial</button>
          <button className="tab-btn" data-tab="info-tab">Información</button>
        </div>

        {/* Formulario de PQRS */}
        <section id="form-tab" className="tab-content active">
          <h2>Formulario de PQRS</h2>
          <form id="pqrs-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="request-type">Tipo de solicitud <span className="required">*</span></label>
              <select
                id="request-type"
                name="requestType"
                required
                value={formData.requestType}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una opción</option>
                <option value="peticion">Petición</option>
                <option value="queja">Queja</option>
                <option value="reclamo">Reclamo</option>
                <option value="sugerencia">Sugerencia</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="user-name">Nombre completo <span className="required">*</span></label>
                <input
                  type="text"
                  id="user-name"
                  name="userName"
                  required
                  value={formData.userName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-id">Identificación <span className="required">*</span></label>
                <input
                  type="text"
                  id="user-id"
                  name="userId"
                  required
                  value={formData.userId}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="user-email">Email <span className="required">*</span></label>
                <input
                  type="email"
                  id="user-email"
                  name="userEmail"
                  required
                  value={formData.userEmail}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-phone">Teléfono <span className="required">*</span></label>
                <input
                  type="tel"
                  id="user-phone"
                  name="userPhone"
                  required
                  value={formData.userPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto <span className="required">*</span></label>
              <input
                type="text"
                id="subject"
                name="subject"
                maxLength="100"
                required
                value={formData.subject}
                onChange={handleInputChange}
              />
              <div className="char-counter"><span>{formData.subject.length}</span>/100</div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción detallada <span className="required">*</span></label>
              <textarea
                id="description"
                name="description"
                rows="6"
                maxLength="1000"
                required
                value={formData.description}
                onChange={handleInputChange}
              ></textarea>
              <div className="char-counter"><span>{formData.description.length}</span>/1000</div>
            </div>

            <div className="form-group">
              <label>Medio de respuesta preferido <span className="required">*</span></label>
              <div className="radio-group">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="responseMedium"
                    value="email"
                    checked={formData.responseMedium === 'email'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-checkmark"></span>
                  Email
                </label>

                <label className="radio-option">
                  <input
                    type="radio"
                    name="responseMedium"
                    value="phone"
                    checked={formData.responseMedium === 'phone'}
                    onChange={handleInputChange}
                  />
                  <span className="radio-checkmark"></span>
                  Teléfono
                </label>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-option">
                <input type="checkbox" id="terms" name="terms" required />
                <span className="checkbox-checkmark"></span>
                Acepto los{" "}
                <a href="#" id="terms-link">términos y condiciones</a>{" "}
                y la{" "}
                <a href="#" id="policy-link">política de tratamiento de datos</a>{" "}
                <span className="required">*</span>
              </label>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setFormData({
                  requestType: '', userName: '', userId: '', userEmail: '', userPhone: '', subject: '', description: '', responseMedium: 'email'
                })}
              >
                Limpiar
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar PQRS'}
              </button>
            </div>
          </form>
        </section>

       
      </main>
    </div>
  );
}
