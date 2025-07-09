// import { Post } from "content-collections"

import { BlogCard } from "./blog-card"

export function BlogPosts({ posts }: { posts: any[] }) {
  return (
    <main className="space-y-8">
      {/* <BlogCard data={posts[0]} horizontale priority /> */}

      <div className="grid gap-8 md:grid-cols-2 md:gap-x-6 md:gap-y-10 xl:grid-cols-3">
        {/* {posts.slice(0).map((post, idx) => (
          <BlogCard data={post} key={idx} priority={idx <= 2} />
        ))} */}
        {posts.map((post, idx) => (
          <BlogCard data={post} key={idx} priority={idx <= 2} />
        ))}
      </div>
    </main>
  )
}
