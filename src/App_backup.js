import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button';
import Editor from './components/Editor';

function App() {
  const [openedEditor, setOpenedEditor] = useState('html');
  const [html, setHtml] = useState('');
  const [css, setCss] = useState('');
  const [js, setJs] = useState('');
  const [srcDoc, setSrcDoc] = useState(``);

  const onTabClick = (editorName) => {
    setOpenedEditor(editorName);
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSrcDoc(
        `
          <html>
            <body>${html}</body>
            <style>${css}</style>
            <script>${js}</script>
          </html>
        `
      )
    }, 250);

    return () => clearTimeout(timeOut);
  }, [html, css, js]);

  return (
    <div className="App">
      <h1>Welcome to CoCode</h1>

      <div className="tab-button-container">
        <Button 
          title="HTML" 
          onClick={() => onTabClick('html')}
          isActive={openedEditor === 'html'} 
        />
        <Button 
          title="CSS" 
          onClick={() => onTabClick('css')} 
          isActive={openedEditor === 'css'}
        />
        <Button 
          title="JavaScript" 
          onClick={() => onTabClick('js')}
          isActive={openedEditor === 'js'}
        />
      </div>

      <div className="editor-container">
        {openedEditor === 'html' && (
            <Editor
              language="xml"
              displayName="HTML"
              value={html}
              setEditorState={setHtml}
            />
        )}
        {openedEditor === 'css' && (
            <Editor
              language="css"
              displayName="CSS"
              value={css}
              setEditorState={setCss}
            />
        )}
        {openedEditor === 'js' && (
            <Editor
              language="javascript"
              displayName="JS"
              value={js}
              setEditorState={setJs}
            />
        )}
      </div>

      <div>
        <iframe
          id="my_iframe"
          srcDoc={srcDoc}
          title="output"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
}

export default App;
