import Link from "next/link";
import { Button}  from "@/components/button"; // Assuming your button component is here

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
            <Pin href="https://github.com/JPerez00/imgxLab">
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
