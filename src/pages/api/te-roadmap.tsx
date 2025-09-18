import type { NextApiRequest, NextApiResponse } from "next";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, interests, grade } = req.body;

    const prompt = `
    Generate a personalized career roadmap for ${name}, who has grade ${grade}.
    Their main interests are: ${interests.join(", ")}.
    The roadmap should include:
    - Suggested career paths
    - Key skills to learn
    - Recommended courses/certifications
    - Roadmap in steps (short-term, mid-term, long-term).
    Format neatly with clear sections.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ roadmap: text });
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
}
