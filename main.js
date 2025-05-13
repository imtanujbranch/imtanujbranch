// --- DOM Element Selection ---
const dslInput = document.getElementById('dslInput');
const lineNumbersDiv = document.getElementById('lineNumbers');
const wordWrapToggle = document.getElementById('wordWrapToggle');
const renderButton = document.getElementById('renderButton');
const chartPlaceholder = document.getElementById('chartPlaceholder');
const errorMessage = document.getElementById('errorMessage');
const exportPngButton = document.getElementById('exportPngButton');
const themeToggle = document.getElementById('themeToggle');
const themeIconSun = document.getElementById('themeIconSun');
const themeIconMoon = document.getElementById('themeIconMoon');
const htmlElement = document.documentElement;
const generatedCodeDisplay = document.getElementById('generatedCodeDisplay').querySelector('code');
const copyWebCodeButton = document.getElementById('copyWebCodeButton');
const copyMessage = document.getElementById('copyMessage');

// --- Global Variables ---
let currentChart = null;
let currentChartConfig = null;

// --- Editor Line Number Logic ---
function updateLineNumbers() {
    if (!dslInput || !lineNumbersDiv) return;

    const lines = dslInput.value.split('\n');
    let lineNumbersHTML = '';
    for (let i = 0; i < lines.length; i++) {
        lineNumbersHTML += `<div>${i + 1}</div>`;
    }
    lineNumbersDiv.innerHTML = lineNumbersHTML;
    lineNumbersDiv.scrollTop = dslInput.scrollTop;
}

if (dslInput) {
    dslInput.addEventListener('input', updateLineNumbers);
    dslInput.addEventListener('scroll', updateLineNumbers);
    window.addEventListener('resize', updateLineNumbers);
}

// --- Word Wrap Logic ---
function applyWordWrap(enabled) {
    if (dslInput) {
        if (enabled) {
            dslInput.classList.add('word-wrap-on');
            dslInput.classList.remove('word-wrap-off');
        } else {
            dslInput.classList.add('word-wrap-off');
            dslInput.classList.remove('word-wrap-on');
        }
        localStorage.setItem('wordWrap', enabled);
        updateLineNumbers();
    }
}

if (wordWrapToggle) {
    wordWrapToggle.addEventListener('change', () => {
        applyWordWrap(wordWrapToggle.checked);
    });
}

const savedWordWrap = localStorage.getItem('wordWrap');
if (savedWordWrap !== null) {
    const isWordWrapEnabled = savedWordWrap === 'true';
    if (wordWrapToggle) wordWrapToggle.checked = isWordWrapEnabled;
    applyWordWrap(isWordWrapEnabled);
} else {
    applyWordWrap(false);
    if (wordWrapToggle) wordWrapToggle.checked = false;
}

// --- Theme Handling Logic ---
function applyTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
        htmlElement.classList.remove('light');
        themeIconSun.classList.remove('hidden');
        themeIconMoon.classList.add('hidden');
    } else {
        htmlElement.classList.remove('dark');
        htmlElement.classList.add('light');
        themeIconSun.classList.add('hidden');
        themeIconMoon.classList.remove('hidden');
    }
    localStorage.setItem('theme', theme);
    updateChartTheme();
    updateLineNumbers();
}

