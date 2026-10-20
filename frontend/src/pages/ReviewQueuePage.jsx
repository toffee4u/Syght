import React from 'react';
import ReviewQueue from '../components/ReviewQueue';

export default function ReviewQueuePage({
  cases,
  onInspectCase,
  onTriageAction,
}) {
  return (
    <div className="syght-page page-review-queue" id="page-queue">
      <ReviewQueue
        cases={cases}
        onInspectCase={onInspectCase}
        onTriageAction={onTriageAction}
      />
    </div>
  );
}
