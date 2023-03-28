import StoryblokClient from 'storyblok-js-client'

export const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK,
})
