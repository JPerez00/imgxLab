# imgxLab

![Image](/public/imgxlab-hero.png)

An open-source lab for photographers, built by photographers.

Simple, intuitive, and packed with essential tools like metadata analysis, shutter count checks, and format converters. All the essential tools that every photographer needs (at some point).

## Live Project

[https://www.imgxlab.com/](https://www.imgxlab.com/)

## Features

- Utilizes local storage.
- Simple and intuitive interface.
- Drag & drop files, or select them manually.
- Works entirely offline, with no internet connection required.

## Current Tools

- **Metadata Analyzer Tool:** Quickly uncover detailed metadata from your unedited images, including camera settings, lens information, copyright data, and more.

- **Frame Insets Designer Tool:** Enhance your photos with customizable frame insets. Adjust width, aspect ratios, and background colors to match your style.

- **Image Compressor:** Efficiently compress images without compromising quality, saving storage space while maintaining visual fidelity.

- **WebP to PNG Converter:** Easily convert images between WebP and PNG formats, allowing for broader compatibility and usage.

- **Image Resizer:** Resize your photos by dimensions or percentage for the web quickly and easily.

## The Magic Behind imgxLab

All processing is done locally using your browser's local storage, ensuring that your files are never shared or uploaded to any external servers. This means you can use imgxLab without an internet connection, and your images remain secure on your device.

We leverage the power of React's `useState` and `useLocalStorage` hooks to provide a seamless and persistent user experience.

## Privacy & Security

All image processing occurs locally in your browser, utilizing local storage to save your settings and progress. This means:

- No Data Sharing: Your images are never uploaded or shared with external servers.
- Offline Capability: imgxLab works 100% offline. You can use all tools without an internet connection.
- Secure Storage: Settings and preferences are stored securely in your browser's local storage.

## Ease Of Use

Not a flashy, sparkly, kira kira project. imgxLab is designed with photographers in mind. The interface is simple, intuitive, and easy to navigate, ensuring that you can access the tools you need without any hassle.

## Work in Progress

The goal is to create a long-term project that solves simple, common issues photographers face.

imgxLab is designed to address the evolving needs of photographers. We welcome feedback, suggestions, and contributions from the community to shape its future.

More tools will be added over time.

## Documentation

Detailed blog posts will be added over time for each tool, covering how they were created, the code, and the reasoning behind them. You can read them [here](https://www.jorge-perez.dev/blog/).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Open Source Project

This project is licensed under the MIT License. See the [LICENSE file](https://github.com/JPerez00/imgxLab/blob/main/LICENSE) for details.
