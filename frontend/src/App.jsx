import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HotelListPage from './pages/HotelListPage';
import AddEditHotelPage from './pages/AddEditHotelPage';
import HotelDetailPage from './pages/HotelDetailPage';

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<HotelListPage />} />
        <Route path="/hotels/new" element={<AddEditHotelPage />} />
        <Route path="/hotels/:id" element={<HotelDetailPage />} />
        <Route path="/hotels/:id/edit" element={<AddEditHotelPage />} />
      </Routes>
    </div>
  );
}
