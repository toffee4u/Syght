import React from 'react';
import PreAuthGateway from '../components/PreAuthGateway';

export default function PreAuthGatewayPage({ onShowToast }) {
  return (
    <main className="syght-page page-preauth-gateway" id="page-preauth">
      <PreAuthGateway onShowToast={onShowToast} />
    </main>
  );
}
