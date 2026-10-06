import React, { useState, useEffect } from 'react';

const initialFormState = {
  title: '',
  description: '',
  latitude: '',
  longitude: '',
  price: '',
  image: null,
};

const IMAGE_BASE = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function HotelForm({ initialData, onSubmit, submitLabel = 'Save Hotel' }) {
  const [form, setForm] = useState(initialFormState);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || '',
        description: initialData.description || '',
        latitude: initialData.latitude || '',
        longitude: initialData.longitude || '',
        price: initialData.price || '',
        image: null,
      });
      if (initialData.image_path) {
        setPreview(`${IMAGE_BASE}${initialData.image_path}`);
      }
    }
  }, [initialData]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    const lat = parseFloat(form.latitude);
    if (form.latitude === '' || isNaN(lat) || lat < -90 || lat > 90) {
      e.latitude = 'Latitude must be a number between -90 and 90';
    }
    const lng = parseFloat(form.longitude);
    if (form.longitude === '' || isNaN(lng) || lng < -180 || lng > 180) {
      e.longitude = 'Longitude must be a number between -180 and 180';
    }
    const price = parseFloat(form.price);
    if (form.price === '' || isNaN(price) || price < 0) {
      e.price = 'Price must be a valid non-negative number';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev) => {
    const { name, value } = ev.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (ev) => {
    const file = ev.target.files[0];
    if (file) {
      setForm((prev) => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('latitude', form.latitude);
    formData.append('longitude', form.longitude);
    formData.append('price', form.price);
    if (form.image) formData.append('image', form.image);
    onSubmit(formData);
  };

  return (
    <form className="hotel-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Hotel Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {preview && (
          <img
            src={preview}
            alt={form.title ? `${form.title} preview` : 'Hotel preview'}
            className="image-preview"
          />
        )}
      </div>

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Thynk Unlimited Resort"
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="Describe the hotel..."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Latitude *</label>
          <input
            type="number"
            step="any"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder="e.g. 11.9416"
          />
          {errors.latitude && <span className="error-text">{errors.latitude}</span>}
        </div>
        <div className="form-group">
          <label>Longitude *</label>
          <input
            type="number"
            step="any"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder="e.g. 79.8083"
          />
          {errors.longitude && <span className="error-text">{errors.longitude}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Price per night (₹) *</label>
        <input
          type="number"
          step="0.01"
          min="0"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="e.g. 2500"
        />
        {errors.price && <span className="error-text">{errors.price}</span>}
      </div>

      <button type="submit" className="btn btn-primary">{submitLabel}</button>
    </form>
  );
}
