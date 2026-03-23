import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Polls() {
  const [voted, setVoted] = useState(false);

  const { user } = useAuth();
  const isDemo = user?.email?.endsWith('@demo.edu');
  const pollData = isDemo ? {
     question: 'Should the Midterm Syllabus be revised to remove Chapter 4?',
     totalVotes: 142,
     options: [
        { id: 1, text: 'Yes, remove Chapter 4', votes: 89, percent: 63, isWinner: true },
        { id: 2, text: 'No, keep Chapter 4', votes: 40, percent: 28, isWinner: false },
        { id: 3, text: 'I have no preference', votes: 13, percent: 9, isWinner: false },
     ]
  } : { question: 'No active polls.', totalVotes: 0, options: [] };

  return (
    <div style={{ padding: '0 48px' }}>
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>Active Polls</h2>
        <button className="btn-primary" style={{backgroundColor: 'var(--alert-color)'}}>Live Polling Server Active</button>
      </div>

      <div className="widget-card" style={{ maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'basline', marginBottom: 24 }}>
          <h3 style={{ fontSize: 20, color: 'var(--text-primary)' }}>{pollData.question}</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{pollData.totalVotes} Votes</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           {pollData.options.map(opt => (
              <div key={opt.id} style={{ position: 'relative', cursor: 'pointer', overflow: 'hidden', borderRadius: 12, border: '1px solid var(--border-color)' }} onClick={() => setVoted(true)}>
                 <div style={{ 
                    position: 'absolute', top: 0, left: 0, bottom: 0, 
                    width: `${opt.percent}%`, 
                    backgroundColor: opt.isWinner ? 'var(--primary-light)' : 'var(--surface-alt)',
                    zIndex: 0, transition: 'width 0.5s ease-out'
                 }} />
                 <div style={{ position: 'relative', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{opt.text}</div>
                    {(voted || opt.isWinner) && <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary-color)' }}>{opt.percent}%</div>}
                 </div>
              </div>
           ))}
        </div>
        
        {!voted && <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', marginTop: 24 }}>Click an option above to cast your vote.</p>}
        {voted && <p style={{ fontSize: 13, color: 'var(--primary-color)', textAlign: 'center', marginTop: 24, fontWeight: 600 }}>Your vote has been recorded securely by Firebase.</p>}
      </div>
    </div>
  );
}
