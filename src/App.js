import './App.css';
import { useState } from 'react';

function App() {

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [sessionId, setSessionId] = useState();
  const [responseReceived, setResponseReceived] = useState(false);
  const [receivedData, setReceivedData] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorContent, setErrorContent] = useState(false);
  const [unexpectedError, setUnexpectedError] = useState(false);
  const [shareableLink, setShareableLink] = useState(false);
  const [testId, setTestId] = useState(false);



  const fetchLogs = async (e) => {
    e.preventDefault();
    const url = `https://mobile-api.lambdatest.com/mobile-automation/api/v1/sessions/${sessionId}`;
    const headers = {
      'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
    };
    try {
      const response = await fetch(url, { method: 'GET', headers });
      const data = await response.json();
      const currentTestId = data.data.test_id;
      console.log("Current Test ID:", currentTestId);
      setTestId(currentTestId);
      console.log("Data:", data);
      console.log("Test ID:", testId);
      if (!response.ok){
        setErrorMessage(true);
        setErrorContent(data);
        setResponseReceived(false);
        setReceivedData(null);
      }
      else{
        setErrorMessage(false);
        setResponseReceived(true);
        setReceivedData(data);
        console.log(receivedData);
      }

      const url2 = `https://api.lambdatest.com/lshs/api/v1.0/share-item/generate-sharable-link`;
      const session_id = currentTestId;
      const apiBody = {"entityIds":[`${session_id}`],"entityType":"App Automation Test", "expiresAt":15};

      const response2 = await fetch(url2, { method: 'POST', headers, body: JSON.stringify(apiBody) });
      const data2 = await response2.json();
      console.log('Data2: ', data2);
      console.log('Shareable link:', data2.shareIdUrl);
      setShareableLink(data2.shareIdUrl);

    } catch (error) {
      console.error('Error fetching logs:', error);
      setUnexpectedError(true);
      setErrorContent({ message: 'Unexpected error occurred' });
      setResponseReceived(false);
      setReceivedData(null);
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

      {responseReceived && (
        <div className="response">
          <div className="response-container">
            <h3 className='response-heading'>Response Received</h3>
            <ul className = 'response-list'> 
              <li className='res-link'>Console Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.console_logs_url}>Link</a></li>
              <li className='res-link'>Network Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.network_logs_url}>Link</a></li>
              <li className='res-link'>Command Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.command_logs_url}>Link</a></li>
              <li className='res-link'>Appium Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.appium_logs_url}>Link</a></li>
              <li className='res-link'>Device Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.device_logs_url}>Link</a></li>
              <li className='res-link'>Crash Logs URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.crash_logs_url}>Link</a></li>
              <li className='res-link'>Screenshots URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.screenshot_url}>Link</a></li>
              <li className='res-link'>Execution Video URL: <a rel="noopener noreferrer" target="_blank" href= {receivedData.data.video_url}>Link</a></li>
              <li className='res-link'>Shareable Link (Execution video and Commands executed): <a rel="noopener noreferrer" target="_blank" href= {shareableLink}>Link</a></li>
            </ul>
          </div>
        </div>
      )}
      {!responseReceived && !errorMessage && (
        <div className="no-response">
          <h3>No Response Yet</h3>
          <p>Enter your details and click the button to fetch session info.</p>
        </div>
      )}

      {errorMessage ? (
        <div className="no-response">
          <h3>Error Occurred</h3>
          <p>{errorContent.message}</p>
        </div>
      ) : null}

      {unexpectedError ? (
        <div className="no-response">
          <h3>Unexpected Error</h3>
          <p>{errorContent.message}</p>
        </div>
      ) : null}
    </div>
  );
}

export default App;
