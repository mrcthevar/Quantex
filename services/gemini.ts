import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Profile, DashboardResponse } from "../types";

const MASTER_SYSTEM_PROMPT = `
ROLE
You are a PERSON INTELLIGENCE DASHBOARD ENGINE.

PRODUCT CONTEXT
- The app has a single Google-like search box.
- The user types a PERSON NAME (e.g. "Roger Deakins").
- You possess a BROWSING CAPABILITY (via Google Search tool).
- YOUR JOB: Use the search tool to gather "raw sources" about the person, and then turn that raw intel into ONE CONSISTENT, COLOURFUL DASHBOARD JSON.

MODEL BEHAVIOUR
- **COMPREHENSIVENESS**: You must provide DETAILED and EXTENSIVE lists. 
  - For 'core_skills', aim for 5-8 specific skills.
  - For 'recent_activity', aim for at least 5 distinct events/news items.
  - For 'past_highlights', aim for a comprehensive career timeline (5+ items).
  - For 'ways_to_add_value', be specific to their current work (not generic).
- Deterministic bias: minimise creativity, maximise accuracy and consistency.
- Conservative with facts: no hard hallucinations (dates, titles, employers).
- If you need to infer, use language like “appears to”, “likely”, “seems”.
- Use the provided search tools to find the most up-to-date information.

====================================================
# OUTPUT: DASHBOARD LAYERS

You MUST output a single JSON object with the sections below.
Each section includes **UI hints** (colours, card styles, icons) so the frontend can render a colourful dashboard.

Top-level structure:

{
  "layout_meta": { ... },
  "identity_snapshot": { ... },
  "career_and_work": { ... },
  "public_presence": { ... },
  "recent_activity": { ... },
  "viewer_relevance": { ... },
  "interaction_suggestions": { ... },
  "uncertainties_and_gaps": { ... }
}
`;

const DASHBOARD_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    layout_meta: {
      type: Type.OBJECT,
      properties: {
        theme: { type: Type.STRING },
        accent_color: { type: Type.STRING },
        section_order: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["theme", "accent_color", "section_order"]
    },
    identity_snapshot: {
      type: Type.OBJECT,
      properties: {
        canonical_name: { type: Type.STRING },
        headline: { type: Type.STRING },
        primary_location: { type: Type.STRING },
        short_bio: { type: Type.STRING },
        tags: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              label: { type: Type.STRING },
              color: { type: Type.STRING },
              variant: { type: Type.STRING }
            },
            required: ["label", "color", "variant"]
          }
        },
        primary_domains_of_focus: { type: Type.ARRAY, items: { type: Type.STRING } },
        avatar_hint: {
          type: Type.OBJECT,
          properties: {
            style: { type: Type.STRING },
            fallback_bg: { type: Type.STRING }
          },
          required: ["style", "fallback_bg"]
        }
      },
      required: ["canonical_name", "headline", "short_bio", "tags", "avatar_hint"]
    },
    career_and_work: {
      type: Type.OBJECT,
      properties: {
        card_style: { type: Type.STRING },
        current_roles: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              context: { type: Type.STRING },
              icon: { type: Type.STRING },
              accent: { type: Type.STRING }
            },
            required: ["title", "icon"]
          }
        },
        current_affiliations: { type: Type.ARRAY, items: { type: Type.STRING } },
        past_highlights: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              year: { type: Type.NUMBER },
              note: { type: Type.STRING },
              chip_color: { type: Type.STRING }
            },
            required: ["title", "chip_color"]
          }
        },
        core_skills: { type: Type.ARRAY, items: { type: Type.STRING } },
        industries: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["current_roles", "core_skills"]
    },
    public_presence: {
      type: Type.OBJECT,
      properties: {
        card_style: { type: Type.STRING },
        online_handles: {
          type: Type.OBJECT,
          properties: {
            website: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ["label", "url"] } },
            linkedin: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ["label", "url"] } },
            twitter: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ["label", "url"] } },
            instagram: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ["label", "url"] } },
            youtube: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ["label", "url"] } },
            github: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ["label", "url"] } },
            other: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { label: { type: Type.STRING }, url: { type: Type.STRING }, icon: { type: Type.STRING }, color: { type: Type.STRING } }, required: ["label", "url"] } },
          }
        },
        content_themes: { type: Type.ARRAY, items: { type: Type.STRING } },
        authority_signals: { type: Type.ARRAY, items: { type: Type.STRING } },
        audience_signal: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            badge_color: { type: Type.STRING }
          }
        },
        reputation_impressions: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["online_handles", "authority_signals"]
    },
    recent_activity: {
      type: Type.OBJECT,
      properties: {
        card_style: { type: Type.STRING },
        last_active_summary: { type: Type.STRING },
        recent_items: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              year: { type: Type.NUMBER },
              title: { type: Type.STRING },
              accent: { type: Type.STRING }
            },
            required: ["title"]
          }
        },
        recency_confidence: {
          type: Type.OBJECT,
          properties: {
            level: { type: Type.STRING },
            color: { type: Type.STRING }
          }
        }
      },
      required: ["recent_items"]
    },
    viewer_relevance: {
      type: Type.OBJECT,
      properties: {
        relevance_score: { type: Type.NUMBER },
        score_color: { type: Type.STRING },
        relevance_reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
        potential_relationship_types: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggested_angles: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["relevance_reasons", "suggested_angles"]
    },
    interaction_suggestions: {
      type: Type.OBJECT,
      properties: {
        recommended_tone: { type: Type.STRING },
        conversation_starters: { type: Type.ARRAY, items: { type: Type.STRING } },
        ways_to_add_value: { type: Type.ARRAY, items: { type: Type.STRING } },
        cautions_and_boundaries: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["recommended_tone", "conversation_starters"]
    },
    uncertainties_and_gaps: {
      type: Type.OBJECT,
      properties: {
        uncertainties: { type: Type.ARRAY, items: { type: Type.STRING } },
        data_gaps: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["uncertainties", "data_gaps"]
    }
  },
  required: [
    "layout_meta",
    "identity_snapshot",
    "career_and_work",
    "public_presence",
    "recent_activity",
    "viewer_relevance",
    "interaction_suggestions",
    "uncertainties_and_gaps"
  ]
};

export const generateInsights = async (
  targetProfile: Profile,
  viewerProfile: Profile | null
): Promise<DashboardResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the person: "${targetProfile.name}"
    Query Context: "${targetProfile.role || targetProfile.context || 'General Professional/Public Figure'}"
    
    Viewer Context:
    - Name: ${viewerProfile?.name || 'Anonymous'}
    - Role: ${viewerProfile?.role || 'Unknown'}
    - Goals: ${(viewerProfile?.goals || []).join(', ')}
    - Mode: Professional Intelligence Dashboard
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Using Flash for reliable search + json combination
      contents: prompt,
      config: {
        systemInstruction: MASTER_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: DASHBOARD_SCHEMA,
        tools: [{ googleSearch: {} }],
        // Removed thinkingConfig to prevent conflicts with JSON mode and Search
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const parsed: DashboardResponse = JSON.parse(text);
    return parsed;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};