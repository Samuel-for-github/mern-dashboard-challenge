import './globals.css'
import {Route, Routes} from "react-router-dom";
import Signinform from "./_auth/forms/Signinform.tsx";
import {Home} from "./_root/pages";
import Signupform from "./_auth/forms/SignupForm.tsx";
import AuthLayout from "./_auth/AuthLayout.tsx";
import RootLayout from "./_root/RootLayout.tsx";
function App() {

    return (
        <>
           <main className="flex h-screen">
               <Routes>
                   {/*{public routes}*/}
                   <Route element={<AuthLayout/>}>
                       <Route path={"/sign-in"} element={<Signinform/>}/>
                       <Route path={"/sign-up"} element={<Signupform/>}/>
                   </Route>

               {/*private routes*/}
                   <Route element={<RootLayout/>}>
                       <Route index element={<Home/>} />
                   </Route>
               </Routes>
           </main>
        </>
    );
}

export default App;