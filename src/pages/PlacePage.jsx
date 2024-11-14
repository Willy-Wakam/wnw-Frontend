import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import DropDown from "../components/DropDown";
import { differenceInCalendarDays } from "date-fns";
import { UserContext } from "../UserContext";

export default function PlacePage() {
  const {user} = useContext(UserContext);

  const { id } = useParams();
  const [place, setPlace] = useState();
  const [allPhotos, setAllPhotos] = useState(false);
  const [nbGuests, setNbGuests] = useState(1);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(0);
  const [redirect, setRedirect] = useState('');

  let numberOfNights = 0;
  if (checkIn && checkOut)
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );

  useEffect(() => {
    if (user) setName(user?.name);
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id, user]);

  const address = place?.address.split(",");
  const newAddress = address?.[0] + ", " + address?.[address?.length - 1];

  if (allPhotos) {
    return (
      <div className="absolute inset-0 bg-black min-h-screen text-white">
        <div className="">
          <h1 className="text-3xl px-8 items-center">
            Photos of {place?.title}
          </h1>
          <button
            role="delete"
            type="button"
            className="flex text-center bg-primary text-white p-2 hover:bg-white hover:text-black hover:font-bold  fixed right-8 font-bold -mt-9"
            onClick={() => setAllPhotos(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="bg-black px-8 grid gap-4 grid-cols-3 py-2 max-sm:grid-cols-1 ">
          {place?.photos?.map((photo, index) => (
            <img
              src={"https://wnw-api.onrender.com/uploads/" + photo?.newName}
              alt=""
              className="object-cover h-[500px] w-[-webkit-fill-available] max-sm:h-[300px]"
              key={index + photo?.newName} role="img"
            />
          ))}
        </div>
      </div>
    );
  }

  function saveBooking(){
    if(checkIn && checkOut && name && email){
        const bookingData = {
            place: place?._id,
            checkIn: new Date(checkIn),
            checkOut: new Date(checkOut),
            name,
            phone: phoneNumber,
            price: numberOfNights * place?.price,
            numberOfGuests: nbGuests,
            mail: email
        };
        axios.post('/bookings', bookingData)
        .then((response) => {
            if(response.status === 200){
                setRedirect(`/account/bookings/all`)
            }
            }
        )
    }
  }
  if(redirect) return < Navigate to={redirect} />;

  return (
    <div className="mt-4 bg-gray-100 p-8 -mx-8">
      <h1 className="text-3xl">{place?.title}</h1>
      <a
        href={"https://maps.google.com/?q=" + newAddress}
        target="_blank"
        className="flex gap-1 items-center font-semibold underline "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
          />
        </svg>
        {newAddress}
      </a>
      <div className="grid grid-cols-2 h-[800px] w-full mt-2 gap-2 mb-10 max-sm:h-[250px]">
        <div className="">
          {place?.photos?.[0] && (
            <img
              src={
                "https://wnw-api.onrender.com/uploads/" + place?.photos?.[0]?.newName
              }
              alt="img"
              onClick={() => setAllPhotos(true)}
              className="rounded-tl-lg object-cover w-full h-[400px] max-sm:h-[250px] cursor-pointer"
            />
          )}
        </div>
        <div className="group relative flex">
          {place?.photos?.[1] && (
            <img
              src={
                "https://wnw-api.onrender.com/uploads/" + place?.photos?.[1]?.newName
              }
              alt="img"
              onClick={() => setAllPhotos(true)}
              className="rounded-tr-lg object-cover h-[400px] max-sm:h-[250px] w-full cursor-pointer"
            />
          )}
        </div>
        <div className="">
          {place?.photos?.[2] && (
            <img
              src={
                "https://wnw-api.onrender.com/uploads/" + place?.photos?.[2]?.newName
              }
              alt="img"
              onClick={() => setAllPhotos(true)}
              className="rounded-bl-lg object-cover h-[400px] max-sm:h-[250px] w-full cursor-pointer"
            />
          )}
        </div>
        <div className="">
          {place?.photos?.[3] && (
            <img
              src={
                "https://wnw-api.onrender.com/uploads/" + place?.photos?.[3]?.newName
              }
              alt="img"
              onClick={() => setAllPhotos(true)}
              className="rounded-br-lg object-cover h-[400px] max-sm:h-[250px] w-full cursor-pointer"
            />
          )}
        </div>
        <div className="bg-primary text-white w-[200px] gap-2 items-center lg:bottom-[20rem] lg:right-[5rem] md:bottom-[20rem] md:right-[5rem]  
          2xl:bottom-[3rem] xl:right-[5rem] xl:bottom-[20rem]  justify-center p-2 absolute rounded-lg shadow shadow-md shadow-gray-250 2xl:right-[35rem] flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
          </svg>
          <button
            type="button"
            className="font-bold"
            onClick={() => setAllPhotos(true)}
          >
            Show more photos
          </button>
        </div>
      </div>
      <div className="grid grid-cols-[2fr_1fr] items-center gap-2 max-sm:grid-cols-1">
        <div className="rounded-lg p-2 items-center grid grid-cols-[1fr]">
          <div className="my-4 max-sm:mt-[14rem]">
            <h2 className="font-semibold text-2xl">Description</h2>
            {place?.description}
          </div>
          <div className="grid">
            <span className="text-2xl font-semibold">Check In/Out & Guests </span> <br />
            <div className="flex justify-between ">
              <span className="font-bold">Check-In: {place?.checkIn} </span>
              <span className="font-bold">Check-Out: {place?.checkOut} </span>
              <span className="font-bold mx-8">
                Max number of guests: {place?.maxGuests}
              </span>
            </div>
            <div className=" mt-4">
              {place?.extraInfo && (
                <>
                  <span className="text-xl font-bold">Extra information:</span>
                  <br />
                  {place?.extraInfo}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <div className="text-2xl text-center mb-2">
            Price: <span className="font-bold"> €{place?.price}</span>{" "}
            <span className="text-sm">per night</span>
            <br />
          </div>
          <div className="border-2 rounded-lg my-4 border-gray-400">
            <div className="flex">
              <div className="py-3 px-4">
                <label htmlFor="date-in" className="font-bold" >
                  CHECK-IN
                </label>
                <input
                  role="checkin"
                  type="date"
                  name="date-in"
                  id=""
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="py-3 px-4 border-l-2 border-gray-400">
                <label htmlFor="date-out" className="font-bold text-center"  >
                  CHECK-OUT
                </label>
                <input
                  role="checkout"
                  type="date"
                  name="date-out"
                  id=""
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
            <div className="py-3 border-t-2 px-4 grid grid-cols-[2fr_1fr] items-center border-gray-400 text-center">
              <label htmlFor="" className="mx-2 font-bold">
                Guests<span className="font-normal">:</span>
              </label>
              <DropDown
                guestsNumber={place?.maxGuests}
                nbGuests={nbGuests}
                setNbGuests={setNbGuests}
              />
            </div>
          </div>
          {numberOfNights > 0 && (
            <>
              <div
                className=""
                data-hs-pin-input='{
                                "availableCharsRE": "^[0-9]+$"
                                }'
              >
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="name and surname"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="your@mail.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  data-hs-pin-input-item
                  className="w-full border my-3 py-2 px-4 rounded-lg"
                />
              </div>
            </>
          )}
          <button className="primary" onClick={saveBooking}>
            Book now
            {checkIn && checkOut && (
              <span className=""> €{numberOfNights * place?.price}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
