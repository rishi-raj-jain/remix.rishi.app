import Heart from '../components/Heart'
import Layout from '../components/Layout'
import { useLoaderData } from '@remix-run/react'
import { Storyblok } from '../lib/storyblok.server'

export async function loader() {
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
        if (Timeline.hasOwnProperty(story.content.Year)) {
          Timeline[story.content.Year].push({ ...story, renderedText: client.richTextResolver.render(story.content.Description) })
        } else {
          Timeline[story.content.Year] = [{ ...story, renderedText: client.richTextResolver.render(story.content.Description) }]
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
    const { data } = await Storyblok.get('cdn/stories/taglines/about')
    const aboutTagline = Storyblok.richTextResolver.render(data.story.content.Text)
    return { Timeline, aboutTagline }
  } catch (e) {
    console.log(e)
    throw new Response('Not Found', {
      status: 404,
    })
  }
}

const About = () => {
  const { Timeline, aboutTagline } = useLoaderData()
  return (
    <Layout>
      <div class="flex w-full flex-col items-center text-[14px]">
        <div class="mt-10 flex w-[90vw] max-w-[540px] flex-col">
          <h1 class="text-3xl font-bold text-zinc-700 dark:text-gray-300">About Me</h1>
          <div className="mt-2 font-light text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: aboutTagline }} />
          <h2 class="mt-16 text-3xl font-bold text-zinc-700 dark:text-gray-300">My Timeline</h2>
          {Object.keys(Timeline)
            .sort((a, b) => (a > b ? -1 : 1))
            .map((item) => (
              <div key={item} class="mt-8 flex flex-col">
                <span class="text-lg font-semibold text-zinc-600 dark:text-gray-400">{item}</span>
                {Timeline[item].map((exp) => (
                  <div key={exp.content.Title} class="relative mt-5 flex flex-row items-start space-x-5">
                    <div class="mt-1 h-[12px] w-[12px]">
                      <Heart width={12} height={21} />
                    </div>
                    <div class="flex flex-col">
                      <span class="text-md font-semibold text-zinc-600 dark:text-gray-400 sm:text-lg">{exp.content.Title}</span>
                      <div className="font-light text-slate-600 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: exp.renderedText }} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </Layout>
  )
}

export default About
