import { Link } from 'remix'
import SEO from '../components/Seo'
import { useLoaderData } from 'remix'
import { Prefetch } from '@layer0/react'
import { deploymentUrl } from '../lib/data'
import SearchBar from '../components/SearchBar'
import DateString from '../components/DateString'
import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.cjs'

export async function loader() {
  const blogsFetch = await fetch(`${deploymentUrl}/api/blogs`)
  if (!blogsFetch.ok)
    throw new Response('Not Found', {
      status: 404,
    })
  const blogsData = await blogsFetch.json()
  return { ...blogsData }
}

const Blogs = () => {
  const { allPosts, recommendedPosts, blogsTagline } = useLoaderData()
  const SEODetails = {
    title: `Blogs - Rishi Raj Jain`,
    canonical: `${deploymentUrl}/blogs`,
  }
  return (
    <>
      <SEO {...SEODetails} />
      <div className="flex flex-col">
        <h1 className="font-bold text-2xl sm:text-5xl">Blogs</h1>
        <h2
          className="mt-5 dark:text-gray-400 font-regular text-md sm:text-xl whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: new RichTextResolver().render(blogsTagline),
          }}
        />
        <SearchBar content={allPosts} />
        <div className="flex flex-row flex-wrap">
          <div className="mt-10 lg:mt-20 w-full lg:w-2/3 lg:pr-10 flex flex-col">
            {allPosts.map((item) => (
              <div key={`/blog/${item.slug}`} className="border-b dark:border-gray-700 pb-10 mb-10 flex flex-col">
                <span className="dark:text-gray-400 text-gray-700">
                  <DateString date={new Date(item.first_published_at)} />
                </span>
                <Prefetch url={`/blog/${item.slug}?_data=${encodeURIComponent('routes/blog/$slug')}`}>
                  <Link to={`/blog/${item.slug}`} className="mt-3 hover:underline">
                    <span className="font-bold text-lg sm:text-2xl">{item.content.title}</span>
                  </Link>
                </Prefetch>
                <span className="mt-3 dark:text-gray-400 text-gray-700 line-clamp-2 text-sm">{item.content.intro}</span>
                <Prefetch url={`/blog/${item.slug}?_data=${encodeURIComponent('routes/blog/$slug')}`}>
                  <Link to={`/blog/${item.slug}`} className="hover:underline text-blue-500 mt-5 uppercase text-sm">
                    Read More &rarr;
                  </Link>
                </Prefetch>
              </div>
            ))}
          </div>
          <div className="mt-0 lg:mt-20 w-full lg:w-1/3 flex flex-col">
            <h4 className="font-bold text-md sm:text-lg">Recommended Posts</h4>
            {recommendedPosts.map((item) => (
              <a
                rel="noopener"
                target="_blank"
                key={item.content.Title}
                href={item.content.Url.url}
                className="mt-5 pb-2 border-b dark:border-gray-700 hover:underline truncate dark:text-gray-400 text-gray-500 text-sm"
              >
                {item.content.Title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Blogs

export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <p>The stack trace is:</p>
      <pre>{error.stack}</pre>
    </div>
  );
}

