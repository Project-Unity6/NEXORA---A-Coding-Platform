import React, { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { basicSetup } from 'codemirror';

// Import languages
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';

export default function CodeEditor({ value, onChange, language, theme }) {
  const containerRef = useRef(null);
  const viewRef = useRef(null);

  // Map language string to CM language extension
  const getLanguageExtension = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'javascript':
        return javascript();
      case 'python':
        return python();
      case 'java':
        return java();
      case 'cpp':
      case 'c++':
      case 'c':
        return cpp();
      default:
        return python();
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Custom theme extension to match Nexora palette
    const nexoraTheme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: '13px',
        fontFamily: 'var(--font-mono)',
        background: theme === 'dark' ? '#0F0F0F' : '#FAFAF8',
        color: 'var(--ink)',
      },
      '.cm-content': {
        caretColor: 'var(--ink)',
        padding: '16px 0',
      },
      '.cm-cursor': {
        borderLeftColor: 'var(--ink)',
      },
      '.cm-gutters': {
        backgroundColor: theme === 'dark' ? '#171615' : '#F3F0EA',
        color: 'var(--ink-4)',
        borderRight: '1px solid var(--border)',
        paddingLeft: '8px',
      },
      '.cm-activeLineGutter': {
        backgroundColor: 'var(--border)',
      },
      '.cm-activeLine': {
        backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
      }
    });

    const extensions = [
      basicSetup,
      getLanguageExtension(language),
      nexoraTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      }),
    ];

    if (theme === 'dark') {
      extensions.push(oneDark);
    }

    const state = EditorState.create({
      doc: value || '',
      extensions,
    });

    const view = new EditorView({
      state,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  }, [theme]); // Rebuild when theme changes to apply editor updates

  // Update value and language dynamically if they change outside
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;

    const currentDoc = view.state.doc.toString();
    if (value !== currentDoc) {
      view.dispatch({
        changes: { from: 0, to: currentDoc.length, insert: value || '' }
      });
    }
  }, [value]);

  useEffect(() => {
    // If language changes, we re-instantiate view to update syntax extensions
    const view = viewRef.current;
    if (!view) return;
    
    // We update the state extensions
    const nexoraTheme = EditorView.theme({
      '&': {
        height: '100%',
        fontSize: '13px',
        fontFamily: 'var(--font-mono)',
        background: theme === 'dark' ? '#0F0F0F' : '#FAFAF8',
        color: 'var(--ink)',
      },
      '.cm-content': {
        caretColor: 'var(--ink)',
        padding: '16px 0',
      },
      '.cm-gutters': {
        backgroundColor: theme === 'dark' ? '#171615' : '#F3F0EA',
        color: 'var(--ink-4)',
        borderRight: '1px solid var(--border)',
        paddingLeft: '8px',
      }
    });

    const extensions = [
      basicSetup,
      getLanguageExtension(language),
      nexoraTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChange) {
          onChange(update.state.doc.toString());
        }
      }),
    ];

    if (theme === 'dark') {
      extensions.push(oneDark);
    }

    view.setState(EditorState.create({
      doc: view.state.doc.toString(),
      extensions
    }));

  }, [language]);

  return <div ref={containerRef} style={{ height: '100%' }} />;
}
