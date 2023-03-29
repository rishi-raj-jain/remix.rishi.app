import { Suspense } from 'react'
import { defer } from '@remix-run/node'
import { ClientOnly } from 'remix-utils'
import Layout from '../components/Layout'
import { Storyblok } from '../lib/storyblok.server'
import SearchBar from '../components/SearchBar.client'
import DateString from '../components/DateString.client'
import { Await, Link, useLoaderData } from '@remix-run/react'

export async function loader() {
  return defer({
    blogsTagline: new Promise(async (resolve, reject) => {
      try {
        const { data } = await Storyblok.get('cdn/stories/taglines/blogs')
        resolve(Storyblok.richTextResolver.render(data.story.content.Text))
      } catch (e) {
        console.log(e.message || e.toString())
        reject(e)
      }
    }),
    allPosts: await new Promise(async (resolve, reject) => {
      try {
        let Posts = []
        const getPosts = async (page, client) => {
          const res = await client.get('cdn/stories', {
            page: page,
            per_page: 100,
            starts_with: 'posts/',
          })
          Posts = [...Posts, ...res.data.stories]
          let total = res.total
          let lastPage = Math.ceil(total / res.perPage)
          if (page <= lastPage) {
            page++
            await getPosts(page)
          }
        }
        await getPosts(1, Storyblok)
        resolve(Posts)
      } catch (e) {
        console.log(e.message || e.toString())
        reject(e)
      }
    }),
    recommendedPosts: new Promise(async (resolve, reject) => {
      try {
        const { data } = await Storyblok.get('cdn/stories', { page: 1, per_page: 100, starts_with: 'recommended/' })
        resolve(data.stories)
      } catch (e) {
        console.log(e.message || e.toString())
        reject(e)
      }
    }),
  })
}

export default function Blogs() {
  const { blogsTagline, allPosts, recommendedPosts } = useLoaderData()
  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold sm:text-5xl">Blogs</h1>
        <Suspense fallback={<p className="mt-2 font-light text-slate-600 dark:text-slate-400">Loading Blogs's Tagline...</p>}>
          <Await
            resolve={blogsTagline}
            errorElement={<p className="mt-2 font-light text-slate-600 dark:text-slate-400">Error loading blogs Tagline!</p>}
          >
            {(blogsTagline) => (
              <h2
                dangerouslySetInnerHTML={{ __html: blogsTagline }}
                className="font-regular text-md mt-5 whitespace-pre-line dark:text-gray-400 sm:text-xl"
              />
            )}
          </Await>
        </Suspense>
        <ClientOnly fallback={<span className="hide-if-no-javascript w-full">Loading...</span>}>{() => <SearchBar />}</ClientOnly>
        <div className="flex flex-row flex-wrap">
          <div className="mt-10 flex w-full flex-col lg:mt-20 lg:w-2/3 lg:pr-10">
            {allPosts.map((item, _) => (
              <div key={_} className="mb-10 flex flex-col border-b pb-10 dark:border-gray-700">
                <ClientOnly>
                  {() => (
                    <span id={`first_published_at_${_}`} className={`text-gray-700 dark:text-gray-400`}>
                      {item && item.first_published_at ? <DateString date={new Date(item.first_published_at)} /> : 'placeholder date'}
                    </span>
                  )}
                </ClientOnly>
                {item && item.content && (
                  <Link href={`/blog/${item.slug}`} className={`mt-3 text-lg font-bold hover:underline sm:text-2xl`}>
                    {item.content.title}
                  </Link>
                )}
                {item && item.content && <span className={`mt-3 text-sm text-gray-700 line-clamp-2 dark:text-gray-400`}>{item.content.intro}</span>}
                {item && item.slug && (
                  <Link href={`/blog/${item.slug}`} className={`mt-5 text-sm uppercase text-blue-500 hover:underline`}>
                    Read More &rarr;
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="mt-0 flex w-full flex-col lg:mt-20 lg:w-1/3">
            <h4 className="text-md font-bold sm:text-lg">Recommended Posts</h4>
            <Suspense fallback={<p className="mt-2 font-light text-slate-600 dark:text-slate-400">Loading Rishi's Recommended Posts...</p>}>
              <Await
                resolve={recommendedPosts}
                errorElement={<p className="mt-2 font-light text-slate-600 dark:text-slate-400">Error loading Rishi's Recommended Posts</p>}
              >
                {(recommendedPosts) =>
                  recommendedPosts.map(
                    (item) =>
                      item &&
                      item.content && (
                        <a
                          target="_blank"
                          rel="noreferrer"
                          key={item.content.Title}
                          href={item.content.Url.url}
                          className={`mt-5 truncate border-b pb-2 text-sm text-gray-500 hover:underline dark:border-gray-700 dark:text-gray-400`}
                        >
                          {item.content.Title}
                        </a>
                      )
                  )
                }
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
    </Layout>
  )
}
