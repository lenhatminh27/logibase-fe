import {Avatar, Button, Drawer, Dropdown, Form, Input, List, type MenuProps, message, Modal, Spin, Tooltip,} from "antd"
import React, {useEffect, useState} from "react"
import {BiEdit, BiSend, BiTrash} from "react-icons/bi"
import {type CommentResponse} from "../../../shared/types/comment"
import {getErrorMessage} from "../../../shared/utils/helpers"
import type {AxiosError} from "axios"
import {instance} from "../../../config/axios"
import {EllipsisOutlined, UserOutlined} from "@ant-design/icons"
import {useSelector} from "react-redux"
import type {RootState} from "../../../redux/store"

interface CommentSiderProps {
  showDrawer: () => void
  onClose: () => void
  open: boolean
  lessonId: number
  className?: string
}


function CommentSider({
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
  className,
  open,
 // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
  showDrawer,
  lessonId,
  onClose,
}: CommentSiderProps) {
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const getComments = async () => {
    setIsLoading(true)
    try {
      const response = await instance.get(
        `/api/lesson-comment/lesson/${lessonId}`
      )
      console.log(response.data.data)
      setComments(response.data.data)
      setIsLoading(false)
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
  }

  const onReplySubmit = async (commentId: number, content: string) => {
    try {
      await instance.post(`/api/lesson-comment`, {
        lessonId: lessonId,
        parentId: commentId,
        content: content,
      })
      message.success("Phản hồi thành công!")
      getComments()
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
  }

  const handleFormSubmit = async (values: { content: string }) => {
    try {
      await instance.post(`/api/lesson-comment`, {
        lessonId: lessonId,
        content: values.content,
      })
      message.success("Tạo bình luận thành công!")
      getComments()
    } catch (error) {
      message.error(getErrorMessage(error as AxiosError))
    }
  }

  useEffect(() => {
    getComments()
  }, [])

  return (
    <div>
      <Drawer
        width={600}
        title="Bình luận"
        closable={{ "aria-label": "Close Button" }}
        onClose={onClose}
        open={open}>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen bg-gray-100">
            <Spin size="large" tip="Đang tải nội dung khóa học..." />
          </div>
        ) : (
          <>
            <Form layout="vertical" onFinish={handleFormSubmit}>
              <Form.Item
                name="content"
                rules={[{ required: true, message: "Không thể để trống!" }]}
                className="mb-2">
                <Input.TextArea
                  rows={2}
                  placeholder={`Bình luận tại đây...`}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  size="small"
                  htmlType="submit"
                  icon={<BiSend size={14} className="mr-1" />}>
                  Gửi bình luận
                </Button>
              </Form.Item>
            </Form>
            <div className="mr-5">
              {comments.map((comment) => (
                <CommentItem
                  comment={comment}
                  isChild={false}
                  onReplySubmit={onReplySubmit}
                  onMutateSuccess={() => getComments()}
                />
              ))}
            </div>
          </>
        )}
      </Drawer>
    </div>
  )
}

interface CommentItemProps {
  comment: CommentResponse
  isChild: boolean
  parentId?: number
  onReplySubmit: (commentId: number, content: string) => void
  onUpdateRequired?: () => void
  onMutateSuccess: () => void
}

