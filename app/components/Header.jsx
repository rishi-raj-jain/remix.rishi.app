import Toggle from './Toggle'
import { Link } from '@remix-run/react'

export default function Header() {
  return (
    <nav className="sticky top-0 z-10 flex w-full flex-col items-center bg-white dark:bg-black">
      <div className="flex w-full max-w-[90vw] flex-row items-center justify-between sm:px-10 lg:max-w-[75vw]">
        <Toggle />
        <div className="relative flex max-w-[258px] flex-row items-center space-x-5 overflow-x-scroll sm:max-w-none sm:overflow-x-hidden">
          <Link className="dark:text-white" to="/">
            Home
          </Link>
          <Link className="dark:text-white" to="/about">
            About
          </Link>
          <Link className="dark:text-white" to="/blogs">
            Blogs
          </Link>
          <Link className="dark:text-white" to="/cv">
            CV
          </Link>
          <Link className="dark:text-white" to="/storyblok">
            Storyblok
          </Link>
        </div>
      </div>
    </nav>
  )
}
