import Link from "next/link";
import { Divider } from "@/components/divider";
import { TextSearchIcon, ClockIcon, ScaleIcon, ScanIcon } from "lucide-react"

function Pin(props: JSX.IntrinsicAttributes & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target="_blank"
      className="mr-0.5 ml-0.5 inline-flex items-center border px-2 py-1 text-sm leading-6 no-underline text-zinc-300 border-1 border-white/20 backdrop-blur-xl bg-zinc-900 rounded-lg"
    />
  );
}

export default function Home() {

  const apps = [
    { name: "Metadata Analyzer", description: "Quickly uncover detailed metadata from your unedited images, including camera settings, lens information, copyright data, and more.", icon: <TextSearchIcon className="h-6 w-6" />, link: "/metadata-viewer" },
    { name: "Frame Insets Designer", description: "Enhance your photos with customizable frame insets. Adjust width, aspect ratios, and background colors to match your style.", icon: <ScanIcon className="h-6 w-6" />, link: "/frame-inset" },
    { name: "Work in Progress", description: "New tools are on the way! Stay tuned for upcoming features to enhance your photography workflow.", icon: <ClockIcon className="h-6 w-6" />, link: "#" },
    { name: "Work in Progress", description: "New tools are on the way! Stay tuned for upcoming features to enhance your photography workflow.", icon: <ClockIcon className="h-6 w-6" />, link: "#" },
    { name: "Work in Progress", description: "New tools are on the way! Stay tuned for upcoming features to enhance your photography workflow.", icon: <ClockIcon className="h-6 w-6" />, link: "#" },
    { name: "Work in Progress", description: "New tools are on the way! Stay tuned for upcoming features to enhance your photography workflow.", icon: <ClockIcon className="h-6 w-6" />, link: "#" },
    // { name: "Shutter Count Checker", description: "Discover your camera's shutter count instantly and keep track of its usage. Use an unedited JPEG photo.", icon: <ApertureIcon className="h-6 w-6" />, link: "/shutter-count" },
    // { name: "Frame Insets Designer", description: "Enhance your photos with customizable frame insets. Adjust width, aspect ratios, and background colors to match your style.", icon: <ScanIcon className="h-6 w-6" />, link: "/frame-inset" },
    // { name: "WebP to PNG Converter", description: "Effortlessly convert images between WebP and PNG formats, both ways, with ease.", icon: <RefreshCwIcon className="h-6 w-6" />, link: "/webp-to-png" },
  ];
  
  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto mt-16 md:mt-24 mb-32">
        <div className="mt-16 text-center text-balance">
          <div className="mb-2 md:mb-1 font-semibold inline-flex rounded-2xl px-4 py-1.5 text-sm md:text-base text-white ring-1 ring-orange-300/30 hover:ring-orange-300/50 backdrop-blur-xl bg-orange-300/10 transition-all">
            {`Welcome To imgxLab`}
          </div>
          <h1 className="mb-4 md:mb-6 max-w-4xl mx-auto w-full md:text-7xl text-4xl leading-[2.8rem] md:leading-[5.2rem] font-bold tracking-tight bg-gradient-to-br from-zinc-100 from-30% to-orange-500 to-80% bg-clip-text text-transparent">
            An open-source lab for photographers, built by photographers.
          </h1>
          <p className="leading-6 max-w-4xl mx-auto w-full text-base md:text-lg text-zinc-300">
            {`Simple, intuitive, and packed with 
            essential tools like metadata analysis, shutter count checks, and format 
            converters. All the essential tools that every photographer needs (at some point).`}
          </p>
        </div>
        <div className="py-10">
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
      <footer className="mt-8">
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
            <Pin href="https://github.com/JPerez00/imgxLab/blob/main/LICENSE">
            <ScaleIcon 
            className="-mt-0.5 mr-1 inline-block h-3 w-3" 
            aria-label="MIT logo"
            />
              MIT License 
            </Pin>
          </p>
        </div>
      </footer>
    </div>
  );
}
