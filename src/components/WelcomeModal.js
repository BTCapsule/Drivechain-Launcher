import React, { useState } from 'react';
import styles from './WelcomeModal.module.css';

const WelcomeModal = ({ isOpen, onClose }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mnemonic, setMnemonic] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGenerateWallet = async () => {
    try {
      setIsGenerating(true);
      setError('');
      
      // Generate master wallet
      const result = await window.electronAPI.createMasterWallet();
      if (!result.success) {
        throw new Error(result.error);
      }

      // Get chain IDs from config
      const config = await window.electronAPI.getConfig();
      const l1Chain = config.chains.find(c => c.chain_layer === 1);
      const sidechains = config.chains.filter(c => c.chain_layer === 2);

      // Derive L1 wallet
      if (l1Chain) {
        await window.electronAPI.deriveChainWallet(l1Chain.id);
      }

      // Derive sidechain wallets
      for (const chain of sidechains) {
        await window.electronAPI.deriveChainWallet(chain.id);
      }

      onClose();
    } catch (error) {
      console.error('Error generating wallet:', error);
      setError(error.message || 'Failed to generate wallet');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRestoreWallet = async () => {
    try {
      setIsGenerating(true);
      setError('');

      if (!mnemonic) {
        throw new Error('Please enter a mnemonic phrase');
      }

      // Import master wallet
      const result = await window.electronAPI.importMasterWallet(mnemonic, passphrase);
      if (!result.success) {
        throw new Error(result.error);
      }

      // Get chain IDs from config
      const config = await window.electronAPI.getConfig();
      const l1Chain = config.chains.find(c => c.chain_layer === 1);
      const sidechains = config.chains.filter(c => c.chain_layer === 2);

      // Derive L1 wallet
      if (l1Chain) {
        await window.electronAPI.deriveChainWallet(l1Chain.id);
      }

      // Derive sidechain wallets
      for (const chain of sidechains) {
        await window.electronAPI.deriveChainWallet(chain.id);
      }

      onClose();
    } catch (error) {
      console.error('Error restoring wallet:', error);
      setError(error.message || 'Failed to restore wallet');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Welcome to DC Launcher! 🚀</h2>
        <div className={styles.modalBody}>
          <p>
            DC Launcher is your all-in-one tool for managing Drivechain nodes. Start and stop nodes, 
            manage wallets, and interact with both mainchain and sidechains through a simple interface. 
            Let's begin by setting up your wallet!
          </p>
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <button 
          className={styles.generateButton} 
          onClick={handleGenerateWallet}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Wallet'}
        </button>

        <div 
          className={styles.advancedToggle}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <span className={styles.advancedText}>{showAdvanced ? 'Hide restore options' : 'Restore wallet'}</span>
          <span className={`${styles.chevron} ${showAdvanced ? styles.up : ''}`}>▼</span>
        </div>

        {showAdvanced && (
          <div className={styles.advancedSection}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={mnemonic}
                onChange={(e) => setMnemonic(e.target.value)}
                placeholder="Enter BIP39 Mnemonic (12 or 24 words)"
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <input
                type="text"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter optional passphrase"
                className={styles.input}
              />
            </div>
            <div className={styles.restoreButtonContainer}>
              <button 
                className={styles.restoreButton} 
                onClick={handleRestoreWallet}
                disabled={isGenerating}
              >
                {isGenerating ? 'Restoring...' : 'Restore Wallet'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelcomeModal;
