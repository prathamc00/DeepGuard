import { AnalysisResult, RAGExplanation, ForensicEvidence, SimilarCase } from "../types";

const API_BASE_URL = "http://localhost:8000";

/**
 * Analyze media using the v2 RAG-enhanced endpoint
 * Falls back to v1 if v2 fails
 */
export const analyzeMedia = async (
    file: File,
    onProgress?: (progress: number) => void
): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        // Try v2 RAG endpoint first
        const response = await fetch(`${API_BASE_URL}/api/v2/detect`, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            // Fall back to v1 if v2 fails
            console.warn("v2 endpoint failed, falling back to v1");
            return analyzeMediaV1(file);
        }

        const data = await response.json();
        return mapV2Response(data, file);

    } catch (error) {
        console.error("v2 endpoint error, trying v1:", error);
        return analyzeMediaV1(file);
    }
};

/**
 * Original v1 analysis (fallback)
 */
const analyzeMediaV1 = async (file: File): Promise<AnalysisResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Upload failed");
    }

    const data = await response.json();
    const isDeepfake = data.result.toLowerCase() === "fake";
    const confidenceScore = data.confidence * 100;

    return {
        isDeepfake,
        confidenceScore,
        explanation: isDeepfake
            ? "The system detected signs of manipulation consistent with deepfake generation techniques."
            : "The media appears to be authentic with no significant anomalies detected.",
        artifactsDetected: isDeepfake ? ["Potential digital artifacts detected"] : [],
        visualAnomalies: [],
        metadata: {
            fileName: file.name,
            fileType: file.type,
            timestamp: new Date().toISOString(),
        },
    };
};

/**
 * Map v2 RAG response to AnalysisResult
 */
const mapV2Response = (data: any, file: File): AnalysisResult => {
    const isDeepfake = data.result === "fake";
    const confidenceScore = data.confidence * 100;

    // Map forensic evidence
    const forensicEvidence: ForensicEvidence = data.explanation.forensic_evidence;

    // Map similar cases
    const similarCases: SimilarCase[] = data.explanation.similar_cases || [];

    // Build artifacts list from forensic analysis
    const artifactsDetected: string[] = [];
    if (forensicEvidence.fft_anomaly) {
        artifactsDetected.push("FFT Frequency Anomaly");
    }
    if (forensicEvidence.color_anomaly) {
        artifactsDetected.push("Color Channel Inconsistency");
    }
    if (forensicEvidence.noise_anomaly) {
        artifactsDetected.push("Noise Pattern Irregularity");
    }
    if (forensicEvidence.compression_artifacts === "high") {
        artifactsDetected.push("Heavy Compression Artifacts");
    } else if (forensicEvidence.compression_artifacts === "medium") {
        artifactsDetected.push("Moderate Compression Artifacts");
    }

    // Build visual anomalies from forensic findings
    const visualAnomalies = data.explanation.forensic_findings.map((finding: string, index: number) => ({
        location: `Finding ${index + 1}`,
        description: finding,
    }));

    // Build RAG explanation
    const ragExplanation: RAGExplanation = {
        summary: data.explanation.summary,
        confidence_reasoning: data.explanation.confidence_reasoning,
        forensic_findings: data.explanation.forensic_findings,
        similar_cases_summary: data.explanation.similar_cases_summary,
        similar_cases: similarCases,
        forensic_evidence: forensicEvidence,
        gradcam_url: data.explanation.gradcam_url,
    };

    return {
        isDeepfake,
        confidenceScore,
        explanation: data.explanation.summary,
        artifactsDetected,
        visualAnomalies,
        metadata: {
            fileName: file.name,
            fileType: file.type,
            timestamp: new Date().toISOString(),
        },
        ragExplanation,
        forensicEvidence,
        similarCases,
    };
};

/**
 * Get RAG index statistics
 */
export const getIndexStats = async () => {
    const response = await fetch(`${API_BASE_URL}/api/v2/index/stats`);
    if (!response.ok) {
        throw new Error("Failed to get index stats");
    }
    return response.json();
};
