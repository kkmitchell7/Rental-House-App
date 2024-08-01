import React, { useEffect, useState } from "react";
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
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
      setIsSuccess(true);
      setIsError(false);
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
      setIsSuccess(false);
      setIsError(true);
    }
  }, []);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        setIsLoading(true);
        dispatch(fetchBookingByUser(user.id));
        setIsLoading(false);
      } catch (error) {
        setIsError(true);
        setIsLoading(false);
        setMessage(error.message || error);
      }
    };
    fetchUserBookings();
  }, [dispatch, user.id]);


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