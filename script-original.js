// CityListen Tulcán - Versión Original Simple
class CityListenApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.selectedPeriod = 'week';
        this.cityData = {
            zones: {
                centro: { status: 'alert', reports: 28, wellBeing: 68 },
                norte: { status: 'good', reports: 15, wellBeing: 82 },
                sur: { status: 'good', reports: 19, wellBeing: 76 },
                este: { status: 'critical', reports: 45, wellBeing: 48 },
                oeste: { status: 'good', reports: 22, wellBeing: 74 }
            },
            metrics: {
                security: 72, transport: 68, environment: 79,
                health: 75, services: 64, tourism: 81, education: 77
            }
        };
        
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMapInteraction();
        this.setupCharts();
        this.setupReportForm();
        this.updateZoneColors();
        this.startRealTimeUpdates();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.showSection(targetId);
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }

    showSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
        }
    }

    setupMapInteraction() {
        const zones = document.querySelectorAll('.map-zone');
        zones.forEach(zone => {
            zone.addEventListener('click', () => {
                const zoneId = zone.dataset.zone;
                this.showZoneDetails(zoneId);
            });
        });
    }

    showZoneDetails(zoneId) {
        const zoneData = this.cityData.zones[zoneId];
        if (!zoneData) return;

        const zoneName = this.getZoneName(zoneId);
        const statusText = this.getStatusText(zoneData.status);
        
        alert(`${zoneName}\n\nReportes: ${zoneData.reports}\nEstado: ${statusText}\nBienestar: ${zoneData.wellBeing}%`);
    }

    getZoneName(zoneId) {
        const names = {
            centro: 'Centro Histórico',
            norte: 'Zona Norte',
            sur: 'Zona Sur',
            este: 'Zona Este',
            oeste: 'Zona Oeste'
        };
        return names[zoneId] || zoneId;
    }

    getStatusText(status) {
        const texts = {
            good: 'Óptimo',
            alert: 'Alerta',
            critical: 'Crítico'
        };
        return texts[status] || status;
    }

    updateZoneColors() {
        const zones = document.querySelectorAll('.map-zone');
        zones.forEach(zone => {
            const zoneId = zone.dataset.zone;
            const zoneData = this.cityData.zones[zoneId];
            
            if (zoneData) {
                zone.className = `map-zone ${zoneData.status}`;
            }
        });
    }

    setupCharts() {
        this.setupChartControls();
        this.drawAllCharts();
    }

    setupChartControls() {
        const chartButtons = document.querySelectorAll('.chart-btn');
        chartButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const period = btn.dataset.period;
                this.selectedPeriod = period;
                
                chartButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                this.drawAllCharts();
            });
        });
    }

    drawAllCharts() {
        this.drawBarChart();
        this.drawPieChart();
        this.drawLineChart();
        this.drawAreaChart();
    }

    drawBarChart() {
        const canvas = document.getElementById('barChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getBarChartData();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const barWidth = (canvas.width - padding * 2) / data.labels.length;
        const maxValue = Math.max(...data.values);
        
        data.values.forEach((value, index) => {
            const barHeight = (value / maxValue) * (canvas.height - padding * 2);
            const x = padding + index * barWidth + barWidth * 0.2;
            const y = canvas.height - padding - barHeight;
            
            ctx.fillStyle = data.colors[index];
            ctx.fillRect(x, y, barWidth * 0.6, barHeight);
            
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(value, x + barWidth * 0.3, y - 5);
            
            ctx.fillStyle = '#64748b';
            ctx.font = '11px Inter';
            ctx.fillText(data.labels[index], x + barWidth * 0.3, canvas.height - padding + 15);
        });
    }

    drawPieChart() {
        const canvas = document.getElementById('pieChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getPieChartData();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 40;
        
        let currentAngle = -Math.PI / 2;
        const total = data.values.reduce((sum, val) => sum + val, 0);
        
        data.values.forEach((value, index) => {
            const sliceAngle = (value / total) * Math.PI * 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            
            ctx.fillStyle = data.colors[index];
            ctx.fill();
            
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round((value / total) * 100)}%`, labelX, labelY);
            
            currentAngle += sliceAngle;
        });
    }

    drawLineChart() {
        const canvas = document.getElementById('lineChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getLineChartData();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const maxValue = Math.max(...data.values);
        const pointSpacing = chartWidth / (data.values.length - 1);
        
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
        }
        
        ctx.strokeStyle = '#3b82f6';
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
    }

    drawAreaChart() {
        const canvas = document.getElementById('areaChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = this.getAreaChartData();
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;
        const maxValue = Math.max(...data.values);
        const pointSpacing = chartWidth / (data.values.length - 1);
        
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
    }

    getBarChartData() {
        return {
            labels: ['Seguridad', 'Transporte', 'Ambiente', 'Salud', 'Servicios'],
            values: [45, 32, 38, 28, 41],
            colors: ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6']
        };
    }

    getPieChartData() {
        return {
            values: [35, 22, 28, 52, 31],
            colors: ['#fbbf24', '#22c55e', '#22c55e', '#ef4444', '#22c55e']
        };
    }

    getLineChartData() {
        return {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            values: [68, 72, 75, 71, 69, 74, 76]
        };
    }

    getAreaChartData() {
        return {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            values: [25, 32, 45, 38, 28, 35, 20]
        };
    }

    setupReportForm() {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitReport();
            });
        }
    }

    submitReport() {
        const category = document.getElementById('category').value;
        const zone = document.getElementById('zone').value;
        const description = document.getElementById('description').value;
        const location = document.getElementById('location').value;
        
        if (!category || !zone || !description) {
            alert('Por favor completa todos los campos obligatorios');
            return;
        }
        
        alert('Reporte enviado exitosamente');
        this.clearForm();
    }

    clearForm() {
        document.getElementById('category').value = '';
        document.getElementById('zone').value = '';
        document.getElementById('description').value = '';
        document.getElementById('location').value = '';
    }

    startRealTimeUpdates() {
        setInterval(() => {
            this.updateMetrics();
        }, 5000);
    }

    updateMetrics() {
        // Simulate real-time updates
        const zones = document.querySelectorAll('.map-zone .stat');
        zones.forEach(zone => {
            const currentText = zone.textContent;
            const currentValue = parseInt(currentText.match(/\d+/)[0]);
            const newValue = currentValue + Math.floor(Math.random() * 3);
            zone.textContent = `${newValue} reportes`;
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CityListenApp();
});
