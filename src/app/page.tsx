
export default function Home() {
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
      </div>
    </div>
  );
}
