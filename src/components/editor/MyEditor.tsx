import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"

interface MyEditorProps {
  value: string
  setValue: (val: string) => void
}

function MyEditor({ value, setValue }: MyEditorProps) {
  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={setValue}
      className="h-[500px] mb-12"
    />
  )
}

export default MyEditor
