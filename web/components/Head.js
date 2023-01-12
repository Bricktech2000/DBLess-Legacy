import React, { Component } from 'react';
import NextHead from 'next/head';

const Head = () => {
  const title = 'DBLess Password Manager';
  const desc = 'A hash-based, database-less password manager';
  const icon = 'icon.png';

  return (
    <NextHead>
      <meta charSet="UTF-8" />
      <meta
        name="viewport"
        content="width=device-width, height=device-height, initial-scale=1.0"
      />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={`https://dbless.emilien.ca/${icon}`} />
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="shortcut icon" href={`https://dbless.emilien.ca/${icon}`} />

      {/* https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Add_to_home_screen */}
      <link rel="manifest" href="manifest.webmanifest" />

      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      />
      {/* https://fonts.google.com/specimen/Roboto?category=Sans+Serif */}
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
        rel="stylesheet"
      />
      {/* https://fonts.google.com/specimen/Inconsolata?category=Monospace */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* https://stackoverflow.com/questions/32963400/android-keyboard-shrinking-the-viewport-and-elements-using-unit-vh-in-css */}
      {/* https://medium.com/@sruthisreemenon/avoid-ui-distortions-during-keyboard-display-for-a-mobile-friendly-webpage-86eb99590a13 */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('load', () => {
              setTimeout(() => {
                let viewport = document.querySelector("meta[name=viewport]");
                viewport.setAttribute("content", "height=" + window.innerHeight + "px, width=device-width, initial-scale=1.0")
              });
            });
          `,
        }}
      />
    </NextHead>
  );
};

export default Head;
