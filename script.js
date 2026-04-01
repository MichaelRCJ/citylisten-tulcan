// ===== CITYLISTEN APPLICATION =====
// La Ciudad Inteligente que Escucha

class CityListenApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.isListening = false;
        this.reportData = [];
        this.cityData = this.initializeCityData();
        this.accessibilitySettings = {
            highContrast: false,
            largeText: false,
            screenReader: true,
            voiceCommands: false,
            reduceMotion: false
        };
        this.voiceRecognition = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.startListeningAnimation();
        this.loadCityData();
        this.setupGeolocation();
        
        // Start real-time updates for map
        this.startRealTimeUpdates();
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Floating Action Button
        const fabBtn = document.getElementById('fabBtn');
        fabBtn.addEventListener('click', () => this.openReportSection());

        // Report Form
        const reportForm = document.getElementById('reportForm');
        if (reportForm) {
            reportForm.addEventListener('submit', (e) => this.handleReportSubmit(e));
        }

        // Location Button
        const locationBtn = document.getElementById('locationBtn');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => this.getCurrentLocation());
        }

        // Modal Close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeModal());
        }

        // Map Zones
        document.querySelectorAll('.map-zone').forEach(zone => {
            zone.addEventListener('click', (e) => this.handleZoneClick(e));
            zone.addEventListener('mouseenter', (e) => this.handleZoneHover(e));
            // Make zones keyboard accessible
            zone.setAttribute('tabindex', '0');
            zone.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleZoneClick(e);
                }
            });
        });

        // Metric Cards
        document.querySelectorAll('.metric-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleMetricClick(e));
            // Make cards keyboard accessible
            card.setAttribute('tabindex', '0');
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleMetricClick(e);
                }
            });
        });

        // Notification Button
        const notificationBtn = document.querySelector('.notification-btn');
        if (notificationBtn) {
            notificationBtn.addEventListener('click', () => this.showNotifications());
        }

        // Profile Button
        const profileBtn = document.querySelector('.profile-btn');
        if (profileBtn) {
            profileBtn.addEventListener('click', () => this.navigateToProfile());
        }

        // Accessibility Button
        const accessibilityBtn = document.getElementById('accessibilityBtn');
        if (accessibilityBtn) {
            accessibilityBtn.addEventListener('click', () => this.openAccessibilityPanel());
        }

        // Accessibility Panel Close
        const closeAccessibility = document.getElementById('closeAccessibility');
        if (closeAccessibility) {
            closeAccessibility.addEventListener('click', () => this.closeAccessibilityPanel());
        }

        // Accessibility Toggles
        this.setupAccessibilityToggles();

        // Keyboard Shortcuts
        this.setupKeyboardShortcuts();

        // Character Counter
        const descriptionTextarea = document.getElementById('description');
        if (descriptionTextarea) {
            descriptionTextarea.addEventListener('input', (e) => this.updateCharacterCounter(e));
        }

        // Map Controls
        this.setupMapControls();

        // Zone Interactions
        this.setupZoneInteractions();

        // Chart Controls
        this.setupChartControls();
    }

    // ===== NAVIGATION =====
    handleNavigation(e) {
        const navItem = e.currentTarget;
        const sectionName = navItem.dataset.section;
        
        if (sectionName && sectionName !== this.currentSection) {
            this.navigateToSection(sectionName);
        }
    }

    navigateToSection(sectionName) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Update active section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        this.currentSection = sectionName;

        // Add ripple effect to active nav item
        this.createRippleEffect(document.querySelector(`[data-section="${sectionName}"]`));
    }

    openReportSection() {
        this.navigateToSection('report');
        
        // Add special animation to FAB
        const fab = document.getElementById('fabBtn');
        fab.style.transform = 'scale(0.8) rotate(45deg)';
        setTimeout(() => {
            fab.style.transform = '';
        }, 300);
    }

    navigateToProfile() {
        this.navigateToSection('profile');
    }

    // ===== REPORT HANDLING =====
    handleReportSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const report = {
            id: Date.now(),
            category: formData.get('category'),
            location: formData.get('location'),
            description: formData.get('description'),
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        this.submitReport(report);
    }

    async submitReport(report) {
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Enviando...</span>';
        submitBtn.disabled = true;

        // Simulate API call
        await this.simulateAPICall();

        // Add report to data
        this.reportData.push(report);
        this.updateCityMetrics(report);

        // Show success modal
        this.showSuccessModal();

        // Reset form
        document.getElementById('reportForm').reset();
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;

        // Create ripple effect on map
        this.createMapRipple(report.location);
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.classList.add('active');
        
        // Add celebration animation
        this.createCelebrationEffect();
    }

    closeModal() {
        const modal = document.getElementById('successModal');
        modal.classList.remove('active');
    }

    // ===== GEOLOCATION =====
    setupGeolocation() {
        if ('geolocation' in navigator) {
            this.getCurrentLocation();
        }
    }

    getCurrentLocation() {
        const locationInput = document.getElementById('location');
        const locationBtn = document.getElementById('locationBtn');
        
        if (locationBtn) {
            locationBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const locationText = `Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`;
                
                if (locationInput) {
                    locationInput.value = locationText;
                }
                
                if (locationBtn) {
                    locationBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
                    setTimeout(() => {
                        locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
                    }, 2000);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                
                if (locationInput) {
                    locationInput.value = 'Ubicación no disponible';
                }
                
                if (locationBtn) {
                    locationBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
                    setTimeout(() => {
                        locationBtn.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
                    }, 2000);
                }
            }
        );
    }

    // ===== MAP INTERACTIONS =====
    handleZoneClick(e) {
        const zone = e.currentTarget;
        const zoneName = zone.dataset.zone;
        const status = zone.dataset.status;
        
        // Create ripple effect
        this.createRippleEffect(zone);
        
        // Show zone details
        this.showZoneDetails(zoneName, status);
    }

    handleZoneHover(e) {
        const zone = e.currentTarget;
        zone.style.transform = 'translateY(-8px) scale(1.02)';
    }

    showZoneDetails(zoneName, status) {
        const statusText = {
            good: 'Óptimo',
            alert: 'Alerta',
            critical: 'Crítico'
        };

        // Create temporary tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'zone-tooltip';
        tooltip.innerHTML = `
            <h4>${zoneName.charAt(0).toUpperCase() + zoneName.slice(1)}</h4>
            <p>Estado: ${statusText[status]}</p>
        `;
        tooltip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 3000;
            animation: fadeIn 0.3s ease-out;
        `;

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, 3000);
    }

    // ===== METRIC INTERACTIONS =====
    handleMetricClick(e) {
        const card = e.currentTarget;
        const metric = card.dataset.metric;
        
        // Create ripple effect
        this.createRippleEffect(card);
        
        // Show metric details
        this.showMetricDetails(metric);
    }

    showMetricDetails(metric) {
        const metricInfo = {
            safety: {
                title: 'Seguridad Ciudadana',
                description: 'Índice basado en reportes de incidentes y percepción de seguridad.',
                trend: '+2.3% esta semana'
            },
            transport: {
                title: 'Sistema de Transporte',
                description: 'Eficiencia del transporte público basada en reportes de ciudadanos.',
                trend: '-1.2% esta semana'
            },
            environment: {
                title: 'Calidad Ambiental',
                description: 'Nivel de contaminación y calidad del aire en la ciudad.',
                trend: '+5.1% esta semana'
            },
            health: {
                title: 'Servicios de Salud',
                description: 'Disponibilidad y calidad de servicios médicos.',
                trend: 'Estable esta semana'
            },
            services: {
                title: 'Servicios Públicos',
                description: 'Estado de servicios básicos como agua, luz y limpieza.',
                trend: '-3.7% esta semana'
            }
        };

        const info = metricInfo[metric];
        if (info) {
            this.showNotification(info.title, info.description, info.trend);
        }
    }

    // ===== ANIMATIONS =====
    initializeAnimations() {
        // Animate metric cards on load
        document.querySelectorAll('.metric-card').forEach((card, index) => {
            setTimeout(() => {
                card.style.animation = 'fadeIn 0.5s ease-out';
            }, index * 100);
        });

        // Animate map zones on load
        document.querySelectorAll('.map-zone').forEach((zone, index) => {
            setTimeout(() => {
                zone.style.animation = 'fadeIn 0.5s ease-out';
            }, index * 150);
        });
    }

    startListeningAnimation() {
        // Create subtle pulsing animation to show city is "listening"
        setInterval(() => {
            if (this.isListening) {
                this.createListeningWave();
            }
        }, 3000);

        this.isListening = true;
    }

    createListeningWave() {
        const wave = document.createElement('div');
        wave.className = 'listening-wave';
        wave.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 100px;
            height: 100px;
            border: 2px solid rgba(37, 99, 235, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 2s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        document.body.appendChild(wave);

        setTimeout(() => {
            wave.remove();
        }, 2000);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.className = 'ripple-effect';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createMapRipple(location) {
        const mapContainer = document.querySelector('.city-map');
        const ripple = document.createElement('div');
        
        ripple.className = 'map-ripple';
        ripple.style.cssText = `
            position: absolute;
            width: 20px;
            height: 20px;
            background: rgba(37, 99, 235, 0.6);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: mapRipplePulse 1s ease-out;
            pointer-events: none;
        `;

        mapContainer.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 1000);
    }

    createCelebrationEffect() {
        // Create confetti-like effect
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'celebration-particle';
                particle.style.cssText = `
                    position: fixed;
                    width: 8px;
                    height: 8px;
                    background: ${['#2563eb', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 4)]};
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: celebrationFloat 2s ease-out forwards;
                    pointer-events: none;
                    z-index: 3000;
                `;

                document.body.appendChild(particle);

                setTimeout(() => {
                    particle.remove();
                }, 2000);
            }, i * 50);
        }
    }

    // ===== MAP INTERACTIONS =====
    setupMapControls() {
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        const resetViewBtn = document.getElementById('resetView');
        const closeZoneInfoBtn = document.getElementById('closeZoneInfo');

        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomMap(1.2));
        }
        
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomMap(0.8));
        }
        
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => this.resetMapView());
        }
        
        if (closeZoneInfoBtn) {
            closeZoneInfoBtn.addEventListener('click', () => this.closeZoneInfo());
        }
    }

    setupZoneInteractions() {
        const zonePaths = document.querySelectorAll('.zone-path');
        
        zonePaths.forEach(zone => {
            // Click interaction
            zone.addEventListener('click', (e) => this.handleZoneClick(e));
            
            // Keyboard interaction
            zone.setAttribute('tabindex', '0');
            zone.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleZoneClick(e);
                }
            });
            
            // Hover interaction
            zone.addEventListener('mouseenter', (e) => this.handleZoneHover(e));
        });
    }

    handleZoneClick(e) {
        const zonePath = e.currentTarget;
        const zoneName = zonePath.dataset.zone;
        const zoneData = this.cityData.zones[zoneName];
        
        if (zoneData) {
            this.showZoneInformation(zoneName, zoneData);
            this.createRippleEffect(zonePath);
            
            // Announce to screen readers
            this.announceToScreenReader(
                `Zona seleccionada: ${zoneData.description}. Estado: ${this.getStatusText(zoneData.status)}. ${zoneData.reports} reportes.`
            );
        }
    }

    handleZoneHover(e) {
        const zonePath = e.currentTarget;
        const zoneName = zonePath.dataset.zone;
        const zoneData = this.cityData.zones[zoneName];
        
        if (zoneData) {
            // Update tooltip or show preview
            zonePath.style.cursor = 'pointer';
        }
    }

    showZoneInformation(zoneName, zoneData) {
        const panel = document.getElementById('zoneInfoPanel');
        const zoneNameElement = document.getElementById('selectedZoneName');
        const zoneContentElement = document.getElementById('zoneInfoContent');
        
        if (panel && zoneNameElement && zoneContentElement) {
            zoneNameElement.textContent = zoneData.description;
            
            const recentReports = this.getRecentReportsForZone(zoneName);
            
            zoneContentElement.innerHTML = `
                <div class="zone-details">
                    <div class="zone-detail-item">
                        <div class="zone-detail-label">Estado Actual</div>
                        <div class="zone-detail-value">${this.getStatusText(zoneData.status)}</div>
                    </div>
                    <div class="zone-detail-item">
                        <div class="zone-detail-label">Total de Reportes</div>
                        <div class="zone-detail-value">${zoneData.reports}</div>
                    </div>
                    <div class="zone-detail-item">
                        <div class="zone-detail-label">Índice de Bienestar</div>
                        <div class="zone-detail-value">${zoneData.wellBeing}%</div>
                    </div>
                    <div class="zone-detail-item">
                        <div class="zone-detail-label">Tendencia</div>
                        <div class="zone-detail-value">${this.getZoneTrend(zoneName)}</div>
                    </div>
                </div>
                
                <div class="zone-recent-reports">
                    <h4>Reportes Recientes</h4>
                    ${recentReports.map(report => `
                        <div class="report-item">
                            <div class="report-category">${this.getCategoryName(report.category)}</div>
                            <div class="report-time">Hace ${this.getTimeAgo(report.timestamp)}</div>
                        </div>
                    `).join('')}
                </div>
                
                <div style="margin-top: 1rem; text-align: center;">
                    <button class="report-zone-btn" onclick="app.navigateToSection('report')">
                        <i class="fas fa-plus"></i>
                        Reportar en esta zona
                    </button>
                </div>
            `;
            
            panel.classList.add('active');
            
            // Scroll panel into view
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    closeZoneInfo() {
        const panel = document.getElementById('zoneInfoPanel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    getRecentReportsForZone(zoneName) {
        // Generate mock recent reports for the zone
        const categories = ['security', 'transport', 'environment', 'health', 'services'];
        const reports = [];
        
        for (let i = 0; i < 3; i++) {
            reports.push({
                category: categories[Math.floor(Math.random() * categories.length)],
                timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
            });
        }
        
        return reports;
    }

    getZoneTrend(zoneName) {
        const trends = ['Mejorando', 'Estable', 'Empeorando'];
        return trends[Math.floor(Math.random() * trends.length)];
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 60) {
            return `${diffMins} minutos`;
        } else {
            const diffHours = Math.floor(diffMins / 60);
            return `${diffHours} horas`;
        }
    }

    zoomMap(factor) {
        const svg = document.querySelector('.tulcan-map');
        if (svg) {
            const currentScale = svg.style.transform ? 
                parseFloat(svg.style.transform.replace('scale(', '').replace(')', '')) : 1;
            const newScale = Math.max(0.5, Math.min(3, currentScale * factor));
            svg.style.transform = `scale(${newScale})`;
            svg.style.transformOrigin = 'center';
            
            this.announceToScreenReader(`Zoom: ${Math.round(newScale * 100)}%`);
        }
    }

    resetMapView() {
        const svg = document.querySelector('.tulcan-map');
        if (svg) {
            svg.style.transform = 'scale(1)';
            this.announceToScreenReader('Vista restablecida');
        }
    }

    // ===== CHART FUNCTIONALITY =====
    setupChartControls() {
        const chartButtons = document.querySelectorAll('.chart-btn');
        
        chartButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                this.updateAllCharts(period);
                
                // Update active button
                chartButtons.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Announce to screen readers
                this.announceToScreenReader(`Gráficos actualizados: ${this.getPeriodName(period)}`);
            });
        });
        
        // Initialize all charts with week data
        this.updateAllCharts('week');
    }

    updateAllCharts(period) {
        this.drawBarChart(period);
        this.drawPieChart(period);
        this.drawLineChart(period);
        this.drawAreaChart(period);
    }

    drawBarChart(period) {
        const canvas = document.getElementById('barChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getBarChartData(period);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        const padding = 40;
        const barWidth = (canvas.width - padding * 2) / data.labels.length;
        const maxValue = Math.max(...data.values);
        
        data.values.forEach((value, index) => {
            const barHeight = (value / maxValue) * (canvas.height - padding * 2);
            const x = padding + index * barWidth + barWidth * 0.2;
            const y = canvas.height - padding - barHeight;
            
            // Draw bar with gradient
            const gradient = ctx.createLinearGradient(0, y, 0, canvas.height - padding);
            gradient.addColorStop(0, data.colors[index]);
            gradient.addColorStop(1, this.adjustColor(data.colors[index], -20));
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x, y, barWidth * 0.6, barHeight);
            
            // Draw value on top
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth * 0.3, y - 5);
            
            // Draw label
            ctx.fillStyle = '#64748b';
            ctx.font = '11px Inter';
            ctx.fillText(data.labels[index], x + barWidth * 0.3, canvas.height - padding + 15);
        });
        
        // Draw title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Total de Reportes', canvas.width / 2, 20);
    }

    drawPieChart(period) {
        const canvas = document.getElementById('pieChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getPieChartData(period);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        let currentAngle = -Math.PI / 2;
        const total = data.values.reduce((sum, val) => sum + val, 0);
        
        data.values.forEach((value, index) => {
            const sliceAngle = (value / total) * Math.PI * 2;
            
            // Draw slice
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = data.colors[index];
            ctx.fill();
            
            // Draw border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
        
        // Draw title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Distribución por Zona', canvas.width / 2, 20);
    }

    drawLineChart(period) {
        const canvas = document.getElementById('lineChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getLineChartData(period);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const maxValue = Math.max(...data.values);
        const pointSpacing = chartWidth / (data.values.length - 1);
        
        // Draw grid
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        // Draw line with gradient
        const gradient = ctx.createLinearGradient(padding, 0, canvas.width - padding, 0);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#8b5cf6');
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.values.forEach((value, index) => {
            const x = padding + pointSpacing * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        data.values.forEach((value, index) => {
            const x = padding + pointSpacing * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
        
        // Draw title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Tendencia de Bienestar', canvas.width / 2, 20);
    }

    drawAreaChart(period) {
        const canvas = document.getElementById('areaChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getAreaChartData(period);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const maxValue = Math.max(...data.values);
        const pointSpacing = chartWidth / (data.values.length - 1);
        
        // Draw area
        const gradient = ctx.createLinearGradient(0, padding, 0, canvas.height - padding);
        gradient.addColorStop(0, 'rgba(34, 197, 94, 0.3)');
        gradient.addColorStop(1, 'rgba(34, 197, 94, 0.05)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        
        data.values.forEach((value, index) => {
            const x = padding + pointSpacing * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, canvas.height - padding);
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.lineTo(canvas.width - padding, canvas.height - padding);
        ctx.closePath();
        ctx.fill();
        
        // Draw line
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.values.forEach((value, index) => {
            const x = padding + pointSpacing * index;
            const y = padding + chartHeight - (value / maxValue) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw title
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Actividad Diaria', canvas.width / 2, 20);
    }

    getBarChartData(period) {
        const data = {
            day: {
                labels: ['Seguridad', 'Transporte', 'Ambiente', 'Salud', 'Servicios'],
                values: [15, 8, 12, 6, 9],
                colors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']
            },
            week: {
                labels: ['Seguridad', 'Transporte', 'Ambiente', 'Salud', 'Servicios'],
                values: [45, 32, 38, 28, 41],
                colors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']
            },
            month: {
                labels: ['Seguridad', 'Transporte', 'Ambiente', 'Salud', 'Servicios'],
                values: [180, 125, 145, 98, 162],
                colors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']
            }
        };
        return data[period] || data.week;
    }

    getPieChartData(period) {
        const data = {
            day: {
                values: [28, 15, 19, 45, 22],
                colors: ['#fbbf24', '#22c55e', '#22c55e', '#ef4444', '#22c55e']
            },
            week: {
                values: [35, 22, 28, 52, 31],
                colors: ['#fbbf24', '#22c55e', '#22c55e', '#ef4444', '#22c55e']
            },
            month: {
                values: [140, 88, 112, 208, 124],
                colors: ['#fbbf24', '#22c55e', '#22c55e', '#ef4444', '#22c55e']
            }
        };
        return data[period] || data.week;
    }

    getLineChartData(period) {
        const data = {
            day: {
                labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
                values: [72, 75, 71, 68, 74, 76]
            },
            week: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                values: [68, 72, 75, 71, 69, 74, 76]
            },
            month: {
                labels: ['Sem1', 'Sem2', 'Sem3', 'Sem4'],
                values: [65, 70, 73, 75]
            }
        };
        return data[period] || data.week;
    }

    getAreaChartData(period) {
        const data = {
            day: {
                labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
                values: [5, 12, 18, 8, 15, 6]
            },
            week: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                values: [25, 32, 45, 38, 28, 35, 20]
            },
            month: {
                labels: ['Sem1', 'Sem2', 'Sem3', 'Sem4'],
                values: [180, 220, 195, 240]
            }
        };
        return data[period] || data.week;
    }

    adjustColor(color, amount) {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    }

    // Update real-time statistics for chart
    updateRealTimeStats() {
        const todayReports = document.getElementById('todayReports');
        const resolvedProblems = document.getElementById('resolvedProblems');
        const responseTime = document.getElementById('responseTime');
        
        // Update map statistics
        if (todayReports) {
            const currentValue = parseInt(todayReports.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 3);
            todayReports.textContent = newValue;
        }
        
        if (resolvedProblems) {
            const currentValue = parseInt(resolvedProblems.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 2);
            resolvedProblems.textContent = newValue;
        }
        
        if (responseTime) {
            const currentTime = parseFloat(responseTime.textContent);
            const newTime = Math.max(0.5, currentTime + (Math.random() - 0.5) * 0.5);
            responseTime.textContent = `${newTime.toFixed(1)}h`;
        }
        
        // Update statistics section
        this.updateStatisticsSection();
    }

    updateStatisticsSection() {
        const statValues = document.querySelectorAll('.stat-value');
        
        statValues.forEach((stat, index) => {
            if (index === 0) {
                // Participation
                const current = parseInt(stat.textContent.replace(',', ''));
                const newValue = current + Math.floor(Math.random() * 5);
                stat.textContent = newValue.toLocaleString();
            } else if (index === 1) {
                // Reports
                const current = parseInt(stat.textContent);
                const newValue = current + Math.floor(Math.random() * 3);
                stat.textContent = newValue;
            } else if (index === 2) {
                // Resolution rate
                const current = parseInt(stat.textContent);
                const newValue = Math.min(95, current + Math.floor(Math.random() * 2));
                stat.textContent = `${newValue}%`;
            }
        });
    }

    // ===== ACCESSIBILITY METHODS =====
    setupAccessibilityToggles() {
        const toggles = {
            highContrast: 'highContrast',
            largeText: 'largeText',
            screenReader: 'screenReader',
            voiceCommands: 'voiceCommands',
            reduceMotion: 'reduceMotion'
        };

        Object.keys(toggles).forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            if (toggle) {
                toggle.checked = this.accessibilitySettings[toggles[toggleId]];
                toggle.addEventListener('change', (e) => {
                    this.toggleAccessibilityFeature(toggles[toggleId], e.target.checked);
                });
            }
        });
    }

    toggleAccessibilityFeature(feature, enabled) {
        this.accessibilitySettings[feature] = enabled;
        const body = document.body;
        
        switch (feature) {
            case 'highContrast':
                body.classList.toggle('high-contrast', enabled);
                this.announceToScreenReader(
                    enabled ? 'Modo de alto contraste activado' : 'Modo de alto contraste desactivado'
                );
                break;
                
            case 'largeText':
                body.classList.toggle('large-text', enabled);
                this.announceToScreenReader(
                    enabled ? 'Texto grande activado' : 'Texto grande desactivado'
                );
                break;
                
            case 'screenReader':
                body.classList.toggle('screen-reader-mode', enabled);
                this.announceToScreenReader(
                    enabled ? 'Modo lector de pantalla activado' : 'Modo lector de pantalla desactivado'
                );
                break;
                
            case 'voiceCommands':
                if (enabled) {
                    this.startVoiceCommands();
                } else {
                    this.stopVoiceCommands();
                }
                break;
                
            case 'reduceMotion':
                body.classList.toggle('reduce-motion', enabled);
                this.announceToScreenReader(
                    enabled ? 'Movimiento reducido activado' : 'Movimiento reducido desactivado'
                );
                break;
        }
        
        // Save preferences to localStorage
        localStorage.setItem('accessibilitySettings', JSON.stringify(this.accessibilitySettings));
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Alt + A: Accessibility Panel
            if (e.altKey && e.key === 'a') {
                e.preventDefault();
                this.openAccessibilityPanel();
            }
            
            // Alt + R: Report
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                this.openReportSection();
            }
            
            // Alt + M: Map
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                this.navigateToSection('map');
            }
            
            // Alt + S: Statistics
            if (e.altKey && e.key === 's') {
                e.preventDefault();
                this.navigateToSection('statistics');
            }
            
            // Escape: Close modals
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openAccessibilityPanel() {
        const panel = document.getElementById('accessibilityPanel');
        if (panel) {
            panel.classList.add('active');
            panel.setAttribute('aria-hidden', 'false');
            // Focus on first focusable element
            const firstFocusable = panel.querySelector('button, input, select, textarea');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }
    }

    closeAccessibilityPanel() {
        const panel = document.getElementById('accessibilityPanel');
        if (panel) {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
            // Return focus to accessibility button
            const accessibilityBtn = document.getElementById('accessibilityBtn');
            if (accessibilityBtn) {
                accessibilityBtn.focus();
            }
        }
    }

    closeAllModals() {
        this.closeAccessibilityPanel();
        this.closeModal();
    }

    updateCharacterCounter(e) {
        const textarea = e.target;
        const charCount = textarea.value.length;
        const charCountElement = document.getElementById('charCount');
        const counter = document.querySelector('.char-counter');
        
        if (charCountElement) {
            charCountElement.textContent = charCount;
            
            // Update counter color based on length
            counter.classList.remove('warning', 'danger');
            if (charCount > 400) {
                counter.classList.add('danger');
            } else if (charCount > 300) {
                counter.classList.add('warning');
            }
        }
        
        // Announce to screen reader when approaching limit
        if (charCount >= 450 && charCount % 10 === 0) {
            this.announceToScreenReader(`${charCount} de 500 caracteres usados`);
        }
    }

    announceToScreenReader(message) {
        // Create a temporary element for screen reader announcements
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // ===== VOICE COMMANDS =====
    startVoiceCommands() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.announceToScreenReader('Reconocimiento de voz no soportado en este navegador');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.voiceRecognition = new SpeechRecognition();
        
        this.voiceRecognition.lang = 'es-ES';
        this.voiceRecognition.continuous = true;
        this.voiceRecognition.interimResults = false;
        
        this.voiceRecognition.onresult = (event) => {
            const last = event.results.length - 1;
            const command = event.results[last][0].transcript.toLowerCase();
            this.processVoiceCommand(command);
        };
        
        this.voiceRecognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            this.showVoiceIndicator('Error en reconocimiento de voz', 'error');
        };
        
        this.voiceRecognition.onend = () => {
            if (this.accessibilitySettings.voiceCommands) {
                // Restart recognition if still enabled
                setTimeout(() => {
                    this.voiceRecognition.start();
                }, 1000);
            }
        };
        
        try {
            this.voiceRecognition.start();
            this.showVoiceIndicator('Comandos de voz activados', 'success');
            this.announceToScreenReader('Comandos de voz activados. Di "ayuda" para escuchar los comandos disponibles.');
        } catch (error) {
            console.error('Error starting voice recognition:', error);
        }
    }

    stopVoiceCommands() {
        if (this.voiceRecognition) {
            this.voiceRecognition.stop();
            this.voiceRecognition = null;
            this.showVoiceIndicator('Comandos de voz desactivados', 'info');
            this.announceToScreenReader('Comandos de voz desactivados');
        }
    }

    processVoiceCommand(command) {
        console.log('Voice command received:', command);
        
        // Navigation commands
        if (command.includes('inicio') || command.includes('dashboard')) {
            this.navigateToSection('dashboard');
            this.announceToScreenReader('Navegando al inicio');
        } else if (command.includes('mapa')) {
            this.navigateToSection('map');
            this.announceToScreenReader('Navegando al mapa');
        } else if (command.includes('reportar') || command.includes('reporte')) {
            this.openReportSection();
            this.announceToScreenReader('Abriendo formulario de reporte');
        } else if (command.includes('estadísticas')) {
            this.navigateToSection('statistics');
            this.announceToScreenReader('Navegando a estadísticas');
        } else if (command.includes('perfil')) {
            this.navigateToSection('profile');
            this.announceToScreenReader('Navegando al perfil');
        }
        
        // Action commands
        else if (command.includes('accesibilidad')) {
            this.openAccessibilityPanel();
            this.announceToScreenReader('Abriendo panel de accesibilidad');
        } else if (command.includes('notificaciones')) {
            this.showNotifications();
            this.announceToScreenReader('Mostrando notificaciones');
        } else if (command.includes('ayuda')) {
            this.announceVoiceCommandsHelp();
        }
        
        // Form commands
        else if (command.includes('enviar') && this.currentSection === 'report') {
            const form = document.getElementById('reportForm');
            if (form) {
                form.dispatchEvent(new Event('submit'));
            }
        }
        
        else {
            this.showVoiceIndicator(`Comando no reconocido: ${command}`, 'warning');
        }
    }

    announceVoiceCommandsHelp() {
        const helpText = 'Comandos de voz disponibles: ' +
            'Di "inicio" para ir al inicio, ' +
            '"mapa" para ir al mapa, ' +
            '"reportar" para hacer un reporte, ' +
            '"estadísticas" para ver estadísticas, ' +
            '"perfil" para ir a tu perfil, ' +
            '"accesibilidad" para abrir opciones de accesibilidad, ' +
            '"notificaciones" para ver notificaciones, ' +
            'o "enviar" cuando estés en el formulario de reporte.';
        
        this.announceToScreenReader(helpText);
    }

    showVoiceIndicator(message, type = 'info') {
        // Remove existing indicator
        const existing = document.querySelector('.voice-indicator');
        if (existing) {
            existing.remove();
        }
        
        // Create new indicator
        const indicator = document.createElement('div');
        indicator.className = 'voice-indicator active';
        if (type === 'error') {
            indicator.style.background = 'var(--danger-red)';
        } else if (type === 'warning') {
            indicator.style.background = 'var(--warning-yellow)';
        } else if (type === 'success') {
            indicator.style.background = 'var(--success-green)';
        }
        
        indicator.innerHTML = `
            <i class="fas fa-microphone"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(indicator);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (indicator.parentNode) {
                indicator.remove();
            }
        }, 3000);
    }

    // ===== DATA MANAGEMENT =====
    initializeCityData() {
        return {
            zones: {
                centro: { status: 'alert', reports: 28, wellBeing: 68, description: 'Centro Histórico de Tulcán' },
                norte: { status: 'good', reports: 15, wellBeing: 82, description: 'Zona Norte - Residencial' },
                sur: { status: 'good', reports: 19, wellBeing: 76, description: 'Zona Sur - Comercial' },
                este: { status: 'critical', reports: 45, wellBeing: 48, description: 'Zona Este - Industrial' },
                oeste: { status: 'good', reports: 22, wellBeing: 74, description: 'Zona Oeste - Turística' }
            },
            metrics: {
                security: 72,
                transport: 68,
                environment: 79,
                health: 75,
                services: 64,
                tourism: 81,
                education: 77
            },
            cityInfo: {
                name: 'Tulcán',
                province: 'Carchi',
                country: 'Ecuador',
                altitude: '2950 m.s.n.m.',
                climate: 'Frío andino',
                population: '53,558 habitantes',
                knownFor: 'Puerta de entrada a Ecuador desde Colombia'
            }
        };
    }

    loadCityData() {
        // Update map zones with real data for Tulcán
        Object.keys(this.cityData.zones).forEach(zoneName => {
            const zone = document.querySelector(`[data-zone="${zoneName}"]`);
            const zoneData = this.cityData.zones[zoneName];
            
            if (zone) {
                zone.dataset.status = zoneData.status;
                zone.setAttribute('aria-label', `${zoneData.description}. Estado: ${this.getStatusText(zoneData.status)}. ${zoneData.reports} reportes.`);
                this.updateZoneVisual(zone, zoneData.status);
            }
        });

        // Update metrics
        this.updateMetricsDisplay();
        
        // Load saved accessibility settings
        this.loadAccessibilitySettings();
    }

    updateCityMetrics(report) {
        // Update zone data based on new report
        const zone = this.determineZoneFromLocation(report.location);
        if (zone && this.cityData.zones[zone]) {
            this.cityData.zones[zone].reports++;
            this.recalculateZoneStatus(zone);
        }

        // Update category metrics
        if (this.cityData.metrics[report.category]) {
            this.cityData.metrics[report.category] = Math.max(0, 
                this.cityData.metrics[report.category] - 2);
        }

        this.loadCityData();
        
        // Announce to screen readers
        this.announceToScreenReader(
            `Reporte de ${this.getCategoryName(report.category)} recibido. ${this.cityData.zones[zone]?.reports || 0} reportes en la zona.`
        );
    }

    determineZoneFromLocation(location) {
        // Zone determination for Tulcán based on location patterns
        // In a real app, this would use geospatial data
        const zones = ['centro', 'norte', 'sur', 'este', 'oeste'];
        
        // Simple heuristic based on location text or random for demo
        if (location.includes('centro') || location.includes('histórico')) {
            return 'centro';
        } else if (location.includes('norte')) {
            return 'norte';
        } else if (location.includes('sur')) {
            return 'sur';
        } else if (location.includes('este')) {
            return 'este';
        } else if (location.includes('oeste')) {
            return 'oeste';
        }
        
        return zones[Math.floor(Math.random() * zones.length)];
    }

    recalculateZoneStatus(zoneName) {
        const zoneData = this.cityData.zones[zoneName];
        const reportCount = zoneData.reports;
        
        if (reportCount > 50) {
            zoneData.status = 'critical';
            zoneData.wellBeing = Math.max(20, zoneData.wellBeing - 5);
        } else if (reportCount > 30) {
            zoneData.status = 'alert';
            zoneData.wellBeing = Math.max(40, zoneData.wellBeing - 3);
        } else {
            zoneData.status = 'good';
            zoneData.wellBeing = Math.min(95, zoneData.wellBeing + 2);
        }
    }

    updateZoneVisual(zone, status) {
        // Remove existing status classes
        zone.classList.remove('status-good', 'status-alert', 'status-critical');
        zone.classList.add(`status-${status}`);
    }

    updateMetricsDisplay() {
        Object.keys(this.cityData.metrics).forEach(metric => {
            const card = document.querySelector(`[data-metric="${metric}"]`);
            if (card) {
                const valueElement = card.querySelector('.metric-value');
                if (valueElement) {
                    valueElement.textContent = `${this.cityData.metrics[metric]}%`;
                    // Add accessibility label
                    valueElement.setAttribute('aria-label', `${this.getCategoryName(metric)}: ${this.cityData.metrics[metric]} por ciento`);
                }
            }
        });
    }

    getStatusText(status) {
        const statusMap = {
            'good': 'Óptimo',
            'alert': 'Alerta',
            'critical': 'Crítico'
        };
        return statusMap[status] || 'Desconocido';
    }

    getCategoryName(category) {
        const categoryMap = {
            'security': 'Seguridad Ciudadana',
            'transport': 'Transporte Público',
            'environment': 'Medio Ambiente',
            'health': 'Salud Pública',
            'services': 'Servicios Municipales',
            'tourism': 'Turismo',
            'education': 'Educación',
            'safety': 'Seguridad'
        };
        return categoryMap[category] || category;
    }

    loadAccessibilitySettings() {
        const saved = localStorage.getItem('accessibilitySettings');
        if (saved) {
            try {
                this.accessibilitySettings = { ...this.accessibilitySettings, ...JSON.parse(saved) };
                // Apply saved settings
                Object.keys(this.accessibilitySettings).forEach(feature => {
                    if (this.accessibilitySettings[feature]) {
                        this.toggleAccessibilityFeature(feature, true);
                    }
                });
            } catch (error) {
                console.error('Error loading accessibility settings:', error);
            }
        }
    }

    startRealTimeUpdates() {
        // Update map statistics every 5 seconds
        setInterval(() => {
            if (this.currentSection === 'map') {
                this.updateRealTimeStats();
            }
        }, 5000);
        
        // Add new report points randomly
        setInterval(() => {
            this.addRandomReportPoint();
        }, 8000);
    }

    addRandomReportPoint() {
        const reportPoints = document.getElementById('reportPoints');
        if (reportPoints) {
            const zones = ['centro', 'norte', 'sur', 'este', 'oeste'];
            const zone = zones[Math.floor(Math.random() * zones.length)];
            const coordinates = this.getZoneCoordinates(zone);
            
            const newPoint = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            newPoint.setAttribute('class', 'report-pulse');
            newPoint.setAttribute('cx', coordinates.x);
            newPoint.setAttribute('cy', coordinates.y);
            newPoint.setAttribute('r', '8');
            newPoint.setAttribute('fill', '#ef4444');
            
            const animateRadius = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animateRadius.setAttribute('attributeName', 'r');
            animateRadius.setAttribute('values', '8;15;8');
            animateRadius.setAttribute('dur', '2s');
            animateRadius.setAttribute('repeatCount', 'indefinite');
            
            const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animateOpacity.setAttribute('attributeName', 'opacity');
            animateOpacity.setAttribute('values', '1;0.3;1');
            animateOpacity.setAttribute('dur', '2s');
            animateOpacity.setAttribute('repeatCount', 'indefinite');
            
            newPoint.appendChild(animateRadius);
            newPoint.appendChild(animateOpacity);
            reportPoints.appendChild(newPoint);
            
            // Remove after 10 seconds
            setTimeout(() => {
                newPoint.remove();
            }, 10000);
        }
    }

    getZoneCoordinates(zoneName) {
        const coordinates = {
            'centro': { x: 400, y: 275 },
            'norte': { x: 275, y: 125 },
            'sur': { x: 550, y: 425 },
            'este': { x: 600, y: 300 },
            'oeste': { x: 200, y: 300 }
        };
        
        const base = coordinates[zoneName];
        return {
            x: base.x + (Math.random() - 0.5) * 100,
            y: base.y + (Math.random() - 0.5) * 50
        };
    }

    // ===== NOTIFICATIONS =====
    showNotifications() {
        const notifications = [
            { title: 'Nuevos reportes', message: '5 ciudadanos han reportado problemas', time: 'Hace 5 min' },
            { title: 'Problema resuelto', message: 'Reporte de transporte en centro fue resuelto', time: 'Hace 1 hora' },
            { title: 'Mejora ambiental', message: 'Calidad del aire ha mejorado 15%', time: 'Hace 2 horas' }
        ];

        this.showNotificationList(notifications);
    }

    showNotificationList(notifications) {
        const notificationPanel = document.createElement('div');
        notificationPanel.className = 'notification-panel';
        notificationPanel.innerHTML = `
            <div class="notification-header">
                <h3>Notificaciones</h3>
                <button class="close-notifications">×</button>
            </div>
            <div class="notification-list">
                ${notifications.map(notif => `
                    <div class="notification-item">
                        <h4>${notif.title}</h4>
                        <p>${notif.message}</p>
                        <small>${notif.time}</small>
                    </div>
                `).join('')}
            </div>
        `;
        
        notificationPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 350px;
            max-height: 400px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            z-index: 2000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notificationPanel);

        // Close handlers
        notificationPanel.querySelector('.close-notifications').addEventListener('click', () => {
            notificationPanel.remove();
        });

        setTimeout(() => {
            notificationPanel.remove();
        }, 10000);
    }

    showNotification(title, message, trend = '') {
        const notification = document.createElement('div');
        notification.className = 'notification-toast';
        notification.innerHTML = `
            <h4>${title}</h4>
            <p>${message}</p>
            ${trend ? `<small>${trend}</small>` : ''}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2000;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // ===== UTILITY FUNCTIONS =====
    simulateAPICall() {
        return new Promise(resolve => setTimeout(resolve, 1500));
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('es-ES', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
        });
    }
}

// ===== CUSTOM ANIMATIONS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes mapRipplePulse {
        0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
        }
    }

    @keyframes celebrationFloat {
        0% {
            transform: translate(-50%, -50%) translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) translateY(-100px) rotate(360deg);
            opacity: 0;
        }
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .notification-panel {
        overflow: hidden;
    }

    .notification-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid #e5e7eb;
    }

    .notification-header h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
    }

    .close-notifications {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s;
    }

    .close-notifications:hover {
        background: #f3f4f6;
        color: #1f2937;
    }

    .notification-list {
        max-height: 350px;
        overflow-y: auto;
    }

    .notification-item {
        padding: 1rem;
        border-bottom: 1px solid #f3f4f6;
        transition: background-color 0.2s;
    }

    .notification-item:hover {
        background: #f9fafb;
    }

    .notification-item:last-child {
        border-bottom: none;
    }

    .notification-item h4 {
        margin: 0 0 0.25rem 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: #1f2937;
    }

    .notification-item p {
        margin: 0 0 0.5rem 0;
        font-size: 0.85rem;
        color: #6b7280;
    }

    .notification-item small {
        font-size: 0.75rem;
        color: #9ca3af;
    }

    .notification-toast h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
    }

    .notification-toast p {
        margin: 0 0 0.5rem 0;
        font-size: 0.9rem;
        color: #6b7280;
    }

    .notification-toast small {
        font-size: 0.8rem;
        color: #2563eb;
        font-weight: 500;
    }

    .zone-tooltip {
        min-width: 200px;
        text-align: center;
    }

    .zone-tooltip h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: #1f2937;
    }

    .zone-tooltip p {
        margin: 0;
        font-size: 0.9rem;
        color: #6b7280;
    }
`;

document.head.appendChild(style);

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new CityListenApp();
    
    // Make app globally available for debugging
    window.cityListenApp = app;
    
    console.log('🏙️ CityListen initialized - La ciudad está escuchando...');
});

// ===== SERVICE WORKER FOR PWA (Optional) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
