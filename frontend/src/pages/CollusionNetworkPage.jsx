import React from 'react';
import CollusionNetwork from '../components/CollusionNetwork';

export default function CollusionNetworkPage({ onInspectCase }) {
  return (
    <div className="syght-page page-collusion-network" id="page-network">
      <CollusionNetwork onInspectCase={onInspectCase} />
    </div>
  );
}
