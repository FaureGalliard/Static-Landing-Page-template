// Gestión de navegación y formulario - StepUp
document.addEventListener("DOMContentLoaded", () => {
  // Navegación hamburguesa
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const navItems = document.querySelectorAll(".nav-links a");

  hamburger?.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navItems.forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });

  // Cerrar menú cuando se hace clic fuera de él
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });

  // Cerrar menú con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    }
  });

  // Verificador de formulario optimizado
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    institution: document.getElementById("institution"),
    interest: document.getElementById("interest"),
    message: document.getElementById("message")
  };

  const validationState = { name: false, email: false, institution: false, interest: false };
  
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    name: /^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s]{2,50}$/,
    institution: /^[a-zA-Z0-9áéíóúüñÁÉÍÓÚÜÑ\s&.-]{2,100}$/
  };

  // Función unificada para manejo de mensajes
  const manageMessage = (fieldId, message = null, isError = true) => {
    const errorId = `${fieldId}-error`;
    const existingError = document.getElementById(errorId);
    
    if (!message) {
      existingError?.remove();
      document.getElementById(fieldId)?.parentNode.classList.remove('has-error');
      return;
    }

    if (existingError) {
      existingError.textContent = message;
      return;
    }

    const errorDiv = document.createElement('div');
    errorDiv.id = errorId;
    errorDiv.className = isError ? 'error-message' : 'success-message';
    errorDiv.textContent = message;
    
    const field = document.getElementById(fieldId);
    field.parentNode.appendChild(errorDiv);
    field.parentNode.classList.add('has-error');
  };

  // Función de validación optimizada
  const validateField = (field, type) => {
    const value = field.value.trim().replace(/\s+/g, ' ');
    const fieldId = field.id;
    let isValid = false;
    let errorMessage = '';

    field.classList.remove('valid', 'invalid');

    const validations = {
      name: () => {
        if (!value) return 'El nombre es obligatorio';
        if (value.length < 2) return 'El nombre debe tener al menos 2 caracteres';
        if (value.length > 50) return 'El nombre no puede exceder 50 caracteres';
        if (!patterns.name.test(value)) return 'El nombre solo puede contener letras y espacios';
        if (value.split(' ').length < 2) return 'Por favor ingresa tu nombre completo';
        return null;
      },
      email: () => {
        if (!value) return 'El correo electrónico es obligatorio';
        if (value.length > 254) return 'El correo electrónico es demasiado largo';
        if (!patterns.email.test(value)) return 'Ingresa un correo electrónico válido';
        if (!value.includes('.') || value.split('@').length !== 2) return 'El correo debe tener formato: usuario@dominio.com';
        if (value.split('@')[1].split('.').length < 2) return 'El dominio debe tener al menos una extensión (.com, .es, etc.)';
        if (value.split('@')[1].split('.').some(part => part.length < 2)) return 'El dominio no es válido';
        if (value.startsWith('.') || value.endsWith('.') || value.includes('..')) return 'El correo contiene puntos en posiciones inválidas';
        return null;
      },
      institution: () => {
        if (!value) return 'La institución educativa es obligatoria';
        if (value.length < 2 || value.length > 100) return 'El nombre de la institución debe tener entre 2 y 100 caracteres';
        if (!patterns.institution.test(value)) return 'Nombre de institución contiene caracteres no válidos';
        return null;
      },
      interest: () => !value ? 'Selecciona un área de interés' : null
    };

    errorMessage = validations[type]?.() || '';
    isValid = !errorMessage;

    // Actualizar estado visual
    field.classList.add(isValid ? 'valid' : 'invalid');
    field.parentNode.classList.toggle('valid', isValid);
    field.parentNode.classList.toggle('invalid', !isValid);
    
    isValid ? manageMessage(fieldId) : manageMessage(fieldId, errorMessage);
    validationState[type] = isValid;

    return isValid;
  };

  // Función debounce
  const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // Event listeners optimizados
  const setupValidation = (field, type, condition = () => true) => {
    field.addEventListener('blur', () => validateField(field, type));
    field.addEventListener('input', debounce(() => {
      if (field.classList.contains('invalid') || condition()) {
        validateField(field, type);
      }
    }, 500));
  };

  setupValidation(fields.name, 'name', () => fields.name.value.length > 10);
  setupValidation(fields.email, 'email', () => fields.email.value.includes('@'));
  setupValidation(fields.institution, 'institution', () => fields.institution.value.length > 10);
  
  fields.interest.addEventListener('change', () => validateField(fields.interest, 'interest'));

  // Formateo automático
  fields.name.addEventListener('input', (e) => {
    e.target.value = e.target.value.split(' ').map(word => 
      word.length > 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
    ).join(' ');
  });

  fields.email.addEventListener('input', (e) => {
    e.target.value = e.target.value.toLowerCase();
  });

  // Función para mostrar mensajes generales
  const showMessage = (message, isSuccess = false) => {
    const messageDiv = document.createElement('div');
    messageDiv.className = isSuccess ? 'success-message' : 'error-message general-error';
    messageDiv.innerHTML = `
      <i class="fas fa-${isSuccess ? 'check-circle' : 'exclamation-triangle'}"></i>
      <div>
        ${isSuccess ? '<strong>¡Formulario enviado correctamente!</strong><br><span>Te contactaremos pronto. Revisa tu correo electrónico.</span>' : `<span>${message}</span>`}
      </div>
    `;
    
    form.insertBefore(messageDiv, form.firstChild);
    
    if (isSuccess) messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => messageDiv.remove(), 300);
    }, isSuccess ? 7000 : 5000);
  };

  // Manejo de envío del formulario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isValid = Object.keys(validationState).every(key => 
      validateField(fields[key], key)
    );

    if (!isValid) {
      form.querySelector('.invalid')?.focus();
      showMessage('Por favor, corrige los errores en el formulario antes de enviar.');
      return;
    }

    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => Math.random() > 0.05 ? resolve() : reject(new Error('Error simulado')), 2000);
      });

      showMessage('', true);
      form.reset();
      
      Object.keys(validationState).forEach(key => {
        validationState[key] = false;
        fields[key].classList.remove('valid', 'invalid');
        fields[key].parentNode.classList.remove('valid', 'invalid', 'has-error');
      });

    } catch (error) {
      showMessage('Error al enviar el formulario. Por favor, inténtalo de nuevo.');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });

  // LocalStorage para guardar progreso
  const saveProgress = () => {
    const data = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value]));
    localStorage.setItem('stepUpFormData', JSON.stringify(data));
  };

  const loadProgress = () => {
    try {
      const data = JSON.parse(localStorage.getItem('stepUpFormData') || '{}');
      Object.entries(data).forEach(([key, value]) => {
        if (fields[key]) fields[key].value = value || '';
      });
    } catch (error) {
      console.warn('Error al cargar datos guardados:', error);
    }
  };

  loadProgress();
  setInterval(saveProgress, 10000);
  form.addEventListener('submit', () => localStorage.removeItem('stepUpFormData'));

  // Prevenir envío accidental con Enter
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !['textarea', 'submit'].includes(e.target.type)) {
      e.preventDefault();
    }
  });
});

// Animaciones y utilidades optimizadas
document.addEventListener("DOMContentLoaded", () => {
  // Animación de métricas
  const animateMetrics = () => {
    const metricValues = document.querySelectorAll('.metric-value');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        const target = parseInt(entry.target.getAttribute('data-count'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          entry.target.textContent = current < target ? Math.floor(current) : target;
          if (current < target) requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    metricValues.forEach(metric => observer.observe(metric));
  };

  // Animaciones de fade-in
  const animateFadeIn = () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(element => observer.observe(element));
  };

  // Año dinámico
  const yearElement = document.getElementById('year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Inicializar animaciones
  animateMetrics();
  animateFadeIn();
});

// Efectos adicionales para mejorar la experiencia
document.addEventListener("DOMContentLoaded", () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.backdropFilter = 'blur(10px)';
    } else {
      navbar.style.background = 'var(--light)';
      navbar.style.backdropFilter = 'none';
    }
    
    lastScrollY = window.scrollY;
  });

  // Parallax effect para el hero
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      hero.style.transform = `translateY(${rate}px)`;
    });
  }

  // Hover effects para las cards
  const cards = document.querySelectorAll('.problem-card, .benefit-card, .testimonial-card, .step-item');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)';
    });
  });
});
