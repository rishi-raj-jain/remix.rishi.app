import dark from '~/dark.css'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkPrism from 'remark-prism'
import { ClientOnly } from 'remix-utils'
import remarkRehype from 'remark-rehype'
import Layout from '~/components/Layout'
import Author from '~/components/Author'
import rehypeStringify from 'rehype-stringify'
import { useLoaderData } from '@remix-run/react'
import { Storyblok } from '~/lib/storyblok.server'
import { addCopyToCode } from '~/lib/markdown.server'
import DateString from '~/components/DateString.client'

export const links = () => [{ rel: 'stylesheet', href: dark }]

export async function loader({ params }) {
  const { slug } = params
  const { data } = await Storyblok.get('cdn/stories/posts/' + slug, {
    resolve_relations: 'author',
  })
  const { story, rels } = data
  let result = await unified().use(remarkParse).use(remarkPrism).use(remarkRehype).use(rehypeStringify).process(story['content']['long_text'])
  story['content']['long_text'] = addCopyToCode(result.toString())
  story['content']['author'] = rels[0]
  return story
}

export default function Blog() {
  const post = useLoaderData()
  return (
    <Layout>
      <div className="flex w-full flex-col items-center">
        <div className="w-full md:max-w-2xl">
          <div className="flex w-full flex-col items-center">
            <ClientOnly>{() => <DateString date={new Date(post.first_published_at)} />}</ClientOnly>
            <h1 className="mt-3 mb-7 text-center text-2xl font-bold sm:text-4xl">{post.content.title}</h1>
            <Author post={post} />
          </div>
          <div className="mt-7 h-[1px] w-full bg-gray-200"></div>
          <article
            dangerouslySetInnerHTML={{ __html: post.content.long_text }}
            className="prose mt-10 flex max-w-none flex-col items-center text-sm dark:prose-light"
          />
        </div>
      </div>
    </Layout>
  )
}
