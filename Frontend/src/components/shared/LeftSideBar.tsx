import {Link, NavLink, useNavigate, useLocation} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {FaUser} from "react-icons/fa";
import {sideBarLinks} from "../../../constant.js"
import {Button} from "@/components/ui/button.tsx";
import {FiLogOut} from "react-icons/fi";
function LeftSideBar() {
    const {pathname} = useLocation()
    const [id, setId] = useState("")
    const [img, setImg] = useState("")
    const [username, setUsername] = useState("")
    const [name, setName] = useState("")
    const navigate = useNavigate();
    useEffect(() => {
        const getUser = async ()=>{
            try {
                return await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/users/get-user`);
            }catch (e:any){
                navigate("/sign-in")
            }
        }
        getUser().then((res:any)=> {
            const data = res.data.data
            console.log(data)
            setId(data._id)
            setImg(data.profileImage)
            setUsername(data.username)
            setName(data.fullName)
        })
    }, []);
    async function logout() {
        try{
            const data = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/logout`)
            toast.success(data.data.message)
            navigate("/sign-in")
        }catch(e:any){
            console.log(e)
        }
    }

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-5">
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/logo.png" alt="logo" width={130} />
                </Link>
                <Link to={`/profile/${id}`} className="flex gap-3 items-center">
                    {img ? (
                        <img src={img} alt="profile" className="rounded-[100%] w-[50px] h-[50px]"/>
                    ) : (<FaUser/>)}
                    <div className="flex flex-col">
                        <p className="body-bold">
                            {name}

                        </p>
                        <p className="small-regular text-light-3">
                            @{username}
                        </p>
                    </div>
                </Link>

                    <ul className="h-[50vh] flex justify-evenly flex-col gap-9">

                        {sideBarLinks.map((link: any)=>{
                            const isActive = pathname === link.route
                            return (

                                    <NavLink key={link.label} className={`leftsidebar-link bg-main ${isActive && 'bg-primary' } font-bold`} to={link.route}>
                                        {link.label}
                                    </NavLink>

                            )
                        })}
                    </ul>


            </div>
            <Button variant="ghost" className="shad-button_ghost w-fit" onClick={logout}>
                <FiLogOut/>
                Logout
            </Button>
        </nav>
    );
}

export default LeftSideBar;