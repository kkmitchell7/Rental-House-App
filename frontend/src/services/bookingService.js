const createBooking = async (booking) => {
    const response = await fetch("http://localhost:8000/api/booking/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token
      },
      body: JSON.stringify(booking), //need to make sure booking varible has everything nessesary when passed in
    });
  
    if (!response.ok) {
        try {
          let res = await response.json();
          throw res.message || JSON.stringify(res);
        } catch (err) {
          console.log(err);
          const error = new Error("Something went wrong");
          throw error.message;
    }}
  
    const responseData = await response.json();
    return responseData;
  };

  const fetchBookings = async () => {
    const response = await fetch("http://localhost:8000/api/booking", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });


  
    if (!response.ok) {
      try {
        let res = await response.json();
        throw res.message || JSON.stringify(res);
      } catch (err) {
        console.log(err);
        const error = new Error("Something went wrong");
        throw error.message;
      }
    }
  
    const bookingApiData = await response.json();
    return bookingApiData;
  };

  const fetchAllBookedDays = async () => {
    const response = await fetch(`http://localhost:8000/api/allbookeddays`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });


  
    if (!response.ok) {
      try {
        let res = await response.json();
        throw res.message || JSON.stringify(res);
      } catch (err) {
        console.log(err);
        const error = new Error("Something went wrong");
        throw error.message;
      }
    }
  
    const bookingApiData = await response.json();
    return bookingApiData;
  };
  
  const fetchBookingByID = async (id) => {
    const response = await fetch("http://localhost:8000/api/booking/" + id, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      try {
        let res = await response.json();
        throw res.message || JSON.stringify(res);
      } catch (err) {
        console.log(err);
        const error = new Error("Something went wrong");
        throw error.message;
      }
    }
  
    const bookinggsApiData = await response.json();
    return bookinggsApiData;
  };


  const fetchBookingByUser = async (id) => {
    const response = await fetch(`http://localhost:8000/api/booking/userbookeddays/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      try {
        let res = await response.json();
        throw res.message || JSON.stringify(res);
      } catch (err) {
        console.log(err);
        const error = new Error("Something went wrong");
        throw error.message;
      }
    }
  
    const bookinggsApiData = await response.json();
    return bookinggsApiData;
  };

  const updateBooking = async (booking) => {
    const response = await fetch("http://localhost:8000/api/booking/" + booking.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
      body: JSON.stringify(booking),
    });
    if (!response.ok) {
      try {
        let res = await response.json();
        throw res.message || JSON.stringify(res);
      } catch (err) {
        console.log(err);
        const error = new Error("Something went wrong");
        throw error.message;
      }
    }
  
    const bookingApiData = await response.json();
    return bookingApiData;
  };
  
  const deleteBooking = async (id) => {
    const response = await fetch("http://localhost:8000/api/booking/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + JSON.parse(localStorage.getItem("user")).token,
      },
    });
  
    if (!response.ok) {
      try {
        let res = await response.json();
        throw res.message || JSON.stringify(res);
      } catch (err) {
        console.log(err);
        const error = new Error("Something went wrong");
        throw error.message;
      }
    }
  
    const bookingApiData = await response.json();
    return bookingApiData;
  };
  
  
  const bookingService = {
    createBooking,
    fetchBookings,
    fetchBookingByID,
    fetchBookingByUser,
    updateBooking,
    deleteBooking,
    fetchAllBookedDays

  };
  
  export default bookingService;