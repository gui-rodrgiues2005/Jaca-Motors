import React, { createContext, useState, useContext } from 'react';

const ConfiguracaoContext = createContext();

export const ConfiguracaoProvider = ({ children }) => {
  const [configuracoes, setConfiguracoes] = useState({
    formatoRelatorio: 'pdf',
    notificacoesEmail: true,
    estoqueMinimo: 10,
    backupAutomatico: true
  });

  const atualizarConfiguracao = (chave, valor) => {
    setConfiguracoes(prev => ({ ...prev, [chave]: valor }));
  };

  return (
    <ConfiguracaoContext.Provider value={{ configuracoes, atualizarConfiguracao }}>
      {children}
    </ConfiguracaoContext.Provider>
  );
};

export const useConfiguracao = () => {
  const context = useContext(ConfiguracaoContext);
  if (!context) {
    throw new Error('useConfiguracao deve ser usado dentro de um ConfiguracaoProvider');
  }
  return context;
};