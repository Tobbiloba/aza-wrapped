import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { AnalysisSummary, AIInsights } from '@/types/insights';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are a witty Nigerian financial commentator creating an "Aza Wrapped" experience (like Spotify Wrapped but for bank statements). Your job is to roast, hype, or comment on the user's spending habits in authentic Nigerian style.

TONE & STYLE:
- Use Nigerian slang naturally: "Omo", "Odogwu", "Na wa", "Wahala", "Soft life", "Sapa", "Japa money", "Baller", "Big man tings", "Wetin concern", etc.
- Mix English with occasional Pidgin for flavor
- Be funny but not mean - more like a friend roasting you at a hangout
- Hype them when they deserve it, roast them when it's funny
- Reference Nigerian culture (Owambe, Jollof, Suya, etc.) when relevant
- Keep it relatable to young Nigerians

IMPORTANT:
- Return ONLY valid JSON, no markdown, no code blocks
- Make insights specific to their actual data - don't be generic
- If someone spent a lot at restaurants, roast that. If they send money to one person a lot, comment on that relationship
- Be creative with nicknames and titles
- Keep roasts playful, never actually offensive`;

function buildUserPrompt(summary: AnalysisSummary): string {
  return `Here's someone's bank statement analysis. Generate personalized, funny insights for their Aza Wrapped.

THEIR DATA:
- Name: ${summary.accountName}
- Period: ${summary.period.start} to ${summary.period.end} (${summary.period.days} days)

MONEY FLOW:
- Total Transactions: ${summary.overview.totalTransactions}
- Money In: ₦${summary.overview.totalCredits.toLocaleString()}
- Money Out: ₦${summary.overview.totalDebits.toLocaleString()}
- Net: ${summary.overview.netFlow >= 0 ? '+' : ''}₦${summary.overview.netFlow.toLocaleString()}

BIGGEST SPENDING DAY (Odogwu Day):
- Date: ${summary.biggestDay.date}
- Amount: ₦${summary.biggestDay.amount.toLocaleString()}
- Transactions: ${summary.biggestDay.transactionCount}
- What they bought: ${summary.biggestDay.topPurchases.join(', ') || 'Various transactions'}

TOP MERCHANTS (Where their money goes):
${summary.topMerchants.map((m, i) => `${i + 1}. ${m.name}: ₦${m.amount.toLocaleString()} (${m.visits} visits)`).join('\n')}

TOP RECIPIENTS (Who they send money to):
${summary.topRecipients.map((r, i) => `${i + 1}. ${r.name}: ₦${r.amount.toLocaleString()} (${r.count} transfers)`).join('\n')}

SPENDING CATEGORIES:
${summary.categories.map(c => `- ${c.name}: ₦${c.amount.toLocaleString()} (${c.percentage.toFixed(1)}%)`).join('\n')}

SPENDING RHYTHM:
- Peak Time: ${summary.rhythm.peakTimeOfDay} (₦${summary.rhythm.peakTimeAmount.toLocaleString()})
- Weekend Spend: ₦${summary.rhythm.weekendSpend.toLocaleString()} (${summary.rhythm.weekendPercentage.toFixed(1)}% of total)
- Weekday Spend: ₦${summary.rhythm.weekdaySpend.toLocaleString()}

SPENDING JOURNEY:
- Peak Month: ${summary.journey.peakMonth} (₦${summary.journey.peakMonthAmount.toLocaleString()})
- Trend: ${summary.journey.monthlyTrend}

PERSONALITY: ${summary.personality.archetype}
Traits: ${summary.personality.traits.join(', ')}

---

Generate a JSON object with these fields (be specific to their data, make it personal and funny):

{
  "intro": {
    "greeting": "personalized greeting with their name",
    "tagline": "catchy one-liner about their year"
  },
  "overview": {
    "headline": "2-4 word headline about their money moves",
    "reaction": "1-2 sentence reaction to their overall flow"
  },
  "odogwuDay": {
    "title": "dramatic title for their biggest day (e.g., 'ODOGWU MODE ACTIVATED')",
    "roast": "2-3 sentences roasting/hyping what they did that day",
    "verdict": "short verdict like 'Certified Big Spender'"
  },
  "yourSpots": {
    "overall": "1-2 sentences about their spending spots",
    "merchants": [
      {
        "name": "merchant name",
        "relationship": "funny relationship status",
        "roast": "one-liner about this merchant"
      }
    ]
  },
  "moneyCircle": {
    "overall": "1-2 sentences about who they send money to",
    "recipients": [
      {
        "name": "recipient name",
        "title": "funny title like 'The Landlord' or 'Bank of Mum'",
        "insight": "one-liner about this relationship"
      }
    ]
  },
  "categories": {
    "headline": "headline about their priorities",
    "roast": "1-2 sentences about their spending categories"
  },
  "rhythm": {
    "title": "their spending rhythm title (e.g., 'Night Crawler')",
    "description": "1-2 sentences about when they spend",
    "verdict": "short verdict"
  },
  "journey": {
    "peakMonthRoast": "roast about their peak spending month",
    "trend": "comment on their spending trend over the period"
  },
  "personality": {
    "archetype": "their money personality title",
    "emoji": "one emoji that represents them",
    "opener": "dramatic opener line",
    "roast": "2-3 sentence personality roast",
    "prediction": "funny 2025 prediction for them",
    "traits": [{"emoji": "emoji", "label": "trait"}, ...] (3-4 traits)
  },
  "summary": {
    "headline": "final headline for their wrapped",
    "caption": "shareable caption for social media",
    "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
  }
}`;
}

export async function POST(request: NextRequest) {
  try {
    const summary: AnalysisSummary = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: buildUserPrompt(summary),
        },
      ],
      system: SYSTEM_PROMPT,
    });

    // Extract text content
    const textContent = message.content.find((c) => c.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse JSON response
    let insights: AIInsights;
    try {
      // Clean up response - remove any markdown code blocks if present
      let jsonText = textContent.text.trim();
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```json?\n?/, '').replace(/\n?```$/, '');
      }
      insights = JSON.parse(jsonText);
    } catch {
      console.error('Failed to parse Claude response:', textContent.text);
      throw new Error('Invalid JSON response from Claude');
    }

    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error generating insights:', error);
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
