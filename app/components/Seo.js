import { Fragment } from 'react'
import { defaultDescription, defaultTitle, deploymentUrl, profileLinks } from '../lib/data'

const SEO = ({
  title,
  description,
  image = `${deploymentUrl}/static/social-media-card.jpg`,
  pubDate,
  canonical = deploymentUrl,
  author,
  faviconImage = `${deploymentUrl}/static/favicon-image.jpg`,
  children,
}) => {
  const Title = `${title ?? defaultTitle}`.trim()
  const Description = `${description ?? defaultDescription}`.trim()
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <title>{Title}</title>
      <meta name="title" property="title" content={Title} />
      <meta name="og:title" property="og:title" content={Title} />
      <meta name="twitter:title" property="twitter:title" content={Title} />
      <meta name="description" property="description" content={Description} />
      <meta name="og:description" property="og:description" content={Description} />
      <meta name="twitter:description" property="twitter:description" content={Description} />
      {canonical && <meta name="og:url" property="og:url" content={canonical} />}
      {canonical && <meta name="twitter:url" property="twitter:url" content={canonical} />}
      <link rel="icon" href={faviconImage} />
      <meta name="og:image" property="og:image" content={image} />
      <meta name="twitter:image" property="twitter:image" content={image} />
      {profileLinks && profileLinks['twitter'] && (
        <meta
          name="twitter:creator"
          content={`@${profileLinks['twitter'].split('/')[profileLinks['twitter'].split('/').length - 1]}`}
        />
      )}
      {pubDate && (
        <Fragment>
          <meta property="article:published_time" content={`${new Date(pubDate).toISOString()}`} />
          <meta property="og:type" content="article" />
        </Fragment>
      )}
      {canonical && <link rel="canonical" href={canonical} />}
      {author && <meta name="author" content={author} />}
      {children}
    </>
  )
}

export default SEO
