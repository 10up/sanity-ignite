/**
 * Do not import Sanity or Front-end specific code into this
 * file, it will not be tree shaken effectively and will impact
 * performance.
 */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
