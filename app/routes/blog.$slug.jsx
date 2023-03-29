import dark from '~/dark.css'
import { useEffect } from 'react'
import { ClientOnly } from 'remix-utils'
import Layout from '~/components/Layout'
import Author from '~/components/Author'
import MD_TO_HTML from '~/lib/markdown.server'
import { useLoaderData } from '@remix-run/react'
import { Storyblok } from '~/lib/storyblok.server'
import DateString from '~/components/DateString.client'

export const links = () => [{ rel: 'stylesheet', href: dark }]

export async function loader({ params }) {
  const { slug } = params
  const { data } = await Storyblok.get('cdn/stories/posts/' + slug, {
    resolve_relations: 'author',
  })
  const { story, rels } = data
  story['content']['long_text'] = await MD_TO_HTML(story['content']['long_text'])
  story['content']['author'] = rels[0]
  return story
}

// Reference
// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.top = '0'
  textArea.style.left = '0'
  textArea.style.position = 'fixed'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  try {
    var successful = document.execCommand('copy')
    var msg = successful ? 'successful' : 'unsuccessful'
    console.log('Fallback: Copying text command was ' + msg)
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err)
  }
  document.body.removeChild(textArea)
}

export default function Blog() {
  const post = useLoaderData()
  useEffect(() => {
    if (typeof window === 'undefined') { return }
    if (window.copyTextToClipboard) {
      return
    }
    window.copyTextToClipboard = (selector) => {
      const elementSelector = document.querySelector(selector)
      let elementText = elementSelector.innerText
      if (elementText.startsWith('Copy\n')) {
        elementText = elementText.replace('Copy\n', '')
      } else if (elementText.startsWith('Copied\n')) {
        elementText = elementText.replace('Copied\n', '')
      }
      if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(elementText)
        return
      }
      navigator.clipboard.writeText(elementText).then(
        function () {
          elementSelector.querySelector(`${selector}-text`).innerHTML = `Copied`
          elementSelector.querySelector(
            `${selector}-icon`
          ).innerHTML = `<path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z"/>`
          console.log('Async: Copying to clipboard was successful!')
        },
        function (err) {
          console.error('Async: Could not copy text: ', err)
        }
      )
    }
  }, [])
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
