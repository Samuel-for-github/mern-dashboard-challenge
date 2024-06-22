import {useState} from "react";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {signInValidation} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import axios from "axios";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";


axios.defaults.withCredentials = true;

function SignInForm() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [error2, setError2] = useState("")
    const form = useForm<z.infer<typeof signInValidation>>({
        resolver: zodResolver(signInValidation),
        defaultValues: {
            password: "",
            email: "",
        },
    })
    const navigate = useNavigate();
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signInValidation>) {
        try{
            setLoading(true)
            const data = await axios.post(`${import.meta.env.VITE_API_URL}/api/v1/users/login`,values)

            // const session = data.data.data.accessToken

            toast.success(data.data.message)
            navigate("/")
            setError("")
        }catch(e:any){
            toast.error("User Login Failed")
            console.log(e)
            setLoading(false)
            const e1 =e.response.data.messages
            if (e1.includes("User")) {
                setError(e1)
            }
            else {
                setError2(e1)
            }

        }
        finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Form {...form}>
                <div className="sm:w-420 flex-center flex-col justify-evenly">
                    <img src="/logo.png" alt="logo" className="w-1/4"/>
                    <h2 className="h3-bold italic font-serif">Log In</h2>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 w-full max-md:w-[320px]">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="shad-input" type="email" {...field} />
                                    </FormControl>
                                    {/*<FormMessage/>*/}
                                    <p>{error}</p>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input className="shad-input" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                    {error2}
                                </FormItem>
                            )}
                        />
                        <Button className="shad-button_primary mt-5" type="submit">
                            {loading ? (
                                <div className="flex-center gap-2">
                                    Loading...
                                </div>
                            ) : (
                                "Log In"
                            )}
                        </Button>
                        <p className="text-regular text-light-2 mt-0 md:mt-3 text-center">
                            Don't have an account? <Link className="text-secondary font-semibold ml-1" to="/sign-up">Sign Up</Link>
                        </p>
                    </form>
                </div>
            </Form>
        </>
    );
}

export default SignInForm;