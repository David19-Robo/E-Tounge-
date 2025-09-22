// E--Toungue with chat bot and desire colour range
// Simple navigation active state management


document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // Initialize charts
    let tasteChart = null;
    initializeCharts();
    
    // Graph type buttons
    const graphButtons = document.querySelectorAll('.graph-btn');
    graphButtons.forEach(button => {
        button.addEventListener('click', function() {
            graphButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const graphType = this.getAttribute('data-graph');
            updateChartType(graphType);
        });
    });

    // Working principle step interaction
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', function() {
            // Close all other steps
            steps.forEach(s => {
                if (s !== this) {
                    s.classList.remove('active');
                }
            });
            
            // Toggle current step
            this.classList.toggle('active');
        });
    });

    // Chat Bot Functionality
    const chatBotButton = document.querySelector('.chat-bot-button');
    const chatBotWindow = document.querySelector('.chat-bot-window');
    const chatBotClose = document.querySelector('.chat-bot-close');
    const chatInput = document.querySelector('.chat-bot-input input');
    const chatSendButton = document.querySelector('.chat-bot-input button');
    const chatMessages = document.querySelector('.chat-bot-messages');
    const typingIndicator = document.querySelector('.typing-indicator');

    // Toggle chat window
    chatBotButton.addEventListener('click', () => {
        chatBotWindow.style.display = 'flex';
    });

    // Close chat window
    chatBotClose.addEventListener('click', () => {
        chatBotWindow.style.display = 'none';
    });

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            addMessage(message, 'user');
            chatInput.value = '';
            
            // Show typing indicator
            typingIndicator.style.display = 'flex';
            
            // Get response from Gemini API
            getGeminiResponse(message);
        }
    }

    // Send message on button click
    chatSendButton.addEventListener('click', sendMessage);

    // Send message on Enter key
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add message to chat
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender + '-message');
        messageElement.textContent = text;
        
        // Insert before typing indicator
        chatMessages.insertBefore(messageElement, typingIndicator);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Get response from Gemini API
    async function getGeminiResponse(userMessage) {
        try {
            // Replace with your actual Gemini API key
            const API_KEY = 'AIzaSyC8T2ou33xYuEm1_KsOonU6nxXRFtRJqRQ';
            // Updated API URL for Gemini Flash model
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            
            // Prepare the request
            const requestBody = {
                contents: [{
                    parts: [{
                        text: `You are an assistant for an E-Tongue (Electronic Tongue) project. 
                        The project involves detecting and analyzing liquid taste profiles using sensors and electronic signal processing.
                        Here's information about the project:
                        ${document.querySelector('.intro-text').textContent}
                        
                        Working principle: Sample Collection → Signal Acquisition → Signal Processing → Pattern Recognition.
                        
                        Applications: Food & Beverage Industry, Pharmaceuticals, Environmental Monitoring, Research & Development.
                        
                        The user asked: "${userMessage}"
                        
                        Provide a helpful response about the E-Tongue project.provide within 25 words`
                    }]
                }]
            };
            
            // Make the API call
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            // Hide typing indicator
            typingIndicator.style.display = 'none';
            
            // Extract and display the response text
            if (data.candidates && data.candidates[0].content.parts[0].text) {
                const botResponse = data.candidates[0].content.parts[0].text;
                addMessage(botResponse, 'bot');
            } else {
                addMessage("I'm having trouble connecting to the knowledge base. Please try again later.", 'bot');
            }
        } catch (error) {
            // Hide typing indicator
            typingIndicator.style.display = 'none';
            
            // Fallback responses if API fails
            const fallbackResponses = [
                "The E-Tongue system mimics human taste sensation using sensor arrays and pattern recognition algorithms.",
                "Our E-Tongue can identify complex tastes and quantify taste attributes for various applications.",
                "The technology is particularly useful in food quality control, pharmaceutical taste masking, and environmental monitoring.",
                "The sensor array generates signals based on chemical interactions, which are then processed and analyzed.",
                "We're currently working on improving the accuracy and expanding the applications of our E-Tongue system."
            ];
            
            // Find a relevant fallback response based on user query
            let response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            
            // Simple keyword matching for more relevant fallbacks
            if (userMessage.toLowerCase().includes('applicat') || userMessage.toLowerCase().includes('use')) {
                response = "The E-Tongue has applications in food and beverage quality control, pharmaceutical taste assessment, environmental monitoring, and research development.";
            } else if (userMessage.toLowerCase().includes('work') || userMessage.toLowerCase().includes('how')) {
                response = "The E-Tongue works through four main steps: sample collection, signal acquisition, signal processing, and pattern recognition using specialized algorithms.";
            } else if (userMessage.toLowerCase().includes('sensor')) {
                response = "Our system uses an array of non-specific chemical sensors with cross-sensitivity to different compounds in liquid media.";
            }
            
            addMessage(response, 'bot');
        }
    }

    // Upload Modal Functionality
    const uploadModal = document.getElementById('upload-modal');
    const uploadGraphBtn = document.getElementById('upload-graph-btn');
    const uploadTableBtn = document.getElementById('upload-table-btn');
    const uploadModalClose = document.querySelector('.upload-modal-close');
    const uploadModalCancel = document.querySelector('.upload-modal-cancel');
    const uploadModalConfirm = document.querySelector('.upload-modal-confirm');
    const fileInput = document.getElementById('file-input');
    const uploadPreview = document.getElementById('upload-preview');
    const uploadModalTitle = document.getElementById('upload-modal-title');
    const uploadModalDescription = document.getElementById('upload-modal-description');

    let currentUploadType = '';

    // Open modal for graph upload
    uploadGraphBtn.addEventListener('click', () => {
        currentUploadType = 'graph';
        uploadModalTitle.textContent = 'Upload Sensor Data';
        uploadModalDescription.textContent = 'Please select a CSV file containing sensor response data. The file should have columns for time/measurement and sensor values.';
        uploadModal.style.display = 'flex';
    });

    // Open modal for table upload
    uploadTableBtn.addEventListener('click', () => {
        currentUploadType = 'table';
        uploadModalTitle.textContent = 'Upload Quantitative Data';
        uploadModalDescription.textContent = 'Please select a CSV file containing quantitative analysis data. The file should have columns for sample ID and taste attributes.';
        uploadModal.style.display = 'flex';
    });

    // Close modal
    uploadModalClose.addEventListener('click', closeUploadModal);
    uploadModalCancel.addEventListener('click', closeUploadModal);

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === uploadModal) {
            closeUploadModal();
        }
    });

    function closeUploadModal() {
        uploadModal.style.display = 'none';
        fileInput.value = '';
        uploadPreview.innerHTML = '<i class="fas fa-file-csv"></i><p>File preview will appear here</p>';
        uploadModalConfirm.disabled = true;
    }

    // Handle file selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.name.endsWith('.csv')) {
                // Read and preview the file
                const reader = new FileReader();
                reader.onload = (e) => {
                    const contents = e.target.result;
                    previewCSV(contents, file.name);
                };
                reader.readAsText(file);
                uploadModalConfirm.disabled = false;
            } else {
                alert('Please select a CSV file.');
                fileInput.value = '';
                uploadPreview.innerHTML = '<i class="fas fa-file-csv"></i><p>Please select a valid CSV file</p>';
                uploadModalConfirm.disabled = true;
            }
        }
    });

    // Preview CSV file
    function previewCSV(csvData, fileName) {
        const rows = csvData.split('\n');
        const headers = rows[0].split(',');
        
        uploadPreview.innerHTML = `
            <div style="width: 100%;">
                <h4>${fileName}</h4>
                <p>Columns: ${headers.length}</p>
                <p>Rows: ${rows.length - 1}</p>
                <div style="max-height: 100px; overflow: auto; margin-top: 10px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                ${headers.slice(0, 3).map(header => `<th style="padding: 4px; border: 1px solid #ddd;">${header}</th>`).join('')}
                                ${headers.length > 3 ? '<th style="padding: 4px; border: 1px solid #ddd;">...</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.slice(1, 4).map(row => {
                                const values = row.split(',');
                                return `
                                    <tr>
                                        ${values.slice(0, 3).map(value => `<td style="padding: 4px; border: 1px solid #ddd;">${value}</td>`).join('')}
                                        ${values.length > 3 ? '<td style="padding: 4px; border: 1px solid #ddd;">...</td>' : ''}
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // Handle upload confirmation
    uploadModalConfirm.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file) {
            // Show loading state
            uploadModalConfirm.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            uploadModalConfirm.disabled = true;
            
            // Simulate upload process (replace with actual API call)
            setTimeout(() => {
                // Process the file based on upload type
                const reader = new FileReader();
                reader.onload = (e) => {
                    const csvData = e.target.result;
                    
                    if (currentUploadType === 'graph') {
                        // Process sensor data for graph
                        processSensorData(csvData);
                    } else {
                        // Process quantitative data for table
                        processQuantitativeData(csvData);
                    }
                    
                    // Show success message
                    showNotification(`File "${file.name}" uploaded successfully!`, 'success');
                    closeUploadModal();
                    uploadModalConfirm.innerHTML = 'Upload';
                    uploadModalConfirm.disabled = false;
                };
                reader.readAsText(file);
            }, 1500);
        }
    });

    // Process sensor data and update graph
    function processSensorData(csvData) {
        try {
            const rows = csvData.split('\n');
            const headers = rows[0].split(',').map(h => h.trim());
            
            // Try to detect the structure of the CSV
            let xIndex = headers.findIndex(h => h.toLowerCase().includes('time') || h.toLowerCase().includes('measurement') || h.toLowerCase().includes('x'));
            let yIndex = headers.findIndex(h => h.toLowerCase().includes('sensor') || h.toLowerCase().includes('value') || h.toLowerCase().includes('y'));
            
            // Fallback to first two columns if specific headers not found
            if (xIndex === -1) xIndex = 0;
            if (yIndex === -1) yIndex = 1;
            
            const labels = [];
            const data = [];
            
            // Parse CSV data
            for (let i = 1; i < rows.length; i++) {
                if (rows[i].trim()) {
                    const values = rows[i].split(',');
                    if (values.length >= Math.max(xIndex, yIndex) + 1) {
                        const xVal = values[xIndex].trim();
                        const yVal = parseFloat(values[yIndex]);
                        
                        if (!isNaN(yVal)) {
                            labels.push(xVal);
                            data.push(yVal);
                        }
                    }
                }
            }
            
            // Update the sensor graph
            updateSensorChart(labels, data);
            
            // Show success notification
            showNotification('Sensor graph updated with new data!', 'success');
        } catch (error) {
            console.error('Error processing sensor data:', error);
            showNotification('Error processing the CSV file. Please check the format.', 'error');
        }
    }

    // Process quantitative data and update table
    function processQuantitativeData(csvData) {
        try {
            const rows = csvData.split('\n');
            const headers = rows[0].split(',').map(h => h.trim());
            const data = [];
            
            // Parse CSV data
            for (let i = 1; i < rows.length; i++) {
                if (rows[i].trim()) {
                    const values = rows[i].split(',');
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[header] = values[index] || '';
                    });
                    data.push(rowData);
                }
            }
            
            // Update the data table
            updateDataTable(headers, data);
            
            // Show success notification
            showNotification('Data table updated with new quantitative data!', 'success');
        } catch (error) {
            console.error('Error processing quantitative data:', error);
            showNotification('Error processing the CSV file. Please check the format.', 'error');
        }
    }

    // Update sensor chart with new data (line graph)
    function updateSensorChart(labels, data) {
        const ctx = document.getElementById('tasteChart').getContext('2d');
        
        // Destroy previous chart if it exists
        if (tasteChart) {
            tasteChart.destroy();
        }
        
        // Create new chart as a line graph
        tasteChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sensor Response',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Sensor Response (mV)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time (s)'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'E-Tongue Sensor Response'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Response: ${context.parsed.y.toFixed(2)} mV`;
                            }
                        }
                    }
                }
            }
        });
    }

    // Update data table with new data
    function updateDataTable(headers, data) {
        const table = document.getElementById('dataTable');
        
        // Clear existing table content
        table.innerHTML = '';
        
        // Create header row
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Create body rows
        const tbody = document.createElement('tbody');
        
        data.forEach(rowData => {
            const row = document.createElement('tr');
            
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = rowData[header] || '';
                row.appendChild(td);
            });
            
            tbody.appendChild(row);
        });
        
        table.appendChild(tbody);
    }

    // Update chart type based on selection
    function updateChartType(graphType) {
        if (!tasteChart) return;
        
        // Get the active button to determine which graph to show
        const activeButton = document.querySelector('.graph-btn.active');
        const graphTypeToShow = activeButton.getAttribute('data-graph');
        
        // Update the chart based on the selected type with different data
        if (graphTypeToShow === 'sensor') {
            // Generate new sensor data
            const timeLabels = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
            const sensorData = timeLabels.map(() => Math.floor(Math.random() * 50) + 10);
            
            tasteChart.data.labels = timeLabels;
            tasteChart.data.datasets[0].data = sensorData;
            tasteChart.data.datasets[0].label = 'Sensor Response';
            tasteChart.options.scales.y.title.text = 'Sensor Response (mV)';
            tasteChart.options.scales.x.title.text = 'Time (s)';
            tasteChart.options.plugins.title.text = 'E-Tongue Sensor Response';
            
        } else if (graphTypeToShow === 'taste') {
            // Generate taste profile data
            const tasteLabels = ['Sweetness', 'Bitterness', 'Sourness', 'Saltiness', 'Umami'];
            const tasteData = tasteLabels.map(() => Math.random().toFixed(2));
            
            tasteChart.data.labels = tasteLabels;
            tasteChart.data.datasets[0].data = tasteData;
            tasteChart.data.datasets[0].label = 'Taste Intensity';
            tasteChart.options.scales.y.title.text = 'Intensity';
            tasteChart.options.scales.x.title.text = 'Taste Attributes';
            tasteChart.options.plugins.title.text = 'Taste Profile Analysis';
            
        } else if (graphTypeToShow === 'pca') {
            // Generate PCA data (scatter plot)
            const pcaLabels = ['Sample 1', 'Sample 2', 'Sample 3', 'Sample 4', 'Sample 5', 'Sample 6'];
            const pcaData = pcaLabels.map(() => ({
                x: (Math.random() * 10 - 5).toFixed(2),
                y: (Math.random() * 10 - 5).toFixed(2)
            }));
            
            // Change to scatter chart for PCA
            tasteChart.destroy();
            const ctx = document.getElementById('tasteChart').getContext('2d');
            tasteChart = new Chart(ctx, {
                type: 'scatter',
                data: {
                    datasets: [{
                        label: 'PCA Results',
                        data: pcaData.map((point, index) => ({
                            x: parseFloat(point.x),
                            y: parseFloat(point.y),
                            label: pcaLabels[index]
                        })),
                        backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        pointRadius: 8,
                        pointHoverRadius: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            title: {
                                display: true,
                                text: 'Principal Component 2 (PC2)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Principal Component 1 (PC1)'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'PCA Analysis'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.raw.label}: (${context.parsed.x.toFixed(2)}, ${context.parsed.y.toFixed(2)})`;
                                }
                            }
                        }
                    }
                }
            });
            return;
        }
        
        tasteChart.update();
    }

    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Initialize charts with sample data
    function initializeCharts() {
        // Sample data for initial line graph (sensor response over time)
        const timeLabels = ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55', '60'];
        const sensorData = [12, 19, 28, 35, 42, 48, 52, 55, 57, 58, 59, 60, 60];
        
        updateSensorChart(timeLabels, sensorData);
        
        // Sample data for initial table
        const sampleTableData = [
            {Sample: 'S1', Sweetness: '0.85', Bitterness: '0.12', Sourness: '0.05', Saltiness: '0.08', Umami: '0.02'},
            {Sample: 'S2', Sweetness: '0.10', Bitterness: '0.78', Sourness: '0.08', Saltiness: '0.04', Umami: '0.12'},
            {Sample: 'S3', Sweetness: '0.08', Bitterness: '0.15', Sourness: '0.72', Saltiness: '0.10', Umami: '0.05'},
            {Sample: 'S4', Sweetness: '0.12', Bitterness: '0.09', Sourness: '0.14', Saltiness: '0.82', Umami: '0.07'}
        ];
        
        updateDataTable(['Sample', 'Sweetness', 'Bitterness', 'Sourness', 'Saltiness', 'Umami'], sampleTableData);
    }
});