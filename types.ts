
export interface Tag {
  label: string;
  color: string;
  variant: "solid" | "outline";
}

export interface OnlineHandle {
  label: string;
  url: string;
  icon: string;
  color: string;
}

export interface CareerRole {
  title: string;
  context: string;
  icon: string;
  accent: string;
}

export interface PastHighlight {
  title: string;
  year: number | null;
  note: string;
  chip_color: string;
}

export interface RecentItem {
  year: number | null;
  title: string;
  accent: string;
}

export interface DashboardResponse {
  layout_meta: {
    theme: string;
    accent_color: string;
    section_order: string[];
  };
  identity_snapshot: {
    canonical_name: string;
    headline: string;
    primary_location: string | null;
    short_bio: string;
    tags: Tag[];
    primary_domains_of_focus: string[];
    avatar_hint: {
      style: string;
      fallback_bg: string;
    };
  };
  career_and_work: {
    card_style: string;
    current_roles: CareerRole[];
    current_affiliations: string[];
    past_highlights: PastHighlight[];
    core_skills: string[];
    industries: string[];
  };
  public_presence: {
    card_style: string;
    online_handles: {
      website: OnlineHandle[];
      linkedin: OnlineHandle[];
      twitter: OnlineHandle[];
      instagram: OnlineHandle[];
      youtube: OnlineHandle[];
      github: OnlineHandle[];
      other: OnlineHandle[];
    };
    content_themes: string[];
    authority_signals: string[];
    audience_signal: {
      level: string;
      badge_color: string;
    };
    reputation_impressions: string[];
  };
  recent_activity: {
    card_style: string;
    last_active_summary: string;
    recent_items: RecentItem[];
    recency_confidence: {
      level: string;
      color: string;
    };
  };
  viewer_relevance: {
    relevance_score: number | null;
    score_color: string;
    relevance_reasons: string[];
    potential_relationship_types: string[];
    suggested_angles: string[];
  };
  interaction_suggestions: {
    recommended_tone: string;
    conversation_starters: string[];
    ways_to_add_value: string[];
    cautions_and_boundaries: string[];
  };
  uncertainties_and_gaps: {
    uncertainties: string[];
    data_gaps: string[];
  };
}

export interface Profile {
  id: string;
  name: string;
  role?: string; // e.g. "Software Engineer"
  context?: string; // e.g. "Looking for job"
  location?: string;
  goals?: string[];
}

export interface Theme {
  id: string;
  name: string;
  gradient: string; // e.g. "from-purple-600 to-pink-600"
  textGradient: string; // e.g. "bg-gradient-to-r from-purple-600 to-pink-600"
  primary: string; // e.g. "text-purple-600"
  bgSoft: string; // e.g. "bg-purple-50"
  border: string; // e.g. "border-purple-200"
  shadow: string; // e.g. "shadow-purple-500/20"
  ring: string; // e.g. "focus:ring-purple-500/20"
  iconBg: string; // e.g. "bg-purple-100"
}
