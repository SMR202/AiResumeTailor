"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SiReaddotcv } from "react-icons/si";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [error, setError] = useState("");

    const handleMagicLinkLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    emailRedirectTo: `${window.location.origin}/dashboard`
                }
            });

            if (error) {
                setError(error.message);
            } else {
                setIsEmailSent(true);
            }
        } catch (error) {
            console.error("Error sending magic link:", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isEmailSent) {
        return (
            <div className="font-poppins min-h-screen bg-gradient-to-br from-purple-500 to-gray-100 dark:to-purple-900 dark:from-black flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardContent className="space-y-6 pt-8 pb-8">
                        <div className="text-center space-y-4">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-8 h-8 text-green-600 dark:text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">
                                    Check Your Email
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mt-2">
                                    We've sent a magic link to
                                </p>
                                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                                    {email}
                                </p>
                            </div>
                            
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Click the link in your email to sign in. The link will expire in 10 minutes.
                                </p>
                            </div>
                            
                            <div className="space-y-3">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setIsEmailSent(false);
                                        setEmail("");
                                    }}
                                    className="w-full"
                                >
                                    Try Different Email
                                </Button>
                                
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-gray-100 dark:to-purple-900 dark:from-black flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardContent className="space-y-6 pt-8 pb-8">
                    {/* Logo and Title */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center items-center space-x-3">
                            <SiReaddotcv className="text-4xl text-blue-600 dark:text-blue-400" />
                            <div className="font-poppins font-extrabold text-2xl text-gray-900 dark:text-white">
                                AI Resume Tailor
                            </div>
                        </div>
                        
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins">
                                Welcome Back
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-2">
                                Sign in to create your perfect resume
                            </p>
                        </div>
                    </div>

                    {/* Magic Link Form */}
                    <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                required
                                disabled={isLoading}
                                className="w-full"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading || !email}
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    <span>Sending Magic Link...</span>
                                </div>
                            ) : (
                                "Send Magic Link"
                            )}
                        </Button>
                    </form>

                    {/* Additional Information */}
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                                    How it works
                                </span>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Enter your email address</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Receive a secure login link via email</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                    <span>Click the link to access your account</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                By signing in, you agree to our{" "}
                                <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Privacy Policy
                                </a>
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
