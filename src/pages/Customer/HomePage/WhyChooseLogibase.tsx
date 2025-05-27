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

const { Title, Paragraph } = Typography // Removed Text as it wasn't used

interface ReasonItemProps {
  icon: React.ReactNode
  iconColorClass: string
  title: string
  description?: string
  subPoints?: string[]
}

const reasonsData: ReasonItemProps[] = [
  // ... (reasonsData remains the same)
  {
    icon: <BookOutlined className="text-white text-3xl" />, // Slightly larger icon
    iconColorClass: "bg-blue-500",
    title: "LÝ THUYẾT",
    description:
      "LOGIBASE cung cấp tài liệu giúp học viên chủ động nghiên cứu, nâng cao kiến thức:",
    subPoints: [
      "Bài giảng cô đọng, ngắn gọn và dễ hiểu.",
      "Học viên còn được nâng cao các kiến thức như: tìm mua hàng, vận chuyển, thanh toán quốc tế,...",
    ],
  },
  {
    icon: <TeamOutlined className="text-white text-3xl" />,
    iconColorClass: "bg-green-500",
    title: "TƯƠNG TÁC",
    description:
      "Tương tác trực tiếp với giảng viên trên lớp, giảng viên giải đáp các thắc mắc trong suốt buổi giảng dạy:",
    subPoints: [
      "Hỗ trợ học viên qua điện thoại, SMS, Fanpage.",
      "Cập nhật văn bản mới nhất qua hệ thống hỗ trợ học viên.",
    ],
  },
  {
    icon: <LineChartOutlined className="text-white text-3xl" />,
    iconColorClass: "bg-yellow-500",
    title: "LUYỆN TẬP",
    description: "Làm bài tập thực hành ngay trên lớp học:",
    subPoints: [
      "Qua điện thoại, SMS, Fanpage.",
      "Trong thời gian thực tập trong và sau khóa học.",
    ],
  },
  {
    icon: <SolutionOutlined className="text-white text-3xl" />,
    iconColorClass: "bg-orange-500",
    title: "THI / KIỂM TRA",
    subPoints: [
      "Làm bài kiểm tra và phỏng vấn sau khóa học.",
      "Đánh giá năng lực học viên ngay sau khóa học.",
    ],
  },
  {
    icon: <GlobalOutlined className="text-white text-3xl" />,
    iconColorClass: "bg-amber-600",
    title: "HOẠT ĐỘNG NGOẠI KHÓA",
    subPoints: [
      "Cơ hội được thực tập tại các Chi cục Hải quan, các Công ty xuất nhập khẩu lớn.",
    ],
  },
  {
    icon: <IdcardOutlined className="text-white text-3xl" />,
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
  <div className="flex items-start space-x-4 p-5 h-full">
    {" "}
    {/* Ensure full height for consistent card appearance */}
    <div
      className={`w-16 h-16 rounded-full flex items-center justify-center ${iconColorClass} flex-shrink-0 mt-1 shadow-lg`}>
      {" "}
      {/* Larger icon container, stronger shadow */}
      {icon}
    </div>
    <div>
      <Title level={5} className="!text-gray-900 !font-bold !mb-2 !text-xl">
        {" "}
        {/* Bolder, larger, and darker title */}
        {title}
      </Title>
      {description && (
        <Paragraph className="text-gray-700 text-base mb-2.5 leading-relaxed">
          {description}
        </Paragraph>
      )}
      {subPoints && subPoints.length > 0 && (
        <ul className="list-disc list-inside text-gray-600 text-base space-y-1.5 leading-relaxed">
          {" "}
          {/* Improved spacing and line height */}
          {subPoints.map((point, index) => (
            <li key={index} className="text-gray-700">
              {point}
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
)

const WhyChooseLogibase: React.FC = () => {
  return (
    <div className="mx-auto py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      {" "}
      {/* Added vertical and horizontal padding */}
      <Title
        level={2}
        className="text-center !text-3xl md:!text-4xl !font-extrabold !text-blue-700 mb-5">
        {" "}
        {/* Consistent blue, bolder */}
        LÝ DO BẠN NÊN CHỌN LOGIBASE
      </Title>
      <Paragraph className="text-center text-gray-600 text-base md:text-lg max-w-3xl mx-auto mb-5 leading-relaxed">
        LOGIBASE quyết tâm trở thành Trung tâm Đào tạo và Cung ứng nhân sự Xuất
        nhập khẩu uy tín.
      </Paragraph>
      <Paragraph className="text-center text-gray-700 font-semibold text-base md:text-lg max-w-3xl mx-auto mb-12 md:mb-16 leading-relaxed">
        Chương trình đào tạo chuẩn bám sát vào thị trường XUẤT NHẬP KHẨU trong
        nước:
      </Paragraph>
      <Row gutter={[32, 32]}>
        {" "}
        {/* Increased gutter for more spacing between cards */}
        {reasonsData.map((reason, index) => (
          <Col key={index} xs={24} md={12} lg={8} className="flex">
            {" "}
            {/* Added flex to Col for h-full on child */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ease-in-out w-full">
              {" "}
              {/* Card container */}
              <ReasonItemCard {...reason} />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default WhyChooseLogibase
