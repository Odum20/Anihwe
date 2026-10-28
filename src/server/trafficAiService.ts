import { GoogleGenAI } from "@google/genai";

export interface FrameAnalysisResult {
  hazardLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedObjects: Array<{
    type: string;
    description: string;
    estimatedSpeedKmh?: number;
    violationDetected?: string;
  }>;
  safetyViolations: Array<{
    rule: string;
    severity: 'WARNING' | 'CRITICAL';
    involvedEntity: string;
    explanation: string;
    jamaicanRoadTrafficActRef?: string;
  }>;
  collisionRiskScore: number; // 0 - 100
  accidentAssessment: {
    isAccidentDetected: boolean;
    collisionType?: 'Rear-End' | 'T-Bone' | 'Sideswipe' | 'Pedestrian Impact' | 'None';
    causationHypothesis?: string;
    immediateActionRecommended?: string;
  };
  trafficFlowAssessment: {
    congestionStatus: 'Free Flow' | 'Moderate Density' | 'Congested' | 'Gridlock';
    averageSpeedEstKmh: number;
    intersectionBoxStatus: 'Clear' | 'Partially Blocked' | 'Gridlocked';
  };
  recommendations: string[];
}

export async function analyzeTrafficFrame(
  base64ImageData: string,
  contextNote?: string
): Promise<FrameAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }

  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Remove potential data:image/...;base64, header prefix
  const cleanBase64 = base64ImageData.replace(/^data:image\/[a-z]+;base64,/, '');

  const systemPrompt = `You are a Senior Traffic Operations & Computer Vision Engineer for the National Road Safety Council (NRSC) of Jamaica and Kingston Metropolitan Transport Region.
You are inspecting a video frame from an active traffic junction live camera (such as Half Way Tree, Kingston or similar busy urban crossing).
Carefully inspect:
1. Vehicle flow (Cars, Route Taxis / Coaster Buses, Delivery Trucks, Motorbikes, Bicycles).
2. Road safety rule compliance:
   - Red light running (vehicles moving through signalized stop line against red).
   - Illegal lane changes (crossing solid white dividers, abrupt lateral cut-offs).
   - Yellow box intersection blocking (vehicles stopped inside the junction grid).
   - Pedestrian safety (crossing outside designated crosswalks, jaywalking against active green lights).
   - Motorcyclist helmet usage and reckless overtaking.
3. Potential collisions or near-miss incidents (abrupt stopping, converging trajectories, pedestrian close encounters, vehicle damage).
4. Provide realistic, authoritative analysis formatted strictly as JSON.`;

  const userPrompt = `Analyze this captured traffic camera frame from the junction.
${contextNote ? `Additional operator telemetry note: ${contextNote}` : ''}
Provide a comprehensive safety and flow evaluation in valid JSON matching the schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: userPrompt,
          },
        ],
      },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    const parsed = JSON.parse(responseText) as FrameAnalysisResult;
    return parsed;
  } catch (error: any) {
    console.error("Error analyzing traffic frame with Gemini:", error);
    throw error;
  }
}
