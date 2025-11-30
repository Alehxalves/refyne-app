export interface Board {
  id: string;
  user_id: string;
  title?: string;
  description?: string;
  color?: string;
  text_color?: string;
  created_at: string;
  updated_at: string;
}

export type BoardWithStories = Board & {
  stories: Story[];
};

export interface Story {
  id: string;
  board_id: string;
  title: string;
  description: string;
  default_priority?: "LOW" | "MEDIUM" | "HIGH";
  sort_order: number;
  archived?: boolean;
  story_group_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoryGroup {
  id: string;
  board_id: string;
  title: string;
  color?: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CheckList {
  id: string;
  story_id: string;
  type: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface CheckListItem {
  id: string;
  check_list_id: string;
  title: string;
  is_checked: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export type CheckListWithItems = CheckList & {
  items: CheckListItem[];
};

export interface Priority {
  id: string;
  story_id: string;
  moscow: "MUST" | "SHOULD" | "COULD" | "WON'T";
  csd: "CERTAINTIES" | "SUPPOSITIONS" | "DOUBTS";
  gut_g_value: number;
  gut_u_value: number;
  gut_t_value: number;
  reason: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  story_id: string;
  avatar?: string;
  context: string;
  message: string;
  created_at: string;
  updated_at: string;
}
