import { GoogleGenerativeAI } from "@google/generative-ai";
import { Habit, HabitStats } from "../types";
import { KNOWLEDGE_BASE } from "../constants";

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is not set. Please make sure it is defined in your .env file and exposed in vite.config.ts");
}

const ai = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const model = "gemini-1.5-flash-latest";

function formatHabitDataForPrompt(habits: Habit[], stats: Map<string, HabitStats>): string {
  if (habits.length === 0) {
    return "The user has not added any habits yet.";
  }

  let habitDataString = "Here is a summary of the user\'s current habits and their recent performance:\n\n";

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
  if (!ai) {
    yield "I\'m sorry, the AI service is not configured. Please check your API key.";
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
    yield "I\'m sorry, I\'m having trouble connecting right now. Please try again later.";
  }
}

// 📊 ANALYTICS SUMMARY GENERATOR
export const generateAnalyticsSummary = async (
  habits: Habit[],
  stats: Map<string, HabitStats>
): Promise<string> => {
  if (!ai) {
    return "Could not generate summary at this time.";
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

  try {
    const generativeModel = ai.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    return result.response.text().replace(/\*\*/g, ""); // remove markdown
  } catch (error) {
    console.error("Error generating analytics summary:", error);
    return "Could not generate summary at this time.";
  }
};

// ✨ CLEAN MOTIVATIONAL QUOTE GENERATOR
export const generateMotivationalQuote = async (): Promise<string> => {
  if (!ai) {
    return "Small daily actions create big lifelong change.";
  }
  const prompt = `
Generate a short, powerful motivational quote about personal growth or daily discipline.
Avoid using quotation marks or markdown symbols.
Format it cleanly and naturally.
`;

  try {
    const generativeModel = ai.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    return result.response.text().replace(/[\*\"]/g, "").trim();
  } catch (error) {
    console.error("Error generating motivational quote:", error);
    return "Small daily actions create big lifelong change.";
  }
};
