import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import {
  getHotelById,
  removeHotel
} from '../features/hotels/hotelsSlice';

const IMAGE_BASE = (
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
).replace('/api', '');

export default function HotelDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hotel = useSelector((s) => s.hotels.currentHotel);

  useEffect(() => {
    dispatch(getHotelById(id));
  }, [id, dispatch]);

  if (!hotel) {
    return (
      <p className="status-text">
        Loading hotel details...
      </p>
    );
  }

  // Cloudinary URL or old local image URL
  const imageUrl = hotel.image_path
    ? hotel.image_path.startsWith('http')
      ? hotel.image_path
      : `${IMAGE_BASE}${hotel.image_path}`
    : 'https://via.placeholder.com/800x500?text=No+Image';

  const lat = parseFloat(hotel.latitude);
  const lng = parseFloat(hotel.longitude);

  const mapSrc =
    `https://www.openstreetmap.org/export/embed.html?` +
    `bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}` +
    `&layer=mapnik&marker=${lat}%2C${lng}`;

  const handleDelete = () => {
    if (window.confirm('Delete this hotel?')) {
      dispatch(removeHotel(id));
      navigate('/');
    }
  };

  return (
    <div className="page hotel-detail-page">

      <Helmet>
        <title>
          {hotel.title} | Thynk Unlimited Stays
        </title>

        <meta
          name="description"
          content={
            (
              hotel.description ||
              `Details about ${hotel.title}`
            ).slice(0, 150)
          }
        />
      </Helmet>

      {/* BACK BUTTON */}
      <button
        className="detail-back-btn"
        onClick={() => navigate('/')}
      >
        ← Back to Hotels
      </button>

      {/* TOP SECTION */}
      <section className="detail-poster">

        <div className="detail-decor-circle detail-circle-top"></div>

        {/* TITLE SIDE */}
        <div className="detail-intro">

          <p className="detail-eyebrow">
            THYNK UNLIMITED STAYS
          </p>

          <h1 className="detail-title">
            {hotel.title}
          </h1>

          <div className="detail-title-line">
            <span></span>
          </div>

          <p className="detail-intro-text">
            {hotel.description ||
              'Discover a comfortable and memorable stay.'}
          </p>

          {/* PRICE */}
          <div className="detail-price-box">

            <span>Starting from</span>

            <strong>
              ₹{parseFloat(hotel.price).toLocaleString()}
            </strong>

            <small>/ night</small>

          </div>

        </div>

        {/* IMAGE AREA */}
        <div className="detail-image-area">

          <div className="detail-image-frame">

            <img
              src={imageUrl}
              alt={`${hotel.title} view`}
              className="detail-image"
              onError={(event) => {
                event.currentTarget.src =
                  'https://via.placeholder.com/800x500?text=Image+Not+Available';
              }}
            />

            <span className="detail-badge">
              STAY
            </span>

          </div>

          {/* SECOND IMAGE */}
          <div className="detail-image-accent">

            <img
              src={imageUrl}
              alt={`${hotel.title} interior`}
              onError={(event) => {
                event.currentTarget.src =
                  'https://via.placeholder.com/500x350?text=Image+Not+Available';
              }}
            />

          </div>

        </div>

      </section>

      {/* HOTEL INFORMATION */}
      <section className="detail-info-section">

        <div className="section-heading">

          <span className="section-line"></span>

          <h2>
            About this stay
          </h2>

        </div>

        <p className="detail-desc">
          {hotel.description ||
            'A comfortable and memorable stay awaits you.'}
        </p>

        {/* INFORMATION PILLS */}
        <div className="detail-info-pills">

          <div className="detail-info-pill">

            <span className="info-icon">
              ₹
            </span>

            <div>

              <span className="info-label">
                Price
              </span>

              <strong>
                ₹{parseFloat(hotel.price).toLocaleString()}
                <small> / night</small>
              </strong>

            </div>

          </div>

          <div className="detail-info-pill">

            <span className="info-icon">
              ⌖
            </span>

            <div>

              <span className="info-label">
                Location
              </span>

              <strong>
                Exact location available
              </strong>

            </div>

          </div>

        </div>

      </section>

      {/* LOCATION */}
      <section className="detail-location-section">

        <div className="location-title">

          <p className="detail-eyebrow">
            LOCATION
          </p>

          <h2>
            Explore this stay
          </h2>

          <p>
            View the exact location using the map below.
          </p>

        </div>

        {/* MAP */}
        <div className="detail-map">

          <iframe
            title={`Map showing location of ${hotel.title}`}
            src={mapSrc}
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
          />

        </div>

        {/* COORDINATES */}
        <div className="coordinates-box">

          <div>
            <span>Latitude</span>
            <strong>
              {hotel.latitude}
            </strong>
          </div>

          <div className="coordinate-divider"></div>

          <div>
            <span>Longitude</span>
            <strong>
              {hotel.longitude}
            </strong>
          </div>

        </div>

      </section>

      {/* ACTIONS */}
      <section className="detail-actions">

        <button
          className="btn btn-primary detail-edit-btn"
          onClick={() =>
            navigate(`/hotels/${id}/edit`)
          }
        >
          Edit Hotel
        </button>

        <button
          className="btn btn-delete detail-delete-btn"
          onClick={handleDelete}
        >
          Delete Hotel
        </button>

        <button
          className="btn detail-list-btn"
          onClick={() => navigate('/')}
        >
          View All Hotels
        </button>

      </section>

      <div className="detail-decor-circle detail-circle-bottom"></div>

    </div>
  );
}