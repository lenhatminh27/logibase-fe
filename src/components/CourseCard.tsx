// src/components/CourseCard.tsx
import React from "react"
import { Card, Tag, Button, Dropdown, Menu, Typography, Space } from "antd"
import {
  BookOutlined,
  EllipsisOutlined,
  PictureOutlined,
} from "@ant-design/icons"
import type { CourseResponse } from "../shared/types/course"

const { Title, Text } = Typography

interface CourseCardProps {
  course: CourseResponse
  onEdit: (courseId: number) => void
  onDelete: (courseId: number) => void
  onViewLessons: (courseId: number) => void
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEdit,
  onDelete,
  onViewLessons,
}) => {
  const menu = (
    <Menu>
      <Menu.Item key="edit" onClick={() => onEdit(course.id)}>
        Edit Course
      </Menu.Item>
      <Menu.Item key="lessons" onClick={() => onViewLessons(course.id)}>
        Manage Lessons
      </Menu.Item>
      <Menu.Item key="delete" danger onClick={() => onDelete(course.id)}>
        Delete Course
      </Menu.Item>
    </Menu>
  )

  const getStatusColor = (status: CourseResponse["status"]) => {
    switch (status) {
      case "PUBLIC":
        return "blue"
      case "DRAFT":
        return "gold"
      default:
        return "default"
    }
  }

  return (
    <Card
      hoverable
      className="shadow-lg rounded-lg overflow-hidden"
      bodyStyle={{ padding: 0 }}>
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <PictureOutlined className="text-5xl text-gray-400" />
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Tag color={getStatusColor(course.status)} className="font-semibold">
            {course.status}
          </Tag>
        </div>

        <Title level={5} className="!mb-1 truncate" title={course.title}>
          {course.title}
        </Title>

        <Text type="secondary" className="text-sm mb-3 block">
          By {course.createdBy} •
        </Text>

        <div className="flex justify-between items-center">
          <Button
            icon={<BookOutlined />}
            onClick={() => onViewLessons(course.id)}
            className="border-gray-300 hover:border-blue-500 hover:text-blue-500">
            Lessons
          </Button>
          <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
            <Button
              type="text"
              icon={<EllipsisOutlined className="text-lg" />}
            />
          </Dropdown>
        </div>
      </div>
    </Card>
  )
}

export default CourseCard
