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
    dispatch(fetchAllBookedDays());
    return () => {
        dispatch(resetBooking());
      };
  }, []);



    const [currMonth, setCurrMonth] = useState(new Date().getMonth());
    const [currYear, setCurrYear] = useState(new Date().getFullYear());
    const [days, setDays] = useState([]);
    const [currentDate, setCurrentDate] = useState('');


    // storing full name of all months in array
    const months = ["January", "February", "March", "April", "May", "June", "July",
                "August", "September", "October", "November", "December"];

    const isDateBeforeToday = (dateStr, todayStr) => {
        const date1 = new Date(dateStr);
        const date2 = new Date(todayStr);
        return date1 < date2;
        };
    const renderCalendar = () => {
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
    
            liTag.push(<li key={dataId} className={`inactive ${isBeforeToday} ${isBookedClass}`} data-id={dataId}>
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
    
            liTag.push(<li key={dataId} className={`${isToday} ${isBookedClass} ${isBeforeToday}`} data-id={dataId}>
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
    
            liTag.push(<li key={dataId} className={`inactive ${isBeforeToday} ${isBookedClass}`} data-id={dataId}>
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


    let endDate = null;
    let startDate = null;
    let clickCounter = 0;
    let lastclickedstart = null;
    let lastclickedend = null;

    //document.getElementById('day').addEventListener('click', function(event) {
        
        //what i need to do here is be able to know which date was clicked on and assign that as start date, end date
        /*
        var clickedObject = event.target;
        var clickedFullDate = clickedObject.getAttribute('data-id'); //String of the date
        console.log(clickedFullDate)
        var clickedDate = new Date(clickedFullDate + " 00:00:00");
        console.log(clickedDate) 

        

        //Every other click updates either the startDate or endDate
        if (clickedFullDate != null && is_date1_before_date2(new Date().toString(),clickedFullDate)) { //check to make sure we haven't clicked the same date or the contianer
            if (clickedObject.classList.contains("booked") === false){
                if (clickCounter === 0){
                    if (startDate === null || (endDate !== null && is_date1_before_date2(clickedFullDate,endDate.toString()) && clickedDate.toString() !== startDate.toString())){
                        startDate = clickedDate;
                        clickedObject.classList.add("selected"); 
                        if (lastclickedstart !== null) {
                            // Remove the class from the previously clicked object
                            lastclickedstart.classList.remove("selected");
                        }
                        lastclickedstart = clickedObject;
                    }
                } else if (clickCounter === 1){
                    if (endDate === null || (startDate !== null && is_date1_before_date2(startDate.toString(),clickedFullDate) && clickedDate.toString() !== endDate.toString())){
                        endDate = clickedDate;
                        clickedObject.classList.add("selected");
                        if (lastclickedend !== null) {
                            // Remove the class from the previously clicked object
                            lastclickedend.classList.remove("selected");
                        }
                        lastclickedend = clickedObject;
                    }  
                }
            }
        }
        
        
        //Change text based on date selected
        var displayStartDate = document.getElementById('displayStartDate');
        var displayEndDate = document.getElementById('displayEndDate');
        if (startDate != null){
            displayStartDate.textContent = 'Start date:' + startDate.toString() +"\n";
        }
        if (endDate != null){
            displayEndDate.textContent = 'End date:' + endDate.toString();
        }
        

        if (startDate != null && endDate != null){
            var daysCalc = calculateDays(startDate,endDate);
            //displayPrice.textContent = ' Price:' + Math.ceil(daysCalc * 200);

            //send the info to views so stripe can use this quanity info
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                var l = null;
                }
            };
            xhr.open("POST", 'add', true); //"{% url 'Book Now' %}" issue is here!!
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            //xhr.setRequestHeader("X-CSRFToken", csrftoken);

            var postData = "request_type=return_days"+ 
                "&num_days=" + encodeURIComponent(daysCalc) + 
                "&start_date=" + encodeURIComponent(startDate)+
                    "&end_date=" + encodeURIComponent(endDate);

            xhr.send(postData); //need to send start & end dates here!!
        }
        


        // Toggle the visibility of the start date text
        
        if (startDate != null) {
            displayStartDate.style.display = 'block';
        }

        if (endDate != null) {
            displayEndDate.style.display = 'block';
            //displayPrice.style.display = 'block';
        }
        



        clickCounter = (clickCounter + 1) % 2; //Reset after second click
    });


    function calculateDays(sDate,eDate) { //Takes in Date objects

        // Calculate the difference in days
        const timeDifference = eDate.getTime() - sDate.getTime();
        const daysDifference = (timeDifference / (1000 * 60 * 60 * 24));

        return daysDifference //Return days
    }

    function is_date1_before_date2(strd1,strd2) { //Takes in string of date

        // Calculate the difference in days
        let d1 = new Date(strd1)
        let d2 = new Date(strd2)
        const timeDifference = d1.getTime() - d2.getTime();
        const daysDifference = (timeDifference / (1000 * 60 * 60 * 24))*-1;

        if (daysDifference > 0){ 
            return true;
        } else if (daysDifference <= 0){
            return false;
        }
    }

      */

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
      </div>
    </div>
    )
}