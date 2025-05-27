import { Input, message, Modal, Select, Skeleton } from "antd"
import { instance } from "../../../config/axios"
import { useEffect, useState } from "react"
import type { UserResponse } from "../../../shared/types/user"
import type { Page } from "../../../shared/types/page"
import { getErrorMessage } from "../../../shared/utils/helpers"
import type { AxiosError } from "axios"

interface AddStudentModalProps {
  courseId: number
  isOpen: boolean
  onClose: () => void
}
const initPage: Page = {
  currentPage: 1,
  pageSize: 5,
  totalElements: 0,
  totalPages: 0,
}
function AddStudentModal({ courseId, isOpen, onClose }: AddStudentModalProps) {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [page, setPage] = useState<Page>(initPage)
  const [search, setSearch] = useState<string>("")
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [selectedUser, setSelectedUser] = useState<number | null>(null)

  const handleSubmit = async () => {
    if (!selectedUser) {
      message.error("Vui lòng chọn người dùng!")
    }
    try {
      await instance.post("/api/enrollment", {
        courseId: courseId,
        userId: selectedUser,
      })
      message.success("Thêm học viên thành công!")
      onClose()
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
  }
  const getUsers = async () => {
    const response = await instance.get(
      `/api/users?search=${search}&page=${page.currentPage}&size=7`
    )
    setUsers((prev) => [...prev, ...response.data.data.content])
    setPage((prev) => ({
      ...prev,
      currentPage: prev.currentPage + 1,
      totalPages: response.data.data.pageCustom.totalPages,
    }))
  }
  useEffect(() => {
    getUsers()
  }, [])

  const handlePopupScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    if (target.scrollTop + target.offsetHeight >= target.scrollHeight) {
      console.log("Đã scroll đến cuối danh sách Select")
      if (
        (page.totalPages === 0 || page.currentPage <= page.totalPages) &&
        !isFetching
      ) {
        setIsFetching(true)
        await new Promise((resolve) => {
          setTimeout(async () => {
            await getUsers()
            resolve(null)
          }, 3000)
        })
        setIsFetching(false)
      }
    }
  }

  const options =
    users.length > 0
      ? users.map((user) => ({
          value: user.id,
          label: user.email,
        }))
      : []
  return (
    <Modal
      title={"Thêm học viên"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okText="Thêm"
      cancelText="Hủy">
      <p className="mt-5">Nhập email người dùng</p>
      <Select
        showSearch
        className="!mt-5"
        placeholder="Search to Select"
        optionFilterProp="label"
        onSearch={(value) => setSearch(value)}
        options={options}
        onPopupScroll={handlePopupScroll}
        maxCount={1}
        onSelect={(value) => setSelectedUser(value)}
      />
    </Modal>
  )
}

export default AddStudentModal
