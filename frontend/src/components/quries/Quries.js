import React, { useEffect, useState } from 'react';
import axiosWithToken from '../../axiosWithToken';
import './Quries.css';

function Quries() {
  const [queries, setQueries] = useState([]);
  const [responseText, setResponseText] = useState({});

  useEffect(() => {
    // Fetch queries from the backend
    const fetchQueries = async () => {
      try {
        const response = await axiosWithToken.get('http://localhost:3000/admin-api/view-queries');
        setQueries(response.data.queries);
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };

    fetchQueries();
  }, []);

  const handleInputChange = (e, id) => {
    setResponseText({
      ...responseText,
      [id]: e.target.value,
    });
  };

  const handleResponseSubmit = async (e, id) => {
    e.preventDefault();
    try {
      const response = await axiosWithToken.post(`http://localhost:3000/admin-api/respond-query/${id}`, {
        response: responseText[id],
      });
      if (response.status === 200) {
        alert('Response sent successfully');
        // Update the local state to reflect the response sent
        setQueries(prevQueries =>
          prevQueries.map(query =>
            query._id === id ? { ...query, response: responseText[id] } : query
          )
        );
        setResponseText({
          ...responseText,
          [id]: '',
        });
      }
    } catch (error) {
      console.error('Error sending response:', error);
    }
  };

  return (
    <div className="queries-container">
      {queries.map(query => (
        <div key={query._id} className="query-card">
          <h3>{query.name}</h3>
          <p>Email: {query.email}</p>
          <p>Message: {query.message}</p>
          {query.response && <p>Admin Response: {query.response}</p>}
          <form onSubmit={(e) => handleResponseSubmit(e, query._id)} className="response-form">
            <textarea
              placeholder="Type your response here"
              value={responseText[query._id] || ''}
              onChange={(e) => handleInputChange(e, query._id)}
              rows="4"
              cols="50"
            ></textarea>
            <button type="submit" className="response-button">Send Response</button>
          </form>
        </div>
      ))}
    </div>
  );
}
export default Quries;
