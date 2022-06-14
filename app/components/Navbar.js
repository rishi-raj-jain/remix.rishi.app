import { Link } from 'remix'
import Prefetch from '@layer0/react/Prefetch'

const navLinks = [
  {
    pathname: '/',
    name: 'Home',
  },
  {
    pathname: '/about',
    name: 'About',
  },
  {
    pathname: '/blogs',
    name: 'Blogs',
  },
]

const Navbar = () => {
  return (
    <div className="sticky top-0 z-10 backdrop-filter backdrop-blur-xl w-full flex flex-col items-center">
      <a
        target="_blank"
        href="https://try.layer0.co/nextjs-storyblok/"
        className="w-full bg-white dark:bg-black text-black dark:text-gray-200 border-b border-gray-600 flex flex-row items-center justify-center"
      >
        <h2>Coming in from JSWORLD Conference? &rarr;</h2>
      </a>
      <div className="w-full max-w-[90vw] lg:max-w-[75vw] sm:px-10 flex flex-row items-center justify-between">
        <button className="appearance-none focus:outline-none"></button>
        <div className="relative max-w-[258px] overflow-x-scroll sm:overflow-x-hidden sm:max-w-none flex flex-row items-center space-x-5">
          {navLinks.map((item) => (
            <Prefetch
              key={item.name}
              url={`${item.pathname}?_data=routes${encodeURIComponent(item.pathname === '/' ? '/index' : item.pathname)}`}
            >
              <Link
                to={item.pathname}
                className={`${item.hasOwnProperty('class') ? item.class : ''} flex flex-row items-center relative space-x-3`}
              >
                <span className="text-md font-medium">{item.name}</span>
              </Link>
            </Prefetch>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navbar
