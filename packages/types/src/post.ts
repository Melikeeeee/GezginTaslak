export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  author_name: string;
  author_username: string;
  author_avatar?: string;
  destination_id?: string;
  destination_name?: string;
  place_name?: string;
  caption: string;
  image_url?: string;
  location_name?: string;
  likes_count: number;
  comments_count: number;
  is_liked?: boolean;
  comments?: PostComment[];
  created_at: string;
  updated_at?: string;
}

export interface CreatePostInput {
  caption: string;
  image_url?: string;
  destination_id?: string;
  destination_name?: string;
  place_name?: string;
  location_name?: string;
}
