import './App.css';
import { useState } from 'react';

function App() {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [sessionId, setSessionId] = useState();
  const [responseReceived, setResponseReceived] = useState(false);
  const [receivedData, setreceivedData] = useState(false);

  const fetchLogs = async (e) => {
    e.preventDefault();
    const url = `https://api.lambdatest.com/automation/api/v1/sessions/${sessionId}`;
    const headers = {
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    };
    try {
      const response = await fetch(url, { method: 'GET', headers });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log(data);
      setResponseReceived(true);
      setreceivedData(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  return (
    <div className="App">
      <img src="tR_tab_logo.jpg" alt="LambdaTest Logo" className="logo" />
      <h2 className = "sessionFormHeading">LambdaTest Session Info</h2>
        <form id="session-form">
          <p className='input-heading'>Username</p>
          
          <input className = "inputs" type="text" placeholder="Username" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br />
          <p className='input-heading'>Access-Key</p>
          <input className = "inputs" type="password" placeholder="Access Key" id="accessKey" value ={password} onChange={(e) => setPassword(e.target.value)} required /><br />

          <p className='input-heading'>Session ID</p>
          <input className = "inputs" type="text" placeholder="Session ID" id="sessionId" value = {sessionId} onChange={(e) => setSessionId(e.target.value)} required /><br />
          <button className = "submit-btn" type="submit" onClick={fetchLogs}>Get Session Info</button>
        </form>

      {responseReceived ? (
        <div className="response">
          <div className="response-container">
            <h3 className='response-heading'>Response Received</h3>
            <ul className = 'response-list'> 
              <li className='res-link'>Console Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.console_logs_url}>Link</a></li>
              <li className='res-link'>Network Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.network_logs_url}>Link</a></li>
              <li className='res-link'>Command Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.command_logs_url}>Link</a></li>
              <li className='res-link'>Selenium Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.selenium_logs_url}>Link</a></li>
              <li className='res-link'>Screenshot URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.screenshot_url}>Link</a></li>
              <li className='res-link'>Public URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.public_url}>Link</a></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="no-response">
          <h3>No Response Yet</h3>
          <p>Enter your details and click the button to fetch session info.</p>
        </div>
      )}
    </div>
  );
}

export default App;
