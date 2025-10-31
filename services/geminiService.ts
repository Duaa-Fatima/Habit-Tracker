import { GoogleGenerativeAI } from "@google/generative-ai";
import { Habit, HabitStats } from "../types";
import { KNOWLEDGE_BASE } from "../constants";


// Use the process.env variable defined in vite.config.ts
const API_KEY = process.env.VITE_GEMINI_API_KEY;

// Log the API key to the console for debugging
console.log("Attempting to initialize Gemini with API Key:", API_KEY ? "Key Found" : "Key Not Found");

if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  console.error("VITE_GEMINI_API_KEY is not set. Please check your .env file and vite.config.ts.");
}

const ai = (API_KEY && API_KEY !== 'YOUR_API_KEY_HERE') ? new GoogleGenerativeAI(API_KEY) : null;
// Correct model name
const model = "gemini-1.5-flash"; 

console.log("Gemini AI Service initialized with model:", model);

function formatHabitDataForPrompt(habits: Habit[], stats: Map<string, HabitStats>): string {
  if (habits.length === 0) {
    return "The user has not added any habits yet.";
  }
  let habitDataString = "Here is a summary of the user's current habits and their recent performance:\n\n";
  habits.forEach((habit) => {
    const habitStats = stats.get(habit.id);
    habitDataString += `Habit: \"${habit.name}\" (Category: ${habit.category})\n`;
    habitDataString += `  - Current Streak: ${habitStats?.streak || 0} days\n`;
    habitDataString += `  - Longest Streak: ${habitStats?.longestStreak || 0} days\n`;
    habitDataString += `  - Completion Rate: ${habitStats?.completionRate.toFixed(0) || 0}%\n`;
    habitDataString += `  - Recent logs (last 7 days): \n`;
    const recentLogs = habit.logs.slice(-7);
    if (recentLogs.length > 0) {
      recentLogs.forEach((log) => {
        habitDataString += `    - ${log.date}: ${log.status}\n`;
      });
    } else {
      habitDataString += `    - No recent logs.\n`;
    }
    habitDataString += "\n";
  });
  return habitDataString;
}

// 🧠 STREAMED COACH RESPONSE (word-by-word output)
export async function* generateCoachResponseStream(
  query: string,
  habits: Habit[],
  stats: Map<string, HabitStats>
): AsyncGenerator<string> {
  console.log("--- 🧠 Generating Coach Response Stream ---");
  if (!ai) {
    console.error("AI service not available in generateCoachResponseStream.");
    yield "I'm sorry, the AI service is not configured. Please add your API key to the .env file and restart the server.";
    return;
  }

  const habitContext = formatHabitDataForPrompt(habits, stats);
  const prompt = `
You are \"Aura,\" a warm, empathetic, and deeply knowledgeable AI Habit Coach. Your sole purpose is to support and guide users on their journey of self-improvement.

Persona:
- Empathetic & Validating: Make users feel heard.
- Insightful & Data-Driven: Connect feedback to habits.
- Actionable & Practical: Give clear next steps.
- Encouraging & Conversational: Always end with motivation.

Response Structure:
1. Acknowledge & Validate.
2. Analyze & Connect using principles from the knowledge base.
3. Give a clear, actionable tip.
4. End with an encouraging line.

Knowledge Base:
${KNOWLEDGE_BASE}

User’s Current Habit Data:
${habitContext}

User’s Question:
\"${query}\"

Now, write Aura’s response below (without markdown, bold text, or symbols). Keep it warm, natural, and human:
`;
  
  console.log("Coach Response Prompt:", prompt);

  try {
    const generativeModel = ai.getGenerativeModel({ model });
    const result = await generativeModel.generateContentStream(prompt);
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      const words = chunkText.split(/\s+/);
      for (const word of words) {
        yield word + " ";
        await new Promise((r) => setTimeout(r, 25)); // typing delay
      }
    }
  } catch (error) {
    console.error("Error generating coach response:", error);
    // Log the full error object for more details
    console.error("Full error object in generateCoachResponseStream:", JSON.stringify(error, null, 2));
    yield "I'm sorry, I'm having trouble connecting right now. Please try again later.";
  }
}

// 📊 ANALYTICS SUMMARY GENERATOR
export const generateAnalyticsSummary = async (
  habits: Habit[],
  stats: Map<string, HabitStats>
): Promise<string> => {
  console.log("--- 📊 Generating Analytics Summary ---");
  if (!ai) {
    console.error("AI service not available in generateAnalyticsSummary.");
    return "Could not generate summary at this time. Please add your API key to the .env file.";
  }
  const habitContext = formatHabitDataForPrompt(habits, stats);
  const prompt = `
You are an expert data analyst and motivational coach.
Analyze the following user habit data and write a short, positive summary.
Highlight one key strength and one improvement area.
Keep tone friendly and encouraging.

User Habit Data:
${habitContext}

Your Summary:
`;

  console.log("Analytics Summary Prompt:", prompt);

  try {
    const generativeModel = ai.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    return result.response.text().replace(/\*\*/g, ""); // remove markdown
  } catch (error) {
    console.error("Error generating analytics summary:", error);
    // Log the full error object for more details
    console.error("Full error object in generateAnalyticsSummary:", JSON.stringify(error, null, 2));
    return "Could not generate summary at this time.";
  }
};

// ✨ CLEAN MOTIVATIONAL QUOTE GENERATOR
export const generateMotivationalQuote = async (): Promise<string> => {
  console.log("--- ✨ Generating Motivational Quote ---");
  if (!ai) {
    console.error("AI service not available in generateMotivationalQuote.");
    return "Small daily actions create big lifelong change.";
  }
  const prompt = `
Generate a short, powerful motivational quote about personal growth or daily discipline.
Avoid using quotation marks or markdown symbols.
Format it cleanly and naturally.
`;

  console.log("Motivational Quote Prompt:", prompt);

  try {
    const generativeModel = ai.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    return result.response.text().replace(/[\*\"]/g, "").trim();
  } catch (error) {
    console.error("Error generating motivational quote:", error);
    // Log the full error object for more details
    console.error("Full error object in generateMotivationalQuote:", JSON.stringify(error, null, 2));
    return "Small daily actions create big lifelong change.";
  }
};
