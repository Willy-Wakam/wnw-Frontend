/* eslint-disable react/prop-types */
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
  } from "@material-tailwind/react";
   
  export default function DropDown({guestsNumber, nbGuests, setNbGuests}) {
    let guestsList = [];
    for (let i = 0; i < guestsNumber; i++) {
        guestsList.push(i + 1);
    }
    return (
      <Menu>
        <MenuHandler className="text-black flex items-center mx-4 py-2 border-2 border-primary px-2 rounded-lg justify-around items-center">
            <button className=""> 
                <span className="text-lg ">{nbGuests} </span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
        </MenuHandler>
        <MenuList className="w-[3%] rounded-none max-sm:w-[15%]">
            {
                guestsList?.length > 0 && guestsList.map((guest, index) => 
                    <MenuItem role="item" key={index} className="p-2 border rounded-none hover:bg-primary hover:text-white hover:font-bold" onClick={() => setNbGuests(guestsList?.[index])}> {guest}</MenuItem>
                    )
            }
        </MenuList>
      </Menu>
    );
  }