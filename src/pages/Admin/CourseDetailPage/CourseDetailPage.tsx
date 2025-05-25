import { Button, message, Modal, Space, Tag, Typography } from "antd"
import { LeftOutlined, PlusOutlined } from "@ant-design/icons"
const { Title, Text } = Typography
import { type CourseResponse } from "./../../../shared/types/course"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import type { SectionResponse } from "../../../shared/types/section"
import { instance } from "../../../config/axios"
import type { Response } from "../../../shared/types/response"

// Import các component con
import AddSectionModal from "./AddSectionModal"
import SectionItem from "./SectionItem"

const initCourse: CourseResponse = {
  id: 0,
  createdAt: new Date(),
  createdBy: "",
  description: "",
  price: 0,
  status: "PUBLIC",
  thumbnail: "",
  title: "",
  updatedAt: new Date(),
}

function CourseDetailPage() {
  const navigate = useNavigate()
  const pathname = useLocation().pathname
  const idString = pathname.substring(pathname.lastIndexOf("/") + 1)
  const courseId = Number(idString) // Chuyển thành number

  const [isAddSectionModalVisible, setIsAddSectionModalVisible] =
    useState<boolean>(false)
  const [course, setCourse] = useState<CourseResponse>(initCourse)
  const [sections, setSections] = useState<SectionResponse[]>([])

  const countTotalLessons = () => {
    let count = 0
    if (sections && sections.length > 0) {
      for (const section of sections) {
        if (section.courseLessons && section.courseLessons.length > 0) {
          count += section.courseLessons.length
        }
      }
    }
    return count
  }

  const getCourseDetail = async () => {
    if (isNaN(courseId) || courseId === 0) return // Không fetch nếu id không hợp lệ
    try {
      const response = await instance.get(`/api/course/${courseId}`)
      const resData: Response<CourseResponse> = response.data
      setCourse(resData.data as CourseResponse)
    } catch (error) {
      console.log("Error fetching course detail:", error)
      setCourse(initCourse) // Reset về init nếu lỗi
    }
  }

  const getSections = async () => {
    if (isNaN(courseId) || courseId === 0) return
    try {
      const response = await instance.get(`/api/course-section/${courseId}`)
      const resData: Response<SectionResponse[]> = response.data
      setSections(resData.data as SectionResponse[])
    } catch (error) {
      console.log("Error fetching sections:", error)
      setSections([]) // Reset về mảng rỗng nếu lỗi
    }
  }

  useEffect(() => {
    getCourseDetail()
    getSections()
  }, [courseId])

  const handleOpenAddSectionModal = () => setIsAddSectionModalVisible(true)
  const handleCloseAddSectionModal = () => setIsAddSectionModalVisible(false)
  const handleSectionAdded = () => {
    getSections()
  }
  const handleSectionUpdated = () => {
    getSections()
  }

  const handleSectionDeleted = async (sectionIdToDelete: string | number) => {
    console.log("Attempting to delete section:", sectionIdToDelete)
    try {
      await instance.delete(`/api/course-section/${sectionIdToDelete}`)
      getSections()
      alert("Xóa chương thành công!")
    } catch (error) {
      console.error("Failed to delete section in CourseDetailPage:", error)
      alert("Xóa chương thất bại. Vui lòng thử lại.")
    }
  }

  const handleDeleteLesson = (lessonId: string | number) => {
    Modal.confirm({
      title: "Xác nhận xóa bài học",
      content: "Bạn có chắc muốn xóa bài học này không?",
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await instance.delete(`/api/course-lesson/${lessonId}`)
          message.success("Đã xóa bài học thành công.")
          getSections()
        } catch (error) {
          console.error("Lỗi khi xóa bài học:", error)
          message.error("Xóa bài học thất bại.")
        }
      },
    })
  }

  if (!course || course.id === 0) {
    return <div className="p-6 text-center">Đang tải thông tin khóa học...</div>
  }

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <Button
            type="default"
            icon={<LeftOutlined />}
            className="mr-4 p-2 h-10 w-10 flex items-center justify-center rounded-md border-gray-300 hover:border-blue-500"
            onClick={() => navigate("/admin/courses")}
          />
          <div>
            <Title level={2} className="!mb-0 leading-tight">
              {course.title}
            </Title>
            <Text type="secondary">Quản lý bài học cho khóa học này</Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleOpenAddSectionModal}>
          Thêm chương
        </Button>
      </div>

      {/* Course Stats */}
      <div className="mb-8">
        <Space size="middle">
          <Tag className="text-sm px-3 py-1 rounded-md bg-green-100 text-green-700 border-green-300">
            {sections.length} chương
          </Tag>
          <Tag className="text-sm px-3 py-1 rounded-md bg-blue-100 text-blue-700 border-blue-300">
            {countTotalLessons()} bài học
          </Tag>
        </Space>
      </div>

      {/* Sections List */}
      {sections.map((sectionItem) => (
        <SectionItem
          key={sectionItem.id}
          section={sectionItem}
          courseId={courseId}
          onSectionUpdated={handleSectionUpdated}
          onSectionDeleted={handleSectionDeleted}
          onDeleteLesson={handleDeleteLesson}
          onComplete={() => {
            getSections()
            getCourseDetail()
          }}
        />
      ))}

      {sections.length === 0 && !isNaN(courseId) && course.id !== 0 && (
        <div className="text-center py-10 text-gray-500 bg-white p-6 rounded-lg shadow-md">
          Khóa học này chưa có chương nào.
        </div>
      )}

      {courseId && !isNaN(courseId) && course.id !== 0 && (
        <AddSectionModal
          visible={isAddSectionModalVisible}
          courseId={courseId}
          onClose={handleCloseAddSectionModal}
          onSectionAdded={handleSectionAdded}
          existingSectionsCount={sections.length}
        />
      )}
    </div>
  )
}

export default CourseDetailPage
