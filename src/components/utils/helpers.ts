import { StoryGroup, StoryWithPrioritization } from "@/lib/supabase/models";

function calculatePriorityScore(story: StoryWithPrioritization): number {
  const p = story.prioritization_technique;
  if (!p) return 0;

  const moscowWeight: Record<string, number> = {
    MUST: 4,
    SHOULD: 3,
    COULD: 2,
    WONT: 1,
  };

  const csdWeight: Record<string, number> = {
    CERTAINTIES: 3,
    SUPPOSITIONS: 2,
    DOUBTS: 1,
  };

  let score = 0;

  if (p.useMoscow && p.moscow) {
    score += (moscowWeight[p.moscow] ?? 0) * 1000;
  }

  if (p.useGut) {
    const gutScore = p.gut_g_value * p.gut_u_value * p.gut_t_value;
    score += gutScore * 10;
  }

  if (p.useCsd && p.csd) {
    score += csdWeight[p.csd] ?? 0;
  }

  return score;
}

export function sortStoriesForGroup(
  stories: StoryWithPrioritization[],
  group?: StoryGroup
): StoryWithPrioritization[] {
  const order =
    (group?.order_by_stories as
      | "CUSTOM"
      | "PRIORITY"
      | "STORY_POINTS"
      | "CREATED_AT"
      | "UPDATED_AT") ?? "CUSTOM";

  const direction = (group?.order_direction_stories as "ASC" | "DESC") ?? "ASC";
  const dir = direction === "DESC" ? -1 : 1;

  const arr = [...stories];

  if (order === "PRIORITY") {
    return arr.sort((a, b) => {
      const pa = calculatePriorityScore(a);
      const pb = calculatePriorityScore(b);

      const cmpScore = pb - pa;
      if (cmpScore !== 0) return dir * cmpScore;

      const cmpSortOrder = (a.sort_order ?? 0) - (b.sort_order ?? 0);
      return dir * cmpSortOrder;
    });
  }

  if (order === "STORY_POINTS") {
    return arr.sort((a, b) => {
      const spa = a.story_points ?? 0;
      const spb = b.story_points ?? 0;
      const cmpStoryPoints = spb - spa;
      if (cmpStoryPoints !== 0) return dir * cmpStoryPoints;

      const cmpSortOrder = (a.sort_order ?? 0) - (b.sort_order ?? 0);
      return dir * cmpSortOrder;
    });
  }

  if (order === "CREATED_AT") {
    return arr.sort(
      (a, b) =>
        dir *
        (new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    );
  }

  if (order === "UPDATED_AT") {
    return arr.sort(
      (a, b) =>
        dir *
        (new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime())
    );
  }

  // CUSTOM
  return arr.sort((a, b) => dir * ((a.sort_order ?? 0) - (b.sort_order ?? 0)));
}
