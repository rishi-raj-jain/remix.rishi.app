import { Suspense } from 'react'
import Heart from '../components/Heart'
import { defer } from '@remix-run/node'
import Layout from '../components/Layout'
import { Storyblok } from '../lib/storyblok.server'
import { Await, useLoaderData } from '@remix-run/react'

export async function loader() {
  try {
    const { data } = await Storyblok.get('cdn/stories/taglines/about')
    const aboutTagline = Storyblok.richTextResolver.render(data.story.content.Text)
    return defer({
      aboutTagline,
      Timeline: new Promise(async (resolve, reject) => {
        try {
          const Timeline = {}
          const getStories = async (page, client) => {
            const res = await client.get('cdn/stories', {
              page: page,
              per_page: 100,
              starts_with: 'timeline/',
            })
            let stories = res.data.stories
            stories.forEach((story) => {
              const renderedText = client.richTextResolver.render(story.content.Description)
              if (Timeline.hasOwnProperty(story.content.Year)) {
                Timeline[story.content.Year].push({ ...story, renderedText })
              } else {
                Timeline[story.content.Year] = [{ ...story, renderedText }]
              }
            })
            let total = res.total
            let lastPage = Math.ceil(total / res.perPage)
            if (page <= lastPage) {
              page++
              await getStories(page)
            }
          }
          await getStories(1, Storyblok)
          resolve(Timeline)
        } catch (e) {
          console.log(e.message || e.toString())
          reject(e)
        }
      }),
    })
  } catch (e) {
    console.log(e.message || e.toString())
    throw new Response('Not Found', {
      status: 404,
    })
  }
}

const About = () => {
  const { Timeline, aboutTagline } = useLoaderData()
  return (
    <Layout>
      <div className="flex w-full flex-col items-center text-[14px]">
        <div className="mt-10 flex w-[90vw] max-w-[540px] flex-col">
          <h1 className="text-3xl font-bold text-zinc-700 dark:text-gray-300">About Me</h1>
          <div className="mt-2 font-light text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: aboutTagline }} />
          <h2 className="mt-16 text-3xl font-bold text-zinc-700 dark:text-gray-300">My Timeline</h2>
          <Suspense fallback={<p className="mt-2 font-light text-slate-600 dark:text-slate-400">Loading Rishi's Timeline...</p>}>
            <Await
              resolve={Timeline}
              errorElement={<p className="mt-2 font-light text-slate-600 dark:text-slate-400">Error loading timeline of Rishi!</p>}
            >
              {(Timeline) =>
                Object.keys(Timeline)
                  .sort((a, b) => (a > b ? -1 : 1))
                  .map((item) => (
                    <div key={item} className="mt-8 flex flex-col">
                      <span className="text-lg font-semibold text-zinc-600 dark:text-gray-400">{item}</span>
                      {Timeline[item].map((exp) => (
                        <div key={exp.content.Title} className="relative mt-5 flex flex-row items-start space-x-5">
                          <div className="mt-1 h-[12px] w-[12px]">
                            <Heart width={12} height={21} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-md font-semibold text-zinc-600 dark:text-gray-400 sm:text-lg">{exp.content.Title}</span>
                            <div className="font-light text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: exp.renderedText }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
    </Layout>
  )
}

export default About
