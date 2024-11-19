import Link from "next/link";
import { Button}  from "@/components/button";
import { ScaleIcon } from "lucide-react"; // Assuming your button component is here

function BackButton() {
  return (
    <div className="relative left-2 z-50">
      <Link href="/" aria-label="Go back to home">
        <Button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </Button>
      </Link>
    </div>
  );
}

function Pin(props: JSX.IntrinsicAttributes & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      target="_blank"
      className="mr-0.5 ml-0.5 inline-flex items-center border px-2 py-1 text-sm leading-5 no-underline text-zinc-300 border-1 border-white/20 backdrop-blur-xl bg-zinc-900 rounded-lg"
    />
  );
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col justify-between p-6">
      <BackButton />
      <main className="flex flex-grow flex-col items-center justify-center w-full max-w-2xl mx-auto space-y-10">
        {children}
      </main>
      <footer className="mt-20 w-full max-w-4xl mx-auto">
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
