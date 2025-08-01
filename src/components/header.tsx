import { ModeToggle } from "./mode-toggle";
import { SiReaddotcv } from "react-icons/si";

export function Header() {
    return (
        <div className="flex justify-between items-center p-4">
            <button className="flex space-x-4 items-center">
                <SiReaddotcv className="text-4xl flex-shrink-0" />
                <div className="font-poppins font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl truncate">
                    AI Resume Tailor
                </div>
            </button>
            <ModeToggle />
        </div>
    );
}
