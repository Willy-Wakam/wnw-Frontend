import { Outlet } from "react-router-dom";
import Header from "./components/Header";


export default function Layout(){

    return (
        <>
            <div className="py-4 px-8 flex flex-col min-h-screen 2xl:mx-[25rem]">
                <Header />
                <Outlet />
            </div>
        </>
    )
}