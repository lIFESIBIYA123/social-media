import React from "react";
import { Outlet } from "react-router-dom"
import Navigationbar from "./Navbar";
import React, { createContext, useMemo, useState } from "react";

export const Context = createContext("unknown");

function Layout(props) {
    const [toaster, setToaster] = useState({
        title: "",
        show: false,
        message: "",
        type: "",
    });

    const value = useMemo(() => ({ toaster, setToaster }), [toaster]);

    return (
        <Context.provider value={value}>
            <div>
                <Navigationbar />
                {hasNavigationBack && (
                    <ArrowLeftOutlined
                        style={{
                            color: "#0D6EFD",
                            fontSize: "24px",
                            marginLeft: "5%",
                            marginTop: "1%",
                        }}
                        onClick={() => navigate(-1)}
                    />
                )}
                <div className="container m-5">{props.children}</div>
                
                <Outlet />
            </div>
            <toaster
                title={toaster.title}
                message={toaster.message}
                type={toaster.type}
                showToast={toaster.show}
                onClose={() => setToaster({ ...toaster, show: false})}
            />
        </Context.provider>
        
    );
}

export default Layout;