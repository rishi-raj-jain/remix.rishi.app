import Header from './Header'

export default function Layout({ className, children }) {
  return (
    <div className={`min-h-screen bg-white font-display dark:bg-black ${className}`}>
      <Header />
      <main className="flex flex-col items-center text-black dark:text-gray-200">
        <div className="flex w-full max-w-[90vw] flex-col py-10 sm:px-10 lg:max-w-[75vw]">{children}</div>
      </main>
    </div>
  )
}
