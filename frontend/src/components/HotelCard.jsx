import React from 'react';
import { Link } from 'react-router-dom';

const IMAGE_BASE = (
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
).replace('/api', '');

export default function HotelCard({ hotel, onEdit, onDelete }) {
  if (!hotel) return null;

  const imageUrl = hotel.image_path
    ? `${IMAGE_BASE}${hotel.image_path}`
    : 'https://via.placeholder.com/600x400?text=Hotel+Image';

  const price = Number(hotel.price || 0).toLocaleString('en-IN');

  return (
    <article className="hotel-card">

      {/* HOTEL IMAGE */}
      <Link
        to={`/hotels/${hotel.id}`}
        className="hotel-card-image-link"
      >
        <div className="hotel-image-wrapper">

          <img
            src={imageUrl}
            alt={`${hotel.title || 'Hotel'} exterior view`}
            className="hotel-card-image"
            onError={(event) => {
              event.currentTarget.src =
                'https://via.placeholder.com/600x400?text=Image+Not+Available';
            }}
          />

          <span className="hotel-badge">
            HOTEL
          </span>

          <span className="image-view-text">
            View Hotel →
          </span>

        </div>
      </Link>


      {/* HOTEL DETAILS */}
      <div className="hotel-card-body">

        <Link
          to={`/hotels/${hotel.id}`}
          className="hotel-card-title-link"
        >
          <h3>{hotel.title || 'Untitled Hotel'}</h3>
        </Link>

        <div className="hotel-card-divider"></div>

        <p className="hotel-card-desc">
          {hotel.description
            ? `${hotel.description.slice(0, 100)}${
                hotel.description.length > 100 ? '...' : ''
              }`
            : 'No description available.'}
        </p>


        {/* PRICE AND DETAILS */}
        <div className="hotel-card-bottom">

          <div>
            <span className="price-label">
              Starting from
            </span>

            <p className="hotel-card-price">
              ₹{price}
              <span> / night</span>
            </p>
          </div>

          <Link
            to={`/hotels/${hotel.id}`}
            className="view-details-btn"
          >
            Details →
          </Link>

        </div>


        {/* EDIT AND DELETE */}
        <div className="hotel-card-actions">

          <button
            type="button"
            className="btn btn-small btn-edit"
            onClick={() => onEdit && onEdit(hotel)}
          >
            Edit
          </button>

          <button
            type="button"
            className="btn btn-small btn-delete"
            onClick={() => onDelete && onDelete(hotel.id)}
          >
            Delete
          </button>

        </div>

      </div>

    </article>
  );
}