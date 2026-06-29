export const PageHero = ({
  title,
  excerpt,
}: {
  title: string | null;
  excerpt: string | null;
}) => {
  return (
    <section className="relative overflow-hidden bg-ink text-white px-7 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-primary/15"
      />
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="font-display my-4.5 text-5xl font-extrabold leading-none tracking-tight text-paper lg:text-6xl text-balance">
            {title}
          </h1>
        </div>
        <p className="relative text-muted-on-dark text-base leading-[1.55] max-w-[560px]">
          {excerpt}
        </p>
      </div>
    </section>
  );
};
