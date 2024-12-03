import { PostEntity } from 'src/common/entities/post/post.entity';

export function combinePostsWithLikes(posts: PostEntity[], likes: number[]) {
  return posts.map((post, i) => ({ ...post, like: likes[i] }));
}
