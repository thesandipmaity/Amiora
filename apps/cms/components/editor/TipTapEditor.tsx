'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link as LinkIcon, Image as ImageIcon, Quote, Undo, Redo,
} from 'lucide-react'
import { useEffect, useCallback } from 'react'

interface Props {
  value:    string
  onChange: (val: string) => void
  placeholder?: string
}

export function TipTapEditor({ value, onChange, placeholder = 'Start writing…' }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    editorProps: {
      attributes: { class: 'tiptap prose max-w-none outline-none min-h-[200px] p-4 text-ink text-sm' },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  const addLink = useCallback(() => {
    const url = prompt('Enter URL:')
    if (!url || !editor) return
    editor.chain().focus().setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    const url = prompt('Enter image URL:')
    if (!url || !editor) return
    editor.chain().focus().setImage({ src: url }).run()
  }, [editor])

  if (!editor) return null

  const ToolBtn = ({ onClick, active, title, children }: { onClick: () => void; active?: boolean; title: string; children: React.ReactNode }) => (
    <button type="button" onClick={onClick} title={title}
      className={`p-1.5 rounded hover:bg-surface-2 transition-colors ${active ? 'bg-teal/10 text-teal' : 'text-ink-muted'}`}>
      {children}
    </button>
  )

  return (
    <div className="border border-divider rounded-xl overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-divider bg-surface">
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </ToolBtn>
        <div className="w-px h-4 bg-divider mx-1" />
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <Heading3 className="w-3.5 h-3.5" />
        </ToolBtn>
        <div className="w-px h-4 bg-divider mx-1" />
        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
          <List className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote className="w-3.5 h-3.5" />
        </ToolBtn>
        <div className="w-px h-4 bg-divider mx-1" />
        <ToolBtn onClick={addLink} active={editor.isActive('link')} title="Add Link">
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <ToolBtn onClick={addImage} title="Add Image">
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolBtn>
        <div className="ml-auto flex items-center gap-0.5">
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <Undo className="w-3.5 h-3.5" />
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <Redo className="w-3.5 h-3.5" />
          </ToolBtn>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
