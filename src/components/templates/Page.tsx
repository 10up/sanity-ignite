export default function Page({
  title,
  children,
}: {
  title?: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-12">
      {title ? <h1 className="text-3xl md:text-5xl font-bold mb-10">{title}</h1> : null}
      {children}
    </div>
  );
}
