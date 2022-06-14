module.exports = {
  connector: './layer0',
  includeFiles: {
    build: true,
  },
  backends: {
    storyblok: {
      domainOrIp: 'a.storyblok.com',
      hostHeader: 'a.storyblok.com',
      disableCheckCert: process.env.DISABLE_CHECK_CERT || true,
    },
    image: {
      domainOrIp: 'rishi-raj-jain-html-og-image-default.layer0-limelight.link',
      hostHeader: 'rishi-raj-jain-html-og-image-default.layer0-limelight.link',
      disableCheckCert: process.env.DISABLE_CHECK_CERT || true,
    },
  },
}
