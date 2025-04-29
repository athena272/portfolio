import React from 'react';

function Intro({ theme }) {

   return (
      <div className="flex items-center justify-center flex-col text-center pt-20 pb-6">
         <h1 className="text-4xl md:text-7xl dark:text-white mb-1 md:mb-3 font-bold">Guilherme R. Alves</h1>
         <p className="text-base md:text-xl mb-3 font-medium">Front-End Software Developer</p>
         <p className="text-sm max-w-xl mb-6 font-bold">
            Sou um Desenvolvedor de Software apaixonado, com forte atuação em tecnologias Front-End, e atualmente curso Bacharelado em Engenharia de Computação na Universidade Federal de Sergipe. Ao longo dos últimos anos, contribuí para projetos variados, desde plataformas de empregos no BNE (Banco Nacional de Empregos) até aplicativos mobile em Flutter e sites de provedor de internet, sempre focando em entregar soluções eficientes, de alto desempenho e centradas no usuário. Minhas habilidades abrangem React, Next.js, TypeScript, Node.js e Angular, além de práticas de SEO e otimização de performance. Também possuo experiência em pesquisa de segurança (web bug hunting), identificando e reportando vulnerabilidades de forma responsável. Movido por aprendizado contínuo, valorizo a colaboração, código limpo e o uso da tecnologia para criar experiências digitais de impacto<br />
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