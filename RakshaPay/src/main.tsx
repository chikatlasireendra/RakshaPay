import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

class AppErrorBoundary extends React.Component<React.PropsWithChildren, {hasError:boolean; message:string}> {
  state={hasError:false,message:''};
  static getDerivedStateFromError(error: Error){ return {hasError:true,message:error?.message || 'Unknown application error'}; }
  render(){
    if(this.state.hasError){
      return <div style={{minHeight:'100vh',padding:32,fontFamily:'system-ui',background:'#020617',color:'#fff'}}><h1>RakshaPay could not load</h1><p style={{color:'#cbd5e1'}}>The app hit a frontend error instead of showing a blank page.</p><pre style={{whiteSpace:'pre-wrap',background:'#0f172a',padding:16,borderRadius:12}}>{this.state.message}</pre><button onClick={()=>location.reload()} style={{marginTop:16,padding:'10px 16px',borderRadius:10}}>Reload</button></div>;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>);
