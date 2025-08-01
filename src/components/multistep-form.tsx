"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress"; 
import { Textarea } from "@/components/ui/textarea";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useAuth } from "@/contexts/AuthContext";


export default function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const { user } = useAuth();
    
    const [formData, setFormData] = useState({
        // Step 1: Personal Info
        fullName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        githubPortfolio: "",
        objective: "",
        
        // Step 2: Education
        education: [{
            school: "",
            degree: "",
            startDate: "",
            endDate: "",
            gpa: "",
            achievements: ""
        }],
        relevantCoursework: "",
        
        // Step 3: Leadership/Extracurricular
        leadership: [{
            title: "",
            organization: "",
            startDate: "",
            endDate: "",
            description: ""
        }],
        
        // Step 4: Experience
        experience: [{
            jobTitle: "",
            company: "",
            startDate: "",
            endDate: "",
            location: "",
            description: ""
        }],
        
        // Step 5: Skills
        skills: "",
        
        // Step 6: Projects
        projects: [{
            name: "",
            description: "",
            techStack: "",
            link: ""
        }],
        
        // Step 7: Certifications
        certifications: [{
            title: "",
            issuer: "",
            date: "",
            description: ""
        }],
        
        // Step 8: Job Information
        jobTitle: "",
        jobDescription: ""
    });

    // Load user data on component mount
    useEffect(() => {
        const loadUserData = async () => {
            if (!user?.id) {
                setIsLoadingData(false);
                return;
            }

            try {
                const response = await fetch(`/api/user-data?userId=${user.id}`);
                if (response.ok) {
                    const { data } = await response.json();
                    if (data) {
                        setFormData(prev => ({
                            ...prev,
                            ...data,
                            // Ensure arrays have at least one empty item for form functionality
                            education: data.education?.length > 0 ? data.education : prev.education,
                            leadership: data.leadership?.length > 0 ? data.leadership : prev.leadership,
                            experience: data.experience?.length > 0 ? data.experience : prev.experience,
                            projects: data.projects?.length > 0 ? data.projects : prev.projects,
                            certifications: data.certifications?.length > 0 ? data.certifications : prev.certifications,
                        }));
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setIsLoadingData(false);
            }
        };

        loadUserData();
    }, [user?.id]);

    // Save user data
    const saveUserData = async () => {
        if (!user?.id || !user?.email) return;

        try {
            const response = await fetch('/api/user-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    ...formData,
                    email: user.email, // Ensure we use the authenticated user's email
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    };


    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Save data to MongoDB before generating PDF
            await saveUserData();
            
            const response = await fetch('https://n8n.sameeramjad.xyz/webhook/f83e7b0c-5171-445a-a1a8-b89c52db0459', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                console.error("Failed to submit form data");
                setIsLoading(false);
                return;
            }

            // Check if response is PDF
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/pdf')) {
                // Handle PDF response
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${formData.fullName}_Resume.pdf` || 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                console.log("Resume PDF downloaded successfully");
            } else {
                // Handle JSON response (if webhook returns JSON with PDF URL)
                const result = await response.json();
                if (result.pdfUrl) {
                    // If the response contains a PDF URL
                    const link = document.createElement('a');
                    link.href = result.pdfUrl;
                    link.download = `${formData.fullName}_Resume.pdf` || 'resume.pdf';
                    link.click();
                } else {
                    console.log("Form submitted successfully:", result);
                }
            }
            
            setIsLoading(false);
            setIsComplete(true);
        } catch (error) {
            console.error("Error submitting form:", error);
            setIsLoading(false);
        }
    }

    const nextStep = async () => {
        // Auto-save data when proceeding to next step
        await saveUserData();
        setStep((s) => s + 1);
    };
    const prevStep = () => setStep((s) => s - 1);
    
    const totalSteps = 8;

    // Helper functions to add/remove entries
    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, {
                school: "",
                degree: "",
                startDate: "",
                endDate: "",
                gpa: "",
                achievements: ""
            }]
        });
    };

    const removeEducation = (index: number) => {
        setFormData({
            ...formData,
            education: formData.education.filter((_, i) => i !== index)
        });
    };

    const updateEducation = (index: number, field: string, value: string) => {
        const updated = formData.education.map((edu, i) => 
            i === index ? { ...edu, [field]: value } : edu
        );
        setFormData({ ...formData, education: updated });
    };

    const addLeadership = () => {
        setFormData({
            ...formData,
            leadership: [...formData.leadership, {
                title: "",
                organization: "",
                startDate: "",
                endDate: "",
                description: ""
            }]
        });
    };

    const removeLeadership = (index: number) => {
        setFormData({
            ...formData,
            leadership: formData.leadership.filter((_, i) => i !== index)
        });
    };

    const updateLeadership = (index: number, field: string, value: string) => {
        const updated = formData.leadership.map((lead, i) => 
            i === index ? { ...lead, [field]: value } : lead
        );
        setFormData({ ...formData, leadership: updated });
    };

    const addExperience = () => {
        setFormData({
            ...formData,
            experience: [...formData.experience, {
                jobTitle: "",
                company: "",
                startDate: "",
                endDate: "",
                location: "",
                description: ""
            }]
        });
    };

    const removeExperience = (index: number) => {
        setFormData({
            ...formData,
            experience: formData.experience.filter((_, i) => i !== index)
        });
    };

    const updateExperience = (index: number, field: string, value: string) => {
        const updated = formData.experience.map((exp, i) => 
            i === index ? { ...exp, [field]: value } : exp
        );
        setFormData({ ...formData, experience: updated });
    };

    const addProject = () => {
        setFormData({
            ...formData,
            projects: [...formData.projects, {
                name: "",
                description: "",
                techStack: "",
                link: ""
            }]
        });
    };

    const removeProject = (index: number) => {
        setFormData({
            ...formData,
            projects: formData.projects.filter((_, i) => i !== index)
        });
    };

    const updateProject = (index: number, field: string, value: string) => {
        const updated = formData.projects.map((proj, i) => 
            i === index ? { ...proj, [field]: value } : proj
        );
        setFormData({ ...formData, projects: updated });
    };

    const addCertification = () => {
        setFormData({
            ...formData,
            certifications: [...formData.certifications, {
                title: "",
                issuer: "",
                date: "",
                description: ""
            }]
        });
    };

    const removeCertification = (index: number) => {
        setFormData({
            ...formData,
            certifications: formData.certifications.filter((_, i) => i !== index)
        });
    };

    const updateCertification = (index: number, field: string, value: string) => {
        const updated = formData.certifications.map((cert, i) => 
            i === index ? { ...cert, [field]: value } : cert
        );
        setFormData({ ...formData, certifications: updated });
    }; 

    const stepNames = [
        "Personal Info",
        "Education", 
        "Leadership",
        "Experience",
        "Skills",
        "Projects",
        "Certifications",
        "Job Target"
    ];

    return (
        <div className="max-w-4xl mx-auto mt-10 font-poppins">
            <Card>
                <CardContent className="space-y-4 pt-6">
                    {/* Data Loading Screen */}
                    {isLoadingData && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-xl font-semibold mt-6 mb-2 text-center">Loading Your Data</h2>
                            <p className="text-gray-600 text-center">Please wait while we retrieve your information...</p>
                        </div>
                    )}

                    {/* Loading Screen */}
                    {!isLoadingData && isLoading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin"></div>
                                <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Generating Your Tailored Resume</h2>
                            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md">
                                Our AI is analyzing your information and the job description to create the perfect resume for you. This may take a few moments...
                            </p>
                            <div className="flex items-center mt-6 space-x-2">
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                        </div>
                    )}

                    {/* Success Screen */}
                    {isComplete && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold mb-4 text-center text-green-600 dark:text-green-400">
                                Resume Generated Successfully!
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-center max-w-md mb-8">
                                Your tailored resume has been generated and downloaded. The AI has optimized your resume to match the job description you provided.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button 
                                    onClick={() => {
                                        setIsComplete(false);
                                        setStep(1);
                                        // Reset form data to empty state if needed
                                    }} 
                                    variant="outline"
                                    className="px-6 py-3"
                                >
                                    Create Another Resume
                                </Button>
                                <Button 
                                    onClick={() => window.location.href = '/'}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700"
                                >
                                    Back to Home
                                </Button>
                            </div>
                            <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                                    <strong>Pro Tip:</strong> Your resume has been tailored specifically for the "{formData.jobTitle}" position. 
                                    For different job applications, consider creating additional tailored versions.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Form Steps - Only show when not loading data, not generating PDF, and not complete */}
                    {!isLoadingData && !isLoading && !isComplete && (
                        <>
                            {/* Breadcrumb Navigation */}
                            <Breadcrumb className="mb-6 justify-center flex">
                        <BreadcrumbList>
                            {stepNames.map((stepName, index) => {
                                const stepNumber = index + 1;
                                const isCurrentStep = stepNumber === step;
                                const isCompletedStep = stepNumber < step;
                                
                                return (
                                    <div key={stepNumber} className="flex items-center">
                                        <BreadcrumbItem>
                                            {isCurrentStep ? (
                                                <BreadcrumbPage className="font-semibold text-blue-600">
                                                    {stepName}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink 
                                                    href="#" 
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (isCompletedStep) {
                                                            setStep(stepNumber);
                                                        }
                                                    }}
                                                    className={`${isCompletedStep 
                                                        ? 'text-green-600 hover:text-green-800 cursor-pointer' 
                                                        : 'text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {stepName}
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {stepNumber < stepNames.length && (
                                            <BreadcrumbSeparator className="mx-4" />
                                        )}
                                    </div>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                    
                    <Progress value={(step / totalSteps) * 100} className="mb-8" />
                    
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input
                                        value={formData.fullName}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                fullName: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                email: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone Number</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                phone: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location (City, Country)</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                location: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>LinkedIn URL</Label>
                                    <Input
                                        value={formData.linkedin}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                linkedin: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>GitHub/Portfolio URL</Label>
                                    <Input
                                        value={formData.githubPortfolio}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                githubPortfolio: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Personal Summary / Objective (Optional)</Label>
                                <Textarea
                                    value={formData.objective}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            objective: e.target.value,
                                        })
                                    }
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end mt-5">
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 2: Education */}
                    {step === 2 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Education</h2>
                            {formData.education.map((edu, index) => (
                                <div key={index} className="border p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Education #{index + 1}</h3>
                                        {formData.education.length > 1 && (
                                            <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>School / University Name</Label>
                                            <Input
                                                value={edu.school}
                                                onChange={(e) => updateEducation(index, 'school', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Degree / Program</Label>
                                            <Input
                                                value={edu.degree}
                                                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Start Date</Label>
                                            <Input
                                                type="month"
                                                value={edu.startDate}
                                                onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Date / Present</Label>
                                            <Input
                                                type="month"
                                                value={edu.endDate}
                                                onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                                                placeholder="Leave empty if present"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>GPA / Grade (Optional)</Label>
                                            <Input
                                                value={edu.gpa}
                                                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Achievements (Optional)</Label>
                                        <Textarea
                                            value={edu.achievements}
                                            onChange={(e) => updateEducation(index, 'achievements', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addEducation} className="w-full">
                                Add Another Education
                            </Button>
                            
                            {/* Relevant Coursework Section */}
                            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <h3 className="text-lg font-semibold mb-4">Relevant Coursework</h3>
                                <div className="space-y-2">
                                    <Label>List relevant courses (comma-separated)</Label>
                                    <Textarea
                                        value={formData.relevantCoursework}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                relevantCoursework: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Data Structures, Algorithms, Database Systems, Machine Learning, Web Development"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 3: Leadership/Extracurricular */}
                    {step === 3 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Leadership & Extracurricular Activities</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Include leadership roles, volunteer work, clubs, organizations, and other extracurricular activities.
                            </p>
                            {formData.leadership.map((lead, index) => (
                                <div key={index} className="border p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Activity #{index + 1}</h3>
                                        {formData.leadership.length > 1 && (
                                            <Button variant="destructive" size="sm" onClick={() => removeLeadership(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title/Role</Label>
                                            <Input
                                                value={lead.title}
                                                onChange={(e) => updateLeadership(index, 'title', e.target.value)}
                                                placeholder="e.g., President, Volunteer, Team Leader"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Organization/Club</Label>
                                            <Input
                                                value={lead.organization}
                                                onChange={(e) => updateLeadership(index, 'organization', e.target.value)}
                                                placeholder="e.g., Student Government, Red Cross, Debate Club"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Start Date</Label>
                                            <Input
                                                type="month"
                                                value={lead.startDate}
                                                onChange={(e) => updateLeadership(index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Date / Present</Label>
                                            <Input
                                                type="month"
                                                value={lead.endDate}
                                                onChange={(e) => updateLeadership(index, 'endDate', e.target.value)}
                                                placeholder="Leave empty if present"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description & Achievements</Label>
                                        <Textarea
                                            value={lead.description}
                                            onChange={(e) => updateLeadership(index, 'description', e.target.value)}
                                            placeholder="Describe your role, responsibilities, and achievements..."
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addLeadership} className="w-full">
                                Add Another Activity
                            </Button>
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 4: Experience */}
                    {step === 4 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
                            {formData.experience.map((exp, index) => (
                                <div key={index} className="border p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
                                        {formData.experience.length > 1 && (
                                            <Button variant="destructive" size="sm" onClick={() => removeExperience(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Job Title</Label>
                                            <Input
                                                value={exp.jobTitle}
                                                onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Company Name</Label>
                                            <Input
                                                value={exp.company}
                                                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Start Date</Label>
                                            <Input
                                                type="month"
                                                value={exp.startDate}
                                                onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>End Date / Present</Label>
                                            <Input
                                                type="month"
                                                value={exp.endDate}
                                                onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                                                placeholder="Leave empty if present"
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Location</Label>
                                            <Input
                                                value={exp.location}
                                                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description / Responsibilities</Label>
                                        <Textarea
                                            value={exp.description}
                                            onChange={(e) => updateExperience(index, 'description', e.target.value)}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addExperience} className="w-full">
                                Add Another Experience
                            </Button>
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 5: Skills */}
                    {step === 5 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Skills</h2>
                            <div className="space-y-2">
                                <Label>List of Skills (comma-separated)</Label>
                                <Textarea
                                    value={formData.skills}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            skills: e.target.value,
                                        })
                                    }
                                    placeholder="e.g., JavaScript, React, Node.js, Python, SQL, Git"
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 6: Projects */}
                    {step === 6 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Projects (Optional)</h2>
                            {formData.projects.map((project, index) => (
                                <div key={index} className="border p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Project #{index + 1}</h3>
                                        {formData.projects.length > 1 && (
                                            <Button variant="destructive" size="sm" onClick={() => removeProject(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Project Name</Label>
                                            <Input
                                                value={project.name}
                                                onChange={(e) => updateProject(index, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Project Link (GitHub/Live)</Label>
                                            <Input
                                                value={project.link}
                                                onChange={(e) => updateProject(index, 'link', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label>Tech Stack</Label>
                                            <Input
                                                value={project.techStack}
                                                onChange={(e) => updateProject(index, 'techStack', e.target.value)}
                                                placeholder="e.g., React, Node.js, MongoDB"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Short Description</Label>
                                        <Textarea
                                            value={project.description}
                                            onChange={(e) => updateProject(index, 'description', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addProject} className="w-full">
                                Add Another Project
                            </Button>
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 7: Certifications */}
                    {step === 7 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Certifications / Awards (Optional)</h2>
                            {formData.certifications.map((cert, index) => (
                                <div key={index} className="border p-4 rounded-lg space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">Certification #{index + 1}</h3>
                                        {formData.certifications.length > 1 && (
                                            <Button variant="destructive" size="sm" onClick={() => removeCertification(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Title</Label>
                                            <Input
                                                value={cert.title}
                                                onChange={(e) => updateCertification(index, 'title', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Issuer</Label>
                                            <Input
                                                value={cert.issuer}
                                                onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Input
                                                type="month"
                                                value={cert.date}
                                                onChange={(e) => updateCertification(index, 'date', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={cert.description}
                                            onChange={(e) => updateCertification(index, 'description', e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addCertification} className="w-full">
                                Add Another Certification
                            </Button>
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button onClick={nextStep}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}

                    {/* Step 8: Job Information */}
                    {step === 8 && (
                        <>
                            <h2 className="text-2xl font-bold mb-4">Job Target</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Provide the job details to tailor your resume specifically for this position.
                            </p>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label>Job Title</Label>
                                    <Input
                                        value={formData.jobTitle}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                jobTitle: e.target.value,
                                            })
                                        }
                                        placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Job Description</Label>
                                    <Textarea
                                        value={formData.jobDescription}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                jobDescription: e.target.value,
                                            })
                                        }
                                        placeholder="Paste the complete job description here, including requirements, responsibilities, and qualifications..."
                                        rows={10}
                                        className="min-h-[250px]"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-between mt-5">
                                <Button variant="outline" onClick={prevStep}>
                                    Back
                                </Button>
                                <Button 
                                    onClick={handleSubmit} 
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        'Generate Tailored Resume'
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                    </>
                    )}

                </CardContent>
            </Card>
        </div>
    );
}
