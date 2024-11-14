import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { differenceInCalendarDays } from "date-fns";
import { Link, useLocation } from "react-router-dom";

export default function BookingsPage(){
    const [bookingList, setBookingList] = useState();
    const {pathname} = useLocation();
    const actualDate = Date.now();
    let action = pathname.split('/')?.[3];

    useEffect(() => {
        axios.get('/user-bookings')
            .then((response) =>{
                if(response.status === 200) {
                    setBookingList(response.data)
                }
            })
    }, []);

    function linkClasses (type=null) {
        let classes = 'inline-flex gap-2 py-2 px-6 rounded-lg shadow-md shadow-gray-250';
        if(type === action){
            classes += ' bg-primary text-white';
        } else classes += ' bg-gray-200';

        return classes
    }
    
    return(
        <>
            <NavBar />
            <nav className="w-full my-6 flex gap-4 justify-center" >
                <Link to="/account/bookings/old" className={linkClasses('old')}> 
                    Old 
                </Link>
                <Link to="/account/bookings/all" className={linkClasses('all')}> 
                    All 
                </Link>
                <Link to="/account/bookings/upcoming" className={linkClasses('upcoming')}> 
                    Upcoming 
                </Link>
            </nav>
                {
                    bookingList?.length > 0 && action === "old" &&  
                                        bookingList?.filter(booking => differenceInCalendarDays(new Date(actualDate), new Date(booking.checkOut)) > 0)
                                        .map((booking, index) => 
                        <>
                            <div className="my-2 bg-gray-100 gap-4  w-full mx-auto flex rounded-lg" key={booking._id + '-' + index}>
                                <div className="w-[180px]" key={index + booking._id}>
                                    {
                                        booking.place.photos.length > 0 && (
                                            <img
                                            src={
                                              "https://wnw-api.onrender.com/uploads/" +
                                              booking.place.photos[0].newName
                                            }
                                            alt=""
                                            className="h-[120px] w-[180px] rounded-lg object-cover"
                                            key={booking.place._id + booking._id}
                                          />
                                        )
                                    }
                                </div>
                                <div className="py-3 w-full" key={booking._id + index}>
                                    <h2 className="text-xl" key={booking.place._id + index}>{booking.place.title}</h2>
                                    
                                    <div className=" border-t-2 border-gray-300 my-1 py-1">
                                        <div className="flex gap-2 items-center text-lg">
                                           <div className="flex gap-1"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                            </svg>
                                            {booking.checkIn.split('T')[0] + ' ' + booking.place.checkIn} </div> 
                                           <span className="">&rarr;</span> 
                                           <div className="flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                            </svg>
                                            {booking.checkOut.split('T')[0] + ' ' + booking.place.checkOut} </div>   
                                        </div> 
                                        <div className="flex gap-x-8">  
                                            <span className="flex gap-x-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                                                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                                </svg>
                                                {booking.numberOfGuests} </span>
                                            <span className="flex gap-x-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-400">
                                                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
                                                    </svg>
                                                    {differenceInCalendarDays(
                                                    new Date(booking.checkOut),
                                                    new Date(booking.checkIn)
                                                    )} </span>
                                            <span className="flex"> 
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-green-400">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.902 7.098a3.75 3.75 0 0 1 3.903-.884.75.75 0 1 0 .498-1.415A5.25 5.25 0 0 0 8.005 9.75H7.5a.75.75 0 0 0 0 1.5h.054a5.281 5.281 0 0 0 0 1.5H7.5a.75.75 0 0 0 0 1.5h.505a5.25 5.25 0 0 0 6.494 2.701.75.75 0 1 0-.498-1.415 3.75 3.75 0 0 1-4.252-1.286h3.001a.75.75 0 0 0 0-1.5H9.075a3.77 3.77 0 0 1 0-1.5h3.675a.75.75 0 0 0 0-1.5h-3c.105-.14.221-.274.348-.402Z" clipRule="evenodd" />
                                                </svg>{booking.price}</span>
                                        </div>
                                        </div>
                                </div>
                            </div>
                        </>
                    )
                }
                 {
                    bookingList?.length > 0 && action === "all" &&  bookingList?.map((booking, index) => 
                        <>
                            <div className="my-2 bg-gray-100 gap-4  w-full mx-auto flex rounded-lg" key={booking._id + '-' + index}>
                                <div className="w-[180px]" key={index + booking._id}>
                                    {
                                        booking.place.photos.length > 0 && (
                                            <img
                                            src={
                                              "https://wnw-api.onrender.com/uploads/" +
                                              booking.place.photos[0].newName
                                            }
                                            alt=""
                                            className="h-[120px] w-[180px] rounded-lg object-cover"
                                            key={booking.place._id + booking._id}
                                          />
                                        )
                                    }
                                </div>
                                <div className="py-3 w-full" key={booking._id + index}>
                                    <h2 className="text-xl" key={booking.place._id + index}>{booking.place.title}</h2>
                                    
                                    <div className=" border-t-2 border-gray-300 mt-1 py-2">
                                    <div className="flex gap-2 items-center text-lg">
                                           <div className="flex gap-1"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                            </svg>
                                            {booking.checkIn.split('T')[0] + ' ' + booking.place.checkIn} </div> 
                                           <span className="">&rarr;</span> 
                                           <div className="flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                            </svg>
                                            {booking.checkOut.split('T')[0] + ' ' + booking.place.checkOut} </div>   
                                        </div> 
                                        <div className="flex gap-x-8">  
                                            <span className="flex gap-x-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                                                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                                </svg>
                                                {booking.numberOfGuests} </span>
                                            <span className="flex gap-x-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-400">
                                                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
                                                    </svg>
                                                    {differenceInCalendarDays(
                                                    new Date(booking.checkOut),
                                                    new Date(booking.checkIn)
                                                    )} </span>
                                            <span className="flex"> 
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-green-400">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.902 7.098a3.75 3.75 0 0 1 3.903-.884.75.75 0 1 0 .498-1.415A5.25 5.25 0 0 0 8.005 9.75H7.5a.75.75 0 0 0 0 1.5h.054a5.281 5.281 0 0 0 0 1.5H7.5a.75.75 0 0 0 0 1.5h.505a5.25 5.25 0 0 0 6.494 2.701.75.75 0 1 0-.498-1.415 3.75 3.75 0 0 1-4.252-1.286h3.001a.75.75 0 0 0 0-1.5H9.075a3.77 3.77 0 0 1 0-1.5h3.675a.75.75 0 0 0 0-1.5h-3c.105-.14.221-.274.348-.402Z" clipRule="evenodd" />
                                                </svg>{booking.price}</span>
                                        </div>
                                        </div>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    bookingList?.length > 0 && action === "upcoming" &&  
                                        bookingList?.filter(booking => differenceInCalendarDays(new Date(actualDate), new Date(booking.checkOut)) <= 0)
                                        .map((booking, index) => 
                        <>
                            <div className="my-2 bg-gray-100 gap-4  w-full mx-auto flex rounded-lg" key={booking._id + '-' + index}>
                                <div className="w-[180px]" key={index + booking._id}>
                                    {
                                        booking.place.photos.length > 0 && (
                                            <img
                                            src={
                                              "https://wnw-api.onrender.com/uploads/" +
                                              booking.place.photos[0].newName
                                            }
                                            alt=""
                                            className="h-[120px] w-[180px] rounded-lg object-cover"
                                            key={booking.place._id + booking._id}
                                          />
                                        )
                                    }
                                </div>
                                <div className="py-3 w-full" key={booking._id + index}>
                                    <h2 className="text-xl" key={booking.place._id + index}>{booking.place.title}</h2>
                                    <div className=" border-t-2 border-gray-300 mt-1 py-2">
                                    <div className="flex gap-2 items-center text-lg">
                                           <div className="flex gap-1"> 
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                            </svg>
                                            {booking.checkIn.split('T')[0] + ' ' + booking.place.checkIn} </div> 
                                           <span className="">&rarr;</span> 
                                           <div className="flex gap-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                            </svg>
                                            {booking.checkOut.split('T')[0] + ' ' + booking.place.checkOut} </div>   
                                        </div> 
                                        <div className="flex gap-x-8">  
                                            <span className="flex gap-x-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                                                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                                </svg>
                                                {booking.numberOfGuests} </span>
                                            <span className="flex gap-x-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-yellow-400">
                                                    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
                                                    </svg>
                                                    {differenceInCalendarDays(
                                                    new Date(booking.checkOut),
                                                    new Date(booking.checkIn)
                                                    )} </span>
                                            <span className="flex"> 
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-green-400">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.902 7.098a3.75 3.75 0 0 1 3.903-.884.75.75 0 1 0 .498-1.415A5.25 5.25 0 0 0 8.005 9.75H7.5a.75.75 0 0 0 0 1.5h.054a5.281 5.281 0 0 0 0 1.5H7.5a.75.75 0 0 0 0 1.5h.505a5.25 5.25 0 0 0 6.494 2.701.75.75 0 1 0-.498-1.415 3.75 3.75 0 0 1-4.252-1.286h3.001a.75.75 0 0 0 0-1.5H9.075a3.77 3.77 0 0 1 0-1.5h3.675a.75.75 0 0 0 0-1.5h-3c.105-.14.221-.274.348-.402Z" clipRule="evenodd" />
                                                </svg>{booking.price}</span>
                                        </div>
                                        </div>
                                </div>
                            </div>
                        </>
                    )
                }
                {
                    bookingList?.length === 0 &&(
                        <div className="text-center text-2xl mt-4">
                            Any booking available!
                        </div>
                    )
                }
        </>
    );
}