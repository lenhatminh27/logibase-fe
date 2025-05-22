// src/components/course/AddSectionModal.tsx
import React, { useState, useEffect } from "react"
import { Modal, Form, Input, Button } from "antd"
import { instance } from "../../../config/axios" // Đường dẫn tới instance axios
import type { CreateSectionRequest } from "../../../shared/types/section" // Type của bạn

interface AddSectionModalProps {
  visible: boolean
  courseId: number | string // ID của khóa học
  onClose: () => void
  onSectionAdded: () => void // Callback sau khi thêm thành công
  existingSectionsCount: number // Để tính orderIndex
}

const AddSectionModal: React.FC<AddSectionModalProps> = ({
  visible,
  courseId,
  onClose,
  onSectionAdded,
  existingSectionsCount,
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible) {
      form.resetFields() // Reset form khi modal mở
    }
  }, [visible, form])

  const handleCreateSection = async (values: {
    title: string
    target: string
  }) => {
    setLoading(true)
    try {
      const orderIndex: number = existingSectionsCount // orderIndex bắt đầu từ 0

      const newSectionData: CreateSectionRequest = {
        title: values.title,
        target: values.target,
        courseId: Number(courseId), // Đảm bảo courseId là number nếu API yêu cầu
        orderIndex: orderIndex,
      }

      console.log("Submitting new section:", newSectionData) // Log data gửi đi
      await instance.post("/api/course-section", newSectionData)

      onSectionAdded() // Gọi callback để tải lại danh sách chương
      onClose() // Đóng modal
    } catch (error) {
      console.error("Failed to create section:", error)
      // Thêm thông báo lỗi cho người dùng ở đây
      alert("Tạo chương thất bại. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      title="Thêm chương mới"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}>
          Tạo chương
        </Button>,
      ]}>
      <Form form={form} layout="vertical" onFinish={handleCreateSection}>
        <Form.Item
          name="title"
          label="Tiêu đề chương"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề chương!" },
            { max: 255, message: "Tên khóa học không được vượt quá 255 ký tự" },
          ]}>
          <Input placeholder="Nhập tiêu đề chương" maxLength={255} showCount />
        </Form.Item>
        <Form.Item
          name="target"
          label="Mục tiêu của chương"
          rules={[
            { required: true, message: "Vui lòng nhập mục tiêu của chương!" },
          ]}>
          <Input.TextArea rows={3} placeholder="Nhập mục tiêu của chương" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddSectionModal
