import { PostEntity } from 'src/common/entities/post/post.entity';

export function combinePostsWithLikes(
  posts: PostEntity[],
  likes: number[],
  isLikes: boolean[],
) {
  return posts.map((post, i) => ({
    ...post,
    like: likes[i],
    isLike: isLikes[i],
  }));
}
