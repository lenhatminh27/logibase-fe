import React, { useState } from "react"
import { Table, Space } from "antd"
import {
  VideoCameraOutlined,
  FileTextOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons"
import type { ColumnsType } from "antd/es/table"
import type { LessonResponse } from "../../../shared/types/lesson" // Type của bạn
import LessonDetailModal from "./ViewLessonDetail"
import LessonModal from "./LessonModal"

interface LessonTableProps {
  lessons: LessonResponse[]
  onDeleteLesson: (lessonId: string | number) => void
  onComplete: () => void
}

const getLessonTypeIcon = (lesson: LessonResponse) => {
  if (lesson.videoUrl && lesson.article) {
    return (
      <div className="flex items-center !space-x-5 !mx-auto">
        <VideoCameraOutlined className="mr-1 !text-green-600 !text-[20px]" />
        <FileTextOutlined className="!text-blue-600 !text-[20px]" />
      </div>
    )
  }
  if (lesson.videoUrl) {
    return <VideoCameraOutlined className="!text-green-600 !text-[20px]" />
  }
  if (lesson.article) {
    return <FileTextOutlined className="!text-blue-600 !text-[20px]" />
  }
  return null
}

const LessonTable: React.FC<LessonTableProps> = ({
  lessons,
  onDeleteLesson,
  onComplete,
}) => {
  const [viewLesson, setViewLesson] = useState<number | null>(null)
  const [editLesson, setEditLesson] = useState<number | null>(null)

  const lessonTableColumns: ColumnsType<LessonResponse> = [
    {
      title: "Thứ tự", // "Order"
      dataIndex: "orderIndex", // Giả sử trường order trong lesson là orderIndex
      key: "orderIndex",
      width: 80,
      align: "center",
    },
    {
      title: "Tiêu đề bài học", // "Lesson Title"
      dataIndex: "title",
      key: "title",
      render: (text) => <p className="font-medium m-0">{text}</p>, // Bỏ margin của <p>
    },
    {
      title: "Loại", // "Type"
      key: "type",
      width: 150,
      render: (
        _,
        lesson: LessonResponse // Truyền cả lesson object
      ) => <Space size="small">{getLessonTypeIcon(lesson)}</Space>,
    },

    {
      title: "Hành động", // "Actions"
      key: "actions",
      width: 150,
      align: "center",
      render: (_, lesson) => {
        const lessonMenu = (
          <div className="flex !bg-transparent !text-[20px] space-x-5">
            <div
              key="preview"
              className="cursor-pointer "
              onClick={() => setViewLesson(lesson.id)}>
              <EyeOutlined className="hover:!text-gray-500" />
            </div>
            <div
              key="edit"
              className="cursor-pointer hover:!text-gray-500"
              onClick={() => setEditLesson(lesson.id)}>
              <EditOutlined />
            </div>
            <div
              key="delete"
              className="cursor-pointer"
              onClick={() => onDeleteLesson(lesson.id)}>
              <DeleteOutlined className="!text-red-500 hover:!text-red-900" />
            </div>
            <LessonDetailModal
              lesson={lesson}
              open={lesson.id === viewLesson}
              key={lesson.id}
              onClose={() => setViewLesson(null)}
            />
            <LessonModal
              sectionId={lesson.sectionId}
              isOpen={editLesson === lesson.id}
              onClose={() => setEditLesson(null)}
              key={lesson.id}
              lesson={lesson}
              onComplete={onComplete}
            />
          </div>
        )
        return <Space size="small">{lessonMenu}</Space>
      },
    },
  ]

  return (
    <Table
      columns={lessonTableColumns}
      dataSource={lessons}
      rowKey="id"
      pagination={false}
      size="middle"
    />
  )
}

export default LessonTable
