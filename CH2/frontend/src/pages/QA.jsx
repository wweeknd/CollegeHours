import React from 'react';
import { useAuth } from '../context/AuthContext';
import { IconMessage } from '../utils/icons';

export default function QA() {
  const { user } = useAuth();
  let qaData = [];
  if (user?.email?.endsWith('@demo.edu')) {
    qaData = [

    { id: 1, subject: 'Cloud Computing', query: 'What happens if two node instances mutate the same document exactly at the same millisecond in Firestore?', author: 'Julian (102-CS)', active: true, answers: 2, upvotes: 14 },
    { id: 2, subject: 'Compiler Design', query: 'Is the mid-semester syllabus including Syntax Directed Translation?', author: 'Sarah (114-IT)', active: false, answers: 1, upvotes: 8 },
    { id: 3, subject: 'General', query: 'When will the library open for night hours?', author: 'Rahul (09-EC)', active: false, answers: 0, upvotes: 24 }
  
    ];
  }

  return (
    <div style={{ padding: '0 48px' }}>
      <div className="section-header" style={{ marginBottom: 32 }}>
        <h2 className="section-title" style={{ fontSize: 24 }}>Question & Answers</h2>
        <button className="btn-primary">Ask a Question</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
        {qaData.map(q => (
           <div className="widget-card" key={q.id} style={{ display: 'flex', gap: 24, padding: 24, borderLeft: q.active ? '4px solid var(--primary-color)' : '4px solid transparent' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
                 <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--primary-color)' }}>{q.upvotes}</div>
                 <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Votes</div>
              </div>
              <div style={{ flex: 1 }}>
                 <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
                    <span className="tag-active-now" style={{ margin: 0, padding: '4px 8px', fontSize: 9 }}>{q.subject}</span>
                 </div>
                 <h3 style={{ fontSize: 16, marginBottom: 8, color: 'var(--text-primary)' }}>{q.query}</h3>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Posted by <strong style={{color:'var(--text-primary)'}}>{q.author}</strong></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)' }}>
                       <IconMessage /> {q.answers} Answers
                    </div>
                 </div>
              </div>
           </div>
        ))}
      </div>
    </div>
  );
}
