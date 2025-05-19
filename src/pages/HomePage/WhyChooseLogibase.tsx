// src/components/WhyChooseLogibase.tsx
import React from "react"
import { Typography, Row, Col } from "antd"
import {
  BookOutlined,
  TeamOutlined,
  LineChartOutlined,
  SolutionOutlined,
  GlobalOutlined,
  IdcardOutlined,
} from "@ant-design/icons"

const { Title, Paragraph, Text } = Typography

interface ReasonItemProps {
  icon: React.ReactNode
  iconColorClass: string
  title: string
  description?: string // Making description optional as some items go straight to sub-points
  subPoints?: string[]
}

const reasonsData: ReasonItemProps[] = [
  {
    icon: <BookOutlined className="text-white text-2xl" />,
    iconColorClass: "bg-blue-500",
    title: "LÝ THUYẾT",
    description:
      "LOGIBASE cung cấp tài liệu giúp học viên chủ động nghiên cứu, nâng cao kiến thức:",
    subPoints: [
      "Bài giảng cô đọng, ngắn gọn và dễ hiểu.",
      "Học viên còn được nâng cao các kiến thức như: tìm mua hàng, vận chuyển, thanh toán quốc tế,...", // Assuming full sentence
    ],
  },
  {
    icon: <TeamOutlined className="text-white text-2xl" />,
    iconColorClass: "bg-green-500",
    title: "TƯƠNG TÁC",
    description:
      "Tương tác trực tiếp với giảng viên trên lớp, giảng viên giải đáp các thắc mắc trong suốt buổi giảng dạy:",
    subPoints: [
      "Hỗ trợ học viên qua điện thoại, SMS, Fanpage.",
      "Cập nhật văn bản mới nhất qua hệ thống hỗ trợ học viên.", // Assuming full sentence
    ],
  },
  {
    icon: <LineChartOutlined className="text-white text-2xl" />,
    iconColorClass: "bg-yellow-500",
    title: "LUYỆN TẬP",
    description: "Làm bài tập thực hành ngay trên lớp học:",
    subPoints: [
      "Qua điện thoại, SMS, Fanpage.", // This seems to be a repeated point or a general support method. I'll keep it as per the image.
      "Trong thời gian thực tập trong và sau khóa học.",
    ],
  },
  {
    icon: <SolutionOutlined className="text-white text-2xl" />,
    iconColorClass: "bg-orange-500", // Using a distinct orange
    title: "THI / KIỂM TRA",
    subPoints: [
      "Làm bài kiểm tra và phỏng vấn sau khóa học.",
      "Đánh giá năng lực học viên ngay sau khóa học.",
    ],
  },
  {
    icon: <GlobalOutlined className="text-white text-2xl" />,
    iconColorClass: "bg-amber-600", // Using a darker amber/brownish orange
    title: "HOẠT ĐỘNG NGOẠI KHÓA",
    subPoints: [
      "Cơ hội được thực tập tại các Chi cục Hải quan, các Công ty xuất nhập khẩu lớn.",
    ],
  },
  {
    icon: <IdcardOutlined className="text-white text-2xl" />,
    iconColorClass: "bg-teal-500",
    title: "CHỨNG CHỈ",
    subPoints: [
      "Các chứng chỉ được cấp bởi Masimex có giá trị cao khi xin việc tại các doanh nghiệp lớn tại Việt Nam.",
    ],
  },
]

const ReasonItemCard: React.FC<ReasonItemProps> = ({
  icon,
  iconColorClass,
  title,
  description,
  subPoints,
}) => (
  <div className="flex items-start space-x-4 p-4">
    <div
      className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColorClass} flex-shrink-0 mt-1`}>
      {icon}
    </div>
    <div>
      <Title level={5} className="!text-gray-800 !font-semibold !mb-1">
        {title}
      </Title>
      {description && (
        <Paragraph className="text-gray-600 text-sm mb-2">
          {description}
        </Paragraph>
      )}
      {subPoints && subPoints.length > 0 && (
        <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
          {subPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}
    </div>
  </div>
)

const WhyChooseLogibase: React.FC = () => {
  return (
    <div className=" mx-auto">
      <Title
        level={2}
        className="text-center !text-3xl !font-bold !text-gray-800 mb-4">
        LÝ DO BẠN NÊN CHỌN LOGIBASE
      </Title>
      <Paragraph className="text-center text-gray-600 text-md max-w-3xl mx-auto mb-4">
        LOGIBASE quyết tâm trở thành Trung tâm Đào tạo và Cung ứng nhân sự Xuất
        nhập khẩu uy tín.
      </Paragraph>
      <Paragraph className="text-center text-gray-700 font-semibold text-md max-w-3xl mx-auto mb-10">
        Chương trình đào tạo chuẩn bám sát vào thị trường XUẤT NHẬP KHẨU trong
        nước:
      </Paragraph>

      <Row gutter={[16, 16]}>
        {" "}
        {/* Responsive gutter for spacing */}
        {reasonsData.map((reason, index) => (
          <Col key={index} xs={24} md={12} lg={8}>
            {" "}
            {/* Full width on small, half on medium, third on large */}
            <ReasonItemCard {...reason} />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default WhyChooseLogibase
