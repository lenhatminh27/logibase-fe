import { useEffect, useState } from "react"
import {
  Input,
  Button,
  Typography,
  Table,
  Pagination,
  message,
  Modal,
  Form,
  Select,
} from "antd"
import { SearchOutlined } from "@ant-design/icons"
import type { CourseResponse } from "../../../shared/types/course" // Your existing Course type
import type { Page } from "../../../shared/types/page"
import { instance } from "../../../config/axios"
import { useNavigate, useLocation } from "react-router-dom"
import type { ColumnsType } from "antd/es/table"
import type { UserResponse } from "../../../shared/types/user"
import type { CreateUserRequest } from "../../../shared/types/user"
import { useForm } from "antd/es/form/Form"
import { getErrorMessage } from "../../../shared/utils/helpers"
import type { AxiosError } from "axios"
import { useSelector } from "react-redux"
import type { RootState } from "../../../redux/store"

const { Title, Text } = Typography

const initPage: Page = {
  currentPage: 1,
  pageSize: 10,
  totalElements: 0,
  totalPages: 1,
}

const initCourseInfo: Partial<CourseResponse> = {
  id: undefined,
  title: "Khóa học",
}

function UserPage() {
  const [search, setSearch] = useState("")
  const [users, setUsers] = useState<UserResponse[]>([])
  const [courseInfo, setCourseInfo] =
    useState<Partial<CourseResponse>>(initCourseInfo)
  const [page, setPage] = useState<Page>(initPage)
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCourse, setLoadingCourse] = useState<boolean>(false)
  const [isShowAddUserModal, setIsShowAddUserModal] = useState<boolean>(false)

  const [form] = Form.useForm()

  const user = useSelector((state: RootState) => state.auth.user)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await instance.get(
        `/api/users?search=${search}&page=${page.currentPage}&size=${page.pageSize}`
      )
      const resData = response.data.data
      if (resData && resData.content && resData.pageCustom) {
        setUsers(resData.content)
        setPage((prevPage) => ({
          ...prevPage,
          totalElements: resData.pageCustom.totalElements,
          totalPages: resData.pageCustom.totalPages,
        }))
      } else {
        setUsers([])
        setPage(initPage)
        console.error("Malformed student enrollment data:", response.data.data)
      }
    } catch (error) {
      message.error("Không thể tải danh sách người dùng.")
      setUsers([])
      setPage(initPage)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveUser = async (email: string) => {
    try {
      await instance.delete(`/api/users`, { data: { email: email } })
      message.success("Xoá người dùng thành công")
      fetchUsers()
    } catch (error) {
      message.error("Xoá người dùng thất bại!")
    }
  }

  const handleCreateUser = async (user: CreateUserRequest) => {
    try {
      await instance.post(`/api/users`, { ...user })
      fetchUsers()
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
    setIsShowAddUserModal(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [page.currentPage, page.pageSize, search])

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

  const onFinish = (values: CreateUserRequest) => {
    handleCreateUser(values)
  }

  const studentColumns: ColumnsType<UserResponse> = [
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
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      render: (_, record: UserResponse) => (
        <Button
          hidden={user?.email === record.email}
          danger
          size="small"
          onClick={() => handleRemoveUser(record.email)}>
          Xoá
        </Button>
      ),
    },
  ]

  if (loadingCourse && !courseInfo?.id) {
    return (
      <div className="p-6 text-center">Đang tải thông tin người dùng...</div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center justify-between w-full">
          <Title level={2} className="!mb-0 leading-tight">
            Quản lý người dùng
          </Title>
          <Button onClick={() => setIsShowAddUserModal(true)} type="primary">
            + Thêm người dùng
          </Button>
          <Modal
            open={isShowAddUserModal}
            onOk={() => form.submit()}
            okText="Tạo"
            onCancel={() => setIsShowAddUserModal(false)}>
            <h1 className="mb-4">Tạo người dùng</h1>
            <Form
              form={form}
              className="!pr-10"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={{ role: "USER" }}
              name="addUser"
              onFinish={onFinish}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email!" }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                ]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="First name"
                name="firstName"
                rules={[{ required: true, message: "Vui lòng nhập!" }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Last name"
                name="lastName"
                rules={[{ required: true, message: "Vui lòng nhập!" }]}>
                <Input />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[{ required: true, message: "Vui lòng nhập!" }]}>
                <Select
                  options={[
                    { value: "ADMIN", label: "ADMIN" },
                    { value: "USER", label: "USER" },
                  ]}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
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
          dataSource={users}
          rowKey={(record) => record.email} // Assuming enrollment ID is unique
          pagination={false}
          loading={loading}
        />
      </div>

      <div className="mt-6 flex justify-center sm:justify-end">
        {users.length > 0 && (
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
      {users.length === 0 && !loading && (
        <div className="text-center py-10 text-gray-500 bg-white p-6 rounded-lg shadow-md mt-6">
          Không tìm thấy học viên nào cho khóa học này
          {search && ` với từ khóa "${search}"`}.
        </div>
      )}
    </div>
  )
}
export default UserPage
