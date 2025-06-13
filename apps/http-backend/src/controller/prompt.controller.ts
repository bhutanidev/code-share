import  { Request, Response } from 'express';
import { CodeAnalysisRequestSchema } from '@workspace/common/zodschema';
import asyncHandler from '../utils/asyncHandler';
import ApiError from '../utils/ApiError';
import apiResponse from '../utils/ApiResponse';


let ai :any;

function sanitizeCode(code: string): string {

  const dangerousPatterns = [
    /eval\s*\(/gi,
    /Function\s*\(/gi,
    /setTimeout\s*\(/gi,
    /setInterval\s*\(/gi,
    /import\s*\(/gi,
    /require\s*\(/gi,
    /process\s*\./gi,
    /global\s*\./gi,
    /window\s*\./gi,
    /__dirname/gi,
    /__filename/gi,
    /fs\s*\./gi,
    /child_process/gi,
    /exec\s*\(/gi,
    /spawn\s*\(/gi,
  ];

  let sanitized = code;

  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '/* REMOVED_POTENTIAL_INJECTION */');
  });

  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000) + '\n/* CODE_TRUNCATED */';
  }

  return sanitized;
}

export const analyzeCodeHandler = asyncHandler(async(req,res,next)=>{
    const validationData = CodeAnalysisRequestSchema.safeParse(req.body)
    if(!validationData.success){
        next(new ApiError(400,validationData.error.message||"Fill the fields correctly"))
        return;
    }
    try {
        const { code, prompt } = validationData.data;

        // Sanitize code
        const sanitizedCode = sanitizeCode(code);

        // Build prompt for code analysis
        const fullPrompt = `
            You are a code analysis assistant. Please analyze the following code and respond to the user's prompt.

            Code to analyze:
            \`\`\`
            ${sanitizedCode}
            \`\`\`

            User's prompt: ${prompt}

            Please provide:
            1. Analysis of the code
            2. Any suggestions for improvement
            3. Any potential issues or errors
            4. Recommendations based on best practices

            Keep your response helpful and constructive.
            `

        // const model = ai.getGenerativeModel({ model: 'gemini-pro' }); // Get model from the new 'ai' instance
        const { GoogleGenAI } = await import('@google/genai');
        ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const result =  await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: fullPrompt,
        });
        const analysis = result.text; 

        res.status(200).json(new apiResponse(200, analysis, "response fetch successful"));

    } catch (error) {
        if (error instanceof Error) {
            next(new ApiError(500, `Gemini API error: ${error.message}`));
        } else {
            next(new ApiError(500, "An unknown Gemini API error occurred"));
        }
    }
});
