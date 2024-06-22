import './globals.css'
import {Route, Routes} from "react-router-dom";
import SignInForm from "@/_auth/forms/SignInForm.tsx";
import {Home} from "./_root/pages";
import SignUpForm from "@/_auth/forms/SignUpForm.tsx";
import AuthLayout from "./_auth/AuthLayout.tsx";
import RootLayout from "./_root/RootLayout.tsx";
import MyPost from "@/_root/pages/MyPost.tsx";
function App() {

    return (
        <>
           <main className="flex h-screen">
               <Routes>
                   {/*{public routes}*/}
                   <Route element={<AuthLayout/>}>
                       <Route path={"/sign-in"} element={<SignInForm/>}/>
                       <Route path={"/sign-up"} element={<SignUpForm/>}/>
                   </Route>

               {/*private routes*/}
                   <Route element={<RootLayout/>}>
                       <Route index element={<Home/>} />
                       <Route path="/myPost" element={<MyPost/>} />

                   </Route>
               </Routes>
           </main>
        </>
    );
}

export default App;