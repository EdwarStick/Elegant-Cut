import React from 'react';
import '../styles/pqrs/pqrs.css';

function Pqrs() {
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
          <form id="pqrs-form">

            <div className="form-group">
              <label htmlFor="request-type">Tipo de solicitud <span className="required">*</span></label>
              <select id="request-type" name="request-type" required>
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
                <input type="text" id="user-name" name="user-name" required />
              </div>

              <div className="form-group">
                <label htmlFor="user-id">Identificación <span className="required">*</span></label>
                <input type="text" id="user-id" name="user-id" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="user-email">Email <span className="required">*</span></label>
                <input type="email" id="user-email" name="user-email" required />
                <span className="error-message" id="email-error"></span>
              </div>

              <div className="form-group">
                <label htmlFor="user-phone">Teléfono <span className="required">*</span></label>
                <input type="tel" id="user-phone" name="user-phone" required />
                <span className="error-message" id="phone-error"></span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Asunto <span className="required">*</span></label>
              <input type="text" id="subject" name="subject" maxLength="100" required />
              <div className="char-counter"><span id="subject-counter">0</span>/100</div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción detallada <span className="required">*</span></label>
              <textarea id="description" name="description" rows="6" maxLength="1000" required></textarea>
              <div className="char-counter"><span id="description-counter">0</span>/1000</div>
            </div>

            <div className="form-group">
              <label htmlFor="attachments">Adjuntar archivos</label>
              <input
                type="file"
                id="attachments"
                name="attachments"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <small>Formatos permitidos: PDF, JPG, PNG, DOC, DOCX (Máx. 5MB por archivo)</small>
            </div>

            <div className="form-group">
              <label>Medio de respuesta preferido <span className="required">*</span></label>
              <div className="radio-group">
                <label className="radio-option">
                  <input type="radio" name="response-medium" value="email" defaultChecked />
                  <span className="radio-checkmark"></span>
                  Email
                </label>

                <label className="radio-option">
                  <input type="radio" name="response-medium" value="phone" />
                  <span className="radio-checkmark"></span>
                  Teléfono
                </label>

                <label className="radio-option">
                  <input type="radio" name="response-medium" value="mail" />
                  <span className="radio-checkmark"></span>
                  Correo físico
                </label>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-option">
                <input type="checkbox" id="terms" name="terms" required />
                <span className="checkbox-checkmark"></span>
                Acepto los <a href="#" id="terms-link">términos y condiciones</a> y la <a href="#" id="policy-link">política de tratamiento de datos</a> <span className="required">*</span>
              </label>
            </div>

            <div className="form-actions">
              <button type="reset" className="btn btn-secondary">Limpiar</button>
              <button type="submit" className="btn btn-primary">Enviar PQRS</button>
            </div>

          </form>
        </section>

        {/* Consulta de estado */}
        <section id="track-tab" className="tab-content">
          <h2>Consultar Estado de PQRS</h2>
          <div className="track-form">
            <div className="form-group">
              <label htmlFor="tracking-number">Número de radicado</label>
              <input type="text" id="tracking-number" name="tracking-number" placeholder="Ej: PQRS-2023-001234" />
              <button id="track-btn" className="btn btn-primary">Consultar</button>
            </div>
          </div>

          <div id="tracking-result" className="tracking-result"></div>
        </section>

        {/* Historial */}
        <section id="history-tab" className="tab-content">
          <h2>Historial de PQRS</h2>
          <div className="history-container">
            <p className="info-message">Para ver su historial de PQRS, por favor inicie sesión en el sistema.</p>
            <button id="login-btn" className="btn btn-primary">Iniciar Sesión</button>
          </div>
        </section>

        {/* Información adicional */}
        <section id="info-tab" className="tab-content">
          <h2>Información Adicional</h2>
          <div className="info-content">

            <div className="info-section">
              <h3>Tiempos de Respuesta</h3>
              <ul>
                <li><strong>Peticiones:</strong> 15 días hábiles</li>
                <li><strong>Quejas:</strong> 15 días hábiles</li>
                <li><strong>Reclamos:</strong> 30 días hábiles</li>
                <li><strong>Sugerencias:</strong> 10 días hábiles</li>
              </ul>
            </div>

            <div className="info-section">
              <h3>Canales Alternativos de Contacto</h3>
              <ul>
                <li><strong>Teléfono:</strong> (01) 800-123-4567</li>
                <li><strong>Correo electrónico:</strong> pqrs@empresa.com</li>
                <li><strong>Dirección:</strong> Calle 123 #45-67, Ciudad</li>
                <li><strong>Horario de atención:</strong> Lunes a Viernes 8:00 AM - 6:00 PM</li>
              </ul>
            </div>

            <div className="info-section">
              <h3>Política de Tratamiento de Datos</h3>
              <p>
                Sus datos personales serán tratados de acuerdo con la Ley de Protección de Datos Personales.
                Solo serán utilizados para el procesamiento de su PQRS y no serán compartidos con terceros sin su autorización.
              </p>
            </div>

            <div className="info-section">
              <h3>Términos y Condiciones</h3>
              <p>
                Al enviar una PQRS, usted acepta que la información proporcionada es veraz y autoriza su tratamiento para los fines relacionados con la gestión de su solicitud.
              </p>
            </div>

          </div>
        </section>

        {/* MODALES */}
        <div id="confirmation-modal" className="modal">
          <div className="modal-content">
            <span className="close-modal">&times;</span>
            <h2>PQRS Enviada Exitosamente</h2>
            <div id="confirmation-details"></div>
            <div className="modal-actions">
              <button id="print-receipt" className="btn btn-primary">Imprimir Comprobante</button>
              <button id="new-request" className="btn btn-secondary">Nueva PQRS</button>
            </div>
          </div>
        </div>

        <div id="terms-modal" className="modal">
          <div className="modal-content">
            <span className="close-modal">&times;</span>
            <h2>Términos y Condiciones</h2>
            <div className="modal-body">
              <p>Al utilizar este sistema de PQRS, usted acepta los siguientes términos y condiciones:</p>
              <ol>
                <li>La información proporcionada debe ser veraz y completa.</li>
                <li>Se compromete a utilizar el sistema únicamente para fines legítimos.</li>
                <li>La empresa puede rechazar solicitudes con lenguaje ofensivo.</li>
                <li>Los tiempos de respuesta pueden variar según la complejidad.</li>
                <li>Autoriza el tratamiento de datos personales para la gestión de su PQRS.</li>
              </ol>
            </div>
          </div>
        </div>

        <div id="policy-modal" className="modal">
          <div className="modal-content">
            <span className="close-modal">&times;</span>
            <h2>Política de Tratamiento de Datos</h2>
            <div className="modal-body">
              <p>De acuerdo con la legislación vigente sobre protección de datos personales:</p>
              <ol>
                <li>Sus datos serán incluidos en una base de datos.</li>
                <li>Serán usados para gestionar su PQRS.</li>
                <li>No se compartirán sin autorización, salvo obligación legal.</li>
                <li>Puede ejercer sus derechos contactando al responsable.</li>
                <li>Los datos se conservarán el tiempo necesario por ley.</li>
              </ol>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Pqrs;
