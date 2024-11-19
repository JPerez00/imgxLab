import Link from "next/link";
import { Divider } from "@/components/divider";
import { ApertureIcon, ScanIcon, TextSearchIcon, RefreshCwIcon } from "lucide-react"


function Pin(props: JSX.IntrinsicAttributes & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target="_blank"
      className="mr-0.5 ml-0.5 inline-flex items-center border px-2 py-1 text-sm leading-5 no-underline text-zinc-300 border-1 border-white/20 backdrop-blur-xl bg-zinc-900 rounded-lg"
    />
  );
}

export default function Home() {

  const apps = [
    { name: "Metadata Analyzer", description: "Quickly uncover detailed metadata from your images, including camera settings, lens information, copyright data, and more.", icon: <TextSearchIcon className="h-6 w-6" />, link: "/metadata-viewer" },
    // { name: "Shutter Count Checker", description: "Discover your camera's shutter count instantly and keep track of its usage.", icon: <ApertureIcon className="h-6 w-6" />, link: "/shutter-count" },
    // { name: "Frame Insets Designer", description: "Enhance your photos with customizable frame insets. Adjust width, aspect ratios, and background colors to match your style.", icon: <ScanIcon className="h-6 w-6" />, link: "/frame-inset" },
    // { name: "WebP to PNG Converter", description: "Effortlessly convert images between WebP and PNG formats, both ways, with ease.", icon: <RefreshCwIcon className="h-6 w-6" />, link: "/webp-to-png" },
  ];
  
  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mt-16 text-center text-balance">
          <h1 className="text-balance md:text-7xl text-6xl leading-tight md:leading-[5.2rem] font-bold tracking-tight bg-gradient-to-br from-white from-30% to-orange-500 to-75% bg-clip-text text-transparent mb-2">
            {`imgxLab`}
          </h1>
          <p className="max-w-3xl mx-auto font-semibold text-base md:text-xl text-white/95 mb-3">
            An <span className="underline-custom">open-source</span> lab for photographers, built by photographers.
          </p>
          <p className="max-w-3xl mx-auto text-base md:text-lg text-zinc-400">
            {`Simple, intuitive, and packed with 
            essential tools like metadata analysis, shutter count checks, and format 
            converters. All the essential tools that every photographer needs (at some point).`}
          </p>
          </div>
        <div className="py-8">
          <Divider />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app, index) => (
            <Link key={index} href={app.link} className="transform transition-all duration-300 hover:bg-zinc-800/70 rounded-xl bg-zinc-900 shadow-[0px_0px_0px_1px_rgba(255,255,255,0.15)] hover:shadow-[0px_0px_0px_1px_rgba(255,255,255,0.20)] before:pointer-events-none before:absolute before:-inset-px before:rounded-xl before:shadow-[0px_2px_8px_0px_rgba(0,_0,_0,_0.20),_0px_1px_0px_0px_rgba(255,_255,_255,_0.06)_inset]">
              <div className="h-full p-6 rounded-xl">
                <div className="flex flex-row items-center gap-3 pb-2">
                  <div className="bg-orange-500 text-white p-2 rounded-full ring-2 ring-white/40 backdrop-blur shadow">
                    {app.icon}
                  </div>
                </div>
                <div className="mt-2 text-xl font-semibold tracking-tight text-white">{app.name}</div>
                <div>
                  <div className="mt-1 text-zinc-300">{app.description}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <footer className="mt-20">
        <div className="max-w-5xl mx-auto flex flex-col items-center border-t border-zinc-400/20 py-6 sm:flex-row-reverse sm:justify-between">
          <p className="text-sm text-zinc-500 sm:mt-0">
            Developed by{' '}
            <Link
              href="https://www.jorge-perez.dev/"
              className="hover:text-zinc-400 hover:underline transition-all duration-300"
            >
              Jorge Perez
            </Link>
          </p>
          <p className="mt-4 text-sm text-zinc-400 sm:mt-0">
            Powered by{' '}
            <Pin href="https://vercel.com/home">
              <svg
                width="13"
                height="11"
                role="img"
                aria-label="Vercel logo"
                className="mr-1 inline-block"
              >
                <use href="/sprite.svg#vercel" />
              </svg>
              Vercel
            </Pin>{' '}
            -{' '}
            <Pin href="https://kit.com/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="mr-1 inline-block"
                style={{ verticalAlign: '-0.15em' }} // Adjust this value as needed
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
              </svg>
              Repo
            </Pin>
          </p>
        </div>
      </footer>
    </div>
  );
}
