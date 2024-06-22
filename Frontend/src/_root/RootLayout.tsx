import axios from "axios";
// import {Button} from "@/components/ui/button.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import TopBar from "@/components/shared/TopBar.tsx";
import LeftSideBar from "@/components/shared/LeftSideBar.tsx";
import BottomBar from "@/components/shared/BottomBar.tsx";

axios.defaults.withCredentials=true

function RootLayout() {
    const navigate = useNavigate();
    useEffect(() => {
        const getUser = async ()=>{
            try {
                return await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/get-user`);
            }catch (e:any){
                navigate("/sign-in")
            }
        }
        getUser().then(()=>console.log("Authorised"))
        // const user = getUser().then((res:any)=>console.log(res.data))
    }, []);



    return (
        <div className="w-full md:flex ">
            <TopBar/>
            <LeftSideBar/>
            <section className="flex flex-1 h-full">
                <Outlet/>
            </section>
            <BottomBar/>
            {/*<Button onClick={logout}>Logout</Button>*/}
        </div>
    );
}

export default RootLayout;