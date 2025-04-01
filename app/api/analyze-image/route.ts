import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    const { image } = await request.json();
    const base64Data = image.split(",")[1];

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt =
      'Analyze the provided image meticulously, focusing on identifying all visible objects and the overall scene depicted. Specifically, detect and categorize any solid waste present, detailing the type of waste (e.g., plastic bottles, paper, metal cans, food scraps, etc.). For each identified waste item, provide detailed disposal instructions, including whether it should be recycled, composted, or sent to a landfill. If recyclable, offer creative and practical suggestions for repurposing or reusing the material. Additionally, assess the overall environmental condition shown in the image, determining if it presents any potential health hazards or indicates an unhealthy environment. Justify your assessment by citing specific visual cues from the image, such as the presence of pollution, unsanitary conditions, or signs of ecological imbalance. Conclude with a concise statement summarizing the image\'s overall environmental health and the effectiveness of waste management practices depicted. Provide the response strictly in JSON format. Using this exact json file structure for all answers you give: { "general_description": "description", "waste_analysis": [ { "item_type": "type", "disposal_instructions": "instructions", "recyclable": true, "reuse_suggestions": "suggestions" } ], "environmental_assessment": { "health_status": "status", "justification": "justification" } }';

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
    ]);

    let responseText =
      result.response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!responseText) {
      return NextResponse.json({
        success: false,
        message: "Gemini API returned an empty response.",
      });
    }

    if (responseText.startsWith("```json")) {
      responseText = responseText.substring(7, responseText.length - 3);
    }

    console.log("Gemini response text:", responseText);

    let jsonResult;
    try {
      jsonResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError);
      return NextResponse.json({
        success: false,
        message: "Failed to parse Gemini API response as JSON.",
      });
    }

    console.log(jsonResult);

    return NextResponse.json({
      success: true,
      message: jsonResult,
    });
  } catch (error) {
    console.error("Error analyzing image:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to analyze the image.",
    });
  }
}
