import { API_BASE_URL } from '../config';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
};

const handleResponse = async (response) => {
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed');
    }
    return response.json();
};

export const adminService = {
    getUsers: async () => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    createUser: async (userData) => {
        const response = await fetch(`${API_BASE_URL}/admin/users`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData)
        });
        return handleResponse(response);
    },

    getUser: async (id) => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getSessions: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/sessions`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getSystemStats: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/stats`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getBounties: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/bounties`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getSkills: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/skills`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getTransactions: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/transactions`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getFeedbacks: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/feedbacks`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    updateUserGP: async (userId, amount) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/gp`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(amount)
        });
        return handleResponse(response);
    },

    banUser: async (userId) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    getLogs: async () => {
        const response = await fetch(`${API_BASE_URL}/admin/logs`, {
            headers: getAuthHeaders()
        });
        return handleResponse(response);
    },

    updateUserStatus: async (userId, status) => {
        const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ status })
        });
        return handleResponse(response);
    }
};