function CommentItem({
  comment,
  isChild,
  onReplySubmit,
  parentId,
  onUpdateRequired,
  onMutateSuccess,
}: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replySubmitting, setReplySubmitting] = useState(false)
  const [replyForm] = Form.useForm()

  const [isEditing, setIsEditing] = useState(false)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [editForm] = Form.useForm()

  const [isLocallyDeleted, setIsLocallyDeleted] = useState(false)
  const [deleteModalLoading, setDeleteModalLoading] = useState(false)

  const user = useSelector((state: RootState) => state.auth.user)

  const handleEditCommentAPI = async (commentId: number, content: string) => {
    setEditSubmitting(true)
    try {
      await instance.put(`/api/lesson-comment`, {
        commentId: commentId,
        content: content,
      })
      message.success("Sửa bình luận thành công!")
      onMutateSuccess()
    } catch (error) {
      message.error(getErrorMessage(error as any))
    } finally {
      setEditSubmitting(false)
    }
  }

  const handleEditFormSubmit = (values: { editText: string }) => {
    handleEditCommentAPI(comment.id, values.editText)
  }

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc chắn muốn xoá bình luận này không?",
      okText: "Xoá",
      cancelText: "Huỷ",
      okButtonProps: { loading: deleteModalLoading },
      onOk: async () => {
        setDeleteModalLoading(true)
        try {
          await instance.delete(`/api/lesson-comment/${id}`)
          message.success("Xoá bình luận thành công!")
          onMutateSuccess()
        } catch (error) {
          message.error(getErrorMessage(error as any))
          setDeleteModalLoading(false)
        }
      },
      onCancel: () => {
        setDeleteModalLoading(false)
      },
    })
  }

  // Handle clicks on the dropdown menu items
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const key = e.key
    if (key === "1") {
      // Edit action
      setIsEditing(true)
      editForm.setFieldsValue({ editText: comment.content })
      if (showReplyForm) setShowReplyForm(false) // Close reply form if open
    } else if (key === "2") {
      // Delete action
      confirmDelete(comment.id)
    }
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="flex">
          <BiEdit className="mt-1 mr-2" />
          Sửa
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex text-red-500">
          <BiTrash className="mt-1 mr-2" />
          Xoá
        </div>
      ),
    },
  ]
  const handleReplyFormSubmit = async (values: { replyText: string }) => {
    setReplySubmitting(true)
    try {
      if (isChild && parentId) {
        onReplySubmit(parentId, values.replyText)
      } else {
        onReplySubmit(comment.id, values.replyText)
      }
      replyForm.resetFields()
      setShowReplyForm(false)
    } catch (error) {
      message.error("Lỗi khi gửi trả lời.")
      console.error("Error during reply submission:", error)
    } finally {
      setReplySubmitting(false)
    }
  }

  const commentActions = [
    <Button
      type="link"
      size="small"
      className="p-0 h-auto"
      key={`reply-action-${comment.id}`}
      onClick={() => {
        setShowReplyForm(!showReplyForm)
        if (isEditing) setIsEditing(false)
      }}
      disabled={isEditing}>
      {showReplyForm ? "Hủy" : "Trả lời"}
    </Button>,
  ]

  if (isLocallyDeleted) {
    return null
  }

  return (
    <div className={`py-2 ${isChild ? "bg-gray-50 rounded-md mt-2 mb-2" : ""}`}>
      <List.Item
        actions={isEditing ? [] : commentActions}
        className={`!p-0 list-none ${
          isChild ? "!border-l-2 !border-blue-200 !pl-3" : ""
        }`}>
        <List.Item.Meta
          avatar={
            <div className="flex items-center">
              <Avatar icon={<UserOutlined />} />{" "}
              <span className="text-[16px] ml-2 font-semibold">
                {comment.user.fullName}
              </span>
            </div>
          }
          description={
            <div className="flex justify-between items-start">
              <div className="flex-grow mr-2">
                {" "}
                {isEditing ? (
                  <Form
                    form={editForm}
                    layout="vertical"
                    onFinish={handleEditFormSubmit}
                    className="mt-3">
                    <Form.Item
                      name="editText"
                      rules={[
                        { required: true, message: "Không thể để trống!" },
                        { max: 500, message: "Không được nhập quá 500 ký tự!" }, // Corrected message
                      ]}
                      className="mb-2">
                      <Input.TextArea
                        showCount
                        maxLength={500}
                        rows={2}
                        autoSize={{ minRows: 1, maxRows: 4 }}
                        disabled={editSubmitting}
                      />
                    </Form.Item>
                    <Form.Item className="mb-0">
                      <Button
                        type="primary"
                        size="small"
                        htmlType="submit"
                        loading={editSubmitting}
                        className="mr-2">
                        Lưu
                      </Button>
                      <Button
                        size="small"
                        onClick={() => setIsEditing(false)}
                        disabled={editSubmitting}>
                        Hủy
                      </Button>
                    </Form.Item>
                  </Form>
                ) : (
                  <>
                    <p className="mb-1 text-gray-800 mt-3 break-words">
                      {comment.content}
                    </p>
                    <Tooltip
                      title={new Date(comment.createdAt).toLocaleString(
                        "vi-VN"
                      )} // Use toLocaleString for date and time
                    >
                      <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </span>
                    </Tooltip>
                  </>
                )}
              </div>
              {!isEditing &&
                (user?.email === comment.user.email ||
                  user?.role === "ADMIN") && ( // Hide dropdown when editing
                  <Dropdown
                    placement="topLeft"
                    menu={{ items: menuItems, onClick: handleMenuClick }}>
                    <Button
                      type="text"
                      shape="circle"
                      icon={<EllipsisOutlined style={{ fontSize: "20px" }} />}
                    />
                  </Dropdown>
                )}
            </div>
          }
        />
      </List.Item>

      {showReplyForm &&
        !isEditing && ( // Hide reply form when editing
          <div className={`mt-2 pl-[48px]`}>
            <Form
              form={replyForm}
              layout="vertical"
              onFinish={handleReplyFormSubmit}>
              <Form.Item
                name="replyText"
                rules={[
                  { required: true, message: "Không thể để trống!" },
                  { max: 500, message: "Không được nhập quá 500 ký tự!" },
                ]}
                className="mb-2">
                <Input.TextArea
                  showCount
                  maxLength={500}
                  rows={2}
                  placeholder={`Trả lời ${comment.user.fullName}...`}
                  autoSize={{ minRows: 1, maxRows: 4 }}
                  disabled={replySubmitting}
                />
              </Form.Item>
              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  size="small"
                  htmlType="submit"
                  loading={replySubmitting}
                  icon={<BiSend size={14} className="mr-1" />}>
                  Gửi trả lời
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}

      {comment.childrenComments && comment.childrenComments.length > 0 && (
        <div className="mt-2 pl-6">
          {comment.childrenComments.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
              isChild={true}
              parentId={comment.id}
              onUpdateRequired={onUpdateRequired}
              onMutateSuccess={onMutateSuccess}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentSider
