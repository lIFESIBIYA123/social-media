import React from "react";
import { Outlet } from "react-router-dom"
import Navigationbar from "./Navbar";

function Layout(props) {
    return (
        <div>
            <Navigationbar />
            <div className="container m-5">{props.children}</div>
            <Outlet />
        </div>
    );
}

export default Layout;