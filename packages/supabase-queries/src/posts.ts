import type { SupabaseClient } from "@supabase/supabase-js";
import type { Post, PostComment, CreatePostInput } from "@gezgin/types";
import { SEED_POSTS } from "./seed-data";

export async function getCommunityPosts(
  supabase?: SupabaseClient | null,
  options?: { destinationId?: string }
): Promise<Post[]> {
  if (!supabase) {
    if (options?.destinationId && options.destinationId !== "all") {
      return SEED_POSTS.filter((p) => p.destination_id === options.destinationId);
    }
    return SEED_POSTS;
  }

  try {
    let query = supabase
      .from("posts")
      .select(
        `
        id,
        user_id,
        caption,
        image_url,
        location_name,
        likes_count,
        comments_count,
        created_at,
        updated_at,
        destination_id,
        profiles (
          display_name,
          username,
          avatar_url
        ),
        destinations (
          id,
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (options?.destinationId && options.destinationId !== "all") {
      query = query.eq("destination_id", options.destinationId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (options?.destinationId && options.destinationId !== "all") {
        return SEED_POSTS.filter((p) => p.destination_id === options.destinationId);
      }
      return SEED_POSTS;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      user_id: row.user_id,
      author_name: row.profiles?.display_name || "Gezgin Seyyah",
      author_username: row.profiles?.username || "gezgin",
      author_avatar: row.profiles?.avatar_url,
      destination_id: row.destination_id,
      destination_name: row.destinations?.name,
      location_name: row.location_name,
      caption: row.caption,
      image_url: row.image_url,
      likes_count: row.likes_count || 0,
      comments_count: row.comments_count || 0,
      is_liked: false,
      created_at: new Date(row.created_at).toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "short",
      }),
    }));
  } catch {
    return SEED_POSTS;
  }
}

export async function createCommunityPost(
  supabase: SupabaseClient | null,
  input: CreatePostInput,
  user: { id: string; display_name?: string; username?: string; avatar_url?: string }
): Promise<Post> {
  const newPost: Post = {
    id: `post-${Date.now()}`,
    user_id: user.id,
    author_name: user.display_name || "Gezgin Seyyah",
    author_username: user.username || "gezgin",
    author_avatar: user.avatar_url,
    caption: input.caption,
    image_url: input.image_url,
    destination_id: input.destination_id,
    destination_name: input.destination_name,
    location_name: input.location_name || input.destination_name || "Türkiye",
    likes_count: 0,
    comments_count: 0,
    is_liked: false,
    comments: [],
    created_at: "Az önce",
  };

  if (supabase) {
    try {
      await supabase.from("posts").insert({
        user_id: user.id,
        caption: input.caption,
        image_url: input.image_url,
        destination_id: input.destination_id || null,
        location_name: input.location_name || null,
      });
    } catch {
      // Fallback in memory
    }
  }

  return newPost;
}
