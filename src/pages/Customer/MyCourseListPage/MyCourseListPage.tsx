import { useState, useEffect, useMemo } from "react"
import {
  Input,
  List,
  Card,
  Pagination,
  Empty,
  Tooltip,
  message,
  Progress,
} from "antd"
import {
  FaUserGraduate,
  FaCalendarAlt,
  FaDollarSign,
  FaSearch,
} from "react-icons/fa"
import { getErrorMessage } from "../../../shared/utils/helpers"
import type { AxiosError } from "axios"
import { instance } from "../../../config/axios"
import type { Response } from "../../../shared/types/response"
import type { Page } from "../../../shared/types/page"
import { useNavigate } from "react-router-dom"
import { RiProgress1Fill } from "react-icons/ri"

const initPage: Page = {
  currentPage: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0,
}

interface CourseResponse {
  id: number
  title: string
  description: string
  thumbnail: string
  price: number
  progress: number
  totalLessons: number
  completedLessons: number
}

function MyCourseListPage() {
  const [allCourses, setAllCourses] = useState<Partial<CourseResponse>[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState<Page>(initPage)

  const navigate = useNavigate()

  const getCourses = async () => {
    try {
      const response = await instance.get(
        `/api/enrollment/find-by-user?search=${searchTerm}&page=${page.currentPage}&size=${page.pageSize}`
      )
      const resData: Response<{ content: CourseResponse[]; pageCustom: Page }> =
        response.data
      const publicCourses: CourseResponse[] = resData.data?.content || []
      setAllCourses(publicCourses)
      setPage(resData.data?.pageCustom || initPage)
    } catch (error) {
      const errData = getErrorMessage(error as AxiosError)
      message.error(errData)
    }
  }

  useEffect(() => {
    getCourses()
  }, [searchTerm])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  const handlePageChange = (page: number) => {
    setPage((prev) => ({
      ...prev,
      currentPage: page,
    }))
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Danh sách Khóa học của tôi
      </h1>

      <div className="mb-8 max-w-xl mx-auto">
        <Input.Search
          placeholder="Tìm kiếm theo tên, mô tả, người tạo..."
          allowClear
          enterButton={
            <div className="flex">
              <FaSearch className="mr-1 align-middle" /> Tìm
            </div>
          }
          size="large"
          onSearch={handleSearch}
          onChange={(e) => {
            if (!e.target.value) {
              handleSearch("")
            }
          }}
          className="shadow-md"
        />
      </div>

      {allCourses.length === 0 ? (
        <div className="text-center py-10">
          <Empty description="Không tìm thấy khóa học nào phù hợp." />
        </div>
      ) : (
        <>
          <List
            grid={{
              gutter: 24, // Khoảng cách giữa các card
              xs: 1, // 1 cột trên màn hình rất nhỏ
              sm: 2, // 2 cột trên màn hình nhỏ
              md: 3, // 3 cột trên màn hình vừa
              lg: 4, // 4 cột trên màn hình lớn
              xl: 4, // 4 cột trên màn hình rất lớn
              xxl: 4, // 4 cột trên màn hình cực lớn
            }}
            dataSource={allCourses}
            renderItem={(course) => (
              <List.Item>
                <Card
                  onClick={() => navigate(`/learn/${course.id}`)}
                  hoverable
                  className="shadow-lg rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105"
                  cover={
                    <img
                      alt={course.title}
                      src={course.thumbnail}
                      className="h-48 w-full object-cover"
                    />
                  }>
                  <Tooltip title={course.title}>
                    <Card.Meta
                      title={
                        <h3 className="text-lg font-semibold text-blue-700 truncate">
                          {course.title}
                        </h3>
                      }
                    />
                  </Tooltip>
                  <p className="text-gray-600 my-2 text-sm h-16 overflow-hidden text-ellipsis">
                    {course.description && course.description.length > 100
                      ? `${course.description.substring(0, 97)}...`
                      : course.description}
                  </p>
                  <div className="my-3 space-y-1 text-sm">
                    <div className="flex items-center text-green-600 font-medium">
                      <RiProgress1Fill className="mr-2" />
                      Tiến độ:{" "}
                      <Progress
                        percent={course.progress}
                        size="small"
                        className="!w-[120px] !ml-2"
                      />
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FaUserGraduate className="mr-2" />
                      Bài học: {course.totalLessons}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaCalendarAlt className="mr-2" />
                      Đã hoàn thành: {course.completedLessons}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />

          {page.totalPages > 1 && (
            <div className="mt-10 text-center">
              <Pagination
                current={page.currentPage}
                pageSize={page.pageSize}
                total={allCourses.length}
                onChange={handlePageChange}
                showSizeChanger={false}
                className="inline-block"
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default MyCourseListPage
