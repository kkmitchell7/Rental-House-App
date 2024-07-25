import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./index.css";

import SuccessToast from "../../components/SuccessToast";
import ErrorToast from "../../components/ErrorToast";
import Loading from "../../components/Loading";


import { register, reset } from "../../features/authSlice";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });

  const { first_name, last_name, email, password } = formData;

  useEffect(() => {
    if (isSuccess || user) {
      navigate("/home");
    }
  }, [user, isError, isSuccess, isLoading, message, navigate]);

  
  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="html-body">
        <main className="form-signin">
          <form onSubmit={onSubmit}>
            <h1 className="h3 mb-3 fw-normal">Register</h1>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="first_name"
                name="first_name"
                placeholder="Joe"
                value={first_name}
                onChange={onChange}
              />
              <label htmlFor="first_name">First name</label>
            </div>
            <div className="form-floating">
              <input
                type="text"
                className="form-control"
                id="last_name"
                name="last_name"
                placeholder="Soap"
                value={last_name}
                onChange={onChange}
              />
              <label htmlFor="last_name">Last name</label>
            </div>
            <div className="form-floating">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="..."
                value={email}
                onChange={onChange}
              />
              <label htmlFor="email">Email address</label>
            </div>
            <div className="form-floating">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
              />
              <label htmlFor="password">Password</label>
            </div>
            <button className="w-100 btn btn-lg btn-primary" type="submit">
              Register
            </button>
            <Link to="/login" className="my-5">
              Login
            </Link>
            <p className="mt-5 mb-3 text-muted text-center">
              The Red Cottage 2024
            </p>
          </form>
        </main>
      </div>
      <SuccessToast
        show={isSuccess}
        message={message}
        onClose={() => {
          dispatch(reset());
        }}
      />
      <ErrorToast
        show={isError}
        message={message}
        onClose={() => {
          dispatch(reset());
        }}
      />
    </>
  );
}