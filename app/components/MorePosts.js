import { Link } from 'remix'
import Prefetch from '@layer0/react/Prefetch'

const MorePosts = ({ morePosts }) => {
  const filteredPosts = morePosts.filter((item) => item.hasOwnProperty('name'))

  return (
    filteredPosts.length > 0 && (
      <div className="flex flex-col">
        <div className="text-sm mt-10 mb-5">
          <span> More Posts &rarr; </span>
        </div>
        {filteredPosts.map((item) => (
          <Prefetch key={item.slug} url={`/blog/${item.slug}?_data=routes%2Fblog%2F%24slug`}>
            <Link to={`/blog/${item.slug}`} className="hover:underline mb-5 block w-full font-bold text-lg">
              {item.name}
            </Link>
          </Prefetch>
        ))}
      </div>
    )
  )
}

export default MorePosts
