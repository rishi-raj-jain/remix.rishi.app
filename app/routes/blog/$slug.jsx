import { useLoaderData } from 'remix'
import SEO from '../../components/Seo'
import Author from '../../components/Author'
import markdownToHtml from '../../lib/markdown'
import MorePosts from '../../components/MorePosts'
import DateString from '../../components/DateString'
import { deploymentUrl, imageLink } from '../../lib/data'

export const loader = async ({ params }) => {
  const blogFetch = await fetch(`${deploymentUrl}/api/blog/${params.slug}`)
  if (!blogFetch.ok)
    throw new Response('Not Found', {
      status: 404,
    })
  const blogData = await blogFetch.json()
  blogData['post']['content']['long_text'] = await markdownToHtml(blogData.post.content.long_text)
  return { ...blogData }
}

const Blog = () => {
  const { post, morePosts } = useLoaderData()
  const SEODetails = {
    description: post.content.intro,
    pubDate: post.first_published_at,
    author: post.content.author.name,
    canonical: `${deploymentUrl}/blog/${post.slug}`,
    title: `${post.content.title} - ${post.content.author.name}`,
  }
  if (post.content.image) SEODetails['image'] = `${imageLink}/api?title=${post.content.title}&image=${post.content.image}`
  return (
    <div className="w-full flex flex-col items-center">
      <SEO {...SEODetails} />
      <div className="w-full md:max-w-2xl">
        <div className="w-full flex flex-col items-center">
          <DateString date={new Date(SEODetails.pubDate)} />
          <h1 className="mt-3 mb-7 text-center font-bold text-2xl sm:text-4xl">{post.content.title}</h1>
          <Author post={post} {...SEODetails} />
        </div>
        <div className="mt-7 w-full h-[1px] bg-gray-200"></div>
        <article
          className="prose dark:prose-light max-w-none mt-10 text-sm"
          dangerouslySetInnerHTML={{ __html: post.content.long_text }}
        />
        <MorePosts morePosts={morePosts} />
      </div>
    </div>
  )
}

export default Blog

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  )
}
