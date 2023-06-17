import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript  >
          <script src="https://cdn.jsdelivr.net/npm/marker-animate-unobtrusive@1.1.3/dist/SlidingMarker.min.js"></script>
        </NextScript>
      </body>
    </Html>
  );
}
