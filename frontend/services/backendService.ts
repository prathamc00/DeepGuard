import { AnalysisResult } from "../types";

const API_BASE_URL = "http://localhost:8000";

export const analyzeMedia = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Upload failed");
        }

        const data = await response.json();

        // Map backend response to AnalysisResult
        // BACKEND RETURNS:
        // {
        //     "job_id": "...",
        //     "status": "completed",
        //     "result": "Real" | "Fake",
        //     "confidence": 0.99
        // }

        const isDeepfake = data.result.toLowerCase() === "fake";
        const confidenceScore = data.confidence * 100; // Convert 0-1 to 0-100

        return {
            isDeepfake,
            confidenceScore,
            explanation: isDeepfake
                ? "The system detected signs of manipulation consistent with deepfake generation techniques."
                : "The media appears to be authentic with no significant anomalies detected.",
            artifactsDetected: isDeepfake ? ["Potential digital artifacts detected"] : [],
            visualAnomalies: [], // Backend doesn't provide this yet
            metadata: {
                fileName: file.name,
                fileType: file.type,
                timestamp: new Date().toISOString(),
            },
        };
    } catch (error) {
        console.error("Backend analysis failed:", error);
        throw new Error("Failed to connect to analysis server. Ensure backend is running.");
    }
};
