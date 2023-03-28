import { defer } from '@remix-run/node'
import Layout from '../components/Layout'
import SearchBar from '../components/SearchBar'
import { useLoaderData } from '@remix-run/react'

export async function loader() {
  return defer({
    blogs: await new Promise((resolve, reject) => {}),
    recommendedPosts: new Promise((resolve, reject) => {}),
  })
}

export default function Blogs() {
  const data = useLoaderData()
  return (
    <Layout>
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold sm:text-5xl">Blogs</h1>
        <h2
          className={`font-regular text-md mt-5 whitespace-pre-line dark:text-gray-400 sm:text-xl ${
            data.blogsTagline ? '' : 'bg-black dark:bg-gray-400 animate-pulse'
          }`}
        />
        {data.allPosts[0] != 0 && (
          <span className="hide-if-no-javascript w-full">
            <SearchBar client:only="react" />
          </span>
        )}
        <div className="flex flex-row flex-wrap">
          <div className="mt-10 flex w-full flex-col lg:mt-20 lg:w-2/3 lg:pr-10">
            {data.allPosts.map((item, _) => (
              <div key={_} className="mb-10 flex flex-col border-b pb-10 dark:border-gray-700">
                <span
                  id={`first_published_at_${_}`}
                  className={`text-gray-700 dark:text-gray-400 ${
                    item && item.first_published_at ? '' : 'w-[250px] animate-pulse bg-gray-700 dark:bg-gray-400'
                  }`}
                >
                  {item && item.first_published_at ? <DateString date={new Date(item.first_published_at)} /> : 'placeholder date'}
                </span>
                <a
                  href={item && item.slug ? `/blog/${item.slug}` : ''}
                  className={`mt-3 text-lg font-bold hover:underline sm:text-2xl ${item && item.slug ? '' : 'animate-pulse bg-black'}`}
                >
                  {item && item.content ? item.content.title : 'placeholder title'}
                </a>
                <span
                  className={`mt-3 text-sm text-gray-700 line-clamp-2 dark:text-gray-400 ${
                    item && item.content ? '' : 'w-[200px] animate-pulse bg-gray-700 dark:bg-gray-400'
                  }`}
                >
                  {item && item.content ? item.content.intro : 'placeholder intro'}
                </span>
                <a
                  href={item && item.slug ? `/blog/${item.slug}` : ''}
                  className={`mt-5 text-sm uppercase text-blue-500 hover:underline ${item && item.slug ? '' : 'w-[100px] animate-pulse bg-blue-500'}`}
                >
                  Read More &rarr;
                </a>
              </div>
            ))}
          </div>
          <div className="mt-0 flex w-full flex-col lg:mt-20 lg:w-1/3">
            <h4 className="text-md font-bold sm:text-lg">Recommended Posts</h4>
            {data.recommendedPosts.map((item) => (
              <a
                rel="noreferrer"
                target="_blank"
                key={item.content.Title}
                href={item && item.content ? item.content.Url.url : ''}
                className={`mt-5 truncate border-b pb-2 text-sm text-gray-500 hover:underline dark:border-gray-700 dark:text-gray-400 ${
                  item && item.content ? '' : 'animate-pulse bg-gray-500 dark:bg-gray-400'
                }`}
              >
                {item && item.content ? item.content.Title : 'placeholder title'}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
