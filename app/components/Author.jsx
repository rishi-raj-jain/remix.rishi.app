export default function Author({ post }) {
  return (
    <div className="flex flex-row items-center space-x-3">
      <img
        loading="lazy"
        className="h-[30px]"
        alt={post.content.author.name}
        title={post.content.author.name}
        src={post.content.author.content.picture.filename}
      />
      <div className="flex flex-col">
        <span className="text-sm">{post.content.author.name}</span>
        <a className="text-xs text-blue-500" href="https://twitter.com/rishi_raj_jain_" target="_blank" rel="noreferrer">
          @rishi_raj_jain_
        </a>
      </div>
    </div>
  )
}