themeToggle.addEventListener('click', () => {
    const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(newTheme);
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    applyTheme(savedTheme);
} else {
    applyTheme('light');
}

Chart.defaults.font.family = "'Inter', sans-serif";

function getChartThemeColors(isDarkMode) {
    if (isDarkMode) {
        return {
            tickColor: '#afbac7',
            gridColor: 'rgba(175, 186, 199, 0.1)',
            titleColor: '#cdd5df',
            legendColor: '#cdd5df',
            axisTitleColor: '#afbac7',
            defaultDatasetBg: 'rgba(88, 166, 255, 0.6)',
            defaultDatasetBorder: '#58a6ff',
            svgTextColor: '#cdd5df',
            svgAxisColor: 'rgba(175, 186, 199, 0.5)'
        };
    } else {
        return {
            tickColor: '#495057',
            gridColor: 'rgba(0, 0, 0, 0.08)',
            titleColor: '#212529',
            legendColor: '#212529',
            axisTitleColor: '#495057',
            defaultDatasetBg: 'rgba(14, 165, 233, 0.6)',
            defaultDatasetBorder: '#0ea5e9',
            svgTextColor: '#212529',
            svgAxisColor: 'rgba(0, 0, 0, 0.2)'
        };
    }
}

function getDefaultChartOptions(isDarkMode) {
    const chartColors = getChartThemeColors(isDarkMode);
    return {
        responsive: true,
        maintainAspectRatio: false,
        font: { family: "'Inter', sans-serif", weight: '400' },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: false, text: '', color: chartColors.axisTitleColor, font: { size: 13, weight: '500', family: "'Inter', sans-serif"}},
                ticks: { color: chartColors.tickColor, font: { size: 12, weight: '400', family: "'Inter', sans-serif" } },
                grid: { color: chartColors.gridColor }
            },
            x: {
                title: { display: false, text: '', color: chartColors.axisTitleColor, font: { size: 13, weight: '500', family: "'Inter', sans-serif"}},
                ticks: { color: chartColors.tickColor, font: {size: 12, weight: '400', family: "'Inter', sans-serif" }},
                grid: { color: chartColors.gridColor, display: false }
            }
        },
        plugins: {
            title: {
                display: false,
                text: 'Chart Title',
                color: chartColors.titleColor,
                font: { size: 15, weight: '600', family: "'Inter', sans-serif" }
            },
            legend: {
                labels: { color: chartColors.legendColor, font: {size: 12, weight: '500', family: "'Inter', sans-serif"} }
            },
            tooltip: {
                titleFont: { family: "'Inter', sans-serif", weight: '600', size: 13 },
                bodyFont: { family: "'Inter', sans-serif", weight: '400', size: 12 },
                footerFont: { family: "'Inter', sans-serif", weight: '400' },
                boxPadding: 4,
                backgroundColor: isDarkMode ? 'rgba(23, 33, 44, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                titleColor: isDarkMode ? '#cdd5df' : '#212529',
                bodyColor: isDarkMode ? '#afbac7' : '#495057',
                borderColor: isDarkMode ? 'rgba(175, 186, 199,0.1)' : 'rgba(0,0,0,0.1)',
                borderWidth: 1
            }
        }
    };
}

function getChartTypeDefaults(chartType, isDarkMode) {
    const chartColors = getChartThemeColors(isDarkMode);
    const defaults = {
        type: chartType.toLowerCase(),
        data: {
            labels: [],
            datasets: [{
                label: 'Dataset',
                data: [],
                backgroundColor: chartColors.defaultDatasetBg,
                borderColor: chartColors.defaultDatasetBorder,
                borderWidth: 1
            }]
        }
    };

    switch (defaults.type) {
        case 'line':
            defaults.data.datasets[0].fill = false;
            defaults.data.datasets[0].tension = 0.1;
            break;
        case 'pie':
        case 'doughnut':
        case 'polararea':
            defaults.data.datasets[0].borderWidth = 2;
            break;
        case 'radar':
            defaults.data.datasets[0].fill = true;
            defaults.data.datasets[0].backgroundColor = chartColors.defaultDatasetBg.replace(/0.6\)$/, '0.4)');
            break;
    }
    return defaults;
}

function updateChartTheme() {
    if (currentChart && currentChartConfig) {
        const isDarkMode = htmlElement.classList.contains('dark');
        const newOptions = getDefaultChartOptions(isDarkMode);
        if (currentChartConfig.type === 'pie' || currentChartConfig.type === 'doughnut' || currentChartConfig.type === 'polararea') {
            newOptions.scales = undefined;
        }
        currentChartConfig.options = newOptions;

        const chartTypeDefaults = getChartTypeDefaults(currentChartConfig.type, isDarkMode);
        if (currentChartConfig.data.datasets && currentChartConfig.data.datasets.length > 0) {
            const oldThemeChartColors = getChartThemeColors(!isDarkMode);
            if (currentChartConfig.data.datasets[0].backgroundColor === oldThemeChartColors.defaultDatasetBg ||
                JSON.stringify(currentChartConfig.data.datasets[0].backgroundColor) === JSON.stringify(oldThemeChartColors.defaultDatasetBg) ||
                Array.isArray(currentChartConfig.data.datasets[0].backgroundColor)) {
                currentChartConfig.data.datasets[0].backgroundColor = chartTypeDefaults.data.datasets[0].backgroundColor;
            }
            if (currentChartConfig.data.datasets[0].borderColor === oldThemeChartColors.defaultDatasetBorder ||
                JSON.stringify(currentChartConfig.data.datasets[0].borderColor) === JSON.stringify(oldThemeChartColors.defaultDatasetBorder) ||
                Array.isArray(currentChartConfig.data.datasets[0].borderColor)) {
                currentChartConfig.data.datasets[0].borderColor = chartTypeDefaults.data.datasets[0].borderColor;
            }
        }
        renderChart(currentChartConfig);
    }
}

