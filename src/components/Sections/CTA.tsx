import { Cta } from '@/sanity.types';

export default function CTASection({ section }: { section: Cta }) {
  return (
    <section className="bg-gradient-to-r from-pink-500 to-blue-500 py-16 md:py-24 rounded-4xl">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{section?.heading}</h2>
          <p className="text-xl text-white mb-8">{section?.text}</p>
          <form className="flex flex-col md:flex-row gap-4 justify-center">
            <div className="flex-grow max-w-md">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full py-3 px-4 bg-white bg-opacity-20 text-black placeholder-gray-400 border border-white border-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-white hover:bg-gray-100 py-3 px-6 rounded-md font-medium transition-colors duration-200"
            >
              {section?.buttonText}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
