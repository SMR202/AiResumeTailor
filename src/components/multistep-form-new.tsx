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
                    email: user.email,
                    ...formData
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
        
        // Save data to MongoDB first
        await saveUserData();
        
        try {
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
                link.download = 'resume.pdf';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Expected PDF response but got:", contentType);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
            setIsComplete(true);
        }
    };

    const handleNext = () => {
        if (step < 8) {
            setStep(step + 1);
            // Save data when moving to next step
            saveUserData();
        }
    };

    const handlePrevious = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [...prev.education, {
                school: "",
                degree: "",
                startDate: "",
                endDate: "",
                gpa: "",
                achievements: ""
            }]
        }));
    };

    const removeEducation = (index: number) => {
        if (formData.education.length > 1) {
            setFormData(prev => ({
                ...prev,
                education: prev.education.filter((_, i) => i !== index)
            }));
        }
    };

    const updateEducation = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            education: prev.education.map((edu, i) => 
                i === index ? { ...edu, [field]: value } : edu
            )
        }));
    };

    const addLeadership = () => {
        setFormData(prev => ({
            ...prev,
            leadership: [...prev.leadership, {
                title: "",
                organization: "",
                startDate: "",
                endDate: "",
                description: ""
            }]
        }));
    };

    const removeLeadership = (index: number) => {
        if (formData.leadership.length > 1) {
            setFormData(prev => ({
                ...prev,
                leadership: prev.leadership.filter((_, i) => i !== index)
            }));
        }
    };

    const updateLeadership = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            leadership: prev.leadership.map((lead, i) => 
                i === index ? { ...lead, [field]: value } : lead
            )
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, {
                jobTitle: "",
                company: "",
                startDate: "",
                endDate: "",
                location: "",
                description: ""
            }]
        }));
    };

    const removeExperience = (index: number) => {
        if (formData.experience.length > 1) {
            setFormData(prev => ({
                ...prev,
                experience: prev.experience.filter((_, i) => i !== index)
            }));
        }
    };

    const updateExperience = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) => 
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, {
                name: "",
                description: "",
                techStack: "",
                link: ""
            }]
        }));
    };

    const removeProject = (index: number) => {
        if (formData.projects.length > 1) {
            setFormData(prev => ({
                ...prev,
                projects: prev.projects.filter((_, i) => i !== index)
            }));
        }
    };

    const updateProject = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.map((proj, i) => 
                i === index ? { ...proj, [field]: value } : proj
            )
        }));
    };

    const addCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [...prev.certifications, {
                title: "",
                issuer: "",
                date: "",
                description: ""
            }]
        }));
    };

    const removeCertification = (index: number) => {
        if (formData.certifications.length > 1) {
            setFormData(prev => ({
                ...prev,
                certifications: prev.certifications.filter((_, i) => i !== index)
            }));
        }
    };

    const updateCertification = (index: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            certifications: prev.certifications.map((cert, i) => 
                i === index ? { ...cert, [field]: value } : cert
            )
        }));
    };

    const stepTitles = [
        "Personal Info",
        "Education",
        "Leadership",
        "Experience", 
        "Skills",
        "Projects",
        "Certifications",
        "Job Information"
    ];

    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-base-content">Loading your data...</p>
                </div>
            </div>
        );
    }

    if (isComplete) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="mb-8">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-success flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-base-content mb-2">Resume Generated Successfully!</h2>
                        <p className="text-base-content/70">Your tailored resume has been downloaded automatically.</p>
                    </div>
                    <Button onClick={() => {setIsComplete(false); setStep(1);}} className="btn btn-primary">
                        Create Another Resume
                    </Button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="mt-4 text-base-content">Generating your tailored resume...</p>
                    <p className="text-sm text-base-content/70 mt-2">This may take a few moments</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 p-4">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb Navigation */}
                <div className="mb-6">
                    <Breadcrumb>
                        <BreadcrumbList>
                            {stepTitles.map((title, index) => (
                                <div key={index} className="flex items-center">
                                    <BreadcrumbItem>
                                        {index + 1 === step ? (
                                            <BreadcrumbPage className="font-medium text-primary">
                                                {title}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink 
                                                className={`cursor-pointer ${index + 1 < step ? 'text-success' : 'text-base-content/50'}`}
                                                onClick={() => setStep(index + 1)}
                                            >
                                                {title}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index < stepTitles.length - 1 && <BreadcrumbSeparator />}
                                </div>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm text-base-content/70 mb-2">
                        <span>Step {step} of {stepTitles.length}</span>
                        <span>{Math.round((step / stepTitles.length) * 100)}% Complete</span>
                    </div>
                    <Progress value={(step / stepTitles.length) * 100} className="h-2" />
                </div>

                <Card className="w-full">
                    <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-6 text-center">
                            Step {step}: {stepTitles[step - 1]}
                        </h2>

                        {/* Step 1: Personal Info */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <Label htmlFor="fullName">Full Name *</Label>
                                        <Input
                                            id="fullName"
                                            value={formData.fullName}
                                            onChange={(e) => handleInputChange("fullName", e.target.value)}
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="phone">Phone *</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="location">Location *</Label>
                                        <Input
                                            id="location"
                                            value={formData.location}
                                            onChange={(e) => handleInputChange("location", e.target.value)}
                                            placeholder="Enter your location"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                        <Input
                                            id="linkedin"
                                            value={formData.linkedin}
                                            onChange={(e) => handleInputChange("linkedin", e.target.value)}
                                            placeholder="Enter your LinkedIn URL"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <Label htmlFor="githubPortfolio">GitHub/Portfolio</Label>
                                        <Input
                                            id="githubPortfolio"
                                            value={formData.githubPortfolio}
                                            onChange={(e) => handleInputChange("githubPortfolio", e.target.value)}
                                            placeholder="Enter your GitHub or portfolio URL"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="objective">Professional Objective *</Label>
                                    <Textarea
                                        id="objective"
                                        value={formData.objective}
                                        onChange={(e) => handleInputChange("objective", e.target.value)}
                                        placeholder="Write a brief professional objective or summary"
                                        className="h-32"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Education */}
                        {step === 2 && (
                            <div className="space-y-6">
                                {formData.education.map((edu, index) => (
                                    <div key={index} className="p-6 border border-base-300 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Education {index + 1}</h3>
                                            {formData.education.length > 1 && (
                                                <Button
                                                    onClick={() => removeEducation(index)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>School/Institution *</Label>
                                                <Input
                                                    value={edu.school}
                                                    onChange={(e) => updateEducation(index, "school", e.target.value)}
                                                    placeholder="Enter school name"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Degree *</Label>
                                                <Input
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                                                    placeholder="Enter degree"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Start Date</Label>
                                                <Input
                                                    value={edu.startDate}
                                                    onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                                                    placeholder="e.g., Sep 2021"
                                                />
                                            </div>
                                            <div>
                                                <Label>End Date</Label>
                                                <Input
                                                    value={edu.endDate}
                                                    onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                                                    placeholder="e.g., Jun 2025 or Present"
                                                />
                                            </div>
                                            <div>
                                                <Label>GPA/Grade</Label>
                                                <Input
                                                    value={edu.gpa}
                                                    onChange={(e) => updateEducation(index, "gpa", e.target.value)}
                                                    placeholder="e.g., 3.8/4.0"
                                                />
                                            </div>
                                            <div>
                                                <Label>Achievements</Label>
                                                <Input
                                                    value={edu.achievements}
                                                    onChange={(e) => updateEducation(index, "achievements", e.target.value)}
                                                    placeholder="Dean's List, Honors, etc."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={addEducation} variant="outline" className="w-full">
                                    + Add Another Education
                                </Button>
                                <div>
                                    <Label htmlFor="relevantCoursework">Relevant Coursework</Label>
                                    <Textarea
                                        id="relevantCoursework"
                                        value={formData.relevantCoursework}
                                        onChange={(e) => handleInputChange("relevantCoursework", e.target.value)}
                                        placeholder="List relevant courses separated by commas"
                                        className="h-24"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 3: Leadership/Extracurricular */}
                        {step === 3 && (
                            <div className="space-y-6">
                                {formData.leadership.map((lead, index) => (
                                    <div key={index} className="p-6 border border-base-300 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Leadership/Activity {index + 1}</h3>
                                            {formData.leadership.length > 1 && (
                                                <Button
                                                    onClick={() => removeLeadership(index)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Title/Position</Label>
                                                <Input
                                                    value={lead.title}
                                                    onChange={(e) => updateLeadership(index, "title", e.target.value)}
                                                    placeholder="e.g., President, Volunteer"
                                                />
                                            </div>
                                            <div>
                                                <Label>Organization</Label>
                                                <Input
                                                    value={lead.organization}
                                                    onChange={(e) => updateLeadership(index, "organization", e.target.value)}
                                                    placeholder="Organization name"
                                                />
                                            </div>
                                            <div>
                                                <Label>Start Date</Label>
                                                <Input
                                                    value={lead.startDate}
                                                    onChange={(e) => updateLeadership(index, "startDate", e.target.value)}
                                                    placeholder="e.g., Jan 2023"
                                                />
                                            </div>
                                            <div>
                                                <Label>End Date</Label>
                                                <Input
                                                    value={lead.endDate}
                                                    onChange={(e) => updateLeadership(index, "endDate", e.target.value)}
                                                    placeholder="e.g., Dec 2023 or Present"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={lead.description}
                                                    onChange={(e) => updateLeadership(index, "description", e.target.value)}
                                                    placeholder="Describe your responsibilities and achievements"
                                                    className="h-24"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={addLeadership} variant="outline" className="w-full">
                                    + Add Another Leadership/Activity
                                </Button>
                            </div>
                        )}

                        {/* Step 4: Experience */}
                        {step === 4 && (
                            <div className="space-y-6">
                                {formData.experience.map((exp, index) => (
                                    <div key={index} className="p-6 border border-base-300 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Experience {index + 1}</h3>
                                            {formData.experience.length > 1 && (
                                                <Button
                                                    onClick={() => removeExperience(index)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Job Title</Label>
                                                <Input
                                                    value={exp.jobTitle}
                                                    onChange={(e) => updateExperience(index, "jobTitle", e.target.value)}
                                                    placeholder="e.g., Software Engineer Intern"
                                                />
                                            </div>
                                            <div>
                                                <Label>Company</Label>
                                                <Input
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                                                    placeholder="Company name"
                                                />
                                            </div>
                                            <div>
                                                <Label>Start Date</Label>
                                                <Input
                                                    value={exp.startDate}
                                                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                                                    placeholder="e.g., Jun 2023"
                                                />
                                            </div>
                                            <div>
                                                <Label>End Date</Label>
                                                <Input
                                                    value={exp.endDate}
                                                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                                                    placeholder="e.g., Aug 2023 or Present"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label>Location</Label>
                                                <Input
                                                    value={exp.location}
                                                    onChange={(e) => updateExperience(index, "location", e.target.value)}
                                                    placeholder="e.g., New York, NY or Remote"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={exp.description}
                                                    onChange={(e) => updateExperience(index, "description", e.target.value)}
                                                    placeholder="Describe your responsibilities and achievements"
                                                    className="h-32"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={addExperience} variant="outline" className="w-full">
                                    + Add Another Experience
                                </Button>
                            </div>
                        )}

                        {/* Step 5: Skills */}
                        {step === 5 && (
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="skills">Technical Skills *</Label>
                                    <Textarea
                                        id="skills"
                                        value={formData.skills}
                                        onChange={(e) => handleInputChange("skills", e.target.value)}
                                        placeholder="List your technical skills separated by commas (e.g., JavaScript, Python, React, Node.js, MongoDB)"
                                        className="h-32"
                                        required
                                    />
                                    <p className="text-sm text-base-content/60 mt-2">
                                        Include programming languages, frameworks, tools, and technologies you're proficient in.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 6: Projects */}
                        {step === 6 && (
                            <div className="space-y-6">
                                {formData.projects.map((project, index) => (
                                    <div key={index} className="p-6 border border-base-300 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Project {index + 1}</h3>
                                            {formData.projects.length > 1 && (
                                                <Button
                                                    onClick={() => removeProject(index)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Project Name</Label>
                                                <Input
                                                    value={project.name}
                                                    onChange={(e) => updateProject(index, "name", e.target.value)}
                                                    placeholder="e.g., Task Management App"
                                                />
                                            </div>
                                            <div>
                                                <Label>Tech Stack</Label>
                                                <Input
                                                    value={project.techStack}
                                                    onChange={(e) => updateProject(index, "techStack", e.target.value)}
                                                    placeholder="e.g., React, Node.js, MongoDB"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label>Project Link</Label>
                                                <Input
                                                    value={project.link}
                                                    onChange={(e) => updateProject(index, "link", e.target.value)}
                                                    placeholder="GitHub link or live demo URL"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={project.description}
                                                    onChange={(e) => updateProject(index, "description", e.target.value)}
                                                    placeholder="Describe the project and your contributions"
                                                    className="h-24"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={addProject} variant="outline" className="w-full">
                                    + Add Another Project
                                </Button>
                            </div>
                        )}

                        {/* Step 7: Certifications */}
                        {step === 7 && (
                            <div className="space-y-6">
                                {formData.certifications.map((cert, index) => (
                                    <div key={index} className="p-6 border border-base-300 rounded-lg">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-lg font-semibold">Certification {index + 1}</h3>
                                            {formData.certifications.length > 1 && (
                                                <Button
                                                    onClick={() => removeCertification(index)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Certification Title</Label>
                                                <Input
                                                    value={cert.title}
                                                    onChange={(e) => updateCertification(index, "title", e.target.value)}
                                                    placeholder="e.g., AWS Certified Developer"
                                                />
                                            </div>
                                            <div>
                                                <Label>Issuing Organization</Label>
                                                <Input
                                                    value={cert.issuer}
                                                    onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                                                    placeholder="e.g., Amazon Web Services"
                                                />
                                            </div>
                                            <div>
                                                <Label>Date Obtained</Label>
                                                <Input
                                                    value={cert.date}
                                                    onChange={(e) => updateCertification(index, "date", e.target.value)}
                                                    placeholder="e.g., Jun 2023"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={cert.description}
                                                    onChange={(e) => updateCertification(index, "description", e.target.value)}
                                                    placeholder="Brief description of the certification"
                                                    className="h-20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button onClick={addCertification} variant="outline" className="w-full">
                                    + Add Another Certification
                                </Button>
                            </div>
                        )}

                        {/* Step 8: Job Information */}
                        {step === 8 && (
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="jobTitle">Target Job Title *</Label>
                                    <Input
                                        id="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                                        placeholder="e.g., Software Engineer, Data Analyst"
                                        required
                                    />
                                    <p className="text-sm text-base-content/60 mt-2">
                                        Enter the job title you're applying for
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="jobDescription">Job Description *</Label>
                                    <Textarea
                                        id="jobDescription"
                                        value={formData.jobDescription}
                                        onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                                        placeholder="Paste the complete job description here..."
                                        className="h-64"
                                        required
                                    />
                                    <p className="text-sm text-base-content/60 mt-2">
                                        Paste the full job description to help tailor your resume to the specific requirements
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8 pt-6 border-t border-base-300">
                            <Button
                                onClick={handlePrevious}
                                disabled={step === 1}
                                variant="outline"
                            >
                                Previous
                            </Button>
                            
                            {step < 8 ? (
                                <Button onClick={handleNext}>
                                    Next
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSubmit} 
                                    className="btn-primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Generating..." : "Generate Resume"}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
