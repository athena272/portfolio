import React from 'react';

function Intro({ theme }) {

   return (
      <div className="flex items-center justify-center flex-col text-center pt-20 pb-6">
         <h1 className="text-4xl md:text-7xl dark:text-white mb-1 md:mb-3 font-bold">Guilherme R. Alves</h1>
         <p className="text-base md:text-xl mb-3 font-medium">Front-End Software Developer</p>
         <p className="text-sm max-w-xl mb-6 font-bold">
            Bem-vindo ao meu portfólio! Aqui você encontrará uma seleção cuidadosamente escolhida dos meus trabalhos, habilidades e experiências profissionais.<br />
            Estudante de Engenharia da Computação altamente motivado e entusiasmado com experiência em desenvolvimento web e interesse apurado em segurança web. <br />
            "A{' '}
            <a href="https://github.com/athena272" target="_blank" style={{ textDecoration: 'underline', color: `${theme === 'dark' ? '#38BDF8' : '#4C00FF'}` }} rel="noreffer noopener">
               programação
            </a>
            {' '}iluminou meus dias mais sombrios." ⭐ <br />
         </p>
      </div>
   )
}

export default Intro;