const API_URL = process.env.REACT_APP_API_URL || '/api';

const getToken = () => localStorage.getItem('psybioneer-token');

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }

  return response.json();
};

export const authAPI = {
  async register(userData) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.token) {
      localStorage.setItem('psybioneer-token', data.token);
    }
    return data;
  },

  async login(credentials) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      localStorage.setItem('psybioneer-token', data.token);
    }
    return data;
  },

  async getProfile() {
    return apiRequest('/auth/profile');
  },

  logout() {
    localStorage.removeItem('psybioneer-token');
    localStorage.removeItem('psybioneer-role');
  }
};

export const userAPI = {
  async getAllPatients() {
    return apiRequest('/users/patients');
  },

  async getPatientProfile(patient_id) {
    return apiRequest(`/users/patients/${patient_id}/profile`);
  },

  async updatePatientClinicalRecord(patient_id, payload) {
    return apiRequest(`/users/patients/${patient_id}/clinical-record`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  async updatePatientStatus(patient_id, status, reason = '') {
    return apiRequest(`/users/patients/${patient_id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  async createDoctor(doctorData) {
    return apiRequest('/users/doctors', {
      method: 'POST',
      body: JSON.stringify(doctorData),
    });
  },

  async getAllDoctors() {
    return apiRequest('/users/doctors');
  },

  async deleteMe() {
    return apiRequest('/users/me', { method: 'DELETE' });
  }
};

export const questionAPI = {
  async getAll(instrumentCode = 'CESD') {
    return apiRequest(`/questions?instrument=${encodeURIComponent(instrumentCode)}`);
  },

  async create(text, position) {
    return apiRequest('/questions', {
      method: 'POST',
      body: JSON.stringify({ text, position }),
    });
  },

  async update(id, text, position) {
    return apiRequest(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ text, position }),
    });
  },

  async delete(id) {
    return apiRequest(`/questions/${id}`, {
      method: 'DELETE',
    });
  }
};

export const testAPI = {
  async createSession(patient_id = null, instrument_code = 'CESD') {
    return apiRequest('/tests/sessions', {
      method: 'POST',
      body: JSON.stringify({ patient_id, instrument_code }),
    });
  },

  async saveResponse(session_id, question_id, response_value) {
    return apiRequest('/tests/responses', {
      method: 'POST',
      body: JSON.stringify({ session_id, question_id, response_value }),
    });
  },

  async completeSession(session_id, total_score) {
    return apiRequest('/tests/complete', {
      method: 'POST',
      body: JSON.stringify({ session_id, total_score }),
    });
  },

  async getMySessions() {
    return apiRequest('/tests/sessions/my');
  },

  async getMyStatuses() {
    return apiRequest('/tests/statuses/my');
  },

  async getAllSessions() {
    return apiRequest('/tests/sessions/all');
  },

  async getSessionDetails(session_id) {
    return apiRequest(`/tests/sessions/${session_id}`);
  },

  async addFeedback(session_id, feedback_text) {
    return apiRequest('/tests/feedback', {
      method: 'POST',
      body: JSON.stringify({ session_id, feedback_text }),
    });
  },

  async getPatientSessions(patient_id) {
    return apiRequest(`/tests/sessions/patient/${patient_id}`);
  },

  async getPatientStatuses(patient_id) {
    return apiRequest(`/tests/statuses/patient/${patient_id}`);
  }
};
