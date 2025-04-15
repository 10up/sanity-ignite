export default function Alert() {
  return (
    <div className="bg-gray-100 w-full text-gray-800 text-xs">
      <div className="container mx-auto px-4 py-3 text-center">
        This is a technical demo of Ignite for Sanity - A Sanity + Next.js starter kit.{' '}
        <a
          href="https://www.sanity.io/templates/sanity-ignite"
          className="text-primary underline hover:text-pink-600"
        >
          Click here
        </a>{' '}
        to learn more.
      </div>
    </div>
  );
}
