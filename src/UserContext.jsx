/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({children}){

    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const [logout, setLogout] = useState(false);
    const [redirect, setRedirect] = useState('');
    const [usersList, setUsersList] = useState([]);
    const [addedPlacesList, setAddedPlacesList] = useState([]);

    useEffect(() => {
        if(!user){
            axios.get('/profile')
                .then(({data}) => {
                    setUser(data);
                    setReady(true);
                });
            
        };
        axios.get('/users')
        .then(response => 
            setUsersList(response.data)
        );
        if(user){
            axios.get("/user-places").then((response) => {
                setAddedPlacesList(response.data);
              });
        }
        
    }, [user, usersList])

    return (
       <UserContext.Provider value={{user, setUser, ready, logout, setLogout, redirect, setRedirect, usersList, addedPlacesList}}>
         {
            children
        }
       </UserContext.Provider >
    )
}