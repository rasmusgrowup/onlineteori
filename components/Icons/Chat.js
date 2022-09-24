import React from 'react'
import sidebar from '../../styles/sidebar.module.scss';

export default function Chat() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="31.5" viewBox="0 0 36 31.5" id={sidebar.chat}>
      <path id="Icon_open-chat" data-name="Icon open-chat" d="M0,0V22.5L4.5,18H9V4.5H22.5V0ZM13.5,9V27h18L36,31.5V9Z" fill="#010b36"/>
    </svg>
  )
}