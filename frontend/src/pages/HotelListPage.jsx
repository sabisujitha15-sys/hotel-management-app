import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import {
  getHotels,
  removeHotel,
  clearDeleteSuccess
} from '../features/hotels/hotelsSlice';

import HotelCard from '../components/HotelCard';
import Pagination from '../components/Pagination';
import SearchFilter from '../components/SearchFilter';

export default function HotelListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    list = [],
    total = 0,
    limit = 6,
    offset = 0,
    status,
    deleteSuccess
  } = useSelector((state) => state.hotels);

  const [filters, setFilters] = useState({
    title: '',
    minPrice: '',
    maxPrice: ''
  });

  const [toast, setToast] = useState(false);

  const loadHotels = useCallback(
    (newOffset = 0, newFilters = filters) => {
      dispatch(
        getHotels({
          title: newFilters.title || undefined,
          minPrice: newFilters.minPrice || undefined,
          maxPrice: newFilters.maxPrice || undefined,
          offset: newOffset,
          limit
        })
      );
    },
    [dispatch, filters, limit]
  );

  useEffect(() => {
    loadHotels(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (deleteSuccess) {
      setToast(true);
      dispatch(clearDeleteSuccess());

      const timer = setTimeout(() => {
        setToast(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [deleteSuccess, dispatch]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    loadHotels(0, newFilters);
  };

  const handlePageChange = (newOffset) => {
    loadHotels(newOffset);
  };

  const handleEdit = (hotel) => {
    navigate(`/hotels/${hotel.id}/edit`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this hotel?')) {
      dispatch(removeHotel(id));
    }
  };

  return (
    <div className="page hotel-list-page">

      <Helmet>
        <title>Hotels | Thynk Unlimited Stays</title>
        <meta
          name="description"
          content="Explore hotel stays, search by name, filter by price and manage hotel listings."
        />
      </Helmet>

      {/*  ATTRACTIVE HOME HERO  */}
      <section className="home-hero-new">

        <div className="home-hero-new-content">

          <p className="home-hero-new-eyebrow">
            THYNK UNLIMITED STAYS
          </p>

          <h1>
            Find a stay
            <span> worth remembering.</span>
          </h1>

          <div className="home-hero-new-line">
            <span></span>
          </div>

          <p className="home-hero-new-description">
            Discover comfortable hotels, beautiful destinations
            and memorable stays for your next journey.
          </p>

          <div className="home-hero-new-actions">

            <button
              type="button"
              className="home-hero-new-button"
              onClick={() => navigate('/hotels/new')}
            >
              + Add New Hotel
            </button>

            <a
              href="#hotel-collection"
              className="home-hero-new-link"
            >
              Explore Hotels <span>↓</span>
            </a>

          </div>

        </div>

        <div className="home-hero-new-visual">

          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85"
            alt="Beautiful hotel with swimming pool"
          />

          <div className="home-hero-new-image-label">
            <span>YOUR NEXT ESCAPE</span>
            <strong>Comfort meets elegance</strong>
          </div>

          <div className="home-hero-new-image-decoration"></div>

        </div>

      </section>

      {/*  TOAST  */}
      {toast && (
        <div className="toast-success">
          Hotel deleted successfully!
        </div>
      )}

      {/*  SEARCH  */}
      <section className="home-search-section">

        <div className="home-search-heading">
          <p>DISCOVER YOUR STAY</p>
          <h2>Explore our hotels</h2>
        </div>

        <div className="home-search-panel">
          <SearchFilter onSearch={handleSearch} />
        </div>

      </section>

      {/*  HOTEL LIST  */}
      <section
        className="home-hotels-section"
        id="hotel-collection"
      >

        <div className="home-section-heading">

          <div>
            <p className="home-section-eyebrow">
              OUR COLLECTION
            </p>

            <h2>
              Beautiful stays,
              <span> made for you.</span>
            </h2>
          </div>

          <div className="home-section-line">
            <span></span>
          </div>

        </div>

        {status === 'loading' && (
          <p className="status-text">
            Loading hotels...
          </p>
        )}

        {status === 'succeeded' && list.length === 0 && (
          <p className="status-text">
            No hotels found.
          </p>
        )}

        {status === 'failed' && (
          <p className="status-text">
            Unable to load hotels. Please try again.
          </p>
        )}

        <div className="hotel-grid">
          {list.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

      </section>

      {/*  PAGINATION  */}
      {total > limit && (
        <Pagination
          total={total}
          limit={limit}
          offset={offset}
          onPageChange={handlePageChange}
        />
      )}

    </div>
  );
}