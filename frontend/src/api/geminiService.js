const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const MODEL_NAME = "gemini-flash-latest";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are Fin Ledger AI, a friendly and concise financial advisor built into a personal finance app. 
You analyze the user's transaction data and give short, actionable advice. 
Be specific with numbers when available. Use emojis sparingly for friendliness.
Keep responses under 150 words unless asked for detail.
Never suggest specific stocks or investments. Focus on budgeting and spending habits.`;

/**
 * Perform raw native fetch call to Google API v1.
 */
async function callGemini(promptText) {
    if (!API_KEY) throw new Error("Missing API Key");

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
        })
    });

    if (!response.ok) {
        throw new Error(`Google API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

/**
 * Get financial advice from Gemini given a user prompt and financial context.
 */
export async function getFinancialAdvice(userPrompt, financialContext) {
    if (!API_KEY) {
        return getFallbackAdvice(userPrompt, financialContext);
    }

    try {
        const contextStr = formatContext(financialContext);
        const fullPrompt = `${SYSTEM_PROMPT}\n\n--- User's Financial Data ---\n${contextStr}\n\n--- User's Question ---\n${userPrompt}`;
        return await callGemini(fullPrompt);
    } catch (error) {
        console.error("Gemini API error:", error);
        return getFallbackAdvice(userPrompt, financialContext);
    }
}

/**
 * Generate smart insights for the dashboard automatically.
 */
export async function getSmartInsights(dashboardData) {
    if (!dashboardData) return getDefaultInsights();

    if (!API_KEY) {
        return getRuleBasedInsights(dashboardData);
    }

    try {
        const contextStr = formatContext(dashboardData);
        const prompt = `${SYSTEM_PROMPT}\n\n--- User's Financial Data ---\n${contextStr}\n\n--- Task ---\nGenerate exactly 4 short financial insights as a JSON array of objects with "emoji" and "text" fields. 
Each insight should be 1 sentence, specific with numbers from the data.
Example format: [{"emoji": "🔥", "text": "Your food spending is 35% of total expenses."}]
Return ONLY the JSON array, no other text.`;

        const text = await callGemini(prompt);

        // Extract JSON from response
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return getRuleBasedInsights(dashboardData);
    } catch (error) {
        console.error("Gemini insights error:", error);
        return getRuleBasedInsights(dashboardData);
    }
}

function formatContext(data) {
    if (!data) return "No data available";

    const lines = [];
    if (data.totalBalance !== undefined) lines.push(`Total Balance: $${data.totalBalance}`);
    if (data.totalIncome !== undefined) lines.push(`Total Income: $${data.totalIncome}`);
    if (data.totalExpense !== undefined) lines.push(`Total Expense: $${data.totalExpense}`);

    if (data.last30DaysExpenses?.transactions?.length > 0) {
        const categories = {};
        data.last30DaysExpenses.transactions.forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });
        lines.push(`Last 30 days expenses by category: ${JSON.stringify(categories)}`);
    }

    if (data.recentTransactions?.length > 0) {
        lines.push(`Recent transactions (last 5): ${data.recentTransactions.slice(0, 5).map(t =>
            `${t.type}: $${t.amount} (${t.category || t.source})`
        ).join(", ")}`);
    }

    return lines.join("\n");
}

function getRuleBasedInsights(data) {
    const insights = [];
    const { totalBalance = 0, totalIncome = 0, totalExpense = 0 } = data;

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;

    if (savingsRate > 20) {
        insights.push({ emoji: "🏆", text: `Great job! You're saving ${savingsRate.toFixed(0)}% of your income.` });
    } else if (savingsRate > 0) {
        insights.push({ emoji: "⚠️", text: `You're saving only ${savingsRate.toFixed(0)}% of income. Aim for 20%+.` });
    } else {
        insights.push({ emoji: "🚨", text: `You're spending more than you earn. Time to review your budget.` });
    }

    if (totalBalance > 0) {
        insights.push({ emoji: "💰", text: `Your ledger balance is $${totalBalance.toLocaleString()}.` });
    }

    if (data.last30DaysExpenses?.transactions?.length > 0) {
        const topCategory = data.last30DaysExpenses.transactions.reduce((acc, t) => {
            acc[t.category] = (acc[t.category] || 0) + t.amount;
            return acc;
        }, {});
        const top = Object.entries(topCategory).sort((a, b) => b[1] - a[1])[0];
        if (top) {
            insights.push({ emoji: "📊", text: `Top expense: ${top[0]} at $${top[1].toLocaleString()} this month.` });
        }
    }

    insights.push({ emoji: "💡", text: "Set up a budget to track your spending goals!" });

    return insights.slice(0, 4);
}

function getDefaultInsights() {
    return [
        { emoji: "👋", text: "Welcome to Fin Ledger! Start adding transactions to see insights." },
        { emoji: "📈", text: "Track your income and expenses to see spending patterns." },
        { emoji: "🎯", text: "Set budgets to keep your spending on track." },
        { emoji: "🤖", text: "Add a Gemini API key for AI-powered financial advice!" },
    ];
}

function getFallbackAdvice(prompt, context) {
    return "I'm your Fin Ledger AI assistant. To get personalized advice, add your Gemini API key in the .env file as VITE_GEMINI_API_KEY. For now, check the dashboard insights for rule-based tips! 📊";
}
