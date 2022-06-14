import { Fragment } from 'react'
import SEO from '../components/Seo'
import { useLoaderData } from 'remix'
import { deploymentUrl } from '../lib/data'
import TimelineItem from '../components/TimelineItem'
import RichTextResolver from 'storyblok-js-client/dist/rich-text-resolver.cjs'

export async function loader() {
  const aboutFetch = await fetch(`${deploymentUrl}/api/about`)
  if (!aboutFetch.ok)
    throw new Response('Not Found', {
      status: 404,
    })
  const aboutData = await aboutFetch.json()
  return { ...aboutData }
}

const About = () => {
  const { aboutTagline, Timeline } = useLoaderData()
  const SEODetails = {
    title: `About Me - Rishi Raj Jain`,
    canonical: `${deploymentUrl}/about`,
  }
  return (
    <>
      <SEO {...SEODetails} />
      <h1 className="font-bold text-2xl sm:text-5xl">About Me</h1>
      {aboutTagline && (
        <h2
          dangerouslySetInnerHTML={{
            __html: new RichTextResolver().render(aboutTagline),
          }}
          className="mt-5 dark:text-gray-400 font-regular text-md sm:text-xl whitespace-pre-line"
        />
      )}
      <h1 className="mt-16 font-bold text-2xl sm:text-5xl">My Timeline</h1>
      {Timeline &&
        Object.keys(Timeline)
          .sort((a, b) => (a > b ? -1 : 1))
          .map((item) => (
            <Fragment key={item}>
              <span className="mt-8 font-bold text-lg">{item}</span>
              {Timeline[item].map((exp) => (
                <TimelineItem key={exp.content.Title} {...exp['content']} />
              ))}
            </Fragment>
          ))}
    </>
  )
}

export default About

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

