import { ReactFlowProvider } from '@xyflow/react'
import { Canvas } from '@/modules/canvas/components/Canvas'
import { MediaEditor } from '@/modules/canvas/components/editors/MediaEditor'
import { CaptionEditor } from '@/modules/canvas/components/editors/CaptionEditor'
import { ScheduleGroupEditor } from '@/modules/canvas/components/editors/ScheduleGroupEditor'
import { RectangleEditor } from '@/modules/canvas/components/editors/RectangleEditor'
import { LinkEditor } from '@/modules/canvas/components/editors/LinkEditor'
import { EmbedEditor } from '@/modules/canvas/components/editors/EmbedEditor'
import { NoteEditor } from '@/modules/sticky-notes/components/NoteEditor'

export default function CanvasPage() {
  return (
    <div className="flex-1 relative" style={{ height: '100%' }}>
      <ReactFlowProvider>
        <Canvas />
        <MediaEditor />
        <CaptionEditor />
        <ScheduleGroupEditor />
        <RectangleEditor />
        <LinkEditor />
        <EmbedEditor />
        <NoteEditor />
      </ReactFlowProvider>
    </div>
  )
}
