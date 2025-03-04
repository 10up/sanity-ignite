import { Subscribe } from '@/sanity.types';
import { Button } from '../ui/button';
import PortableText from '../PortableText';
import { type PortableTextBlock } from 'next-sanity';

export default function SubscribeSection({ section }: { section: Subscribe }) {
  return (
    <section className="py-10 md:py-14 bg-white container mx-auto">
      <div className="bg-gradient-to-r from-pink-500 to-blue-500 py-16 md:py-24 rounded-4xl container">
        <div className="">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{section?.heading}</h2>
            <PortableText className="" value={section.content as PortableTextBlock[]} />
            <form className="flex flex-col md:flex-row gap-4 justify-center">
              <div className="flex-grow max-w-md">
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full py-3 px-4 bg-transparent bg-opacity-20 text-white placeholder-gray-100 border border-white border-opacity-30 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  required
                />
              </div>
              <Button type="submit" variant={'outline'} size={'xl'}>
                {section.buttonText}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
