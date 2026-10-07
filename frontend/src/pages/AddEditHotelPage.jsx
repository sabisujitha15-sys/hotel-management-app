import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import HotelForm from '../components/HotelForm';

import {
  addHotel,
  editHotel,
  getHotelById,
  clearCurrentHotel
} from '../features/hotels/hotelsSlice';

export default function AddEditHotelPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentHotel = useSelector(
    (s) => s.hotels.currentHotel
  );

  useEffect(() => {
    if (isEdit) {
      dispatch(getHotelById(id));
    }

    return () => {
      dispatch(clearCurrentHotel());
    };
  }, [id, isEdit, dispatch]);

  const handleSubmit = async (formData) => {
    if (isEdit) {
      await dispatch(
        editHotel({
          id,
          formData
        })
      );
    } else {
      await dispatch(addHotel(formData));
    }

    navigate('/');
  };

  return (
    <div className="page form-page">

      <Helmet>
        <title>
          {isEdit ? 'Edit Hotel' : 'Add New Hotel'}
          {' | Thynk Unlimited Stays'}
        </title>
      </Helmet>


      {/*  HEADER  */}

      <div className="form-page-header">

        <div className="form-heading">

          <p className="detail-eyebrow">
            THYNK UNLIMITED STAYS
          </p>

          <h1>
            {isEdit ? 'Edit Your Hotel' : 'Add a New Hotel'}
          </h1>

          <div className="form-title-line">
            <span></span>
          </div>

          <p className="form-subtitle">
            {isEdit
              ? 'Update the hotel information and keep the details accurate.'
              : 'Add your hotel details and create a beautiful stay listing.'}
          </p>

        </div>

      </div>


      {/*  FORM CARD  */}

      <div className="form-card">

        <div className="form-card-top">

          <div>
            <h2>
              {isEdit
                ? 'Hotel Information'
                : 'Create Hotel Listing'}
            </h2>

            <p>
              Enter the details below to
              {isEdit
                ? ' update this hotel.'
                : ' add your hotel.'}
            </p>
          </div>

          <div className="form-number">
            {isEdit ? '02' : '01'}
          </div>

        </div>


        <div className="form-card-divider"></div>


        <HotelForm
          initialData={isEdit ? currentHotel : null}
          onSubmit={handleSubmit}
          submitLabel={
            isEdit
              ? 'Update Hotel'
              : 'Add Hotel'
          }
        />

      </div>


      {/*  BOTTOM NOTE  */}

      <div className="form-page-note">

        <span>✦</span>

        <p>
          Make sure the hotel name, price and location
          details are accurate before submitting.
        </p>

      </div>

    </div>
  );
}