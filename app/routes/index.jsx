import SEO from '../components/Seo'
import { useLoaderData } from 'remix'
import { deploymentUrl } from '../lib/data'
import SocialLinks from '../components/SocialLinks'
import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.cjs'

export async function loader() {
  const homeFetch = await fetch(`${deploymentUrl}/api/home`)
  if (!homeFetch.ok)
    throw new Response('Not Found', {
      status: 404,
    })
  const homeData = await homeFetch.json()
  return { ...homeData }
}

const Home = () => {
  const { homeTagline } = useLoaderData()
  return (
    <>
      <SEO />
      <div className="min-h-[90vh] flex flex-col justify-center md:justify-auto md:flex-row md:items-center">
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start justify-center">
          <div className="md:hidden filter grayscale">
            <img width={120} height={120} className="rounded object-cover" src="https://rishi.app/static/favicon-image.jpg" />
          </div>
          <h1 className="mt-5 md:mt-0 font-bold text-2xl sm:text-5xl">Rishi Raj Jain</h1>
          <h2 className="text-center md:text-left mt-5 text-lg sm:text-xl text-gray-500 dark:text-white">
            Solutions Engineer at Layer0 by Limelight
          </h2>
          <div className="flex flex-row space-x-5">
            <SocialLinks />
          </div>
          {homeTagline && (
            <>
              <div className="mt-10 bg-gray-200 dark:bg-gray-700 h-[1px] w-full"></div>
              <h2
                dangerouslySetInnerHTML={{
                  __html: new RichTextResolver().render(homeTagline),
                }}
                className="text-center md:text-left mt-10 text-md sm:text-lg text-gray-500 dark:text-white"
              ></h2>
            </>
          )}
        </div>
        <div className="p-5 p-lg-0 hidden md:w-1/2 md:flex flex-col items-end justify-center">
          <div className="filter grayscale">
            <img width={330} className="rounded object-cover" src="https://rishi.app/static/favicon-image.jpg" />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home

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
