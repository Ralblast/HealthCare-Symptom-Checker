import Groq from "groq-sdk";
import { AI_CONFIG } from '../config/constants.js';
import { parseJsonResponse, retryWithBackoff } from '../utils/helpers.js';
import logger from '../utils/logger.js';

if (!process.env.GROQ_API_KEY) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Generate clarification questions using AI
 * @param {string} symptom - Initial symptom description
 * @returns {Promise<string[]>} 
 */
export async function generateClarificationQuestions(symptom) {
  const prompt = `You are a medical assistant. A patient reports: "${symptom}"

Generate 3 essential clarifying questions to better understand their condition.
Focus on: duration, severity, associated symptoms, and relevant history.

Respond with ONLY valid JSON (no markdown, no explanations):
{"questions": ["question 1", "question 2", "question 3"]}`;

  try {
    const completion = await retryWithBackoff(
      async () => await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: AI_CONFIG.MODEL,
        temperature: AI_CONFIG.TEMPERATURE,
        max_tokens: AI_CONFIG.MAX_TOKENS.QUESTIONS,
      }),
      AI_CONFIG.RETRY_ATTEMPTS
    );
    
    const text = completion.choices[0]?.message?.content || "";
    const parsed = parseJsonResponse(text);
    
    if (!parsed || !parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format from AI');
    }
    
    logger.info('Generated clarification questions', { count: parsed.questions.length });
    return parsed.questions.slice(0, 3);
    
  } catch (error) {
    logger.error('Error generating questions', error);
    
  
    return [
      "How long have you been experiencing this symptom?",
      "On a scale of 1-10, how severe is it?",
      "Do you have any other symptoms along with this?"
    ];
  }
}

/**
 * Analyze symptoms using AI and medical knowledge base
 * @param {string} symptomContext - Full symptom context
 * @param {Array} matchingConditions - Matching conditions from database
 * @returns {Promise<Object>} Analysis result
 */
export async function analyzeSymptoms(symptomContext, matchingConditions) {
  const conditionsContext = matchingConditions.map((cond, idx) => 
    `[Condition ${idx + 1}]
Name: ${cond.condition}
Symptoms: ${cond.symptoms.join(', ')}
Description: ${cond.description}
Source: ${cond.source}
Severity: ${cond.severity}`
  ).join('\n\n');

  const prompt = `You are a medical AI assistant. Analyze the patient's symptoms against trusted medical information.

[PATIENT SYMPTOMS]
${symptomContext}

[MEDICAL KNOWLEDGE BASE]
${conditionsContext || "No matching conditions found in database."}

Based ONLY on the conditions above, provide analysis in this EXACT JSON format (no markdown):
{
  "potentialConditions": [
    {
      "conditionName": "exact name from knowledge base",
      "matchPercentage": 85,
      "reasoning": "why this matches the symptoms",
      "recommendations": ["recommendation 1", "recommendation 2"],
      "source": "source from knowledge base"
    }
  ],
  "summary": "brief summary and next steps",
  "urgencyLevel": "low"
}

CRITICAL RULES:
- Only suggest conditions from the knowledge base provided above
- If no knowledge base conditions match, suggest consulting a doctor
- Be honest if you cannot determine a specific condition
- Always emphasize consulting a healthcare professional
- urgencyLevel must be exactly one of: low, medium, high
- Respond with PURE JSON only - no markdown, no code blocks, start with { and end with }`;

  try {
    const completion = await retryWithBackoff(
      async () => await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: AI_CONFIG.MODEL,
        temperature: AI_CONFIG.TEMPERATURE,
        max_tokens: AI_CONFIG.MAX_TOKENS.ANALYSIS,
      }),
      AI_CONFIG.RETRY_ATTEMPTS
    );
    
    const text = completion.choices[0]?.message?.content || "";
    const analysis = parseJsonResponse(text);
    
    if (!analysis) {
      throw new Error('Failed to parse AI response');
    }
    

    analysis.disclaimer = "⚠️ IMPORTANT: This is educational information only, not medical advice. Always consult a qualified healthcare professional for proper diagnosis and treatment.";
    
    
    if (!['low', 'medium', 'high'].includes(analysis.urgencyLevel)) {
      analysis.urgencyLevel = 'medium';
    }
    
    logger.info('Analysis completed', { 
      conditionsFound: analysis.potentialConditions?.length || 0,
      urgency: analysis.urgencyLevel 
    });
    
    return analysis;
    
  } catch (error) {
    logger.error('Error analyzing symptoms', error);
    
    
    return {
      potentialConditions: [],
      summary: "Unable to complete analysis due to a technical issue. Please consult a healthcare professional for proper evaluation of your symptoms.",
      urgencyLevel: "medium",
      disclaimer: "⚠️ IMPORTANT: This is educational information only, not medical advice. Always consult a qualified healthcare professional for proper diagnosis and treatment."
    };
  }
}