// --- SVG Generation Functions ---
function polarToCartesian(cx, cy, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: cx + (radius * Math.cos(angleInRadians)),
        y: cy + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    const d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "L", x, y,
        "Z"
    ].join(" ");
    return d;
}

function generateBarSvg(chartConfig, dimensions) {
    const { svgWidth, svgHeight, margin, chartWidth, chartHeight, themeColors } = dimensions;
    const data = chartConfig.data.datasets[0].data;
    const labels = chartConfig.data.labels;
    const backgroundColors = chartConfig.data.datasets[0].backgroundColor;
    const borderColors = chartConfig.data.datasets[0].borderColor;
    const borderWidth = chartConfig.data.datasets[0].borderWidth || 1;

    if (!data || data.length === 0) return '';

    const maxValue = Math.max(0, ...data);
    const minValue = 0;
    const valueRange = maxValue - minValue;
    const barPadding = 0.2;
    const barWidth = chartWidth / data.length * (1 - barPadding);
    const barSpacing = (chartWidth / data.length * barPadding) / 2;

    let svgElements = '';
    data.forEach((d, i) => {
        const barHeight = ((d - minValue) / (valueRange || 1)) * chartHeight;
        const x = margin.left + i * (barWidth + 2 * barSpacing) + barSpacing;
        const y = margin.top + chartHeight - barHeight;
        const fill = Array.isArray(backgroundColors) ? (backgroundColors[i] || themeColors.defaultDatasetBg) : backgroundColors;
        const stroke = Array.isArray(borderColors) ? (borderColors[i] || themeColors.defaultDatasetBorder) : borderColors;

        svgElements += `<rect x="${x}" y="${y}" width="${barWidth}" height="${Math.max(0, barHeight)}" fill="${fill}" stroke="${stroke}" stroke-width="${borderWidth}"/>\n`;
    });

    return svgElements;
}

function generateLineSvg(chartConfig, dimensions) {
    const { svgWidth, svgHeight, margin, chartWidth, chartHeight, themeColors } = dimensions;
    const data = chartConfig.data.datasets[0].data;
    const labels = chartConfig.data.labels;
    const borderColor = chartConfig.data.datasets[0].borderColor || themeColors.defaultDatasetBorder;
    const backgroundColor = chartConfig.data.datasets[0].backgroundColor || themeColors.defaultDatasetBg;
    const borderWidth = chartConfig.data.datasets[0].borderWidth || 2;

    if (!data || data.length === 0) return '';

    const maxValue = Math.max(0, ...data);
    const minValue = Math.min(0, ...data);
    const yRange = maxValue - minValue;

    let points = "";
    data.forEach((d, i) => {
        const x = margin.left + (i / (data.length - 1)) * chartWidth;
        const y = margin.top + chartHeight - ((d - minValue) / (yRange || 1)) * chartHeight;
        points += `${x},${y} `;
    });

    let svgElements = `<polyline points="${points.trim()}" fill="none" stroke="${Array.isArray(borderColor) ? borderColor[0] : borderColor}" stroke-width="${borderWidth}"/>\n`;

    data.forEach((d, i) => {
        const x = margin.left + (i / (data.length - 1)) * chartWidth;
        const y = margin.top + chartHeight - ((d - minValue) / (yRange || 1)) * chartHeight;
        const pointFill = Array.isArray(backgroundColor) ? (backgroundColor[i] || (Array.isArray(borderColor) ? borderColor[0] : borderColor)) : (backgroundColor || (Array.isArray(borderColor) ? borderColor[0] : borderColor));
        svgElements += `<circle cx="${x}" cy="${y}" r="3" fill="${pointFill}" stroke="${Array.isArray(borderColor) ? borderColor[0] : borderColor}" stroke-width="1"/>\n`;
    });

    if (labels && labels.length > 0) {
        data.forEach((d, i) => {
            if (labels[i]) {
                const x = margin.left + (i / (data.length - 1)) * chartWidth;
                svgElements += `<text x="${x}" y="${margin.top + chartHeight + 20}" fill="${themeColors.svgTextColor}" font-size="10" text-anchor="middle">${labels[i]}</text>\n`;
            }
        });
    }
    return svgElements;
}

