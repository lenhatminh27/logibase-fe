import React, { useState, useEffect } from "react"
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
} from "antd"
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaChalkboardTeacher,
  FaDollarSign,
  FaInfoCircle,
  FaTag,
  FaHome,
} from "react-icons/fa"
import type { CourseResponse } from "../../../shared/types/course"

const { Title, Paragraph, Text } = Typography

const MOCK_COURSES: CourseResponse[] = Array.from({ length: 55 }, (_, i) => ({
  id: i + 1,
  title: `Khóa học Lập trình React Nâng Cao ${i + 1}`,
  description: `Đây là mô tả chi tiết và đầy đủ cho khóa học Lập trình React Nâng Cao số ${
    i + 1
  }. Trong khóa học này, bạn sẽ được học sâu về các khái niệm cốt lõi và kỹ thuật tiên tiến nhất trong React. Chúng tôi sẽ đi qua các chủ đề như Quản lý trạng thái nâng cao với Redux Toolkit hoặc Zustand, Tối ưu hóa hiệu suất ứng dụng React, Server-Side Rendering (SSR) và Static Site Generation (SSG) với Next.js hoặc Remix, Testing trong React với Jest và React Testing Library. Ngoài ra, khóa học còn bao gồm các bài tập thực hành và dự án cuối khóa để bạn áp dụng kiến thức đã học. Phù hợp cho các bạn đã có kiến thức cơ bản về React và muốn nâng tầm kỹ năng.`,
  thumbnail: `https://picsum.photos/seed/${i + 1}/800/400`,
  price: Math.floor(Math.random() * 1000000) + 500000,
  status: "PUBLIC",
  createdBy: `Giảng viên ${String.fromCharCode(
    65 + (i % 26)
  )} - Chuyên gia React với 10 năm kinh nghiệm`,
  createdAt: new Date(Date.now() - Math.random() * 10000000000),
  updatedAt: new Date(Date.now() - Math.random() * 1000000000),
}))

const fetchCourseById = (id: number): Promise<CourseResponse | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const course = MOCK_COURSES.find((c) => c.id === id)
      resolve(course)
    }, 500)
  })
}

function CourseDetailPage() {
  const { courseId } = useParams()

  const navigate = useNavigate()

  const [course, setCourse] = useState<CourseResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (courseId) {
      const id = parseInt(courseId, 10)
      if (isNaN(id)) {
        setError("ID khóa học không hợp lệ.")
        setLoading(false)
        return
      }

      setLoading(true)
      fetchCourseById(id)
        .then((data) => {
          if (data) {
            setCourse(data)
          } else {
            setError("Không tìm thấy khóa học.")
          }
        })
        .catch(() => {
          setError("Đã có lỗi xảy ra khi tải dữ liệu khóa học.")
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [courseId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" tip="Đang tải chi tiết khóa học..." />
      </div>
    )
  }

  if (error) {
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
    // Trường hợp này ít khi xảy ra nếu logic error ở trên đã đúng
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
                    {course.price.toLocaleString("vi-VN")} VNĐ
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item
                  label={
                    <>
                      <FaChalkboardTeacher className="mr-2" />
                      Người tạo
                    </>
                  }>
                  {course.createdBy}
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
              <Button
                type="primary"
                size="large"
                className="mt-6 w-full md:w-auto bg-green-500 hover:bg-green-600">
                Đăng ký khóa học
              </Button>
            </div>
            <div className="md:w-2/5 mt-20">
              <Image
                width="100%"
                alt={course.title}
                src={course.thumbnail}
                className="object-cover h-full"
                preview={{
                  mask: <div className="text-white text-lg">Xem ảnh</div>,
                }}
              />
            </div>
          </div>

          <div className="p-6 md:p-8 border-t border-gray-200">
            <Title level={3} className="!mb-4 text-gray-800">
              <FaInfoCircle className="mr-2 inline-block text-blue-500" />
              Mô tả chi tiết
            </Title>
            <Paragraph className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none text-gray-700 leading-relaxed">
              {course.description.split("\n").map((paragraph, index) => (
                <React.Fragment key={index}>
                  {paragraph}
                  <br />
                </React.Fragment>
              ))}
            </Paragraph>
          </div>
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
