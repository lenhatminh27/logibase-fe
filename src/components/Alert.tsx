import { useState } from "react"
import { Alert as AntdAlert } from "antd"

interface AlertProps {
  message: string
  type: "success" | "info" | "warning" | "error"
  closable?: boolean
  onClose?: () => void
}
function Alert({ message, type, closable = false, onClose }: AlertProps) {
  const [visible, setVisible] = useState(true)

  const handleClose = () => {
    setVisible(false)
  }

  return (
    <>
      {visible && (
        <AntdAlert
          className="mx-auto mb-10"
          message={message}
          type={type}
          closable={closable}
          afterClose={handleClose}
          onClose={onClose}
        />
      )}
    </>
  )
}

export default Alert
