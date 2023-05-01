export default function Root() {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="bg-white mx-auto my-auto p-8 flex flex-col space-y-8">
        <h2 className="underline">links</h2>
        <a href="/mockup">mockup</a>
        <a href="/full">full</a>
        <a href="/data/project">project</a>
        <a href="/data/title">title</a>
      </div>
    </div>
  );
}
