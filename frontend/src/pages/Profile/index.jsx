import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "../../components/Navbar";
import BookingList from "../../components/BookingList";
import Loading from "../../components/Loading";
import SuccessToast from "../../components/SuccessToast";
import ErrorToast from "../../components/ErrorToast";


import {
    fetchBookingByUser
  } from "../../features/bookingSlice";


export default function ProfilePage() {
  const { userId } = useParams();

  const dispatch = useDispatch();

  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    user,
  } = useSelector((state) => state.auth);

  const {
    bookings
    } = useSelector((state) => state.booking);


  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setIsLoading(true);
        dispatch(fetchBookingByUser(userId));
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        setMessage(error.message || error);
      }
    };
    fetchUserBookings();
  }, [userId]);


  const resetSuccess = () => {
    setIsSuccess(false);
    setMessage("");
  };

  const resetError = () => {
    setIsError(false);
    setMessage("");
  };

  const AuthorDetails = () => {
    return (
      <div className="col-md-8 col-lg-6 col-xl-4 mx-auto">
        <div className="position-sticky my-5" style={{ top: "2rem" }}>
          <div className="p-4 mb-3 bg-light rounded">
            <h4 className="">
              Welcome, {user.firstName} {user.lastName}.
            </h4>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading || !user) {
    return <Loading />;
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <AuthorDetails />
        <h5 className="page-subtitle">Your Bookings</h5>
        <BookingList bookings={bookings} />
      </div>
      <SuccessToast show={isSuccess} message={message} onClose={resetSuccess} />
      <ErrorToast show={isError} message={message} onClose={resetError} />
    </>
  );
}