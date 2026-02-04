import { Outlet } from "react-router";
import MainHeader from "../components/MainHeader";

export default function RootLayout(){
    return (
        <>
        <MainHeader/>
        <Outlet/>
        </>
    )
}