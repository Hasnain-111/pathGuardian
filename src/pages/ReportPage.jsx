import { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import '../styles/ReportPage.css';

function ReportPage() {
  const [issueType, setIssueType] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const issueTypes = [
    'No Streetlight',
    'Harassment',
    'Empty Area',
    'Suspicious Activity',
    'Poor Road Condition',
    'Other'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!issueType || !description) {
      alert('Please fill in all fields');
      return;
    }

    setShowSuccess(true);
    setIssueType('');
    setDescription('');

    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="report-page">
      <div className="report-container">
        <div className="report-header">
          <AlertTriangle size={48} className="report-icon" />
          <h1>Report Safety Issue</h1>
          <p>Help make your community safer by reporting issues</p>
        </div>

        {showSuccess && (
          <div className="success-message">
            <CheckCircle size={24} />
            <span>Report submitted successfully!</span>
          </div>
        )}

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issue-type">Type of Issue</label>
            <select
              id="issue-type"
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="form-select"
            >
              <option value="">Select an issue type</option>
              {issueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Describe the Issue</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              rows="6"
              placeholder="Please provide details about the safety issue..."
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Submit Report
          </button>
        </form>

        <div className="report-info">
          <h3>What happens next?</h3>
          <ul>
            <li>Your report is reviewed by our team</li>
            <li>The issue is marked on the map for other users</li>
            <li>Local authorities are notified if necessary</li>
            <li>You help make the community safer for everyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
