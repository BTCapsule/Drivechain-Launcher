import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import styles from './ChainSettingsModal.module.css';
import { X, ExternalLink } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFolderOpen as faFolderOpenRegular } from '@fortawesome/free-regular-svg-icons';

const ChainSettingsModal = ({
  chain,
  onClose,
  onOpenDataDir,
  onOpenWalletDir,
  onReset,
}) => {
  const { isDarkMode } = useTheme();

  const handleResetChain = () => {
    if (
      window.confirm(
        `Are you sure you want to reset this chain? This will:\n` +
          `1. Stop the chain if it's running\n` +
          `2. Delete all chain data\n` +
          `3. Remove any downloaded binaries\n\n` +
          `This action cannot be undone.`
      )
    ) {
      onReset(chain.id);
      onClose();
    }
  };

  const handleOpenRepo = e => {
    e.preventDefault();
    window.open(chain.repo_url, '_blank', 'noopener,noreferrer');
  };

  const handleOverlayClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`${styles.modalOverlay} ${isDarkMode ? styles.dark : styles.light}`}
      onClick={handleOverlayClick}
    >
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{chain.display_name} Settings</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Repository:</span>
            <a
              href={chain.repo_url}
              onClick={handleOpenRepo}
              className={styles.link}
            >
              {chain.repo_url}
              <ExternalLink size={14} className={styles.externalIcon} />
            </a>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Wallet Directory:</span>
            <span className={styles.dataDir}>
              {chain.walletDir}
              <button
                className={styles.dirButton}
                onClick={() => onOpenWalletDir(chain.id)}
                title="Open wallet directory"
              >
                <FontAwesomeIcon icon={faFolderOpenRegular} size="sm" />
              </button>
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Data Directory:</span>
            <span className={styles.dataDir}>
              {chain.dataDir}
              <button
                className={styles.dirButton}
                onClick={() => onOpenDataDir(chain.id)}
                title="Open data directory"
              >
                <FontAwesomeIcon icon={faFolderOpenRegular} size="sm" />
              </button>
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Binary Directory:</span>
            <span className={styles.dataDir}>
              {chain.binaryDir}
              <button
                className={styles.dirButton}
                onClick={() => window.electronAPI.openBinaryDir(chain.id)}
                title="Open binary directory"
              >
                <FontAwesomeIcon icon={faFolderOpenRegular} size="sm" />
              </button>
            </span>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            onClick={handleResetChain}
            className={`btn ${styles.resetBtn}`}
          >
            Reset Chain
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChainSettingsModal;
