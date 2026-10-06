import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchHotels = (params) => axios.get(`${API_BASE}/hotels`, { params });
export const fetchHotelById = (id) => axios.get(`${API_BASE}/hotels/${id}`);
export const createHotel = (formData) =>
  axios.post(`${API_BASE}/hotels`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateHotel = (id, formData) =>
  axios.put(`${API_BASE}/hotels/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteHotel = (id) => axios.delete(`${API_BASE}/hotels/${id}`);
