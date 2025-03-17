import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'; // Você pode trocar o ícone por outros
import './notification.scss'; // Importando o arquivo SCSS

const Notification = ({ message, type, onClose }) => {
  return (
    <div className={`notification ${type}`}>
      <FontAwesomeIcon icon={faExclamationCircle} className="notification__icon" />
      <p className="notification__message">{message}</p>
      <button className="notification__close" onClick={onClose}>X</button>
    </div>
  );
};

export default Notification;
