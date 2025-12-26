
class StorageMock {
  constructor() {
    this.data = {};
    this.initialized = false;
  }

  async get(key, shared = false) {
    const value = this.data[key];
    if (value !== undefined) {
      return { key, value, shared };
    }
    
    
    try {
      const stored = localStorage.getItem(`itasks-${key}`);
      if (stored) {
        this.data[key] = stored;
        return { key, value: stored, shared };
      }
    } catch (error) {
      console.warn('Erro ao ler do localStorage:', error);
    }
    
    return null;
  }

  async set(key, value, shared = false) {
    this.data[key] = value;
    
    
    try {
      localStorage.setItem(`itasks-${key}`, value);
    } catch (error) {
      console.warn('Erro ao salvar no localStorage:', error);
    }
    
    return { key, value, shared };
  }

  async delete(key, shared = false) {
    const existed = key in this.data;
    delete this.data[key];
    
    try {
      localStorage.removeItem(`itasks-${key}`);
    } catch (error) {
      console.warn('Erro ao deletar do localStorage:', error);
    }
    
    return { key, deleted: existed, shared };
  }

  async list(prefix = '', shared = false) {
    const keys = Object.keys(this.data).filter(k => k.startsWith(prefix));
    return { keys, prefix, shared };
  }

  // Método para limpar todos os dados (útil para debug)
  clear() {
    this.data = {};
    
    // Limpar localStorage
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('itasks-')) {
          localStorage.removeItem(key);
        }
      });
      console.log('✅ Storage limpo com sucesso');
      console.log('🔄 Recarregue a página (F5) para reiniciar');
    } catch (error) {
      console.warn('Erro ao limpar localStorage:', error);
    }
  }

  reset() {
    this.clear();
    window.location.reload();
  }
}


const storage = new StorageMock();

if (typeof window !== 'undefined') {
  window.storage = storage;
  
  // Adicionar funções helper para debug
  window.clearStorage = () => storage.clear();
  window.resetApp = () => storage.reset();
  
  console.log('✅ window.storage mock inicializado');
  console.log('💡 Use window.clearStorage() para limpar dados');
  console.log('💡 Use window.resetApp() para resetar e recarregar');
  console.log('');
  console.log('🔑 Credenciais padrão:');
  console.log('   Username: admin');
  console.log('   Password: admin123');
}

export default storage;