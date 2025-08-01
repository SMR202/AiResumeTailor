import MultiStepForm from "@/components/multistep-form";
import { Header } from "@/components/header";

export default function Info() {
    return (
        <div className="min-h-screen bg-gradient-to-br to-purple-500 from-white dark:to-purple-900 dark:from-black">
            <Header />
            <div className="container mx-auto px-6 py-10">
                <MultiStepForm />
            </div>
        </div>
    );
}
