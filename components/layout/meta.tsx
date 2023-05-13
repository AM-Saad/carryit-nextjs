import Head from "next/head";

const DOMAIN = "https://precedent.dev";

export default function Meta({
  title = "Karry, let'em track",
  description = "Track your orders in real-time, every step of the way",
  // image = `${DOMAIN}/api/og`,
}: {
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />

      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <meta itemProp="image" content={image} /> */}
      <meta property="og:logo" content={`${DOMAIN}/logo.png`}></meta>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {/* <meta property="og:image" content={image} /> */}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@abd_elrahmanmo" />
      <meta name="twitter:creator" content="@abd_elrahmanmo" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {/* <meta name="twitter:image" content={image} /> */}
    </Head>
  );
}
