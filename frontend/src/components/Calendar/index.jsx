import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";

import "./index.css";

import {
    fetchAllBookedDays,
    resetSuccessAndError as resetBooking
  } from "../../features/bookingSlice";


export default function Calendar() {


    //let bookedDays = [1,5]; //need to get all the booked days from the API here (use slice/redux!!)

    const dispatch = useDispatch();
    
    const {
    bookedDays,
    isError: isBookingError,
    isSuccess: isBookingSuccess,
    isLoading: isLoadingBookings,
    message: bookingsMessage,
    } = useSelector((state) => state.booking);



  useEffect(() => {
    dispatch(fetchAllBookedDays()); //should change so we only fetch all booked days for the current month & make refetch when we click the button?
    return () => {
        dispatch(resetBooking());
      };
  }, []);



    const [currMonth, setCurrMonth] = useState(new Date().getMonth());
    const [currYear, setCurrYear] = useState(new Date().getFullYear());
    const [days, setDays] = useState([]);
    const [currentDate, setCurrentDate] = useState('');

    const [isAllowedToBook, setIsAllowedToBook] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    // storing full name of all months in array
    const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

    const isDateBeforeToday = (dateStr, todayStr) => {
        const date1 = new Date(dateStr);
        const date2 = new Date(todayStr);
        return date1 < date2;
        };

    const handlePrevClick = () => {
      if (currMonth === 0) {
        setCurrMonth(11);
        setCurrYear(currYear - 1);
      } else {
        setCurrMonth(currMonth - 1);
      }
    };
  
    const handleNextClick = () => {
      if (currMonth === 11) {
        setCurrMonth(0);
        setCurrYear(currYear + 1);
      } else {
        setCurrMonth(currMonth + 1);
      }
    };

    function isDateBeforeDate(date1, date2) { // Takes in Date objects
          // Ensure the inputs are Date objects
          if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
              throw new Error('Both arguments must be Date objects');
          }
      
          // Get time values in milliseconds
          const time1 = date1.getTime();
          const time2 = date2.getTime();
      
          // Compare the time values
          return time1 < time2;
    }

    function generateDateRange(startDate, endDate) {
      // Copy the start date to avoid mutating the original object
      const current = new Date(startDate);
      const dates = [];
  
      // Iterate through dates starting from startDate to endDate
      while (current <= endDate) {
          dates.push(new Date(current)); // Push a new Date object to the array
          current.setDate(current.getDate() + 1); // Move to the next day
      }
  
      return dates;
  }
  function checkDateRangeNotBooked(startDate,endDate){
    let allDates = generateDateRange(startDate,endDate)
    const isAnyBooked = allDates.some((element) => {
      const dateString = element.toISOString().slice(0, 10);
      console.log(dateString);
      return bookedDays.includes(dateString);
    });
    if (isAnyBooked) {
      console.log("returning false");
      return false; // Date range has a booked day
    } else {
      console.log("returning true");
      return true; // Date range has no booked days
  }
  }


    const renderCalendar = () => {
      let clickCounter = 0;
      let lastclickedstart = null;
      let lastclickedend = null;
      const handleDayClick = (event, date) => {
  
        const clickedObject = event.currentTarget;
        let clickedFullDate = new Date(date);

        if (isDateBeforeDate(new Date(),clickedFullDate)) { //check to make sure the date isn't in the past

              //Otherwise date range is free, so either modify startDate or endDate varibles

              if (clickCounter === 0){ //modify startDate
                  if (startDate === null || (endDate !== null && isDateBeforeDate(clickedFullDate,endDate) && clickedFullDate.toString() !== startDate.toString())){
                      setStartDate(clickedFullDate);
                      clickedObject.classList.add("selected"); 
                      if (lastclickedstart !== null) {
                          // Remove the class from the previously clicked object
                          lastclickedstart.classList.remove("selected");
                      }
                      lastclickedstart = clickedObject;
                  }
              } else if (clickCounter === 1){ //modify endDate
                  if (endDate === null || (startDate !== null && isDateBeforeDate(startDate,clickedFullDate) && clickedFullDate.toString() !== endDate.toString())){
                      setEndDate(clickedFullDate);
                      clickedObject.classList.add("selected");
                      if (lastclickedend !== null) {
                          // Remove the class from the previously clicked object
                          lastclickedend.classList.remove("selected");
                      }
                      lastclickedend = clickedObject;
                  }  
              }
          }
        clickCounter = (clickCounter + 1) % 2;
      };

        let firstDayOfMonth = new Date(currYear, currMonth, 1).getDay();
        let lastDateOfMonth = new Date(currYear, currMonth + 1, 0).getDate();
        let lastDayOfMonth = new Date(currYear, currMonth, lastDateOfMonth).getDay();
        let lastDateOfLastMonth = new Date(currYear, currMonth, 0).getDate();
    
        let liTag = [];
        
        for (let i = firstDayOfMonth; i > 0; i--) {
            let dataId;
            if (currMonth === 0) {
            dataId = `${currYear - 1}-12-${(lastDateOfLastMonth - i + 1).toString().padStart(2, '0')}`;
            } else {
            dataId = `${currYear}-${(currMonth).toString().padStart(2, '0')}-${(lastDateOfLastMonth - i + 1).toString().padStart(2, '0')}`;
            }
            
            let isBookedClass = "";

            if (bookedDays){
                let isBooked = bookedDays.includes(dataId);
                isBookedClass = isBooked ? "booked" : "";
            }

            let isBeforeToday = isDateBeforeToday(dataId, new Date().toISOString().split('T')[0]) ? "past" : "";
    
            liTag.push(<li key={dataId} className={`inactive ${isBeforeToday} ${isBookedClass}`} data-id={dataId} onClick={(event) => handleDayClick(event, dataId)}>
            {lastDateOfLastMonth - i + 1}
            </li>);
        }
    
        for (let i = 1; i <= lastDateOfMonth; i++) {
            let dataId = `${currYear}-${(currMonth + 1).toString().padStart(2, '0')}-${(i).toString().padStart(2, '0')}`;
            
            let isBookedClass = "";

            if (bookedDays){
                let isBooked = bookedDays.includes(dataId);
                isBookedClass = isBooked ? "booked" : "";
            }
            
            let isToday = i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear() ? "active" : "";
            let isBeforeToday = isDateBeforeToday(dataId, new Date().toISOString().split('T')[0]) ? "past" : "";
    
            liTag.push(<li key={dataId} className={`${isToday} ${isBookedClass} ${isBeforeToday}`} data-id={dataId} onClick={(event) => handleDayClick(event, dataId)}>
            {i}
            </li>);
        }
    
        for (let i = lastDayOfMonth; i < 6; i++) {
            let dataId;
            if (currMonth === 11) {
            dataId = `${currYear + 1}-01-${(i - lastDayOfMonth + 1).toString().padStart(2, '0')}`;
            } else {
            dataId = `${currYear}-${(currMonth + 2).toString().padStart(2, '0')}-${(i - lastDayOfMonth + 1).toString().padStart(2, '0')}`;
            }
    
            let isBookedClass = "";

            if (bookedDays){
                let isBooked = bookedDays.includes(dataId);
                isBookedClass = isBooked ? "booked" : "";
            }
            let isBeforeToday = isDateBeforeToday(dataId, new Date().toISOString().split('T')[0]) ? "past" : "";
    
            liTag.push(<li key={dataId} className={`inactive ${isBeforeToday} ${isBookedClass}`} data-id={dataId} onClick={(event) => handleDayClick(event, dataId)}>
            {i - lastDayOfMonth + 1}
            </li>);
        }

    
        setDays(liTag);
        setCurrentDate(`${months[currMonth]} ${currYear}`);
        };
    
    useEffect(() => {
        renderCalendar();
        console.log(bookedDays)
    }, [currMonth, currYear, bookedDays]);

    useEffect(() => {
      if (startDate && endDate){
        console.log("startdate: ",startDate)
        console.log("enddate: ",endDate)
        setIsAllowedToBook(checkDateRangeNotBooked(startDate,endDate));
      }
    }, [startDate,endDate]);

    return(
    <div className="row m-5">
      <div className="column-md-8 wrapper p-4">
        <header>
          <p className="current-date">{currentDate}</p>
          <div className="icons">
            <span id="prev" className="material-symbols-rounded" onClick={handlePrevClick}>chevron_left</span>
            <span id="next" className="material-symbols-rounded" onClick={handleNextClick}>chevron_right</span>
          </div>
        </header>
        <div className="calendar">
          <ul className="weeks">
            <li>Sun</li>
            <li>Mon</li>
            <li>Tue</li>
            <li>Wed</li>
            <li>Thu</li>
            <li>Fri</li>
            <li>Sat</li>
          </ul>
          <ul id="day" className="days">{days}</ul>
        </div>
      </div>
      <div className="column-md-2 wrapper m-5" style={{width: '30%', height: '400px', marginLeft:'50px'}}>
        <header>
            <p className="current-date"> Book Now </p>
        </header>
        {isAllowedToBook ? (
        <p>Button here</p>
        ) : (
        <p>Please select a valid date range.</p>
        )}
      </div>
    </div>
    )
}