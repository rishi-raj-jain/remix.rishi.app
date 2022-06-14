export const defaultDescription = `Currently, I am working as a Solutions Engineer at Layer0 by LimeLight Networks.`

export const defaultTitle = 'Rishi Raj Jain - Software Engineer, Developer, Designer, Writer'

export const deploymentUrl = process.env.NODE_ENV == 'production' ? 'https://rishi.app' : 'https://rishi.app'

export const imageLink = 'https://rishi-raj-jain-html-og-image-default.layer0.link'

export const profileLinks = {
  twitter: 'https://twitter.com/rishi_raj_jain_',
  linkedin: 'https://linkedin.com/in/rishi-raj-jain',
  behance: 'https://behance.net/rishi-raj-jain',
  medium: 'https://rishi-raj-jain.medium.com/',
  dribbble: 'https://dribbble.com/rishi-raj-jain',
  github: 'https://github.com/rishi-raj-jain',
  youtube: 'https://www.youtube.com/channel/UCshnsm7ND7kccgYc67KSeig/',
}

export const structuredData = {
  '@id': deploymentUrl,
  '@context': 'https://schema.org',
  '@type': 'Website',
  name: defaultTitle,
  description: defaultDescription,
  url: deploymentUrl,
  sameAs: Object.keys(profileLinks).map((item) => profileLinks[item]),
}

export const defaultHome = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: 'I build products that delight customers through a blend of frontend engineering, and visual design.',
          type: 'text',
        },
      ],
    },
  ],
}

export const defaultAbout = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: `I'm pursuing Computer Science and Design at IIIT-Delhi. \n I love to bring a positive attitude to the table and like to spend my free time in nature or enjoying myself with family and friends.`,
          type: 'text',
        },
      ],
    },
  ],
}

export const defaultBlogs = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        {
          text: `I've been writing since 13 March, 2020 ✨`,
          type: 'text',
        },
      ],
    },
  ],
}
