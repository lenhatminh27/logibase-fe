import { useEffect, useState } from "react"
import {
  Input,
  Button,
  Typography,
  Table,
  Dropdown,
  Pagination,
  Switch,
  message,
  Modal,
} from "antd"
import {
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons"
import type { CourseResponse } from "../../../shared/types/course"
import { instance } from "../../../config/axios"
import type { Page } from "../../../shared/types/page"
import { useNavigate } from "react-router-dom"
import type { ColumnsType } from "antd/es/table"
import CourseModal from "./CourseModal"

const { Title, Text } = Typography

interface CourseListResponse {
  content: CourseResponse[]
  pageCustom: Page
}

const initPage: Page = {
  currentPage: 1, // Changed from 2 to 1 for a more common initial page
  pageSize: 10,
  totalElements: 0,
  totalPages: 10,
}

function CourseList() {
  const [search, setSearch] = useState("") // Initial search can be empty
  const [courses, setCourses] = useState<CourseResponse[]>([])
  const [page, setPage] = useState<Page>(initPage)
  const [loading, setLoading] = useState<boolean>(false)
  const [isShowCourseModal, setIsShowCourseModal] = useState<number | null>(
    null
  )

  const navigate = useNavigate()

  const columns: ColumnsType<CourseResponse> = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_: any, record: CourseResponse) => (
        <Switch
          onChange={() => handleChangeStatus(record.id, record.status)}
          checkedChildren={record.status?.toUpperCase()}
          unCheckedChildren={record.status?.toUpperCase()}
          checked={record.status?.toLowerCase() === "public"}
        />
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt?: Date) =>
        createdAt ? new Date(createdAt).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_: any, record: CourseResponse) => (
        <>
          <Dropdown
            menu={{
              items: [
                {
                  label: "Xem bài học",
                  key: "view",
                  onClick: () => navigate(`/admin/courses/${record.id}`),
                },
                {
                  label: "Chỉnh sửa",
                  key: "edit",
                  onClick: () => setIsShowCourseModal(record.id),
                },
                {
                  label: "Xem học viên",
                  key: "students",
                  onClick: () =>
                    navigate(`/admin/courses/${record.id}/students`),
                },
                {
                  label: "Xoá",
                  key: "delete",
                  danger: true,
                  onClick: () => handleDeleteCourse(record.id),
                },
              ],
            }}
            trigger={["click"]}>
            <Button
              className="!rounded-full p-2"
              type="text"
              icon={<EllipsisOutlined className="!text-[20px] !mx-auto" />}
            />
          </Dropdown>
          <CourseModal
            key={record.id}
            open={isShowCourseModal === record.id}
            course={record}
            onClose={() => setIsShowCourseModal(null)}
            onSuccess={() => {
              message.success("Cập nhật khoá học thành công")
              getCourseList()
            }}
          />
        </>
      ),
    },
  ]

  const getCourseList = async () => {
    setLoading(true)
    try {
      const response = await instance.get(
        `/api/course?search=${search}&page=${page.currentPage}&size=${page.pageSize}`
      )
      const resData: CourseListResponse = response.data.data

      if (resData && resData.content && resData.pageCustom) {
        setCourses(resData.content)
        setPage((prevPage) => ({
          ...prevPage,
          totalElements: resData.pageCustom.totalElements,
          totalPages: resData.pageCustom.totalPages,
        }))
      } else {
        setCourses([])
        setPage((prevPage) => ({
          ...prevPage,
          totalElements: 0,
          totalPages: 0,
        }))
        console.error("Malformed data:", response.data)
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error)
      message.error("Không thể tải danh sách khóa học.")
    } finally {
      setLoading(false)
    }
  }

  const handleChangeStatus = async (
    courseId: number,
    currentStatus: string
  ) => {
    try {
      const isCurrentlyDraft = currentStatus.toLowerCase() === "draft"
      const url = isCurrentlyDraft
        ? `/api/course/toPublic/${courseId}`
        : `/api/course/toDraft/${courseId}`

      await instance.put(url)
      message.success(
        isCurrentlyDraft
          ? "Public khoá học thành công"
          : "Chuyển khoá học về bản nháp thành công"
      )
      getCourseList() // Refresh list
    } catch (error) {
      console.error("Failed to change status:", error)
      message.error("Thay đổi trạng thái thất bại.")
    }
  }

  useEffect(() => {
    getCourseList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.currentPage, page.pageSize, search])

  const handleDeleteCourse = async (courseId: number) => {
    console.log("Delete course:", courseId)
    // Implement actual delete logic with confirmation
    // Example:
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xoá khoá học này?",
      onOk: async () => {
        try {
          await instance.delete(`/api/course/${courseId}`)
          message.success("Xoá khoá học thành công")
          // Adjust pagination if the last item on a page is deleted
          if (courses.length === 1 && page.currentPage > 1) {
            setPage((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }))
          } else {
            getCourseList()
          }
        } catch (error) {
          console.error("Failed to delete course:", error)
          message.error("Xoá khoá học thất bại.")
        }
      },
    })
  }

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage((prev) => ({
      ...prev,
      currentPage: newPage,
      pageSize: newPageSize || prev.pageSize,
    }))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    // Optionally, reset to page 1 on new search to avoid being on a non-existent page
    setPage((prev) => ({ ...prev, currentPage: 1 }))
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <Title level={2} className="!mb-1">
            Danh sách khóa học
          </Title>
          <Text type="secondary">Quản lý các khóa học của bạn</Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => setIsShowCourseModal(-1)}>
          Thêm khóa học mới
        </Button>
      </div>
      <CourseModal
        key={"add-course"}
        open={isShowCourseModal === -1}
        onClose={() => setIsShowCourseModal(null)}
        onSuccess={() => {
          message.success("Thêm khoá học thành công!")
          getCourseList()
        }}
      />

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white rounded-lg shadow">
        <Input
          placeholder="Tìm kiếm khóa học..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={search}
          onChange={handleSearchChange}
          className="max-w-md"
          allowClear
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          pagination={false}
          loading={loading}
          className="custom-courses-table"
        />
      </div>

      <div className="mt-6 flex justify-center sm:justify-end">
        <Pagination
          current={page.currentPage}
          total={page.totalElements}
          pageSize={page.pageSize}
          onChange={handlePageChange}
          showSizeChanger
          pageSizeOptions={["5", "10", "20", "50"]}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`
          }
        />
      </div>
    </div>
  )
}

export default CourseList
