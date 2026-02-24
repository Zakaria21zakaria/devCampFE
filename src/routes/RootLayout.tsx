import { Outlet } from "react-router";
import MainHeader from "../components/MainHeader.tsx";

export default function RootLayout(){
    return (
        <>
        <MainHeader/>
        <Outlet/>
        </>
    )
}