import React, { useState, useRef } from 'react';

const RichTextEditor = ({ value, onChange, placeholder, rows = 10 }) => {
    const [showPreview, setShowPreview] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const textareaRef = useRef(null);

    const insertTag = (startTag, endTag = '', placeholder = '') => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const before = value.substring(0, start);
        const after = value.substring(end);
        
        // Si hay texto seleccionado, usarlo; si no, usar placeholder
        const content = selectedText || placeholder;
        const newValue = before + startTag + content + endTag + after;
        onChange({ target: { value: newValue } });

        // Restaurar el foco y seleccionar el contenido insertado
        setTimeout(() => {
            textarea.focus();
            if (!selectedText && placeholder) {
                // Seleccionar el placeholder para que el usuario lo reemplace
                const startPos = start + startTag.length;
                const endPos = startPos + placeholder.length;
                textarea.setSelectionRange(startPos, endPos);
            } else {
                const newCursorPos = start + startTag.length + content.length;
                textarea.setSelectionRange(newCursorPos, newCursorPos);
            }
        }, 0);
    };

    const formatButtons = [
        {
            icon: 'format_bold',
            label: 'Negrita',
            shortcut: 'Ctrl+B',
            action: () => insertTag('<strong>', '</strong>', 'texto en negrita')
        },
        {
            icon: 'format_italic',
            label: 'Cursiva',
            shortcut: 'Ctrl+I',
            action: () => insertTag('<em>', '</em>', 'texto en cursiva')
        },
        {
            icon: 'format_list_bulleted',
            label: 'Lista con viñetas',
            action: () => insertTag('<ul>\n  <li>', '</li>\n  <li>Otro elemento</li>\n</ul>', 'Primer elemento')
        },
        {
            icon: 'format_list_numbered',
            label: 'Lista numerada',
            action: () => insertTag('<ol>\n  <li>', '</li>\n  <li>Segundo elemento</li>\n</ol>', 'Primer elemento')
        },
        {
            icon: 'title',
            label: 'Subtítulo grande',
            action: () => insertTag('<h3>', '</h3>', 'Título de sección')
        },
        {
            icon: 'format_quote',
            label: 'Cita destacada',
            action: () => insertTag('<blockquote>', '</blockquote>', 'Texto destacado o cita importante')
        },
        {
            icon: 'link',
            label: 'Insertar enlace',
            action: () => {
                const url = prompt('URL del enlace (ej: https://ejemplo.com):');
                if (url) {
                    insertTag(`<a href="${url}" target="_blank">`, '</a>', 'texto del enlace');
                }
            }
        }
    ];

    const quickInserts = [
        {
            label: 'Nuevo párrafo',
            icon: 'notes',
            action: () => insertTag('<p>', '</p>', 'Escribe aquí tu párrafo')
        },
        {
            label: 'Salto de línea',
            icon: 'keyboard_return',
            action: () => insertTag('<br />\n')
        },
        {
            label: 'Línea separadora',
            icon: 'horizontal_rule',
            action: () => insertTag('\n<hr />\n')
        }
    ];

    const templates = [
        {
            name: 'Características',
            icon: 'checklist',
            template: `<h3>Características principales</h3>
<ul>
  <li><strong>Primera característica:</strong> Descripción detallada</li>
  <li><strong>Segunda característica:</strong> Descripción detallada</li>
  <li><strong>Tercera característica:</strong> Descripción detallada</li>
</ul>`
        },
        {
            name: 'Descripción completa',
            icon: 'article',
            template: `<p>Párrafo introductorio que describe el producto de forma general.</p>

<h3>Características destacadas</h3>
<ul>
  <li>Primera característica importante</li>
  <li>Segunda característica importante</li>
  <li>Tercera característica importante</li>
</ul>

<h3>Especificaciones técnicas</h3>
<p>Detalles técnicos del producto...</p>

<blockquote>Dato importante o destacado del producto</blockquote>`
        }
    ];

    const insertTemplate = (template) => {
        const textarea = textareaRef.current;
        const start = textarea.selectionStart;
        const before = value.substring(0, start);
        const after = value.substring(start);
        
        onChange({ target: { value: before + template + after } });
        
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start, start + template.length);
        }, 0);
    };

    return (
        <div className='border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-primary transition-colors'>
            {/* Toolbar Principal */}
            <div className='bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-300 p-2'>
                <div className='flex flex-wrap gap-1 items-center'>
                    {/* Botones de formato */}
                    <div className='flex gap-1 border-r border-gray-300 pr-2'>
                        {formatButtons.map((btn, idx) => (
                            <button
                                key={idx}
                                type='button'
                                onClick={btn.action}
                                title={`${btn.label}${btn.shortcut ? ` (${btn.shortcut})` : ''}`}
                                className='p-2 hover:bg-white hover:shadow-sm rounded transition-all group relative'
                            >
                                <span className='material-symbols-outlined text-gray-700 group-hover:text-primary' style={{fontSize: '20px'}}>
                                    {btn.icon}
                                </span>
                                <span className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none'>
                                    {btn.label}
                                </span>
                            </button>
                        ))}
                    </div>
                    
                    {/* Inserciones rápidas */}
                    <div className='flex gap-1 border-r border-gray-300 pr-2'>
                        {quickInserts.map((btn, idx) => (
                            <button
                                key={idx}
                                type='button'
                                onClick={btn.action}
                                title={btn.label}
                                className='p-2 hover:bg-white hover:shadow-sm rounded transition-all group relative'
                            >
                                <span className='material-symbols-outlined text-gray-600 group-hover:text-primary' style={{fontSize: '18px'}}>
                                    {btn.icon}
                                </span>
                                <span className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10'>
                                    {btn.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Plantillas */}
                    <div className='flex gap-1 border-r border-gray-300 pr-2'>
                        {templates.map((tmpl, idx) => (
                            <button
                                key={idx}
                                type='button'
                                onClick={() => insertTemplate(tmpl.template)}
                                title={`Insertar plantilla: ${tmpl.name}`}
                                className='px-3 py-1 text-xs font-medium bg-white border border-gray-300 hover:border-primary hover:bg-primary hover:text-white rounded transition-all flex items-center gap-1'
                            >
                                <span className='material-symbols-outlined' style={{fontSize: '16px'}}>
                                    {tmpl.icon}
                                </span>
                                {tmpl.name}
                            </button>
                        ))}
                    </div>

                    <div className='flex-1'></div>

                    {/* Botones de acción */}
                    <div className='flex gap-2'>
                        <button
                            type='button'
                            onClick={() => setShowHelp(!showHelp)}
                            className={`p-2 rounded transition-all ${
                                showHelp ? 'bg-blue-100 text-blue-700' : 'hover:bg-white text-gray-600'
                            }`}
                            title='Ayuda'
                        >
                            <span className='material-symbols-outlined' style={{fontSize: '20px'}}>
                                help
                            </span>
                        </button>
                        <button
                            type='button'
                            onClick={() => setShowPreview(!showPreview)}
                            className={`px-4 py-2 rounded font-medium text-sm transition-all flex items-center gap-1 ${
                                showPreview 
                                    ? 'bg-primary text-white shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                        >
                            <span className='material-symbols-outlined' style={{fontSize: '18px'}}>
                                {showPreview ? 'edit' : 'visibility'}
                            </span>
                            {showPreview ? 'Editar' : 'Vista previa'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel de ayuda */}
            {showHelp && (
                <div className='bg-blue-50 border-b border-blue-200 p-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
                        <div>
                            <h4 className='font-bold text-blue-900 mb-2 flex items-center gap-1'>
                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>info</span>
                                Cómo usar el editor
                            </h4>
                            <ul className='space-y-1 text-blue-800'>
                                <li>• <strong>Selecciona texto</strong> y haz clic en un botón para aplicar formato</li>
                                <li>• Sin selección, el botón <strong>inserta una plantilla</strong> que puedes editar</li>
                                <li>• Usa las <strong>plantillas predefinidas</strong> para empezar rápido</li>
                                <li>• <strong>Vista previa</strong> muestra cómo se verá en la tienda</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className='font-bold text-blue-900 mb-2 flex items-center gap-1'>
                                <span className='material-symbols-outlined' style={{fontSize: '18px'}}>tips_and_updates</span>
                                Consejos
                            </h4>
                            <ul className='space-y-1 text-blue-800'>
                                <li>• Usa <strong>listas</strong> para características y especificaciones</li>
                                <li>• Los <strong>subtítulos</strong> organizan mejor la información</li>
                                <li>• Las <strong>negritas</strong> destacan lo más importante</li>
                                <li>• Revisa siempre la <strong>vista previa</strong> antes de guardar</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Editor / Preview */}
            <div className='bg-white'>
                {showPreview ? (
                    <div className='p-6'>
                        <div className='mb-2 flex items-center gap-2 text-sm text-gray-600'>
                            <span className='material-symbols-outlined' style={{fontSize: '16px'}}>visibility</span>
                            <span className='font-medium'>Vista previa - Así se verá en la tienda:</span>
                        </div>
                        <div className='border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50'>
                            {value ? (
                                <div 
                                    className='prose prose-sm max-w-none'
                                    dangerouslySetInnerHTML={{ __html: value }}
                                    style={{
                                        fontSize: '15px',
                                        lineHeight: '1.8'
                                    }}
                                />
                            ) : (
                                <p className='text-gray-400 text-center py-8'>
                                    No hay contenido para mostrar. Escribe algo en el editor.
                                </p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className='relative'>
                        <textarea
                            ref={textareaRef}
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder || 'Escribe la descripción del producto aquí...\n\nPuedes usar los botones de arriba para dar formato al texto, o escribir HTML directamente.'}
                            rows={rows}
                            className='w-full px-4 py-3 focus:outline-none resize-y font-mono text-sm'
                            style={{ minHeight: '300px' }}
                        />
                        {!value && (
                            <div className='absolute top-20 left-1/2 transform -translate-x-1/2 text-center pointer-events-none'>
                                <span className='material-symbols-outlined text-gray-300' style={{fontSize: '48px'}}>
                                    edit_note
                                </span>
                                <p className='text-gray-400 text-sm mt-2'>Empieza a escribir o usa las plantillas</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Barra inferior con estadísticas */}
            <div className='bg-gray-50 border-t border-gray-300 px-4 py-2 flex items-center justify-between text-xs text-gray-600'>
                <div className='flex items-center gap-4'>
                    <span>{value.length} caracteres</span>
                    <span>•</span>
                    <span>{value.split(/\s+/).filter(w => w).length} palabras</span>
                </div>
                <div className='flex items-center gap-1 text-gray-500'>
                    <span className='material-symbols-outlined' style={{fontSize: '14px'}}>code</span>
                    <span>HTML permitido</span>
                </div>
            </div>
        </div>
    );
};

export default RichTextEditor;
