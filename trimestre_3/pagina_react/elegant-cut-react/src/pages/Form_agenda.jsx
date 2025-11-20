import React, { useState } from 'react';
import { Scissors, Calendar, Clock, User, Phone, Mail, CreditCard, FileText, Star, MapPin, Award } from 'lucide-react';

function Form_agenda() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    barber: '',
    service: '',
    notes: '',
    paymentMethod: 'efectivo'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.date || !formData.time || !formData.barber || !formData.service) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    const appointmentData = {
      cliente: formData.name,
      telefono: formData.phone,
      email: formData.email,
      fecha: formData.date,
      horario: formData.time,
      barbero: formData.barber,
      servicio: formData.service,
      notas: formData.notes,
      metodoPago: formData.paymentMethod,
      estado: 'pendiente',
      fechaCreacion: new Date().toISOString()
    };

    console.log('Datos de la cita:', appointmentData);
    
    alert(`¡Cita agendada exitosamente!\n\n${formData.name}, tu cita está confirmada para el ${formatDate(formData.date)} a las ${formData.time}`);
    
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '',
      barber: '',
      service: '',
      notes: '',
      paymentMethod: 'efectivo'
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const services = [
    { id: 'corte-basico', name: 'Corte Básico', price: 15000, duration: '30 min' },
    { id: 'corte-estilo', name: 'Corte con Estilo', price: 20000, duration: '45 min' },
    { id: 'barba', name: 'Arreglo de Barba', price: 10000, duration: '20 min' },
    { id: 'combo', name: 'Corte + Barba', price: 25000, duration: '60 min' },
    { id: 'cejas', name: 'Diseño de Cejas', price: 8000, duration: '15 min' },
    { id: 'mascarilla', name: 'Mascarilla Facial', price: 18000, duration: '30 min' },
    { id: 'manicure', name: 'Manicure Básico', price: 12000, duration: '25 min' }
  ];

  const barbers = [
    { id: 'carlos', name: 'Carlos Rodríguez', specialty: 'Cortes clásicos', rating: 4.9 },
    { id: 'luis', name: 'Luis García', specialty: 'Diseños modernos', rating: 4.8 },
    { id: 'pedro', name: 'Pedro Martínez', specialty: 'Barba y afeitado', rating: 5.0 },
    { id: 'ana', name: 'Ana López', specialty: 'Estilista premium', rating: 4.9 }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const selectedService = services.find(s => s.id === formData.service);
  const selectedBarber = barbers.find(b => b.id === formData.barber);

  return (
    <div className="form-agenda-container">
      {/* HERO HEADER */}
      <div className="hero-header">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-icon">
            <Scissors size={48} />
          </div>
          <h1 className="hero-title">Elegant Cut</h1>
          <p className="hero-subtitle">Reserva tu cita con los mejores profesionales</p>
          <div className="hero-features">
            <div className="hero-feature">
              <Award size={20} />
              <span>Barberos Certificados</span>
            </div>
            <div className="hero-feature">
              <Star size={20} />
              <span>+1000 Clientes Satisfechos</span>
            </div>
            <div className="hero-feature">
              <MapPin size={20} />
              <span>Bogotá, Colombia</span>
            </div>
          </div>
        </div>
      </div>

      <main className="main-content">
        <div className="form-wrapper">
          {/* INFORMACIÓN DE LA BARBERÍA */}
          <div className="info-sidebar">
            <div className="info-card">
              <h3>¿Por qué elegirnos?</h3>
              <ul className="benefits-list">
                <li>
                  <Star className="benefit-icon" size={18} />
                  <div>
                    <strong>Calidad garantizada</strong>
                    <p>Profesionales con más de 10 años de experiencia</p>
                  </div>
                </li>
                <li>
                  <Scissors className="benefit-icon" size={18} />
                  <div>
                    <strong>Técnicas modernas</strong>
                    <p>Equipos de última generación y productos premium</p>
                  </div>
                </li>
                <li>
                  <Clock className="benefit-icon" size={18} />
                  <div>
                    <strong>Puntualidad</strong>
                    <p>Respetamos tu tiempo, sin esperas innecesarias</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="info-card contact-card">
              <h3>Contáctanos</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={18} />
                  <span>+57 310 123 4567</span>
                </div>
                <div className="contact-item">
                  <Mail size={18} />
                  <span>info@elegantcut.co</span>
                </div>
                <div className="contact-item">
                  <MapPin size={18} />
                  <span>Calle 123 #45-67, Bogotá</span>
                </div>
              </div>
            </div>

            {/* RESUMEN DE RESERVA */}
            {(selectedService || selectedBarber) && (
              <div className="info-card summary-card">
                <h3>Resumen de tu cita</h3>
                {selectedService && (
                  <div className="summary-item">
                    <span className="summary-label">Servicio:</span>
                    <span className="summary-value">{selectedService.name}</span>
                    <span className="summary-price">${selectedService.price.toLocaleString()}</span>
                    <span className="summary-duration">{selectedService.duration}</span>
                  </div>
                )}
                {selectedBarber && (
                  <div className="summary-item">
                    <span className="summary-label">Barbero:</span>
                    <span className="summary-value">{selectedBarber.name}</span>
                    <div className="barber-rating">
                      <Star size={14} fill="gold" stroke="gold" />
                      <span>{selectedBarber.rating}</span>
                    </div>
                  </div>
                )}
                {formData.date && (
                  <div className="summary-item">
                    <span className="summary-label">Fecha:</span>
                    <span className="summary-value">{formatDate(formData.date)}</span>
                  </div>
                )}
                {formData.time && (
                  <div className="summary-item">
                    <span className="summary-label">Hora:</span>
                    <span className="summary-value">{formData.time}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* FORMULARIO PRINCIPAL */}
          <div className="form-main">
            <div className="form-header">
              <h2>Agenda tu cita</h2>
              <p>Completa el formulario y confirma tu reserva</p>
            </div>

            <div className="appointment-form">
              
              {/* INFORMACIÓN PERSONAL */}
              <div className="form-section">
                <div className="section-header">
                  <User className="section-icon" size={24} />
                  <h3>Información Personal</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="name">
                      Nombre Completo <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={18} />
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Juan Pérez"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      Teléfono <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" size={18} />
                      <input 
                        type="tel" 
                        id="phone" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="310 123 4567"
                      />
                    </div>
                  </div>

                  <div className="form-group full-width">
                    <label htmlFor="email">Email (opcional)</label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" size={18} />
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tucorreo@ejemplo.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SERVICIO Y BARBERO */}
              <div className="form-section">
                <div className="section-header">
                  <Scissors className="section-icon" size={24} />
                  <h3>Servicio y Profesional</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="service">
                      Selecciona tu servicio <span className="required">*</span>
                    </label>
                    <select 
                      id="service" 
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                    >
                      <option value="">Elige un servicio</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} - ${service.price.toLocaleString()} ({service.duration})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="barber">
                      Selecciona tu barbero <span className="required">*</span>
                    </label>
                    <select 
                      id="barber" 
                      name="barber"
                      value={formData.barber}
                      onChange={handleInputChange}
                    >
                      <option value="">Elige un barbero</option>
                      {barbers.map(barber => (
                        <option key={barber.id} value={barber.id}>
                          {barber.name} - {barber.specialty} ⭐{barber.rating}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* FECHA Y HORA */}
              <div className="form-section">
                <div className="section-header">
                  <Calendar className="section-icon" size={24} />
                  <h3>Fecha y Horario</h3>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label htmlFor="date">
                      Fecha de la cita <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Calendar className="input-icon" size={18} />
                      <input 
                        type="date" 
                        id="date" 
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="time">
                      Horario disponible <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Clock className="input-icon" size={18} />
                      <select 
                        id="time" 
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                      >
                        <option value="">Selecciona una hora</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* NOTAS ADICIONALES */}
              <div className="form-section">
                <div className="section-header">
                  <FileText className="section-icon" size={24} />
                  <h3>Información Adicional</h3>
                </div>
                <div className="form-group">
                  <label htmlFor="notes">Notas o requerimientos especiales</label>
                  <textarea 
                    id="notes" 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Ej: Alergia a productos específicos, preferencias de estilo, etc."
                    rows="4"
                  />
                </div>
              </div>

              {/* MÉTODO DE PAGO */}
              <div className="form-section">
                <div className="section-header">
                  <CreditCard className="section-icon" size={24} />
                  <h3>Método de Pago</h3>
                </div>
                <div className="payment-options">
                  <label className={`payment-option ${formData.paymentMethod === 'efectivo' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="efectivo" 
                      checked={formData.paymentMethod === 'efectivo'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-content">
                      <CreditCard size={24} />
                      <span>Efectivo</span>
                      <p>Paga en la barbería</p>
                    </div>
                  </label>
                  
                  <label className={`payment-option ${formData.paymentMethod === 'transferencia' ? 'active' : ''}`}>
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="transferencia" 
                      checked={formData.paymentMethod === 'transferencia'}
                      onChange={handleInputChange}
                    />
                    <div className="payment-content">
                      <Phone size={24} />
                      <span>Transferencia</span>
                      <p>Nequi, Bancolombia</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* BOTÓN DE ENVÍO */}
              <button onClick={handleSubmit} className="submit-btn">
                <Calendar size={20} />
                Confirmar mi cita
              </button>

              <p className="form-disclaimer">
                Al confirmar tu cita, aceptas recibir recordatorios por WhatsApp o SMS
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Form_agenda;