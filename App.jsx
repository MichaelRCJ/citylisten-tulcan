import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const CityListenApp = () => {
    const [currentSection, setCurrentSection] = useState('dashboard');
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [accessibility, setAccessibility] = useState({
        highContrast: false,
        largeText: false,
        screenReader: false,
        voiceCommands: false,
        reduceMotion: false
    });
    
    const barChartRef = useRef(null);
    const pieChartRef = useRef(null);
    const lineChartRef = useRef(null);
    const areaChartRef = useRef(null);

    // City data for Tulcán
    const cityData = {
        zones: {
            centro: { status: 'alert', reports: 28, wellBeing: 68, color: '#fbbf24' },
            norte: { status: 'good', reports: 15, wellBeing: 82, color: '#22c55e' },
            sur: { status: 'good', reports: 19, wellBeing: 76, color: '#22c55e' },
            este: { status: 'critical', reports: 45, wellBeing: 48, color: '#ef4444' },
            oeste: { status: 'good', reports: 22, wellBeing: 74, color: '#22c55e' }
        },
        metrics: {
            security: 72, transport: 68, environment: 79,
            health: 75, services: 64, tourism: 81, education: 77
        }
    };

    // Chart data functions
    const getBarChartData = (period) => {
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
    };

    const getPieChartData = (period) => {
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
    };

    const getLineChartData = (period) => {
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
    };

    const getAreaChartData = (period) => {
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
    };

    // Chart rendering functions
    useEffect(() => {
        drawBarChart(selectedPeriod);
        drawPieChart(selectedPeriod);
        drawLineChart(selectedPeriod);
        drawAreaChart(selectedPeriod);
    }, [selectedPeriod]);

    const drawBarChart = (period) => {
        const canvas = barChartRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = getBarChartData(period);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
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
            gradient.addColorStop(1, adjustColor(data.colors[index], -20));
            
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
    };

    const drawPieChart = (period) => {
        const canvas = pieChartRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = getPieChartData(period);
        
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
    };

    const drawLineChart = (period) => {
        const canvas = lineChartRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = getLineChartData(period);
        
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
    };

    const drawAreaChart = (period) => {
        const canvas = areaChartRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const data = getAreaChartData(period);
        
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
    };

    const adjustColor = (color, amount) => {
        const num = parseInt(color.replace('#', ''), 16);
        const r = Math.max(0, Math.min(255, (num >> 16) + amount));
        const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
        const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
        return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
    };

    const toggleAccessibility = (setting) => {
        setAccessibility(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    return (
        <div className={`citylisten-app ${accessibility.highContrast ? 'high-contrast' : ''} ${accessibility.largeText ? 'large-text' : ''}`}>
            {/* Header */}
            <header className="app-header">
                <div className="header-content">
                    <div className="logo">
                        <span className="logo-icon">🏙️</span>
                        <h1>CityListen Tulcán</h1>
                    </div>
                    <nav className="main-nav">
                        <button 
                            className={`nav-btn ${currentSection === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setCurrentSection('dashboard')}
                        >
                            <i className="fas fa-home"></i>
                            Dashboard
                        </button>
                        <button 
                            className={`nav-btn ${currentSection === 'map' ? 'active' : ''}`}
                            onClick={() => setCurrentSection('map')}
                        >
                            <i className="fas fa-map"></i>
                            Mapa
                        </button>
                        <button 
                            className={`nav-btn ${currentSection === 'report' ? 'active' : ''}`}
                            onClick={() => setCurrentSection('report')}
                        >
                            <i className="fas fa-plus-circle"></i>
                            Reportar
                        </button>
                        <button 
                            className={`nav-btn ${currentSection === 'stats' ? 'active' : ''}`}
                            onClick={() => setCurrentSection('stats')}
                        >
                            <i className="fas fa-chart-bar"></i>
                            Estadísticas
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {/* Dashboard Section */}
                {currentSection === 'dashboard' && (
                    <section className="dashboard-section">
                        <div className="section-header">
                            <h2>Dashboard de Tulcán</h2>
                            <p>Visión general del bienestar ciudadano</p>
                        </div>
                        
                        <div className="metrics-grid">
                            {Object.entries(cityData.metrics).map(([key, value]) => (
                                <div key={key} className="metric-card">
                                    <div className="metric-icon">
                                        <i className={`fas fa-${getMetricIcon(key)}`}></i>
                                    </div>
                                    <div className="metric-content">
                                        <h3>{getMetricLabel(key)}</h3>
                                        <div className="metric-value">{value}%</div>
                                        <div className="metric-progress">
                                            <div 
                                                className="progress-fill" 
                                                style={{ width: `${value}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Map Section */}
                {currentSection === 'map' && (
                    <section className="map-section">
                        <div className="section-header">
                            <h2>Mapa Interactivo de Tulcán</h2>
                            <p>Reportes en tiempo real por zonas</p>
                        </div>
                        
                        <div className="map-container">
                            <svg className="tulcan-map" viewBox="0 0 800 600">
                                {/* Background */}
                                <rect width="800" height="600" fill="#f0f9ff"/>
                                
                                {/* Zone Paths */}
                                <g id="mapZones">
                                    {Object.entries(cityData.zones).map(([zoneId, zoneData]) => (
                                        <path
                                            key={zoneId}
                                            className={`zone-path ${zoneId}-zone`}
                                            data-zone={zoneId}
                                            d={getZonePath(zoneId)}
                                            fill={zoneData.color}
                                            stroke={zoneData.color}
                                            strokeWidth="2"
                                            opacity="0.8"
                                        />
                                    ))}
                                </g>
                                
                                {/* Zone Labels */}
                                <g id="zoneLabels" className="zone-labels">
                                    {Object.keys(cityData.zones).map((zoneId) => (
                                        <text
                                            key={zoneId}
                                            x={getZoneLabelPosition(zoneId).x}
                                            y={getZoneLabelPosition(zoneId).y}
                                            textAnchor="middle"
                                            className="zone-label"
                                        >
                                            {getZoneLabel(zoneId)}
                                        </text>
                                    ))}
                                </g>
                                
                                {/* Report Points */}
                                <g id="reportPoints" className="report-points">
                                    <circle className="report-pulse" cx="400" cy="275" r="8" fill="#ef4444">
                                        <animate attributeName="r" values="8;15;8" dur="2s" repeatCount="indefinite"/>
                                        <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>
                                    </circle>
                                    <circle className="report-pulse" cx="600" cy="300" r="8" fill="#ef4444">
                                        <animate attributeName="r" values="8;15;8" dur="2.5s" repeatCount="indefinite"/>
                                        <animate attributeName="opacity" values="1;0.3;1" dur="2.5s" repeatCount="indefinite"/>
                                    </circle>
                                </g>
                            </svg>
                        </div>
                    </section>
                )}

                {/* Report Section */}
                {currentSection === 'report' && (
                    <section className="report-section">
                        <div className="section-header">
                            <h2>Reportar Problema</h2>
                            <p>Informa sobre incidencias en tu comunidad</p>
                        </div>
                        
                        <div className="report-form">
                            <div className="form-group">
                                <label htmlFor="category">Categoría</label>
                                <select id="category" className="form-control">
                                    <option value="">Selecciona una categoría</option>
                                    <option value="security">Seguridad Ciudadana</option>
                                    <option value="transport">Transporte Público</option>
                                    <option value="environment">Medio Ambiente</option>
                                    <option value="health">Salud Pública</option>
                                    <option value="services">Servicios Municipales</option>
                                    <option value="tourism">Turismo</option>
                                    <option value="education">Educación</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="zone">Zona</label>
                                <select id="zone" className="form-control">
                                    <option value="">Selecciona una zona</option>
                                    <option value="centro">Centro Histórico</option>
                                    <option value="norte">Zona Norte</option>
                                    <option value="sur">Zona Sur</option>
                                    <option value="este">Zona Este</option>
                                    <option value="oeste">Zona Oeste</option>
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="description">Descripción</label>
                                <textarea 
                                    id="description" 
                                    className="form-control" 
                                    rows="4"
                                    placeholder="Describe el problema detalladamente..."
                                ></textarea>
                            </div>
                            
                            <div className="form-group">
                                <label htmlFor="location">Ubicación (GPS)</label>
                                <input 
                                    type="text" 
                                    id="location" 
                                    className="form-control" 
                                    placeholder="Detectando ubicación..."
                                    readOnly
                                />
                            </div>
                            
                            <button className="submit-btn">
                                <i className="fas fa-paper-plane"></i>
                                Enviar Reporte
                            </button>
                        </div>
                    </section>
                )}

                {/* Statistics Section */}
                {currentSection === 'stats' && (
                    <section className="stats-section">
                        <div className="section-header">
                            <h2>Estadísticas</h2>
                            <p>Análisis de bienestar ciudadano</p>
                        </div>
                        
                        <div className="charts-container">
                            <div className="charts-grid">
                                {/* Bar Chart */}
                                <div className="chart-box">
                                    <h4>Reportes por Categoría</h4>
                                    <canvas 
                                        ref={barChartRef}
                                        width="400" 
                                        height="250"
                                        className="chart-canvas"
                                    ></canvas>
                                </div>
                                
                                {/* Pie Chart */}
                                <div className="chart-box">
                                    <h4>Distribución de Problemas</h4>
                                    <canvas 
                                        ref={pieChartRef}
                                        width="400" 
                                        height="250"
                                        className="chart-canvas"
                                    ></canvas>
                                </div>
                                
                                {/* Line Chart */}
                                <div className="chart-box">
                                    <h4>Tendencia Semanal</h4>
                                    <canvas 
                                        ref={lineChartRef}
                                        width="400" 
                                        height="250"
                                        className="chart-canvas"
                                    ></canvas>
                                </div>
                                
                                {/* Area Chart */}
                                <div className="chart-box">
                                    <h4>Actividad Ciudadana</h4>
                                    <canvas 
                                        ref={areaChartRef}
                                        width="400" 
                                        height="250"
                                        className="chart-canvas"
                                    ></canvas>
                                </div>
                            </div>
                            
                            <div className="chart-controls">
                                <button 
                                    className={`chart-btn ${selectedPeriod === 'day' ? 'active' : ''}`}
                                    onClick={() => handlePeriodChange('day')}
                                >
                                    Hoy
                                </button>
                                <button 
                                    className={`chart-btn ${selectedPeriod === 'week' ? 'active' : ''}`}
                                    onClick={() => handlePeriodChange('week')}
                                >
                                    Semana
                                </button>
                                <button 
                                    className={`chart-btn ${selectedPeriod === 'month' ? 'active' : ''}`}
                                    onClick={() => handlePeriodChange('month')}
                                >
                                    Mes
                                </button>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Accessibility Panel */}
            <div className="accessibility-panel">
                <h3>Accesibilidad</h3>
                <div className="accessibility-controls">
                    <label className="accessibility-toggle">
                        <input 
                            type="checkbox" 
                            checked={accessibility.highContrast}
                            onChange={() => toggleAccessibility('highContrast')}
                        />
                        <span>Alto Contraste</span>
                    </label>
                    <label className="accessibility-toggle">
                        <input 
                            type="checkbox" 
                            checked={accessibility.largeText}
                            onChange={() => toggleAccessibility('largeText')}
                        />
                        <span>Texto Grande</span>
                    </label>
                    <label className="accessibility-toggle">
                        <input 
                            type="checkbox" 
                            checked={accessibility.screenReader}
                            onChange={() => toggleAccessibility('screenReader')}
                        />
                        <span>Modo Lector</span>
                    </label>
                    <label className="accessibility-toggle">
                        <input 
                            type="checkbox" 
                            checked={accessibility.voiceCommands}
                            onChange={() => toggleAccessibility('voiceCommands')}
                        />
                        <span>Comandos de Voz</span>
                    </label>
                    <label className="accessibility-toggle">
                        <input 
                            type="checkbox" 
                            checked={accessibility.reduceMotion}
                            onChange={() => toggleAccessibility('reduceMotion')}
                        />
                        <span>Reducir Movimiento</span>
                    </label>
                </div>
            </div>
        </div>
    );
};

// Helper functions
const getMetricIcon = (key) => {
    const icons = {
        security: 'shield-alt',
        transport: 'bus',
        environment: 'leaf',
        health: 'heartbeat',
        services: 'cogs',
        tourism: 'camera',
        education: 'graduation-cap'
    };
    return icons[key] || 'chart-bar';
};

const getMetricLabel = (key) => {
    const labels = {
        security: 'Seguridad',
        transport: 'Transporte',
        environment: 'Ambiente',
        health: 'Salud',
        services: 'Servicios',
        tourism: 'Turismo',
        education: 'Educación'
    };
    return labels[key] || key;
};

const getZonePath = (zoneId) => {
    const paths = {
        centro: 'M 300 200 L 500 200 L 500 350 L 300 350 Z',
        norte: 'M 200 50 L 350 50 L 350 200 L 200 200 Z',
        sur: 'M 450 350 L 650 350 L 650 500 L 450 500 Z',
        este: 'M 500 200 L 700 200 L 700 400 L 500 400 Z',
        oeste: 'M 100 200 L 300 200 L 300 400 L 100 400 Z'
    };
    return paths[zoneId] || '';
};

const getZoneLabel = (zoneId) => {
    const labels = {
        centro: 'Centro Histórico',
        norte: 'Zona Norte',
        sur: 'Zona Sur',
        este: 'Zona Este',
        oeste: 'Zona Oeste'
    };
    return labels[zoneId] || '';
};

const getZoneLabelPosition = (zoneId) => {
    const positions = {
        centro: { x: 400, y: 275 },
        norte: { x: 275, y: 125 },
        sur: { x: 550, y: 425 },
        este: { x: 600, y: 300 },
        oeste: { x: 200, y: 300 }
    };
    return positions[zoneId] || { x: 0, y: 0 };
};

export default CityListenApp;
