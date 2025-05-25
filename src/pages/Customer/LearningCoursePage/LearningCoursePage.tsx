import React, { useState, useEffect, useMemo } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import {
  Layout,
  Menu,
  Spin,
  Alert,
  Typography,
  Card,
  Button,
  Empty,
  Breadcrumb,
} from "antd"
import {
  FaPlayCircle,
  FaFileAlt,
  FaQuestionCircle,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaListUl,
} from "react-icons/fa"

const { Sider, Content } = Layout
const { Title, Paragraph, Text } = Typography

// Dữ liệu giả lập (trong thực tế sẽ fetch từ API)
const MOCK_COURSE_CONTENT = {
  id: 1,
  title: "Khóa học Lập trình React Nâng Cao 1",
  sections: [
    {
      id: "section-1",
      title: "Chương 1: Giới thiệu và Cài đặt",
      lessons: [
        {
          id: "1-1",
          title: "Bài 1: Giới thiệu khóa học",
          type: "video",
          content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          duration: "03:32",
        },
        {
          id: "1-2",
          title: "Bài 2: Cài đặt môi trường",
          type: "text",
          content:
            "Để bắt đầu, bạn cần cài đặt Node.js và npm/yarn. Sau đó, tạo dự án React bằng Create React App: `npx create-react-app my-app`...",
          duration: "5 phút đọc",
        },
      ],
    },
    {
      id: "section-2",
      title: "Chương 2: React Hooks Nâng Cao",
      lessons: [
        {
          id: "2-1",
          title: "Bài 1: useState và useEffect sâu hơn",
          type: "video",
          content: "https://www.youtube.com/watch?v=6 নেতাকর্মী",
          duration: "15:45",
        },
        {
          id: "2-2",
          title: "Bài 2: useContext và custom Hooks",
          type: "video",
          content: "https://www.youtube.com/watch?v= বিস্তৃত",
          duration: "22:10",
        },
        {
          id: "2-3",
          title: "Bài 3: Bài tập thực hành Hooks",
          type: "quiz",
          content: "Nội dung câu hỏi quiz ở đây...",
          duration: "30 phút",
        },
      ],
    },
    {
      id: "section-3",
      title: "Chương 3: Quản lý State với Redux Toolkit",
      lessons: [
        {
          id: "3-1",
          title: "Bài 1: Giới thiệu Redux Toolkit",
          type: "video",
          content: "https://www.youtube.com/watch?v= AhMod",
          duration: "18:00",
        },
        {
          id: "3-2",
          title: "Bài 2: Slices và Reducers",
          type: "text",
          content:
            "Tìm hiểu về cách tạo slices, actions và reducers một cách dễ dàng với Redux Toolkit.",
          duration: "10 phút đọc",
        },
      ],
    },
  ],
}

// Hàm giả lập fetch nội dung khóa học
const fetchCourseContentById = (id: number): Promise<any> => {
  console.log("Fetching content for course ID:", id)
  return new Promise((resolve) => {
    setTimeout(() => {
      // Trong thực tế, bạn sẽ tìm course content dựa trên id
      // Ở đây ta chỉ trả về MOCK_COURSE_CONTENT nếu id khớp (hoặc bỏ qua id cho ví dụ này)
      if (MOCK_COURSE_CONTENT.id === id) {
        resolve(MOCK_COURSE_CONTENT)
      } else {
        // Trả về một course khác hoặc undefined nếu không tìm thấy
        // Để đơn giản, ta cứ trả về MOCK_COURSE_CONTENT nếu muốn test
        resolve(MOCK_COURSE_CONTENT) // Hoặc resolve(undefined) nếu muốn test case not found
      }
    }, 700)
  })
}

function CourseLearningPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()

  const [courseContent, setCourseContent] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])

  useEffect(() => {
    if (courseId) {
      const id = parseInt(courseId, 10)
      if (isNaN(id)) {
        setError("ID khóa học không hợp lệ.")
        setLoading(false)
        return
      }
      setLoading(true)
      fetchCourseContentById(id)
        .then((data) => {
          if (data) {
            setCourseContent(data)
            // Tự động chọn bài học đầu tiên
            if (
              data.sections.length > 0 &&
              data.sections[0].lessons.length > 0
            ) {
              const firstLesson = data.sections[0].lessons[0]
              setCurrentLesson(firstLesson)
              setSelectedKeys([firstLesson.id])
              setOpenKeys([data.sections[0].id]) // Mở section đầu tiên
            } else {
              setError("Khóa học này chưa có bài học nào.")
            }
          } else {
            setError("Không tìm thấy nội dung khóa học.")
          }
        })
        .catch(() => setError("Lỗi tải nội dung khóa học."))
        .finally(() => setLoading(false))
    }
  }, [courseId])

  const handleLessonClick = (lesson: any, sectionId: string) => {
    setCurrentLesson(lesson)
    setSelectedKeys([lesson.id])
    if (!openKeys.includes(sectionId)) {
      setOpenKeys((prevOpenKeys) => [...prevOpenKeys, sectionId])
    }
  }

  const allLessonsFlat = useMemo(() => {
    if (!courseContent) return []
    return courseContent.sections.flatMap((section) =>
      section.lessons.map((lesson) => ({ ...lesson, sectionId: section.id }))
    )
  }, [courseContent])

  const currentLessonIndex = useMemo(() => {
    if (!currentLesson || !allLessonsFlat.length) return -1
    return allLessonsFlat.findIndex((lesson) => lesson.id === currentLesson.id)
  }, [currentLesson, allLessonsFlat])

  const navigateLesson = (direction: "prev" | "next") => {
    if (currentLessonIndex === -1 || !allLessonsFlat.length) return

    const newIndex =
      direction === "prev" ? currentLessonIndex - 1 : currentLessonIndex + 1

    if (newIndex >= 0 && newIndex < allLessonsFlat.length) {
      const newLesson = allLessonsFlat[newIndex]
      setCurrentLesson(newLesson)
      setSelectedKeys([newLesson.id])
      // Tự động mở section của bài học mới nếu nó chưa mở
      if (!openKeys.includes(newLesson.sectionId)) {
        setOpenKeys((prev) => [...prev, newLesson.sectionId])
      }
    }
  }

  const getLessonIcon = (type) => {
    switch (type) {
      case "video":
        return <FaPlayCircle className="mr-2 text-red-500" />
      case "text":
        return <FaFileAlt className="mr-2 text-blue-500" />
      case "quiz":
        return <FaQuestionCircle className="mr-2 text-green-500" />
      default:
        return <FaListUl className="mr-2 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" tip="Đang tải nội dung khóa học..." />
      </div>
    )
  }

  if (error || !courseContent) {
    return (
      <div className="container mx-auto p-8">
        <Alert
          message="Lỗi"
          description={error || "Không thể tải khóa học."}
          type="error"
          showIcon
        />
        <Button type="default" onClick={() => navigate(-1)} className="mt-4">
          Quay lại
        </Button>
      </div>
    )
  }

  const renderLessonContent = () => {
    if (!currentLesson) {
      return (
        <Empty
          description="Vui lòng chọn một bài học từ danh sách bên."
          className="mt-10"
        />
      )
    }
    switch (currentLesson.type) {
      case "video":
        return (
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            {/* <ReactPlayer
              url={currentLesson.content}
              width="100%"
              height="100%"
              controls
              playing // Tự động play (tùy chọn)
              config={{
                youtube: {
                  playerVars: { showinfo: 0, modestbranding: 1, rel: 0 },
                },
              }}
            /> */}
          </div>
        )
      case "text":
        return (
          <Card title="Nội dung bài học" className="shadow-md">
            <Paragraph className="prose prose-lg max-w-none leading-relaxed whitespace-pre-wrap">
              {currentLesson.content}
            </Paragraph>
          </Card>
        )
      case "quiz":
        return (
          <Card title="Bài kiểm tra" className="shadow-md">
            <Paragraph>
              Loại nội dung Quiz chưa được triển khai đầy đủ.
            </Paragraph>
            <Paragraph>Nội dung quiz: {currentLesson.content}</Paragraph>
            <Button type="primary" className="mt-4">
              Bắt đầu Quiz
            </Button>
          </Card>
        )
      default:
        return <Paragraph>Loại bài học không xác định.</Paragraph>
    }
  }

  return (
    <Layout className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-4 px-2 sm:px-4">
        <Breadcrumb className="mb-4 text-sm bg-white p-3 rounded shadow">
          <Breadcrumb.Item>
            <Link to="/">
              <FaHome className="mr-1 inline-block" /> Trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/courses">Khóa học</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to={`/courses/${courseContent.id}`}>
              {courseContent.title}
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Đang học</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Layout className="container mx-auto shadow-xl rounded-lg overflow-hidden bg-white">
        <Sider
          width={320}
          className="!bg-white border-r border-gray-200 p-0"
          breakpoint="lg" // Sidebar sẽ thu gọn trên màn hình nhỏ hơn lg
          collapsedWidth="0" // Ẩn hoàn toàn khi thu gọn
          trigger={null} // Ẩn trigger mặc định nếu bạn muốn tự quản lý
        >
          <div className="p-4 border-b border-gray-200">
            <Title
              level={4}
              className="!mb-1 truncate"
              title={courseContent.title}>
              {courseContent.title}
            </Title>
            <Text type="secondary" className="text-xs">
              Nội dung khóa học
            </Text>
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={(keys) => setOpenKeys(keys as string[])}
            className="h-[calc(100vh-180px)] overflow-y-auto border-0" // Điều chỉnh chiều cao cho phù hợp
            items={courseContent.sections.map((section) => ({
              key: section.id,
              label: <span className="font-semibold">{section.title}</span>,
              children: section.lessons.map((lesson) => ({
                key: lesson.id,
                label: (
                  <div className="flex justify-between items-center">
                    <span className="truncate" title={lesson.title}>
                      {lesson.title}
                    </span>
                    {lesson.duration && (
                      <Text type="secondary" className="text-xs ml-2">
                        {lesson.duration}
                      </Text>
                    )}
                  </div>
                ),
                icon: getLessonIcon(lesson.type),
                onClick: () => handleLessonClick(lesson, section.id),
              })),
            }))}
          />
        </Sider>
        <Content className="p-4 sm:p-6 md:p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-120px)]">
          {currentLesson && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <Title level={3} className="!text-2xl !mb-1">
                {currentLesson.title}
              </Title>
              <Text type="secondary" className="flex items-center">
                {getLessonIcon(currentLesson.type)}{" "}
                {currentLesson.type.charAt(0).toUpperCase() +
                  currentLesson.type.slice(1)}
                {currentLesson.duration && <span className="mx-2">|</span>}
                {currentLesson.duration && (
                  <Text type="secondary">{currentLesson.duration}</Text>
                )}
              </Text>
            </div>
          )}

          {renderLessonContent()}

          <div className="mt-8 flex justify-between items-center">
            <Button
              icon={<FaArrowLeft className="mr-1" />}
              onClick={() => navigateLesson("prev")}
              disabled={currentLessonIndex <= 0}>
              Bài trước
            </Button>
            <Button
              type="primary"
              icon={<FaArrowRight className="ml-1" />}
              iconPosition="end"
              onClick={() => navigateLesson("next")}
              disabled={
                currentLessonIndex === -1 ||
                currentLessonIndex >= allLessonsFlat.length - 1
              }
              className="bg-green-500 hover:bg-green-600 border-green-500">
              Bài tiếp theo
            </Button>
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default CourseLearningPage
