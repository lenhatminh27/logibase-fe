import React, { useState, useEffect, useCallback } from "react" // Added useCallback
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  Spin,
  Alert,
  Card,
  Tag,
  Descriptions,
  Button,
  Breadcrumb,
  Image,
  Typography,
  message,
  Popover,
  List,
  Collapse,
} from "antd"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaDollarSign,
  FaInfoCircle,
  FaTag, // Note: FaTag is imported but not used
  FaHome,
  FaHandPointRight,
  FaBookOpen,
  FaPlayCircle,
} from "react-icons/fa"
import type { CourseResponse } from "../../../shared/types/course" // Assuming CourseResponse does not necessarily include detailed sections
import { getErrorMessage } from "../../../shared/utils/helpers"
import type { AxiosError } from "axios"
import { instance } from "../../../config/axios"
import type { Response } from "../../../shared/types/response" // Standard API response wrapper
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"
import type { SectionResponse } from "../../../shared/types/section"

const { Title, Paragraph, Text } = Typography
const { Panel } = Collapse

function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>()

  const navigate = useNavigate()

  const [course, setCourse] = useState<CourseResponse | null>(null)
  const [sections, setSections] = useState<SectionResponse[]>([])

  const [loadingCourse, setLoadingCourse] = useState(true)
  const [loadingSections, setLoadingSections] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCourseById = useCallback(async (id: string) => {
    try {
      setLoadingCourse(true)
      const response = await instance.get(`/api/course/${id}`)
      setCourse((response.data as Response<CourseResponse>).data || null)
      setError(null) // Clear previous error on success
    } catch (err) {
      const errorMessage = getErrorMessage(err as AxiosError)
      setError(errorMessage) // Set primary error if course details fail
      message.error(errorMessage)
      setCourse(null) // Ensure course is null on error
    } finally {
      setLoadingCourse(false)
    }
  }, [])

  const getCourseSections = useCallback(async (id: string) => {
    setLoadingSections(true)
    try {
      const response = await instance.get(`/course-section/${id}`)
      const apiResponse = response.data as Response<SectionResponse[]>
      setSections(apiResponse.data || [])
    } catch (err) {
      const errorMessage = getErrorMessage(err as AxiosError)
      message.error(`Lỗi tải nội dung khóa học: ${errorMessage}`)
      setSections([])
    } finally {
      setLoadingSections(false)
    }
  }, [])

  useEffect(() => {
    if (courseId) {
      const idNum = parseInt(courseId, 10)
      if (isNaN(idNum)) {
        setError("ID khóa học không hợp lệ.")
        setLoadingCourse(false)
        setLoadingSections(false)
        return
      }
      // Reset states for potential re-fetches if courseId changes
      setCourse(null)
      setSections([])
      setError(null)
      setLoadingCourse(true)
      setLoadingSections(true)

      fetchCourseById(courseId)
      getCourseSections(courseId)
    } else {
      setError("Không có ID khóa học.")
      setLoadingCourse(false)
      setLoadingSections(false)
    }
  }, [courseId, fetchCourseById, getCourseSections])

  // Combined loading state for the initial page load, primarily for the main spinner
  const isLoadingPage = loadingCourse && !course // Show main spinner if course details are loading and not yet available

  if (isLoadingPage) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" tip="Đang tải chi tiết khóa học..." />
      </div>
    )
  }

  if (error && !course) {
    // Show global error if course fetching failed critically
    return (
      <div className="container mx-auto p-8">
        <Alert message="Lỗi" description={error} type="error" showIcon />
        <Button
          type="primary"
          icon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
          className="mt-4">
          Quay lại
        </Button>
      </div>
    )
  }

  if (!course) {
    // This handles cases like invalid ID after parsing, or API returning null for course
    return (
      <div className="container mx-auto p-8 text-center">
        <Typography.Title level={3}>
          Không tìm thấy thông tin khóa học.
        </Typography.Title>
        <Button
          type="primary"
          icon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
          className="mt-4">
          Quay lại
        </Button>
      </div>
    )
  }

  // Sort sections and lessons once they are available
  const sortedSections = [...sections].sort(
    (a, b) => a.orderIndex - b.orderIndex
  )

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <Breadcrumb className="mb-6 text-base">
          <Breadcrumb.Item>
            <Link to="/">
              <FaHome className="mr-1 inline-block" /> Trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/courses">Khóa học</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{course.title}</Breadcrumb.Item>
        </Breadcrumb>

        <Card bordered={false} className="shadow-xl rounded-lg overflow-hidden">
          <div className="md:flex">
            <div className="md:w-3/5 p-6 md:p-8">
              <Title level={2} className="text-blue-700 !mb-3">
                {course.title}
              </Title>
              <Descriptions
                bordered
                column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
                size="small">
                <Descriptions.Item
                  label={
                    <>
                      <FaDollarSign className="mr-2" />
                      Giá
                    </>
                  }>
                  <Text strong className="text-green-600 text-xl">
                    {course.price
                      ? course.price.toLocaleString("vi-VN") + " VNĐ"
                      : "Liên hệ"}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <FaChalkboardTeacher className="mr-2" />
                      Người tạo
                    </>
                  }>
                  {course.createdBy || "N/A"}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <FaCalendarAlt className="mr-2" />
                      Ngày tạo
                    </>
                  }>
                  {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <FaCalendarAlt className="mr-2" />
                      Cập nhật lần cuối
                    </>
                  }>
                  {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
                </Descriptions.Item>
              </Descriptions>
              <Popover
                placement="rightTop"
                className="!mt-10"
                content={
                  <p className="flex items-center">
                    <span>
                      <FaHandPointRight
                        size={24}
                        className="!text-blue-500 mr-3"
                      />
                    </span>
                    Để đăng ký khoá học, vui lòng liên hệ qua Zalo: 0123456789
                  </p>
                }
                trigger="click">
                <Button type="primary" size="large" className="mt-6">
                  Mua ngay
                </Button>
              </Popover>
            </div>
            <div className="md:w-2/5 flex items-center justify-center p-4 md:p-0 mt-6 md:mt-0">
              <Image
                alt={course.title}
                src={
                  course.thumbnail ||
                  "https://via.placeholder.com/400x300?text=No+Image"
                }
                className="object-cover rounded-md shadow-md max-h-[300px] w-auto"
                preview={{
                  mask: <div className="text-white text-lg">Xem ảnh</div>,
                }}
              />
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-gray-200 mt-6 md:mt-0">
            <Title level={3} className="!mb-4 text-gray-800">
              <FaInfoCircle className="mr-2 inline-block text-blue-500" />
              Mô tả chi tiết
            </Title>
            <Paragraph className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-700 leading-relaxed">
              {course.description && course.description.length > 0
                ? course.description.split("\n").map((paragraph, index) => (
                    <React.Fragment key={index}>
                      {paragraph}
                      <br />
                    </React.Fragment>
                  ))
                : "Chưa có mô tả cho khóa học này."}
            </Paragraph>
          </div>
        </Card>

        <Card
          title={
            <Title level={3} className="!mb-0">
              <FaBookOpen className="mr-2 inline-block text-blue-500" />
              Nội dung khóa học
            </Title>
          }
          bordered={false}
          className="mt-8 shadow-xl rounded-lg overflow-hidden">
          {loadingSections ? (
            <div className="p-6 text-center">
              <Spin tip="Đang tải nội dung khóa học..." />
            </div>
          ) : sortedSections.length > 0 ? (
            <Collapse
              accordion
              bordered={false}
              defaultActiveKey={
                sortedSections.length > 0
                  ? [sortedSections[0].id.toString()]
                  : []
              }
              className="bg-white">
              {sortedSections.map((section, sectionIndex) => {
                const sortedLessons = section.courseLessons
                  ? [...section.courseLessons].sort(
                      (a, b) => a.orderIndex - b.orderIndex
                    )
                  : []
                return (
                  <Panel
                    header={
                      <Text strong className="text-base text-gray-700">
                        {`${section.title}`}
                      </Text>
                    }
                    key={section.id.toString()}
                    className="bg-gray-50 hover:bg-gray-100 rounded-md mb-2 shadow-sm">
                    {sortedLessons.length > 0 ? (
                      <List
                        size="small"
                        dataSource={sortedLessons.map(
                          (lesson, lessonIndex) => ({
                            ...lesson,
                            displayLessonNumber: lessonIndex + 1,
                          })
                        )}
                        renderItem={(lesson) => (
                          <List.Item key={lesson.id} className="!pl-4">
                            <List.Item.Meta
                              avatar={
                                <FaPlayCircle className="mt-1 text-blue-500" />
                              }
                              title={
                                <Text className="text-gray-800">
                                  {`${lesson.title}`}
                                </Text>
                              }
                            />
                            {lesson.duration > 0 && (
                              <Tag color="blue">
                                {`${Math.floor(lesson.duration / 60)} phút ${
                                  lesson.duration % 60 > 0
                                    ? (lesson.duration % 60) + " giây"
                                    : ""
                                }`.trim()}
                              </Tag>
                            )}
                            {lesson.trial && <Tag color="green">Học thử</Tag>}
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Text type="secondary" italic className="pl-4">
                        Chưa có bài học nào trong phần này.
                      </Text>
                    )}
                  </Panel>
                )
              })}
            </Collapse>
          ) : (
            <div className="p-6 text-center">
              <FaInfoCircle
                className="mr-2 inline-block text-gray-400"
                size={24}
              />
              <Text type="secondary" className="italic text-lg">
                Nội dung khóa học đang được cập nhật hoặc không có.
              </Text>
            </div>
          )}
        </Card>

        <div className="mt-8 text-center md:text-left">
          <Button
            icon={<FaArrowLeft className="mr-2" />}
            onClick={() => navigate("/courses")}
            size="large">
            Quay lại danh sách
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailPage
