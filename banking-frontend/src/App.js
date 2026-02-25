import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState('');

  // Form states
  const [depAcc, setDepAcc] = useState('ACC001');
  const [depAmt, setDepAmt] = useState('');
  const [wdAcc, setWdAcc] = useState('ACC001');
  const [wdAmt, setWdAmt] = useState('');
  const [fromAcc, setFromAcc] = useState('ACC001');
  const [toAcc, setToAcc] = useState('ACC002');
  const [transAmt, setTransAmt] = useState('');

  useEffect(() => {
    loadData();
    const id = setInterval(loadData, 3000);
    return () => clearInterval(id);
  }, []);

  const loadData = async () => {
    try {
      const accRes = await axios.get('http://localhost:8080/api/accounts');
      const custRes = await axios.get('http://localhost:8080/api/customers');
      setAccounts(accRes.data);
      setCustomers(custRes.data);
    } catch(e) {}
  };

  const deposit = async () => {
    await axios.post(`http://localhost:8080/api/accounts/deposit/${depAcc}/${depAmt}`);
    setMessage('✅ Deposited $' + depAmt);
    setDepAmt('');
    loadData();
  };

  const withdraw = async () => {
    await axios.post(`http://localhost:8080/api/accounts/withdraw/${wdAcc}/${wdAmt}`);
    setMessage('✅ Withdrew $' + wdAmt);
    setWdAmt('');
    loadData();
  };

  const transfer = async () => {
    await axios.post('http://localhost:8080/api/transfers/transfer', {
      fromAccountNumber: fromAcc,
      toAccountNumber: toAcc,
      amount: parseFloat(transAmt)
    });
    setMessage('✅ Transferred $' + transAmt);
    setTransAmt('');
    loadData();
  };

  return (
    <div style={{padding: 30, maxWidth: 1200, margin: '0 auto'}}>
      <h1 style={{textAlign: 'center', color: '#1976d2'}}>🏦 Sathvika Banking</h1>

      <div style={{background: '#e8f5e8', padding: 20, marginBottom: 30, borderRadius: 8}}>
        Backend: localhost:8080 | Accounts: {accounts.length} | Customers: {customers.length}
      </div>

      {/* Banking Operations */}
      <div style={{background: 'white', padding: 30, borderRadius: 12, marginBottom: 30, boxShadow: '0 8px 32px rgba(0,0,0,0.1)'}}>
        <h2>💳 Operations</h2>

        <div style={{display: 'flex', gap: 15, marginBottom: 20}}>
          <input value={depAcc} onChange={e=>setDepAcc(e.target.value)} placeholder="ACC001" style={{padding:12, border:'1px solid #ddd', borderRadius:6}}/>
          <input value={depAmt} onChange={e=>setDepAmt(e.target.value)} type="number" placeholder="500" style={{padding:12, border:'1px solid #ddd', borderRadius:6}}/>
          <button onClick={deposit} style={{padding:'12px 24px', background:'#4caf50', color:'white', border:'none', borderRadius:6, cursor:'pointer'}}>💰 Deposit</button>
        </div>

        <div style={{display: 'flex', gap: 15, marginBottom: 20}}>
          <input value={wdAcc} onChange={e=>setWdAcc(e.target.value)} placeholder="ACC001" style={{padding:12, border:'1px solid #ddd', borderRadius:6}}/>
          <input value={wdAmt} onChange={e=>setWdAmt(e.target.value)} type="number" placeholder="200" style={{padding:12, border:'1px solid #ddd', borderRadius:6}}/>
          <button onClick={withdraw} style={{padding:'12px 24px', background:'#ff9800', color:'white', border:'none', borderRadius:6, cursor:'pointer'}}>💸 Withdraw</button>
        </div>

        <div style={{display: 'flex', gap: 10}}>
          <input value={fromAcc} onChange={e=>setFromAcc(e.target.value)} placeholder="From" style={{padding:12, border:'1px solid #ddd', borderRadius:6, minWidth:100}}/>
          <input value={toAcc} onChange={e=>setToAcc(e.target.value)} placeholder="To" style={{padding:12, border:'1px solid #ddd', borderRadius:6, minWidth:100}}/>
          <input value={transAmt} onChange={e=>setTransAmt(e.target.value)} type="number" placeholder="100" style={{padding:12, border:'1px solid #ddd', borderRadius:6, minWidth:100}}/>
          <button onClick={transfer} style={{padding:'12px 24px', background:'#1976d2', color:'white', border:'none', borderRadius:6, cursor:'pointer'}}>🔄 Transfer</button>
        </div>

        {message && <div style={{marginTop:20, padding:15, background:'#d4edda', borderRadius:6}}>{message}</div>}
      </div>

      {/* Accounts */}
      <div style={{background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', marginBottom: 20}}>
        <h3 style={{padding:20, background:'#1976d2', color:'white', margin:0}}>💳 Accounts ({accounts.length})</h3>
        <table style={{width:'100%'}}>
          <thead><tr style={{background:'#f5f5f5'}}>
            <th style={{padding:15}}>ID</th>
            <th style={{padding:15}}>Account</th>
            <th style={{padding:15, textAlign:'right'}}>Balance</th>
            <th style={{padding:15}}>Customer</th>
          </tr></thead>
          <tbody>
            {accounts.map(acc => (
              <tr key={acc.id}>
                <td style={{padding:15}}>{acc.id}</td>
                <td style={{padding:15}}><strong>{acc.accountNumber}</strong></td>
                <td style={{padding:15, textAlign:'right', color:'#4caf50', fontSize:20}}>${acc.balance}</td>
                <td style={{padding:15}}>{acc.customer?.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customers */}
      <div style={{background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)'}}>
        <h3 style={{padding:20, background:'#424242', color:'white', margin:0}}>👥 Customers ({customers.length})</h3>
        <table style={{width:'100%'}}>
          <thead><tr style={{background:'#f5f5f5'}}>
            <th style={{padding:15}}>ID</th>
            <th style={{padding:15}}>Name</th>
          </tr></thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust.id}>
                <td style={{padding:15}}>{cust.id}</td>
                <td style={{padding:15}}>{cust.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
