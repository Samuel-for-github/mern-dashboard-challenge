import {Link, useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {FiLogOut} from "react-icons/fi"
import axios from "axios";
import toast from "react-hot-toast";
import {FaUser} from "react-icons/fa";
import {useEffect, useState} from "react";


function TopBar() {
    const [id, setId] = useState("")
    const [img, setImg] = useState("")
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
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/logo.png" alt="logo" width={100} />
                </Link>
                <div className="flex items-center gap-4">
                    <Button variant="ghost" className="shad-button_ghost" onClick={logout}>
                        <FiLogOut/>
                    </Button>

                    <Link to={`/profile/${id}`} className="flex-center gap-3">
                        {img?(
                            <img src={img} alt="profile" className="rounded-[100%] w-[50px] h-[50px]"/>
                        ):(<FaUser/>)}
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default TopBar;