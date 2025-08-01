"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import MultiStepForm from "@/components/multistep-form";
import { ModeToggle } from "@/components/mode-toggle";
import { SiReaddotcv } from "react-icons/si";

export default function DashboardPage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-500 to-gray-100 dark:to-purple-900 dark:from-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-gray-100 dark:to-purple-900 dark:from-black">
            {/* Header */}
            <div className="flex justify-between items-center p-4">
                <button className="flex space-x-4 items-center">
                    <SiReaddotcv className="text-4xl flex-shrink-0" />
                    <div className="font-poppins font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl truncate">
                        AI Resume Tailor
                    </div>
                </button>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700 dark:text-gray-300">
                        Welcome, {user.email}
                    </span>
                    <Button
                        variant="outline"
                        onClick={signOut}
                        className="bg-white/10 hover:bg-white/20"
                    >
                        Sign Out
                    </Button>
                    <ModeToggle />
                </div>
            </div>

            {/* Main Content */}
            <main className="py-8">
                <MultiStepForm />
            </main>
        </div>
    );
}
