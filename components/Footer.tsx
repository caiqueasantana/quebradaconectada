import React from 'react';

const Footer: React.FC = () => {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, resourceName: string) => {
    e.preventDefault();
    // In a real application, this would navigate to the correct resource.
    // For this prototype, we show an alert to clarify it's a placeholder.
    alert(`Em uma aplicação real, este link abriria um recurso sobre "${resourceName}".`);
  };

  return (
    <footer className="py-8 px-4 mt-12 bg-gray-200 dark:bg-black dark:bg-opacity-30 text-center text-gray-600 dark:text-gray-400 transition-colors duration-300">
      <div className="container mx-auto">
        <p className="mb-4">
          "Quebrada Conectada" é um protótipo educacional desenvolvido como parte de uma pesquisa da Fatec Carapicuíba,
          utilizando metodologia mista para explorar a autonomia digital.
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="#" onClick={(e) => handleLinkClick(e, 'LGPD')} className="hover:text-teal-600 dark:hover:text-[#00FFFF] transition-colors">LGPD (Lei nº 13.709/2018)</a>
          <a href="#" onClick={(e) => handleLinkClick(e, 'Cidadania Digital')} className="hover:text-teal-600 dark:hover:text-[#00FFFF] transition-colors">Recursos de Cidadania Digital</a>
          <a href="#" onClick={(e) => handleLinkClick(e, 'Ética em Pesquisa')} className="hover:text-teal-600 dark:hover:text-[#00FFFF] transition-colors">Ética em Pesquisa (CEP)</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
