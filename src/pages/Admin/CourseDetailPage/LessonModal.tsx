// src/components/lesson/AddLessonModal.tsx
import React, { useEffect, useState } from "react"
import { Modal, Form, Input, Button, Checkbox, message, Upload } from "antd"
import type {
  CreateLessonRequest,
  LessonResponse,
} from "../../../shared/types/lesson"
import { instance } from "../../../config/axios"
import MyEditor from "../../../components/editor/MyEditor"
import { convertDurationStringFromSeconds } from "../../../shared/utils/helpers"

interface LessonModalProps {
  lesson?: LessonResponse
  isOpen: boolean
  onClose: () => void
  sectionId: number
  onComplete: () => void
}

interface FormInputValues {
  title: string
  description: string
  durationString?: string
  lessonType?: ("video" | "article")[]
  videoUrl?: string | null
  article?: string | null
  trial: boolean
}

const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  isOpen,
  onClose,
  sectionId = -1,
  onComplete,
}) => {
  const [form] = Form.useForm<FormInputValues>()
  const [loading, setLoading] = useState(false)
  const [selectedLessonTypes, setSelectedLessonTypes] = useState<
    ("video" | "article")[]
  >([])
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<number>(0)
  const [article, setArticle] = useState("")

  useEffect(() => {
    if (isOpen) {
      form.resetFields()
      form.setFieldsValue({ trial: false, lessonType: [] })
      setSelectedLessonTypes([])
    }
  }, [isOpen, form, sectionId])

  const convertDurationToSeconds = (durationString?: string): number => {
    if (!durationString) return 0
    const parts = durationString.split(":")
    if (parts.length === 2) {
      const minutes = parseInt(parts[0], 10)
      const seconds = parseInt(parts[1], 10)
      if (!isNaN(minutes) && !isNaN(seconds)) {
        return minutes * 60 + seconds
      }
    }
    return 0
  }

  useEffect(() => {
    if (isOpen) {
      form.resetFields()
      if (lesson) {
        const initialLessonTypes: ("video" | "article")[] = []
        if (lesson.videoUrl) initialLessonTypes.push("video")
        if (lesson.article) initialLessonTypes.push("article")

        form.setFieldsValue({
          title: lesson.title,
          description: lesson.description,
          durationString: convertDurationStringFromSeconds(lesson.duration),
          lessonType: initialLessonTypes,
          // videoUrl: lesson.videoUrl || null,
        })

        setSelectedLessonTypes(initialLessonTypes)
        setVideoUrl(lesson.videoUrl || null)
        setArticle(lesson.article || "")
      } else {
        form.setFieldsValue({ lessonType: [], trial: false })
        setSelectedLessonTypes([])
        setVideoFile(null)
        setVideoUrl(null)
        setArticle("")
      }
    }
  }, [isOpen, form, lesson])

  const handleFormSubmit = async (values: FormInputValues) => {
    setLoading(true)
    try {
      const durationInSeconds = convertDurationToSeconds(values.durationString)

      if (selectedLessonTypes.includes("video") && !videoUrl) {
        message.error("Vui lòng tải lên video!")
        return
      }

      if (
        values.durationString &&
        durationInSeconds === 0 &&
        values.durationString !== "00:00"
      ) {
        form.setFields([
          { name: "durationString", errors: ["Thời lượng không hợp lệ."] },
        ])
        return
      }

      const lessonDataToSave: CreateLessonRequest = {
        title: values.title,
        description: values.description,
        videoUrl: selectedLessonTypes.includes("video") ? videoUrl || null : "",
        article:
          (selectedLessonTypes.includes("article") ? article : null) || null,
        duration: durationInSeconds,
        sectionId,
      }

      if (lesson) {
        await instance.put(`/api/course-lesson`, {
          ...lessonDataToSave,
          lessonId: lesson.id,
        })
        message.success("Cập nhật bài học thành công.")
      } else {
        await instance.post("/api/course-lesson", lessonDataToSave)
        message.success("Tạo bài học thành công.")
      }

      onClose()
      onComplete()
    } catch (error) {
      console.error("Lỗi khi lưu bài học:", error)
      message.error("Lỗi khi lưu bài học")
    } finally {
      setLoading(false)
      setVideoUrl("")
    }
  }

  const handleLessonTypeChange = (types: any[]) => {
    const selectedTypes = types as ("video" | "article")[]
    setSelectedLessonTypes(selectedTypes)

    if (!selectedTypes.includes("video")) {
      setVideoUrl("")
      setVideoFile(null)
      setUploadProgress(0)
    }

    if (!selectedTypes.includes("article")) {
      setArticle("")
    }
  }

  return (
    <Modal
      title={lesson ? "Chỉnh sửa bài học" : "Thêm bài học mới"}
      open={isOpen}
      onOk={() => form.submit()}
      onCancel={onClose}
      confirmLoading={loading}
      okText="Lưu bài học"
      cancelText="Hủy"
      width={700}
      height={700}
      maskClosable={false}
      destroyOnClose>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFormSubmit}
        initialValues={{
          trial: false,
          lessonType: [],
          durationString: "",
          title: "",
          description: "",
          videoUrl: "",
          article: "",
        }}>
        <Form.Item
          name="title"
          label="Tiêu đề bài học"
          rules={[
            { required: true, message: "Vui lòng nhập tiêu đề!" },
            { max: 255, message: "Tên khóa học không được vượt quá 255 ký tự" },
          ]}>
          <Input placeholder="Nhập tiêu đề bài học" maxLength={255} showCount />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả ngắn"
          rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn!" }]}>
          <Input.TextArea rows={3} placeholder="Nhập mô tả ngắn cho bài học" />
        </Form.Item>

        <Form.Item
          name="durationString" // Sử dụng name khác cho input string
          label="Thời lượng (MM:SS)"
          rules={[
            { required: true, message: "Vui lòng nhập thời lượng!" },
            {
              pattern: /^(?:[0-5]?\d):[0-5]\d$/, // Cho phép M hoặc MM
              message: "Định dạng MM:SS không hợp lệ (ví dụ: 05:30 hoặc 5:30)",
            },
          ]}>
          <Input placeholder="Ví dụ: 05:30 cho 5 phút 30 giây" />
        </Form.Item>

        <Form.Item name="lessonType" label="Loại nội dung">
          <Checkbox.Group
            options={[
              { label: "Video", value: "video" },
              { label: "Bài viết (Article)", value: "article" },
            ]}
            onChange={handleLessonTypeChange}
          />
        </Form.Item>

        {selectedLessonTypes.includes("video") && (
          <Form.Item name="videoFile" label="Chọn video từ máy">
            <Upload
              customRequest={async ({ file, onSuccess, onError }) => {
                const formData = new FormData()
                formData.append("file", file as File)

                try {
                  const response = await instance.put(
                    "/api/upload-video",
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                      onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                          (progressEvent.loaded * 100) /
                            (progressEvent.total || 1)
                        )
                        setUploadProgress(percent)
                      },
                    }
                  )

                  const url = response.data?.data.preSignedURL
                  if (url) {
                    setVideoFile(file as File)
                    setVideoUrl(url)
                    message.success("Tải video thành công.")
                    onSuccess?.({}, file)
                  } else {
                    throw new Error("Không nhận được URL từ server.")
                  }
                } catch (error) {
                  console.error("Upload error:", error)
                  message.error("Tải video thất bại.")
                  onError?.(error as Error)
                }
              }}
              showUploadList={false}
              maxCount={1}
              accept="video/*">
              <Button>Chọn file video</Button>
            </Upload>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ marginTop: 10 }}>
                <div
                  style={{
                    width: "100%",
                    background: "#f0f0f0",
                    height: 8,
                    borderRadius: 4,
                  }}>
                  <div
                    style={{
                      width: `${uploadProgress}%`,
                      height: "100%",
                      background: "#1890ff",
                      borderRadius: 4,
                      transition: "width 0.3s",
                    }}
                  />
                </div>
                <div style={{ marginTop: 4, textAlign: "right", fontSize: 12 }}>
                  {uploadProgress}%
                </div>
              </div>
            )}

            {videoUrl && (
              <div className="my-10">
                <video
                  src={videoUrl}
                  controls
                  width="350px"
                  style={{ borderRadius: 8, border: "1px solid #ddd" }}
                />
              </div>
            )}
          </Form.Item>
        )}

        {selectedLessonTypes.includes("article") && (
          <MyEditor value={article} setValue={(value) => setArticle(value)} />
        )}
      </Form>
    </Modal>
  )
}

export default LessonModal
