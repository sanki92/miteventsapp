import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import AuthService from "../services/AuthService";

export default function LoginScreen () {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await AuthService.login( email, password );

        } catch (err) {
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 text-white">
            <div className="flex-1 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-medium text-center mb-10">Welcome Back!</h1>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="loginEmail">Email</Label>
                            <Input 
                                id="loginEmail" 
                                type="email" 
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="bg-black/30 border-0 text-white h-14"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="loginPassword">Password</Label>
                            <Input 
                                id="loginPassword" 
                                type="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="bg-black/30 border-0 text-white h-14"
                                required
                            />
                        </div>
                        <div className="text-center">
                            <a href="#" className="text-sm hover:underline">Forgot Password?</a>
                        </div>
                        {error && <div className="text-red-400 text-center">{error}</div>}
                        <Button className="w-full h-14 bg-black hover:bg-black/80" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "LOGIN"}
                        </Button>
                        <div className="text-center mt-4">
                            <p className="text-sm">
                                New here? <a href="/signup" className="underline">Create an account</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};