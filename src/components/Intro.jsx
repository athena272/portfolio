import React from 'react';

function Intro() {
   return (
      <div className="flex items-center justify-center flex-col text-center pt-20 pb-6">
         <h1 className="text-4xl md:text-7xl dark:text-white mb-1 md:mb-3 font-bold">Guilherme R. Alves</h1>
         <p className="text-base md:text-xl mb-3 font-medium">Front-End Software Developer</p>
         <p className="text-sm max-w-xl mb-6 font-bold">
            Estudante de ciência da computação altamente motivado e entusiasmado com experiência em desenvolvimento web e interesse apurado em segurança web. <br />
            "A{' '}
            <a href="https://github.com/athena272" target="_blank" className="text-cyan-600 hover:underline underline-offset-2 decoration-2 decoration-red-600" rel="noreffer noopener">
               programação
            </a>
            {' '}iluminou meus dias mais sombrios." ⭐ <br />
            Buscando aproveitar minhas habilidades e conhecimento para fazer uma contribuição significativa para a indústria de tecnologia.
         </p>
      </div>
   )
}

export default Intro;