import React, { useState, useEffect } from "react" // Thêm useState, useEffect
import { Button, Dropdown, Menu, Space, Typography, Input, Form } from "antd" // Thêm Input, Form
import {
  EllipsisOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons" // Thêm icon cho Save/Cancel
import LessonTable from "./LessonTable"
import type { SectionResponse } from "../../../shared/types/section"
import { instance } from "../../../config/axios"
import LessonModal from "./LessonModal"

const { Title, Text } = Typography // Thêm Text để hiển thị target

interface SectionItemProps {
  section: SectionResponse
  courseId: number
  onSectionUpdated: () => void // Callback để báo cho cha biết section đã được cập nhật
  onSectionDeleted: (sectionId: string | number) => void // Callback để báo cho cha biết section đã bị xóa
  onComplete: () => void
  onDeleteLesson: (lessonId: string | number) => void
}

const SectionItem: React.FC<SectionItemProps> = ({
  section,
  onComplete,
  onSectionUpdated,
  onSectionDeleted,
  onDeleteLesson,
}) => {
  const [showLessonModal, setShowLessonModal] = useState<number | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm() // Sử dụng Ant Design Form
  const [loadingSave, setLoadingSave] = useState(false)

  useEffect(() => {
    if (isEditing) {
      form.setFieldsValue({
        title: section.title,
        target: section.target || "",
      })
    }
  }, [isEditing, section, form])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    form.resetFields()
  }

  const handleSaveEdit = async (values: { title: string; target: string }) => {
    setLoadingSave(true)
    try {
      await instance.put(`/api/course-section`, {
        title: values.title,
        target: values.target,
        orderIndex: section.orderIndex,
        sectionId: section.id,
      })
      onSectionUpdated()
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update section:", error)
      alert("Cập nhật chương thất bại!")
    } finally {
      setLoadingSave(false)
    }
  }

  const handleDeleteClick = () => {
    if (
      window.confirm(
        `Bạn có chắc muốn xóa chương "${section.title}" và tất cả bài học bên trong?`
      )
    ) {
      onSectionDeleted(section.id)
    }
  }

  const sectionMenu = (
    <Menu>
      <Menu.Item key="edit-section" onClick={handleEditClick}>
        Chỉnh sửa chương
      </Menu.Item>
      <Menu.Item key="delete-section" danger onClick={handleDeleteClick}>
        Xóa chương
      </Menu.Item>
    </Menu>
  )

  return (
    <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start mb-4">
        {isEditing ? (
          <Form
            form={form}
            onFinish={handleSaveEdit}
            className="flex-grow mr-4" // Cho form chiếm không gian và có margin phải
            initialValues={{
              title: section.title,
              target: section.target || "",
            }}>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
              className="!mb-2" // Giảm margin bottom
            >
              <Input
                placeholder="Tiêu đề chương"
                className="text-xl font-semibold"
              />
            </Form.Item>
            <Form.Item
              name="target"
              rules={[{ required: true, message: "Vui lòng nhập mục tiêu!" }]}
              className="!mb-0">
              <Input.TextArea rows={2} placeholder="Mục tiêu của chương" />
            </Form.Item>
          </Form>
        ) : (
          <div className="flex-grow">
            <Title level={4} className="!mb-1">
              {section.title}
            </Title>
            {section.target && ( // Chỉ hiển thị target nếu có
              <Text type="secondary" className="block text-sm">
                Mục tiêu: {section.target}
              </Text>
            )}
          </div>
        )}
        <Space
          direction={isEditing ? "horizontal" : "horizontal"}
          align="start">
          {" "}
          {/* align="start" cho button */}
          {isEditing ? (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => form.submit()}
                loading={loadingSave}>
                Lưu
              </Button>
              <Button icon={<CloseOutlined />} onClick={handleCancelEdit}>
                Hủy
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => setShowLessonModal(-1)}
                className="border-gray-300 hover:border-blue-500 hover:text-blue-500">
                Thêm bài học
              </Button>
              <Dropdown overlay={sectionMenu} trigger={["click"]}>
                <Button
                  type="text"
                  icon={<EllipsisOutlined className="text-lg" />}
                />
              </Dropdown>
            </>
          )}
        </Space>
      </div>

      <LessonTable
        lessons={section.courseLessons || []}
        onDeleteLesson={onDeleteLesson}
        onComplete={onComplete}
      />
      {(!section.courseLessons || section.courseLessons.length === 0) && (
        <div className="text-center py-4 text-gray-500">
          Chương này chưa có bài học nào.
        </div>
      )}
      <LessonModal
        sectionId={section.id}
        key={section.id}
        isOpen={showLessonModal === -1}
        onClose={() => setShowLessonModal(null)}
        onComplete={onComplete}
      />
    </div>
  )
}

export default SectionItem
