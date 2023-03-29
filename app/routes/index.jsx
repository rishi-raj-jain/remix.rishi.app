import Layout from '~/components/Layout'
import { useLoaderData } from '@remix-run/react'
import { Storyblok } from '~/lib/storyblok.server'
import SocialLinks from '~/components/SocialLinks'

export async function loader() {
  try {
    const { data } = await Storyblok.get('cdn/stories/taglines/home')
    return Storyblok.richTextResolver.render(data.story.content.Text)
  } catch (e) {
    console.log(e.message || e.toString())
    throw new Response('Not Found', {
      status: 404,
    })
  }
}

const Home = () => {
  const __html = useLoaderData()
  return (
    <Layout className="overflow-hidden">
      <div className="md:justify-auto flex min-h-[90vh] flex-col justify-center md:flex-row md:items-center">
        <div className="order-2 md:order-1 flex w-full flex-col items-center justify-center md:w-1/2 md:items-start">
          <h1 className="mt-5 text-2xl font-bold sm:text-5xl md:mt-0">Rishi Raj Jain</h1>
          <h2 className="mt-5 text-center text-lg text-gray-500 dark:text-white sm:text-xl md:text-left">
            Technical Customer Success Manager at Edgio
          </h2>
          <div className="flex flex-row space-x-5">
            <SocialLinks />
          </div>
          <div className="mt-10 h-[1px] w-full bg-gray-200 dark:bg-gray-700"></div>
          <h2 dangerouslySetInnerHTML={{ __html }} className="text-md mt-10 text-center text-gray-500 dark:text-white sm:text-lg md:text-left" />
        </div>
        <div className="order-1 md:order-2 flex flex-col items-center md:items-end justify-center md:flex md:w-1/2">
          <div className="grayscale filter">
            <img
              fetchpriority="high"
              alt="Rishi Raj Jain"
              sizes="(max-width: 768px) 110px, 330px"
              className="rounded object-cover aspect-square transform-gpu"
              src="https://opt.moovweb.net?img=https://rishi.app/static/favicon-image.jpg"
              srcSet="https://opt.moovweb.net?img=https://rishi.app/static/favicon-image.jpg&width=110 110w, https://opt.moovweb.net?img=https://rishi.app/static/favicon-image.jpg&width=330 330w"
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home