function generatePieSvg(chartConfig, dimensions) {
    const { svgWidth, svgHeight, margin, themeColors } = dimensions;
    const data = chartConfig.data.datasets[0].data;
    const labels = chartConfig.data.labels;
    const backgroundColors = chartConfig.data.datasets[0].backgroundColor;
    const borderColors = chartConfig.data.datasets[0].borderColor;
    const borderWidth = chartConfig.data.datasets[0].borderWidth || 1;

    if (!data || data.length === 0) return '';

    const total = data.reduce((sum, val) => sum + val, 0);
    if (total === 0) return '';

    const cx = svgWidth / 2;
    const cy = (svgHeight - margin.bottom + margin.top) / 2;
    const pieRadius = Math.min(cx - margin.left, cy - margin.top) * 0.8;

    let svgElements = '';
    let currentAngle = 0;

    data.forEach((value, i) => {
        const sliceAngle = (value / total) * 360;
        const fill = Array.isArray(backgroundColors) ? (backgroundColors[i] || themeColors.defaultDatasetBg) : backgroundColors;
        const stroke = Array.isArray(borderColors) ? (borderColors[i] || themeColors.defaultDatasetBorder) : borderColors;

        if (value > 0) {
            svgElements += `<path d="${describeArc(cx, cy, pieRadius, currentAngle, currentAngle + sliceAngle)}" fill="${fill}" stroke="${stroke}" stroke-width="${borderWidth}"/>\n`;
        }
        currentAngle += sliceAngle;
    });

    // Add legend
    const legendYStart = cy + pieRadius + 30;
    const legendItemHeight = 20;
    const legendRectSize = 10;
    labels.forEach((label, i) => {
        const fill = Array.isArray(backgroundColors) ? (backgroundColors[i] || themeColors.defaultDatasetBg) : backgroundColors;
        const yPos = legendYStart + i * legendItemHeight;
        svgElements += `<rect x="${margin.left}" y="${yPos - legendRectSize}" width="${legendRectSize}" height="${legendRectSize}" fill="${fill}" />\n`;
        svgElements += `<text x="${margin.left + legendRectSize + 5}" y="${yPos - legendRectSize / 2 + 4}" fill="${themeColors.svgTextColor}" font-size="12">${label} (${((data[i]/total)*100).toFixed(1)}%)</text>\n`;
    });

    return svgElements;
}

function generatePolarAreaSvg(chartConfig, dimensions) {
    const { svgWidth, svgHeight, margin, themeColors } = dimensions;
    const data = chartConfig.data.datasets[0].data;
    const labels = chartConfig.data.labels;
    const backgroundColors = chartConfig.data.datasets[0].backgroundColor;
    const borderColors = chartConfig.data.datasets[0].borderColor;
    const borderWidth = chartConfig.data.datasets[0].borderWidth || 1;

    if (!data || data.length === 0) return '';

    const numSegments = data.length;
    const anglePerSegment = 360 / numSegments;
    const maxValue = Math.max(0, ...data);

    const cx = svgWidth / 2;
    const cy = (svgHeight - margin.bottom + margin.top) / 2;
    const maxRadius = Math.min(cx - margin.left, cy - margin.top) * 0.8;

    let svgElements = '';
    let currentAngle = 0;

    data.forEach((value, i) => {
        const segmentRadius = (value / maxValue) * maxRadius;
        const fill = Array.isArray(backgroundColors) ? (backgroundColors[i] || themeColors.defaultDatasetBg) : backgroundColors;
        const stroke = Array.isArray(borderColors) ? (borderColors[i] || themeColors.defaultDatasetBorder) : borderColors;

        if (value > 0) {
            svgElements += `<path d="${describeArc(cx, cy, segmentRadius, currentAngle, currentAngle + anglePerSegment)}" fill="${fill}" stroke="${stroke}" stroke-width="${borderWidth}"/>\n`;
        }
        currentAngle += anglePerSegment;
    });

    // Add legend
    const legendYStart = cy + maxRadius + 30;
    const legendItemHeight = 20;
    const legendRectSize = 10;
    labels.forEach((label, i) => {
        const fill = Array.isArray(backgroundColors) ? (backgroundColors[i] || themeColors.defaultDatasetBg) : backgroundColors;
        const yPos = legendYStart + i * legendItemHeight;
        svgElements += `<rect x="${margin.left}" y="${yPos - legendRectSize}" width="${legendRectSize}" height="${legendRectSize}" fill="${fill}" />\n`;
        svgElements += `<text x="${margin.left + legendRectSize + 5}" y="${yPos - legendRectSize / 2 + 4}" fill="${themeColors.svgTextColor}" font-size="12">${label} (${data[i]})</text>\n`;
    });

    return svgElements;
}

