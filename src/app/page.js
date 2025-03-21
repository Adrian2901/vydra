import Chat from '../app/components/chat';

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col">
      <header className="h-4"></header>
      
      <main className="text-center flex-grow flex">
        <div className="w-1/5">
          <p className="text-4xl text-primary pb-8">Vydra</p>
          <div className="w-11/12 h-12 mb-6 mx-auto bg-primary rounded-2xl">
            <p className="my-auto text-accent py-3">Previous bug report/chat...</p>
          </div>
        </div>
        <div className="w-4/5 bg-primary rounded-l-2xl py-4 flex flex-col justify-between">
            <Chat />
        </div>
      </main>

      <footer className="p-2 text-center text-primary">
        <p>Copyright © 2025 Adrian Hassa, Ionel Pop, Teodora Portase</p>
      </footer>
    </div>
  );
}
