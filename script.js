// script.js - Versión mejorada
document.addEventListener('DOMContentLoaded', () => {
    // Constantes
    const WHATSAPP_NUMBER = "521234567890"; // Cambiar por número real
    const STORAGE_KEY = 'motoTapiaProducts';
    
    // --- Inventario de productos ---
    const inventarioMotoTapia = [
        { id: 1, nombre: "Batería LTH Moto 12V", categoria: "baterias", precio: "$950 MXN", icono: "🔋", desc: "Arranque seguro. Libre de mantenimiento.", stock: true },
        { id: 2, nombre: "Llanta Pirelli Diablo Rosso", categoria: "llantas", precio: "$2,300 MXN", icono: "🛞", desc: "Máximo agarre en calle y lluvia.", stock: true },
        { id: 3, nombre: "Llanta Michelin Pilot Street", categoria: "llantas", precio: "$1,850 MXN", icono: "🛞", desc: "Durabilidad excepcional para ciudad.", stock: true },
        { id: 4, nombre: "Kit de Arrastre Racing", categoria: "refacciones", precio: "$1,400 MXN", icono: "⚙️", desc: "Cadena O-Ring de alta tensión.", stock: true },
        { id: 5, nombre: "Faro LED Ojo de Ángel", categoria: "accesorios", precio: "$850 MXN", icono: "💡", desc: "Iluminación profunda 6000K.", stock: true },
        { id: 6, nombre: "Aceite Motul 7100 10W40", categoria: "refacciones", precio: "$380 MXN", icono: "🛢️", desc: "100% Sintético. Protección total.", stock: true },
        { id: 7, nombre: "Batería Gel Yuasa", categoria: "baterias", precio: "$1,100 MXN", icono: "🔋", desc: "Alta resistencia a la vibración.", stock: true },
        { id: 8, nombre: "Casco Certificado DOT", categoria: "accesorios", precio: "$1,990 MXN", icono: "🪖", desc: "Máxima seguridad y ventilación.", stock: true }
    ];

    // --- Funciones de utilidad ---
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toastMessage');
        if (!toast) return;
        
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        toast.innerHTML = `<i class="fas ${icon}"></i> <span>${message}</span>`;
        toast.classList.add('show');
        
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    function validateForm(formData) {
        const errors = {};
        
        if (!formData.nombre || formData.nombre.trim().length < 3) {
            errors.nombre = "Nombre debe tener al menos 3 caracteres";
        }
        
        if (!formData.moto || formData.moto.trim().length < 2) {
            errors.moto = "Ingrese el modelo de su motocicleta";
        }
        
        if (!formData.servicio) {
            errors.servicio = "Seleccione un servicio";
        }
        
        if (!formData.fecha) {
            errors.fecha = "Seleccione una fecha";
        } else {
            const selectedDate = new Date(formData.fecha);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                errors.fecha = "La fecha no puede ser anterior a hoy";
            }
        }
        
        return errors;
    }

    function displayFormErrors(errors) {
        // Limpiar errores anteriores
        document.querySelectorAll('.error-message').forEach(el => el.innerHTML = '');
        document.querySelectorAll('.form-group input, .form-group select').forEach(el => 
            el.classList.remove('error'));
        
        // Mostrar nuevos errores
        Object.keys(errors).forEach(field => {
            const errorElement = document.getElementById(`error-${field}`);
            const inputElement = document.getElementById(`${field}Cita`) || document.getElementById(field);
            
            if (errorElement) {
                errorElement.innerHTML = errors[field];
            }
            if (inputElement) {
                inputElement.classList.add('error');
            }
        });
    }

    // --- Renderizado de productos ---
    function renderProducts(filtro = 'all') {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;
        
        const loadingDiv = document.getElementById('loadingProducts');
        if (loadingDiv) loadingDiv.style.display = 'block';
        
        // Simular carga (para mejorar UX)
        setTimeout(() => {
            productsGrid.innerHTML = '';
            
            let filtrados = filtro === 'all' 
                ? inventarioMotoTapia 
                : inventarioMotoTapia.filter(p => p.categoria === filtro);
            
            if (filtrados.length === 0) {
                productsGrid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                        <i class="fas fa-box-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 20px;"></i>
                        <p style="color: var(--text-muted);">No hay productos en esta categoría.</p>
                    </div>
                `;
                if (loadingDiv) loadingDiv.style.display = 'none';
                return;
            }
            
            filtrados.forEach(prod => {
                const card = document.createElement('article');
                card.className = 'product-card';
                card.setAttribute('role', 'listitem');
                card.innerHTML = `
                    <div class="product-img">${prod.icono}</div>
                    <div class="product-cat">${prod.categoria}</div>
                    <h3>${prod.nombre}</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 15px;">${prod.desc}</p>
                    <div class="product-price">${prod.precio}</div>
                    <button class="btn-outline btn-cotizar" style="width: 100%; border-radius: 8px; padding: 12px;" 
                            data-name="${prod.nombre}" data-price="${prod.precio}">
                        <i class="fab fa-whatsapp"></i> Consultar disponibilidad
                    </button>
                `;
                productsGrid.appendChild(card);
            });
            
            if (loadingDiv) loadingDiv.style.display = 'none';
            
            // Eventos para cotizar productos
            document.querySelectorAll('.btn-cotizar').forEach(btn => {
                btn.removeEventListener('click', handleProductQuote);
                btn.addEventListener('click', handleProductQuote);
            });
        }, 300);
    }
    
    function handleProductQuote(e) {
        const btn = e.currentTarget;
        const nombre = btn.getAttribute('data-name');
        const precio = btn.getAttribute('data-price');
        const msg = encodeURIComponent(
            `Hola Moto Tapia, vi en su página web y me interesa cotizar la disponibilidad de:\n\n*${nombre}*\nPrecio: ${precio}\n\n¿Podrían confirmar si tienen en stock?`
        );
        window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${msg}`, '_blank');
    }

    // --- Filtros de productos ---
    function initFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (!filterBtns.length) return;
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.getAttribute('data-cat');
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderProducts(category);
            });
        });
    }

    // --- Formulario de citas mejorado ---
    function initAppointmentForm() {
        const citaForm = document.getElementById('appointmentForm');
        if (!citaForm) return;
        
        // Configurar fecha mínima
        const fechaInput = document.getElementById('fechaCita');
        if (fechaInput) {
            const today = new Date().toISOString().split('T')[0];
            fechaInput.min = today;
            
            // Establecer fecha por defecto (mañana)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            fechaInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        citaForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = {
                nombre: document.getElementById('nombreCita')?.value.trim() || '',
                moto: document.getElementById('motoModelo')?.value.trim() || '',
                servicio: document.getElementById('servicioTipo')?.value || '',
                fecha: document.getElementById('fechaCita')?.value || '',
                telefono: document.getElementById('telefonoCita')?.value.trim() || '',
                notas: document.getElementById('comentariosCita')?.value.trim() || 'Sin detalles adicionales.'
            };
            
            // Validar formulario
            const errors = validateForm(formData);
            
            if (Object.keys(errors).length > 0) {
                displayFormErrors(errors);
                showToast('Por favor complete todos los campos requeridos', 'error');
                return;
            }
            
            // Limpiar errores si todo está bien
            displayFormErrors({});
            
            // Mapeo de servicios para mejor presentación
            const serviciosMap = {
                'Escaneo Computarizado': '🔍 Escaneo Computarizado',
                'Mantenimiento Preventivo': '🔧 Mantenimiento Preventivo',
                'Reparación de Motor': '⚙️ Reparación de Motor',
                'Sistema Fuel Injection': '💉 Sistema Fuel Injection',
                'Falla Eléctrica': '⚡ Falla Eléctrica'
            };
            
            const servicioDisplay = serviciosMap[formData.servicio] || formData.servicio;
            
            const textoWA = `*🏍️ NUEVA CITA DE TALLER | MOTO TAPIA SERVICE*
━━━━━━━━━━━━━━━━━━━━
📋 *Datos del Cliente:*
👤 *Nombre:* ${formData.nombre}
📞 *Teléfono:* ${formData.telefono || 'No proporcionado'}

🏍️ *Datos de la Moto:*
• *Modelo:* ${formData.moto}

🔧 *Servicio Solicitado:*
${servicioDisplay}

📅 *Fecha Agendada:*
${formData.fecha}

📝 *Descripción del Problema:*
${formData.notas}
━━━━━━━━━━━━━━━━━━━━
⏰ *Horario de atención:* Lun-Vie 9am-7pm | Sáb 9am-3pm
📍 *Dirección:* Av. Latinoamericana 2020, Uruapan

_*Este mensaje fue generado automáticamente desde el sitio web*_`;

            const urlWA = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(textoWA)}`;
            
            showToast('Redirigiendo a WhatsApp para confirmar su cita...');
            
            setTimeout(() => {
                window.open(urlWA, '_blank');
                citaForm.reset();
                
                // Restaurar fecha por defecto después de reset
                if (fechaInput) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    fechaInput.value = tomorrow.toISOString().split('T')[0];
                }
                
                showToast('¡Cita generada exitosamente!', 'success');
            }, 1500);
        });
    }

    // --- Menú móvil mejorado ---
    function initMobileMenu() {
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const navMenu = document.getElementById('navLinks');
        
        if (mobileBtn && navMenu) {
            mobileBtn.addEventListener('click', () => {
                const isExpanded = navMenu.classList.contains('show');
                navMenu.classList.toggle('show');
                mobileBtn.setAttribute('aria-expanded', !isExpanded);
            });
            
            // Cerrar menú al hacer click en un enlace
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('show');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                });
            });
            
            // Cerrar menú al hacer click fuera
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileBtn.contains(e.target) && navMenu.classList.contains('show')) {
                    navMenu.classList.remove('show');
                    mobileBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // --- Animación de navbar al hacer scroll ---
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.padding = '8px 0';
                navbar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            } else {
                navbar.style.padding = '12px 0';
                navbar.style.boxShadow = 'var(--shadow-sm)';
            }
        });
    }

    // --- Smooth scroll para enlaces internos ---
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // --- Inicialización ---
    function init() {
        renderProducts('all');
        initFilters();
        initAppointmentForm();
        initMobileMenu();
        initNavbarScroll();
        initSmoothScroll();
        
        // Mostrar mensaje de bienvenida
        console.log('🚀 Moto Tapia Service - Sitio web cargado correctamente');
    }
    
    init();
});