function generateYAxis(chartConfig, dimensions) {
    const { svgWidth, svgHeight, margin, chartWidth, chartHeight, themeColors } = dimensions;
    const data = chartConfig.data.datasets[0].data;
    if (!data || data.length === 0) return '';

    const maxValue = Math.max(0, ...data);
    const minValue = chartConfig.type === 'line' ? Math.min(0, ...data) : 0;
    const yRange = maxValue - minValue;
    const yAxisLabelText = chartConfig.options.scales?.y?.title?.display ? chartConfig.options.scales.y.title.text : '';

    let elements = `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartHeight}" stroke="${themeColors.svgAxisColor}" stroke-width="1"/>\n`;

    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
        const tickValue = minValue + (yRange / numTicks) * i;
        const tickY = margin.top + chartHeight - ((tickValue - minValue) / (yRange || 1)) * chartHeight;
        elements += `<line x1="${margin.left - 5}" y1="${tickY}" x2="${margin.left}" y2="${tickY}" stroke="${themeColors.svgAxisColor}" stroke-width="1"/>\n`;
        elements += `<text x="${margin.left - 10}" y="${tickY + 4}" fill="${themeColors.svgTextColor}" font-size="10" text-anchor="end">${tickValue.toLocaleString()}</text>\n`;
    }

    if (yAxisLabelText) {
        const labelX = margin.left / 2;
        const labelY = margin.top + chartHeight / 2;
        elements += `<text x="${labelX}" y="${labelY}" fill="${themeColors.svgTextColor}" font-size="12" font-weight="500" transform="rotate(-90, ${labelX}, ${labelY}) translate(0, -5)" text-anchor="middle">${yAxisLabelText}</text>\n`;
    }

    return elements;
}

function generateXAxis(chartConfig, dimensions) {
    const { svgWidth, svgHeight, margin, chartWidth, chartHeight, themeColors } = dimensions;
    const xAxisLabelText = chartConfig.options.scales?.x?.title?.display ? chartConfig.options.scales.x.title.text : '';
    const labels = chartConfig.data.labels;

    let elements = `<line x1="${margin.left}" y1="${margin.top + chartHeight}" x2="${margin.left + chartWidth}" y2="${margin.top + chartHeight}" stroke="${themeColors.svgAxisColor}" stroke-width="1"/>\n`;

    if (xAxisLabelText) {
        const labelX = margin.left + chartWidth / 2;
        const labelY = svgHeight - margin.bottom / 2;
        elements += `<text x="${labelX}" y="${labelY}" fill="${themeColors.svgTextColor}" font-size="12" font-weight="500" text-anchor="middle">${xAxisLabelText}</text>\n`;
    }

    if (labels && labels.length > 0) {
        const tickSpacing = chartWidth / (labels.length - 1);
        labels.forEach((label, i) => {
            const x = margin.left + (i * tickSpacing);
            elements += `<line x1="${x}" y1="${margin.top + chartHeight}" x2="${x}" y2="${margin.top + chartHeight + 5}" stroke="${themeColors.svgAxisColor}" stroke-width="1"/>\n`;
            elements += `<text x="${x}" y="${margin.top + chartHeight + 20}" fill="${themeColors.svgTextColor}" font-size="10" text-anchor="middle" transform="rotate(-45, ${x}, ${margin.top + chartHeight + 20})">${label}</text>\n`;
        });
    }

    return elements;
}

