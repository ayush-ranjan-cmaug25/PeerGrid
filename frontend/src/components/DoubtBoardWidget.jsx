import React, { useState } from 'react';
import './DoubtBoardWidget.css';

const DoubtBoardWidget = () => {
    const [bounties, setBounties] = useState([
        { id: 1, title: 'Calculus Derivatives', points: 50, description: 'Need help with chain rule.', tags: ['Math', 'Calculus'] },
        { id: 2, title: 'React Hooks', points: 30, description: 'Explain useEffect dependency array.', tags: ['React', 'Frontend'] },
        { id: 3, title: 'MongoDB Aggregation', points: 40, description: 'How to use $lookup?', tags: ['Database', 'NoSQL'] },
    ]);

    const [selectedBounty, setSelectedBounty] = useState(null);

    return (
        <div className="glass-card doubt-board-container">
            <h2 className="section-title">Doubt Board</h2>
            <div className="bounty-grid">
                {bounties.map(bounty => (
                    <div key={bounty.id} className="bounty-card" onClick={() => setSelectedBounty(bounty)}>
                        <div className="bounty-header">
                            <h3 className="bounty-title">{bounty.title}</h3>
                            <span className="bounty-points">+{bounty.points} GP</span>
                        </div>
                        <p className="bounty-desc">{bounty.description}</p>
                        <div className="bounty-tags">
                            {bounty.tags.map(tag => <span key={tag} className="bounty-tag">{tag}</span>)}
                        </div>
                    </div>
                ))}
            </div>

            {selectedBounty && (
                <div className="modal-overlay" onClick={() => setSelectedBounty(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3 className="modal-title">{selectedBounty.title}</h3>
                        <p className="modal-desc">{selectedBounty.description}</p>
                        <div className="modal-footer">
                            <span className="modal-points">{selectedBounty.points} Grid Points Reward</span>
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => alert(`Accepted challenge: ${selectedBounty.title}`)} className="btn-accept">Accept Challenge</button>
                            <button onClick={() => setSelectedBounty(null)} className="btn-close">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DoubtBoardWidget;
