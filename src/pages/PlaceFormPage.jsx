import PerksLabel from "../components/PerksLabel";
import { useEffect, useState } from "react";
import PhotoUploader from "../components/PhotoUploader";
import axios from "axios";
import NavBar from "../components/NavBar";
import { Navigate, useParams } from "react-router-dom";

export default function PlaceFormPage(){

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [guests, setGuests] = useState(1);
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [perks, setPerks] = useState([]);
    const [redirect, setRedirect] = useState(false);
    const [price, setPrice] = useState(50)
    const {id} = useParams();
    const perksList = ['Wifi', 'Parking', 'TV', 'Pets', 'Kitchen']

    useEffect(() => {
        if(!id) return;
        axios.get('places/' + id, {id})
            .then(response => {
                const {data} = response;
                setTitle(data.title);
                setAddress(data.address);
                setDescription(data.description);
                setExtraInfo(data.extraInfo);
                setCheckin(data.checkIn);
                setCheckout(data.checkOut);
                setGuests(data.maxGuests);
                setAddedPhotos(data.photos);
                setPerks(data.perks);
                setPrice(data.price)
            })
    }, [id])

    function change(val, func){
        func(val.target.value);
    }

    if(redirect){
        return <Navigate to={'/account/places'} />;
    }

    async function updateOrAddNewPlace(ev){
        const placeData = {
            title, address,
            addedPhotos, description,
            perks, extraInfo,
            checkin, checkout, guests, price
        }
        ev.preventDefault();
        if(id){
            await axios.put('/places', {
                id, ...placeData
            });
            setRedirect(true);
        }else {
            await axios.post('/places', placeData);
            setRedirect(true);
        }
        
    }

    return (
        <>
            <NavBar />
                    <div>
                        <form onSubmit={updateOrAddNewPlace}>
                            <h2 className="text-2xl mt-4">Title</h2>
                            <p className="text-gray-400 text-sm -mb-3">Title for your place. Should be short and catchy as in advertisement.</p>
                            <input type="text" placeholder="title" name="title" id="title" value={title} onChange={e => change(e, setTitle)}/>
                            <h2 className="text-2xl mt-4">Address</h2>
                            <p className="text-gray-400 text-sm -mb-3">Address for this place.</p>
                            <input type="text" name="" id="address" placeholder="address" value={address} onChange={e => change(e, setAddress)}/>
                            <h2 className="text-2xl mt-4">Photos</h2>
                            <p className="text-gray-400 text-sm -mb-3">more = better.</p> 
                            <PhotoUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                            <h2 className="text-2xl mt-4">Description</h2>
                            <p className="text-gray-400 text-sm -mb-3">Description of the place.</p>
                            <textarea id="description" value={description} onChange={e => change(e, setDescription)}/>
                            <h2 className="text-2xl mt-4">Perks</h2>
                            <p className="text-gray-400 text-sm">Select all the perks of your place.</p> 
                            <PerksLabel selected={perks} onChange={setPerks} perksList={perksList}/>
                            <h2 className="text-2xl mt-4">Extra info</h2>
                            <p className="text-gray-400 text-sm -mb-3">Information about the house rules.</p> 
                            <textarea value={extraInfo} onChange={e => change(e, setExtraInfo)}/>
                            
                            <h2 className="text-2xl mt-4">Check in&out times</h2>
                            <p className="text-gray-400 text-sm">Add check in and out times. Remember to have some time window for cleaning between guests.</p> 
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                <div>
                                    <h4 className=" mb-1">Check-in</h4>
                                    <input type="time" name="" id="checkin" className="border py-2 px-6 rounded-lg" value={checkin} onChange={e => change(e, setCheckin)}/>
                                </div>
                                <div>
                                    <h4 className="mb-1">Check-out</h4>
                                    <input type="time" name="" id="checkout" className="border py-2 px-6 rounded-lg" value={checkout} onChange={e => change(e, setCheckout)}/>
                                </div>
                                <div>
                                    <h4 className="mb-1">Max number of guests</h4>
                                    <input type="number" name="" id="guests" className="border py-2 px-6 rounded-lg" value={guests} onChange={e => change(e, setGuests)}/>
                                </div>
                                <div>
                                    <h4 className="mb-1">Price per night</h4>
                                    <input type="number" name="" id="guests" className="border py-2 px-6 rounded-lg" value={price} onChange={e => change(e, setPrice)}/>
                                </div>
                            </div>
                            <button type="submit" className="primary my-4">Save</button>
                        </form>
                    </div>
        </>
    )
}