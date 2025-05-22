import { Modal, Typography, Divider } from "antd"
import type { LessonResponse } from "../../../shared/types/lesson"

const { Title, Paragraph, Text } = Typography

function LessonDetailModal({
  open,
  onClose,
  lesson,
}: {
  open: boolean
  onClose?: () => void
  lesson: LessonResponse | null
}) {
  if (!lesson) return null

  return (
    <Modal
      title="Chi tiết bài học"
      open={open}
      onCancel={onClose}
      footer={null}
      width={700}>
      <Typography>
        <Title level={4}>{lesson.title}</Title>

        <Text type="secondary">
          Ngày tạo: {new Date(lesson.createdAt).toLocaleString("vi-VN")}
        </Text>

        <Divider />

        <Title level={5}>Mô tả</Title>
        <Paragraph>{lesson.description || "Không có mô tả."}</Paragraph>

        {lesson.videoUrl && (
          <>
            <Title level={5}>Video</Title>
            <video controls width="350px" className="mx-auto">
              <source src={lesson.videoUrl} type="video/mp4" />
              Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
          </>
        )}

        <Divider />

        <Title level={5}>Bài viết</Title>
        {lesson.article && (
          <div
            className="!overflow-auto max-h-[400px]"
            dangerouslySetInnerHTML={{ __html: lesson.article }}></div>
        )}
      </Typography>
    </Modal>
  )
}

export default LessonDetailModal
