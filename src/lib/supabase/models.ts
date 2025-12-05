import {
  CHECK_LIST_TYPE,
  CSD_LEVEL,
  MOSCOW_LEVEL,
  ORDER_BY_STORIES,
  ORDER_DIRECTION_STORIES,
} from "./enums";

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
  story_points?: number;
  archived?: boolean;
  story_group_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type StoryWithPrioritization = Story & {
  prioritization_technique?: PrioritizationTechnique | null;
};

export interface StoryGroup {
  id: string;
  board_id: string;
  title: string;
  color?: string;
  sort_order: number;
  order_by_stories: ORDER_BY_STORIES;
  order_direction_stories: ORDER_DIRECTION_STORIES;
  archived?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckList {
  id: string;
  story_id: string;
  type: CHECK_LIST_TYPE;
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

export interface PrioritizationTechnique {
  id: string;
  story_id: string;
  moscow: MOSCOW_LEVEL;
  csd: CSD_LEVEL;
  gut_g_value: number;
  gut_u_value: number;
  gut_t_value: number;
  useMoscow: boolean;
  useCsd: boolean;
  useGut: boolean;
  created_at: string;
  updated_at: string;
}

export interface JustificationsForPriorization {
  id: string;
  priorization_technique_id: string;
  message: string;
  avatar?: string;
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
