import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const uploadResume = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await axios.post(`${API_BASE_URL}/api/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Backend error:", error.response.status, error.response.data);
        } else if (error.request) {
            console.error("No response from backend. Is the server running on port 8080?");
        } else {
            console.error("Request setup error:", error.message);
        }
        throw error;
    }
};

export const getDownloadUrl = (fileId) => `${API_BASE_URL}/api/download/${fileId}`;
