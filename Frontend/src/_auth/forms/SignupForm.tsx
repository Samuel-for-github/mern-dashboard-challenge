import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {signUpValidation} from "@/lib/validation";
import {Link} from "react-router-dom";
import {useState} from "react";





function Signupform() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const form = useForm<z.infer<typeof signUpValidation>>({
        resolver: zodResolver(signUpValidation),
        defaultValues: {
            fullName: "",
            password: "",
            email: "",
            username: "",
        },
    })
    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof signUpValidation>) {
        console.log("hi")
try{
    console.log(values)
    setLoading(true)
    const data = await axios.post(`https://localhost:3000/api/v1/users/register`,values)
    console.log(data)
    setError("")
}catch(e:any){
    setLoading(false)
    console.log(e)
    setError(e.response.data.messages)
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
                    <h2 className="h3-bold italic font-serif">Create a new Account</h2>


                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-1 w-full max-md:w-[320px]">
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input className="shad-input" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input className="shad-input" type="text" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                    <p>{error}</p>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input className="shad-input" type="email" {...field} />
                                    </FormControl>
                                    <FormMessage/>
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
                                </FormItem>
                            )}
                        />
                        <Button className="shad-button_primary mt-0 md:mt-1" type="submit">
                            {loading ? (
                                <div className="flex-center gap-2">
                                    Loading...
                                </div>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                        <p className="text-regular text-light-2 mt-0 md:mt-3 text-center">
                            Already have an account? <Link className="text-secondary font-semibold ml-1" to="/sign-in">Log in</Link>
                        </p>
                    </form>
                </div>
            </Form>
        </>
    );
}

export default Signupform;