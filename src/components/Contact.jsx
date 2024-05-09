import React from 'react';
import Title from './Title';

function Contact() {
   return (
      <div className="flex flex-col mb-10 mx-auto">
         <div className="flex justify-center items-center">
            <form
               action="https://getform.io/f/f03fd014-8463-4360-8587-8ae6247dd0dd"
               method="POST"
               className="flex flex-col w-full md:w-7/12"
            >
               <Title>Contato</Title>
               <input
                  type="text"
                  name="name"
                  placeholder="Nome"
                  className="p-2 bg-transparent border-2 rounded-md focus:outline-none"
                  required
               />
               <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="my-2 p-2 bg-transparent border-2 rounded-md focus:outline-none"
                  required
               />
               <textarea
                  name="message"
                  placeholder="Mensagem"
                  rows="10"
                  className="p-2 mb-4 bg-transparent border-2 rounded-md focus:outline-none"
                  required
               />
               <button
                  type="submit"
                  className="text-center inline-block px-8 py-3 w-max text-base font-medium rounded-md text-white bg-gradient-to-r from-yellow-500 to-pink-500 drop-shadow-md hover:stroke-white"
               >
                  Vamos trabalhar juntos
               </button>
            </form>
         </div>
      </div>
   )
}

export default Contact;