function generateSvgChartCode(chartConfig, isDarkMode) {
    if (!chartConfig || !chartConfig.data || !chartConfig.data.datasets || chartConfig.data.datasets.length === 0) {
        return '';
    }

    const chartType = chartConfig.type;
    const themeColors = getChartThemeColors(isDarkMode);

    const svgWidth = 600;
    const svgHeight = 400;
    const margin = {
        top: 50,
        right: 30,
        bottom: 70,
        left: 80
    };
    const chartWidth = svgWidth - margin.left - margin.right;
    const chartHeight = svgHeight - margin.top - margin.bottom;

    const chartTitle = chartConfig.options.plugins.title.display ? chartConfig.options.plugins.title.text : '';
    const datasetLabel = chartConfig.data.datasets[0].label || 'Dataset';
    const backgroundColors = chartConfig.data.datasets[0].backgroundColor;

    const dimensions = {
        svgWidth,
        svgHeight,
        margin,
        chartWidth,
        chartHeight,
        themeColors,
        isDarkMode
    };

    let chartSpecificSvg = '';
    let yAxisElements = '';
    let xAxisElements = '';

    if (chartType === 'bar') {
        yAxisElements = generateYAxis(chartConfig, dimensions);
        xAxisElements = generateXAxis(chartConfig, dimensions);
        chartSpecificSvg = generateBarSvg(chartConfig, dimensions);
    } else if (chartType === 'line') {
        yAxisElements = generateYAxis(chartConfig, dimensions);
        xAxisElements = generateXAxis(chartConfig, dimensions);
        chartSpecificSvg = generateLineSvg(chartConfig, dimensions);
    } else if (chartType === 'pie' || chartType === 'doughnut') {
        chartSpecificSvg = generatePieSvg(chartConfig, dimensions);
        if(chartType === 'doughnut') {
            const cx = svgWidth / 2;
            const cy = (svgHeight - margin.bottom + margin.top) / 2;
            const innerRadius = Math.min(cx - margin.left, cy - margin.top) * 0.8 * 0.5;
            chartSpecificSvg += `<circle cx="${cx}" cy="${cy}" r="${innerRadius}" fill="${isDarkMode ? '#0b131a' : '#f8f9fa'}" />\n`;
        }
    } else if (chartType === 'polararea') {
        chartSpecificSvg = generatePolarAreaSvg(chartConfig, dimensions);
    } else {
        chartSpecificSvg = `<text x="${svgWidth/2}" y="${svgHeight/2}" fill="${themeColors.svgTextColor}" text-anchor="middle">SVG generation for '${chartType}' charts is coming soon.</text>`;
    }

    let titleSvg = '';
    if (chartTitle) {
        titleSvg = `<text x="${svgWidth / 2}" y="${margin.top / 2 + 5}" fill="${themeColors.svgTextColor}" font-size="16" font-weight="600" text-anchor="middle">${chartTitle}</text>\n`;
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SVG Chart: ${chartTitle || 'Generated Chart'}</title>
    <style>
        body { margin: 20px; font-family: 'Inter', sans-serif; background-color: ${isDarkMode ? '#0d1a26' : '#f8f9fa'}; display: flex; justify-content: center; align-items: center;}
        svg { background-color: ${isDarkMode ? '#0b131a' : '#f8f9fa'}; border-radius: 6px; }
    </style>
</head>
<body>
    <svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">
        ${titleSvg}
        ${yAxisElements}
        ${xAxisElements}
        ${chartSpecificSvg}
    </svg>
</body>
</html>`;
}

function parseDSL(dsl) {
    const lines = dsl.trim().split('\n');
    const isDarkMode = htmlElement.classList.contains('dark');

    let chartType = 'bar';
    for (const line of lines) {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim().toUpperCase();
            if (key === 'TYPE') {
                chartType = parts.slice(1).join(':').trim().toLowerCase();
                break;
            }
        }
    }
    if (!['bar', 'line', 'pie', 'doughnut', 'radar', 'polararea'].includes(chartType)) {
        throw new Error(`Unsupported chart type in DSL: ${chartType}. Valid types are bar, line, pie, doughnut, radar, polararea.`);
    }

    let config = getChartTypeDefaults(chartType, isDarkMode);
    config.options = getDefaultChartOptions(isDarkMode);
    if (chartType === 'pie' || chartType === 'doughnut' || chartType === 'polararea' || chartType === 'radar') {
        config.options.scales = undefined;
    }

    let currentDataset = config.data.datasets[0];

    lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length < 2) return;

        const key = parts[0].trim().toUpperCase();
        const value = parts.slice(1).join(':').trim();

        try {
            switch (key) {
                case 'TYPE':
                    break;
                case 'TITLE':
                    config.options.plugins.title.display = true;
                    config.options.plugins.title.text = value.replace(/^"|"$/g, '');
                    break;
                case 'X_AXIS_LABEL':
                    if (config.options.scales && config.options.scales.x) {
                        config.options.scales.x.title.display = true;
                        config.options.scales.x.title.text = value.replace(/^"|"$/g, '');
                    }
                    break;
                case 'Y_AXIS_LABEL':
                    if (config.options.scales && config.options.scales.y) {
                        config.options.scales.y.title.display = true;
                        config.options.scales.y.title.text = value.replace(/^"|"$/g, '');
                    }
                    break;
                case 'LABELS':
                    config.data.labels = JSON.parse(value);
                    if (!Array.isArray(config.data.labels)) throw new Error("LABELS must be a valid JSON array.");
                    break;
                case 'DATASET_LABEL':
                    currentDataset.label = value.replace(/^"|"$/g, '');
                    break;
                case 'DATA':
                    const parsedData = JSON.parse(value);
                    if (!Array.isArray(parsedData) || parsedData.some(item => typeof item !== 'number' || isNaN(item))) {
                        throw new Error("DATA must be a valid JSON array of numbers.");
                    }
                    currentDataset.data = parsedData;
                    break;
                case 'BACKGROUND_COLOR':
                    const bgColors = JSON.parse(value);
                    if (!Array.isArray(bgColors)) throw new Error("BACKGROUND_COLOR must be a JSON array.");
                    currentDataset.backgroundColor = bgColors;
                    break;
                case 'BORDER_COLOR':
                    const borderColors = JSON.parse(value);
                    if (!Array.isArray(borderColors)) throw new Error("BORDER_COLOR must be a JSON array.");
                    currentDataset.borderColor = borderColors;
                    break;
                case 'BORDER_WIDTH':
                    currentDataset.borderWidth = parseFloat(value);
                    if (isNaN(currentDataset.borderWidth)) {
                        throw new Error("BORDER_WIDTH must be a number.");
                    }
                    break;
                default:
                    console.warn(`Unknown DSL key: ${key}`);
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                throw new Error(`Error parsing value for ${key}: "${value}". Expected valid JSON. Details: ${e.message}`);
            }
            throw new Error(`Error processing line "${line}": ${e.message}`);
        }
    });

    if (config.data.labels.length === 0 && ['bar', 'line', 'radar', 'pie', 'doughnut', 'polararea'].includes(config.type)) {
        throw new Error("LABELS are required for this chart type.");
    }
    if (currentDataset.data.length === 0) {
        throw new Error("DATA is required.");
    }
    return config;
}

function renderChart(chartConfigToRender) {
    const canvas = document.getElementById('myChart');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';

    if (currentChart) {
        currentChart.destroy();
    }
    currentChart = new Chart(ctx, chartConfigToRender);
}

// Event Listeners
renderButton.addEventListener('click', () => {
    const dslText = dslInput.value;
    errorMessage.textContent = '';
    copyMessage.textContent = '';
    try {
        currentChartConfig = parseDSL(dslText);
        renderChart(currentChartConfig);
        chartPlaceholder.style.display = 'none';
        exportPngButton.classList.remove('hidden');

        const isDarkMode = htmlElement.classList.contains('dark');
        const svgWebCode = generateSvgChartCode(currentChartConfig, isDarkMode);
        generatedCodeDisplay.textContent = svgWebCode;
        copyWebCodeButton.classList.remove('hidden');

    } catch (error) {
        console.error("DSL Parsing/Rendering Error:", error);
        errorMessage.textContent = `Error: ${error.message}`;
        if (currentChart) {
            currentChart.destroy();
            currentChart = null;
        }
        currentChartConfig = null;
        chartPlaceholder.style.display = 'block';
        document.getElementById('myChart').style.display = 'none';
        exportPngButton.classList.add('hidden');
        generatedCodeDisplay.textContent = '';
        copyWebCodeButton.classList.add('hidden');
    }
});

copyWebCodeButton.addEventListener('click', () => {
    if (generatedCodeDisplay.textContent) {
        navigator.clipboard.writeText(generatedCodeDisplay.textContent)
            .then(() => {
                copyMessage.textContent = 'Code copied to clipboard!';
                setTimeout(() => { copyMessage.textContent = ''; }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy code: ', err);
                copyMessage.textContent = 'Failed to copy!';
                setTimeout(() => { copyMessage.textContent = ''; }, 2000);
            });
    }
});

exportPngButton.addEventListener('click', () => {
    if (currentChart && currentChartConfig) {
        const originalImage = new Image();
        originalImage.onload = () => {
            const tempCanvas = document.createElement('canvas');
            const dpr = window.devicePixelRatio || 1;
            const padding = 30;

            const chartContentWidth = currentChart.canvas.width / dpr;
            const chartContentHeight = currentChart.canvas.height / dpr;

            tempCanvas.width = chartContentWidth + 2 * padding;
            tempCanvas.height = chartContentHeight + 2 * padding;

            const tempCtx = tempCanvas.getContext('2d');
            const isDarkMode = htmlElement.classList.contains('dark');

            const mainExportBgColor = isDarkMode ? '#0d1a26' : '#f8f9fa';
            tempCtx.fillStyle = mainExportBgColor;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            const chartAreaX = padding;
            const chartAreaY = padding;
            const chartAreaWidth = chartContentWidth;
            const chartAreaHeight = chartContentHeight;

            const chartInnerBgColor = isDarkMode ? '#0b131a' : '#f8f9fa';
            tempCtx.fillStyle = chartInnerBgColor;

            tempCtx.shadowColor = isDarkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)';
            tempCtx.shadowBlur = 10;
            tempCtx.shadowOffsetX = 0;
            tempCtx.shadowOffsetY = 4;

            const borderRadius = 6;
            tempCtx.beginPath();
            tempCtx.moveTo(chartAreaX + borderRadius, chartAreaY);
            tempCtx.lineTo(chartAreaX + chartAreaWidth - borderRadius, chartAreaY);
            tempCtx.quadraticCurveTo(chartAreaX + chartAreaWidth, chartAreaY, chartAreaX + chartAreaWidth, chartAreaY + borderRadius);
            tempCtx.lineTo(chartAreaX + chartAreaWidth, chartAreaY + chartAreaHeight - borderRadius);
            tempCtx.quadraticCurveTo(chartAreaX + chartAreaWidth, chartAreaY + chartAreaHeight, chartAreaX + chartAreaWidth - borderRadius, chartAreaY + chartAreaHeight);
            tempCtx.lineTo(chartAreaX + borderRadius, chartAreaY + chartAreaHeight);
            tempCtx.quadraticCurveTo(chartAreaX, chartAreaY + chartAreaHeight, chartAreaX, chartAreaY + chartAreaHeight - borderRadius);
            tempCtx.lineTo(chartAreaX, chartAreaY + borderRadius);
            tempCtx.quadraticCurveTo(chartAreaX, chartAreaY, chartAreaX + borderRadius, chartAreaY);
            tempCtx.closePath();
            tempCtx.fill();

            tempCtx.shadowColor = 'transparent';

            tempCtx.clip();

            tempCtx.drawImage(originalImage, chartAreaX, chartAreaY, chartAreaWidth, chartAreaHeight);

            tempCtx.restore();

            const fileName = (currentChartConfig.options.plugins.title.text && currentChartConfig.options.plugins.title.display ? currentChartConfig.options.plugins.title.text : 'chart')
                .replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';

            const imageURIWithBg = tempCanvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = imageURIWithBg;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
        originalImage.src = currentChart.toBase64Image('image/png', 1.0);
    } else {
        errorMessage.textContent = "No chart available to export.";
    }
});

// Initial render and line number update on page load
renderButton.click();
updateLineNumbers(); 