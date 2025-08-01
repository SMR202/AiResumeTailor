"use client";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br to-purple-500 from-white dark:to-purple-900 dark:from-black">
            <Header />
            {/* Main content section */}
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text content */}
                    <div className="space-y-6 font-poppins">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                            Tailor Your Resume.
                            <br />
                            <span className="text-blue-600 dark:text-blue-400">
                                Land the Job.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                            Craft the perfect resume for any job in seconds.
                            Powered by AI, Resume Tailor rewrites and optimizes
                            your resume to match job descriptions — no
                            experience required.
                        </p>

                        <div className="pt-4">
                            <Button 
                                className="btn btn-primary text-lg px-8 py-6 shadow-lg hover:shadow-lg transition-all duration-300 rounded-3xl hover:cursor-pointer hover:shadow-purple-500"
                                onClick={() => window.location.href = '/login'}
                            >
                                Get Started
                            </Button>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="bg-white dark:bg-black p-6 rounded-4xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 max-w-md">
                            <Image
                                src="/Resume_Template.webp"
                                alt="Resume Template Preview"
                                width={400}
                                height={600}
                                className="w-full h-auto rounded-3xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Animated STANDOUT text */}
            <div className="w-full overflow-hidden whitespace-nowrap py-4">
                <div className="text-[17vw] font-extrabold inline-block animate-scroll opacity-20">
                    STANDOUT&nbsp;&nbsp;&nbsp;&nbsp;STANDOUT&nbsp;&nbsp;&nbsp;&nbsp;STANDOUT&nbsp;&nbsp;&nbsp;&nbsp;STANDOUT
                </div>
            </div>
        </div>
    );
}
