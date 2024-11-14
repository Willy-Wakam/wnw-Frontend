import { useContext } from "react"
import { UserContext } from "../UserContext"
import { Navigate } from "react-router-dom";
import axios from "axios";
import NavBar from "../components/NavBar";

export default function AccountPage(){

    const { ready, user, setUser, logout, setLogout} = useContext(UserContext);

    async function logoutUser(){
        await axios.post('/logout');
        setUser(null);
        setLogout(true);

    }

    if(!ready) return 'Loading...';

    if(logout) { return < Navigate to={'/'} />};

    if(!user && ready) { return <Navigate to="/login" />; }

    return (
        <div className="">
            
            <NavBar />
                    <div className="text-center  max-w-lg mx-auto mt-4">
                        Logged as {user.name} ({user.email})
                        <br />
                        <button onClick={logoutUser} className="primary max-w-sm mt-4"> Logout </button>
                    </div>
        </div>
    )
}