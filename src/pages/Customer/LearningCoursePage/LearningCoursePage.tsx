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
  message,
  Checkbox,
} from "antd"
import {
  FaPlayCircle,
  FaFileAlt,
  FaArrowLeft,
  FaArrowRight,
  FaHome,
} from "react-icons/fa"
import type { SectionResponse } from "../../../shared/types/section"
import { getErrorMessage } from "../../../shared/utils/helpers"
import type { AxiosError } from "axios"
import { instance } from "../../../config/axios"
import type { LessonResponse } from "../../../shared/types/lesson"
import ReactPlayer from "react-player"
import type { CourseResponse } from "../../../shared/types/course"
import CommentSider from "./CommentSider"
import { BiCheckCircle, BiComment } from "react-icons/bi"
import { convertDurationFromSeconds } from "./../../../shared/utils/helpers"

const { Sider, Content } = Layout
const { Title, Text } = Typography

function CourseLearningPage() {
  const { courseId } = useParams<{ courseId: string }>()

  const navigate = useNavigate()

  const [courseContent, setCourseContent] = useState<CourseResponse | null>(
    null
  )
  const [sectionList, setSectionList] = useState<SectionResponse[]>([])
  const [currentLesson, setCurrentLesson] = useState<LessonResponse | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const showDrawer = () => {
    setOpen(true)
  }

  const onClose = () => {
    setOpen(false)
  }

  const getCourse = async () => {
    setLoading(true)
    try {
      const response = await instance.get(`/api/course/${courseId}`)
      setCourseContent(response.data.data)
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
    setLoading(false)
  }

  // const getCourses = async () => {
  //     try {
  //       const response = await instance.get(
  //         `/api/enrollment/find-by-user?search=${searchTerm}&page=${page.currentPage}&size=${page.pageSize}`
  //       )
  //       const resData: Response<{ content: CourseResponse[]; pageCustom: Page }> =
  //         response.data
  //       const publicCourses: CourseResponse[] = resData.data?.content || []
  //       setAllCourses(publicCourses)
  //       setPage(resData.data?.pageCustom || initPage)
  //     } catch (error) {
  //       const errData = getErrorMessage(error as AxiosError)
  //       message.error(errData)
  //     }
  //   }

  const getCourseSections = async () => {
    setLoading(true)
    try {
      const response = await instance.get(`/api/course-section/${courseId}`)
      setSectionList(response.data.data)
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
    setLoading(false)
  }

  useEffect(() => {
    if (courseId) {
      const id = parseInt(courseId, 10)
      if (isNaN(id)) {
        setError("ID khóa học không hợp lệ.")
        return
      }
      getCourse()
      getCourseSections()
    }
  }, [courseId])

  const handleLessonClick = (lesson: any, sectionId: number) => {
    setCurrentLesson(lesson)
    setSelectedKeys([lesson.id])
    if (!openKeys.includes(sectionId.toString())) {
      setOpenKeys((prevOpenKeys) => [...prevOpenKeys, sectionId.toString()])
    }
  }

  const getLessonIcon = (lesson: LessonResponse) => {
    if (lesson.videoUrl.trim() !== "")
      return <FaPlayCircle className="mr-2 text-red-500" />
    else return <FaFileAlt className="mr-2 text-blue-500" />
  }

  const handleTrackingProgressLesson = async (lesson: LessonResponse) => {
    try {
      !lesson.done
        ? await instance.post(`/api/progress/${lesson.id}`)
        : await instance.delete(`/api/progress/${lesson.id}`)
      getCourseSections()
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" tip="Đang tải nội dung khóa học..." />
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
    if (currentLesson.videoUrl !== "" && currentLesson.article !== "")
      return (
        <>
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
            <ReactPlayer
              url={currentLesson.videoUrl}
              width="100%"
              height="100%"
              controls
              playing
              config={{
                youtube: {
                  playerVars: { showinfo: 0, modestbranding: 1, rel: 0 },
                },
              }}
            />
          </div>
          <Card title="Nội dung bài học" className="shadow-md">
            <div
              dangerouslySetInnerHTML={{ __html: currentLesson.article }}></div>
          </Card>
        </>
      )
    if (currentLesson.videoUrl !== "")
      return (
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
          <ReactPlayer
            url={currentLesson.videoUrl}
            width="100%"
            height="100%"
            controls
            playing
            config={{
              youtube: {
                playerVars: { showinfo: 0, modestbranding: 1, rel: 0 },
              },
            }}
          />
        </div>
      )
    if (currentLesson.article !== "")
      return (
        <Card title="Nội dung bài học" className="shadow-md">
          <div
            dangerouslySetInnerHTML={{ __html: currentLesson.article }}></div>
        </Card>
      )
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
            <Link to="/learn">Khóa học của tôi</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            {courseContent && (
              <Link to={`/courses/detail/${courseContent.id}`}>
                {courseContent.title}
              </Link>
            )}
          </Breadcrumb.Item>
          <Breadcrumb.Item>Đang học</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Layout className="container relative mx-auto shadow-xl rounded-lg overflow-hidden bg-white">
        {currentLesson && (
          <CommentSider
            open={open}
            showDrawer={showDrawer}
            onClose={onClose}
            lessonId={currentLesson.id}
            className="!fixed !bottom-5 !right-10 !z-10"
          />
        )}
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
              title={courseContent?.title}>
              {courseContent?.title}
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
            items={
              sectionList &&
              sectionList.map((section) => ({
                key: section.id,
                label: <span className="font-semibold">{section.title}</span>,
                children: section.courseLessons.map((lesson) => ({
                  key: lesson.id,
                  label: (
                    <div className="flex justify-between items-center">
                      <span
                        className="truncate w-4/5"
                        title={lesson.title}
                        onClick={() => handleLessonClick(lesson, section.id)}>
                        {lesson.title}
                      </span>
                      {
                        <Checkbox
                          checked={lesson.done}
                          onChange={() => handleTrackingProgressLesson(lesson)}
                        />
                      }
                    </div>
                  ),
                  icon: getLessonIcon(lesson),
                })),
              }))
            }
          />
        </Sider>
        <Content className="relative p-4 sm:p-6 md:p-8 bg-gray-50 overflow-y-auto h-[calc(100vh-120px)]">
          {currentLesson && (
            <div className="mb-6 pb-4 border-b border-gray-200">
              <Title level={3} className="!text-2xl !mb-1 flex justify-between">
                {currentLesson.title}
                <Button type="primary" className="sticky" onClick={showDrawer}>
                  <BiComment size={20} /> Bình luận
                </Button>
              </Title>
              <Text type="secondary" className="flex items-center">
                {getLessonIcon(currentLesson)}{" "}
                {currentLesson.duration && <span className="mx-2">|</span>}
                {currentLesson.duration && (
                  <Text type="secondary">
                    {convertDurationFromSeconds(currentLesson.duration)}
                  </Text>
                )}
              </Text>
            </div>
          )}
          {renderLessonContent()}
        </Content>
      </Layout>
    </Layout>
  )
}

export default CourseLearningPage
