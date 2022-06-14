const Author = ({ author, post }) => {
  return (
    <div className="flex flex-row items-center space-x-3">
      <img width={30} height={30} alt={author} title={author} src={post.content.author.content.picture.filename} />
      <div className="flex flex-col">
        <span className="text-sm">{author}</span>
        <a className="text-blue-500 text-xs" href="https://twitter.com/rishi_raj_jain_" target="_blank">
          {'@rishi_raj_jain_'}
        </a>
      </div>
    </div>
  )
}

export default Author
