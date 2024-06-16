import './globals.css'
import {Route, Routes} from "react-router-dom";
import Signinform from "./_auth/forms/Signinform.tsx";
import {Home} from "./_root/pages";
import Signupform from "./_auth/forms/SignupForm.tsx";
function App() {
    return (
        <>
           <main className="flex h-screen">
               <Routes>
                   {/*{public routes}*/}
                   <Route path={"/sign-in"} element={<Signinform/>}/>
                   <Route path={"/sign-up"} element={<Signupform/>}/>
               {/*private routes*/}
                   <Route index element={<Home/>} />

               </Routes>
           </main>
        </>
    );
}

export default App;