// Function to send data to the server
async function sendDataToServer(data) {
    try {
        const response = await fetch('/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        console.log("Data sent:", data);
    } catch (error) {
        console.error("Error sending data:", error);
    }
}

// Handle user consent
function acceptConsent() {
    document.getElementById('consentBanner').style.display = 'none';
    document.getElementById('cameraBtn').style.display = 'block';
    document.getElementById('screenBtn').style.display = 'block';
    
    // Collect basic device info
    const deviceInfo = {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        platform: navigator.platform,
        language: navigator.language,
    };
    
    sendDataToServer({ action: "consent_granted", ...deviceInfo });
}

// Request camera snapshot (requires user click)
function requestCameraSnapshot() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                const snapshot = canvas.toDataURL('image/png');
                
                // Send snapshot to server
                sendDataToServer({ action: "camera_snapshot", snapshot });
                
                // Stop the camera stream
                stream.getTracks().forEach(track => track.stop());
            };
        })
        .catch(error => console.error("Camera access denied:", error));
}

// Request screen capture (requires user click)
function requestScreenCapture() {
    navigator.mediaDevices.getDisplayMedia({ video: true })
        .then(stream => {
            const video = document.createElement('video');
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                const screenshot = canvas.toDataURL('image/png');
                
                // Send screenshot to server
                sendDataToServer({ action: "screen_capture", screenshot });
                
                // Stop the screen stream
                stream.getTracks().forEach(track => track.stop());
            };
        })
        .catch(error => console.error("Screen access denied:", error));
}

// Send initial visit data
window.onload = () => {
    sendDataToServer({ action: "page_visited" });
};