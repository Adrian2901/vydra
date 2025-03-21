import { Bot, User } from 'lucide-react';

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
          <div className="w-11/12 h-12 mb-6 mx-auto bg-primary rounded-2xl">
            <p className="my-auto text-text py-3">Previous bug report/chat...</p>
          </div>
        </div>
        <div className="w-4/5 bg-primary rounded-l-2xl py-4 flex flex-col justify-between">
          <div className='w-full space-y-8'>
            <div className='flex text-left text-xl mx-8'>
              <Bot color='black' size={36} />
              <p className='my-auto mx-4'>Hello! How can I help you today? ^^</p>
            </div>
            <div className='flex text-right text-xl mx-8 justify-end'>
              <p className='my-auto mx-4'>Can you help me improve this bug report? I dont know to write good quality bug reports:(</p>
              <User color='black' size={36} />
            </div>
            <div className='flex text-left text-xl mx-8'>
              <Bot color='black' size={36} />
              <p className='my-auto mx-4'>Certainly! I&apos;d be happy to help you improve your bug report. Please provide the details of the bug report you have, and I'll assist you in refining it.</p>
            </div>
          </div>
          
          <div className="p-4 bg-secondary text-primary w-11/12 mx-auto rounded-2xl flex">
            <textarea className="w-full h-24 resize-none" placeholder="Type your message here..."></textarea>
            <button className="bg-accent text-primary py-2 px-4 rounded h-12 my-auto mx-2">Send</button>
          </div>
        </div>
      </main>

      <footer className="p-2 text-center text-primary">
        <p>Copyright © 2025 Adrian Hassa, Ionel Pop, Teodora Portase</p>
      </footer>
    </div>
  );
}
