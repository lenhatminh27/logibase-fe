import {
  Form,
  Input,
  message,
  Modal,
  Upload,
  Image,
  type UploadFile,
} from "antd"
import { useEffect, useState } from "react"
import { instance } from "../../../config/axios"
import type { Course } from "../../../shared/types/course"
import type { ErrorResponse } from "../../../shared/types/response"
import type { AxiosError } from "axios"
import { PlusOutlined } from "@ant-design/icons"
import type { RcFile } from "antd/es/upload"

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

function CourseModal({
  course,
  open,
  onClose,
  onSuccess,
}: {
  course?: Course
  open: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState("")
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile)
    }
    setPreviewImage(file.url || (file.preview as string))
    setPreviewOpen(true)
  }

  const handleChange = async ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[]
  }) => {
    setFileList(newFileList)
    const latestFile = newFileList[0]

    if (latestFile && latestFile.originFileObj) {
      const formData = new FormData()
      formData.append("file", latestFile.originFileObj)

      try {
        const response = await instance.post("/api/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        const imageUrl = response.data.data.preSignedURL
        latestFile.url = imageUrl
        setFileList([latestFile])
        form.setFieldValue("thumbnail", imageUrl)
      } catch (error) {
        message.error("Tải ảnh thất bại")
      }
    }
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      setLoading(true)
      const payload = {
        title: values.title,
        description: values.description,
        thumbnail: values.thumbnail,
        price: values.price || 0,
      }
      if (!course) await instance.post("/api/course", payload)
      else await instance.put(`/api/course/${course.id}`, payload)

      form.resetFields()
      onSuccess()
      onClose()
    } catch (error) {
      const errorData: ErrorResponse = (error as AxiosError).response
        ?.data as ErrorResponse
      message.error(errorData?.message || "Lỗi hệ thống")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (course) {
      form.setFieldsValue({
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
      })
      if (course.thumbnail) {
        setFileList([
          {
            uid: "-1",
            name: "thumbnail.png",
            status: "done",
            url: course.thumbnail,
          },
        ])
      }
    } else {
      form.resetFields()
      setFileList([])
    }
  }, [course, form])

  return (
    <Modal
      title={course ? "Chỉnh sửa khoá học" : "Thêm khóa học"}
      open={open}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Hủy">
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên khóa học"
          rules={[
            { required: true, message: "Vui lòng nhập tên khóa học" },
            { max: 255, message: "Tên khóa học không được vượt quá 255 ký tự" },
          ]}>
          <Input
            placeholder="VD: Khóa học React cơ bản"
            maxLength={255}
            showCount
          />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input />
        </Form.Item>

        <Form.Item name="price" label="Giá (VNĐ)">
          <Input type="number" />
        </Form.Item>

        <Form.Item label="Thumbnail">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={() => false}>
            {fileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Form.Item name="thumbnail" noStyle>
            <Input type="hidden" />
          </Form.Item>
        </Form.Item>

        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </Form>
    </Modal>
  )
}

export default CourseModal
