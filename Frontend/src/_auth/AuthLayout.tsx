
import {Outlet, Navigate} from "react-router-dom";

function AuthLayout() {


    const isAuthenticated = false
    return (

        <>
            {isAuthenticated?(
                <Navigate to="/"/>
            ):(
                <>
                <section className="flex flex-1 justify-center items-center bg-[url(/background.png)] bg-cover flex-col">
                    <Outlet/>
                </section>

                </>
            )}
        </>
    );
}

export default AuthLayout;