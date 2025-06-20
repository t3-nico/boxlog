import { notFound } from 'next/navigation'
import { getAllPosts, getPostBySlug } from '../../../../lib/api'
import markdownToHtml from '../../../../lib/markdownToHtml'

// @ts-ignore
export default async function PostPage({ params }) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'content',
    'coverImage',
  ])

  if (!post || !post.title) {
    return notFound()
  }

  const content = await markdownToHtml(post.content || '')

  return (
    <main className="py-12">
      <div className="container mx-auto px-5">
        <article className="prose prose-invert lg:prose-xl mx-auto">
          <h1>{post.title}</h1>
          {post.date && (
            <div className="text-zinc-400 mb-8">
              {new Date(post.date).toLocaleDateString('ja-JP')}
            </div>
          )}
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      </div>
    </main>
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts(['slug'])
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
