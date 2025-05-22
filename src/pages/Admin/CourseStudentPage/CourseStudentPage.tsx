import { useEffect, useState } from "react"
import {
  Input,
  Button,
  Typography,
  Table,
  Pagination,
  message,
  Tag,
  Modal,
  Progress,
} from "antd"
import {
  LeftOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons"
import type { Course } from "../../../shared/types/course" // Your existing Course type
import type { Page } from "../../../shared/types/page"
import { type EnrollmentResponse } from "../../../shared/types/enrollment"
import { instance } from "../../../config/axios"
import { useNavigate, useLocation } from "react-router-dom"
import type { ColumnsType } from "antd/es/table"
import AddStudentModal from "./AddStudentModal"

const { Title, Text } = Typography

const initPage: Page = {
  currentPage: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 1,
}

const initCourseInfo: Partial<Course> = {
  id: undefined,
  title: "Khóa học",
}

function CourseStudentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const courseId = location.pathname.split("/")[3]

  const [search, setSearch] = useState("")
  const [students, setStudents] = useState([])
  const [courseInfo, setCourseInfo] = useState<Partial<Course>>(initCourseInfo)
  const [page, setPage] = useState<Page>(initPage)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCourse, setLoadingCourse] = useState<boolean>(false)
  const [isShowAddStudentModal, setIsShowAddStudentModal] =
    useState<boolean>(false)

  const fetchCourseDetails = async () => {
    if (!courseId) return
    setLoadingCourse(true)
    try {
      const response = await instance.get(`/api/course/${courseId}`)
      setCourseInfo(response.data.data as Course)
    } catch (error) {
      console.error("Failed to fetch course details:", error)
      message.error("Không thể tải thông tin khóa học.")
      setCourseInfo({ id: Number(courseId), title: "Chi tiết khóa học" })
    } finally {
      setLoadingCourse(false)
    }
  }

  const fetchEnrolledStudents = async () => {
    if (!courseId) return
    setLoading(true)
    try {
      const response = await instance.get(
        `/api/enrollment/user/${courseId}?search=${search}&page=${page.currentPage}&size=${page.pageSize}`
      )
      const resData = response.data.data
      if (resData && resData.content && resData.pageCustom) {
        setStudents(resData.content)
        setPage((prevPage) => ({
          ...prevPage,
          totalElements: resData.pageCustom.totalElements,
          totalPages: resData.pageCustom.totalPages,
        }))
      } else {
        setStudents([])
        setPage(initPage) // Reset page if data is malformed
        console.error("Malformed student enrollment data:", response.data.data)
      }
    } catch (error) {
      console.error("Failed to fetch enrolled students:", error)
      message.error("Không thể tải danh sách học viên.")
      setStudents([])
      setPage(initPage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCourseDetails()
  }, [courseId])

  useEffect(() => {
    fetchEnrolledStudents()
  }, [courseId, page.currentPage, page.pageSize, search])

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage((prev) => ({
      ...prev,
      currentPage: newPage,
      pageSize: newPageSize || prev.pageSize,
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handleUnenrollStudent = (userId: number) => {
    Modal.confirm({
      title: "Xác nhận xoá học viên khỏi khoá học",
      content: "Bạn có chắc muốn xoá học viên này khỏi khóa học?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await instance.delete("/api/enrollment", {
            data: {
              courseId: courseId,
              userId: userId,
            },
          })
          message.success("Đã xoá học viên khỏi khoá học thành công.")
          fetchEnrolledStudents() // Refresh the list
        } catch (error) {
          console.error("Failed to unenroll student:", error)
          message.error("Xoá thất bại. Vui lòng thử lại.")
        }
      },
    })
  }

  const studentColumns: ColumnsType<EnrollmentResponse> = [
    {
      title: "Tên học viên",
      dataIndex: "fullName",
      key: "fullName",
      render: (fullName: string) => <Text strong>{fullName || "N/A"}</Text>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Ngày ghi danh",
      dataIndex: "enrolledAt",
      key: "enrolledAt",
      render: (enrolledAt?: Date | string) =>
        enrolledAt ? new Date(enrolledAt).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Tiến độ", // Optional
      dataIndex: "trackingProgress",
      key: "trackingProgress",
      render: (trackingProgress?: number) => (
        <Progress percent={trackingProgress} size="small" />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record: EnrollmentResponse) => (
        <Button
          danger
          size="small"
          onClick={() => handleUnenrollStudent(record.userId)}>
          Xoá
        </Button>
      ),
    },
  ]

  if (loadingCourse && !courseInfo?.id) {
    return <div className="p-6 text-center">Đang tải thông tin khóa học...</div>
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center">
          <Button
            type="default"
            icon={<LeftOutlined />}
            className="mr-4 p-2 h-10 w-10 flex items-center justify-center rounded-md border-gray-300 hover:border-blue-500"
            onClick={() => navigate("/admin/courses")} // Or navigate back to course detail if preferred
          />
          <div>
            <Title level={2} className="!mb-0 leading-tight">
              {courseInfo.title || "Học viên khóa học"}
            </Title>
            <Text type="secondary">
              Quản lý danh sách học viên của khóa học này
            </Text>
          </div>
        </div>
        <Button
          type="primary"
          icon={<UserAddOutlined />}
          size="large"
          onClick={() => setIsShowAddStudentModal(true)}>
          Thêm học viên
        </Button>
        <AddStudentModal
          courseId={Number(courseId)}
          isOpen={isShowAddStudentModal}
          onClose={() => {
            setIsShowAddStudentModal(false), fetchEnrolledStudents()
          }}
        />
      </div>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow">
        <Input
          placeholder="Tìm kiếm học viên theo tên hoặc email..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={handleSearchChange}
          className="max-w-md"
          allowClear
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table
          columns={studentColumns}
          dataSource={students}
          rowKey={(record) => record.email} // Assuming enrollment ID is unique
          pagination={false}
          loading={loading}
        />
      </div>

      <div className="mt-6 flex justify-center sm:justify-end">
        {students.length > 0 && (
          <Pagination
            current={page.currentPage}
            total={page.totalElements}
            pageSize={page.pageSize}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["5", "10", "20", "50"]}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} học viên`
            }
          />
        )}
      </div>
      {students.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500 bg-white p-6 rounded-lg shadow-md mt-6">
          Không tìm thấy học viên nào cho khóa học này
          {search && ` với từ khóa "${search}"`}.
        </div>
      )}
    </div>
  )
}

export default CourseStudentPage
