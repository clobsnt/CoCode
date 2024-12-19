import React, { useState, useEffect } from "react";
import "./Editor.css";
import ReactCodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { dracula } from '@uiw/codemirror-theme-dracula';
import { eclipse } from '@uiw/codemirror-theme-eclipse';
import { abyss } from '@uiw/codemirror-theme-abyss';
import { quietlight } from '@uiw/codemirror-theme-quietlight';

const themeArray = ['dracula', 'eclipse', 'abyss', 'quietlight'];

const Editor = () => {
    const [htmlCode, setHtmlCode] = useState("");
    const [cssCode, setCssCode] = useState("");
    const [jsCode, setJsCode] = useState("");
    const [srcDoc, setSrcDoc] = useState("");
    const [theme, setTheme] = useState(dracula);

    // Update the iframe content dynamically
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSrcDoc(`
                <html>
                    <head>
                        <style>${cssCode}</style>
                    </head>
                    <body>
                        ${htmlCode}
                        <script>${jsCode}</script>
                    </body>
                </html>
            `);
        }, 300);

        return () => clearTimeout(timeout);
    }, [htmlCode, cssCode, jsCode]);

    // Handle Theme Change
    const handleThemeChange = (event) => {
        const selectedTheme = event.target.value;
        switch (selectedTheme) {
            case 'dracula':
                setTheme(dracula);
                break;
            case 'eclipse':
                setTheme(eclipse);
                break;
            case 'abyss':
                setTheme(abyss);
                break;
            case 'quietlight':
                setTheme(quietlight);
                break;
            default:
                setTheme(dracula);
        }
    };

    return (
        <div className="editor-container">
            <div className="theme-selector">
                <label>Select Theme: </label>
                <select onChange={handleThemeChange}>
                {themeArray.map((themeName) => (
                    <option key={themeName} value={themeName}>
                    {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                    </option>
                ))}
                </select>
            </div>

            <div className="code-editors">
                <div className="editor">
                    <b>HTML</b>
                    <ReactCodeMirror
                        value={htmlCode}
                        height="200px"
                        extensions={[html()]}
                        theme={theme}
                        onChange={(value) => setHtmlCode(value)}
                    />
                </div>
                <div className="editor">
                    <b>CSS</b>
                    <ReactCodeMirror
                        value={cssCode}
                        height="200px"
                        extensions={[css()]}
                        theme={theme}
                        onChange={(value) => setCssCode(value)}
                    />
                </div>
                <div className="editor">
                    <b>JavaScript</b>
                    <ReactCodeMirror
                        value={jsCode}
                        height="200px"
                        extensions={[javascript()]}
                        theme={theme}
                        onChange={(value) => setJsCode(value)}
                    />
                </div>
            </div>

            <div className="preview">     
                <iframe
                    srcDoc={srcDoc}
                    title="Output"
                    sandbox="allow-scripts"
                    width="100%"
                    height="200px"
                ></iframe>
            </div>
        </div>
    );
};

export default Editor;