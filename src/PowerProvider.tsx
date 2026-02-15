import { initialize } from "@microsoft/power-apps/app"
import { useEffect, useState, type ReactNode } from "react";

interface PowerProviderProps {
  children: ReactNode;
}

export default function PowerProvider({ children }: PowerProviderProps) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initApp = async () => {
            try {
                // Simulating initialization for now
                await new Promise((resolve) => setTimeout(resolve, 500));
                console.log("Power Apps initialized");
                setIsInitialized(true);
            }
            catch (error) {
                // Log the full error object to see details in the Console
                console.error("Failed to initialize Power Apps. Details:", error);
            }
        };

        initApp();
    }, []);

    if (!isInitialized) {
        return <div>Initializing Power Apps...</div>;
    }

    return <>{children}</>;
}