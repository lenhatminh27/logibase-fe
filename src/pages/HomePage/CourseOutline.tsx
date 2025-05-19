// src/components/CourseOutline.tsx
import React from "react"
import { Typography } from "antd"

const { Title, Paragraph } = Typography

interface LessonItem {
  id: string
  title: string
  description?: string
  subItems?: string[]
}

const courseData: LessonItem[] = [
  {
    id: "bai1",
    title: "Bài 1: Giới thiệu về Xuất Nhập Khẩu",
    subItems: [
      "Giới thiệu về XNK và các hoạt động XNK trong thực tế:",
      "Sơ đồ hoạt động XNK trong thực tế",
      "Các hình thức hoạt động xuất nhập khẩu",
      "Các quy định điều chỉnh hoạt động XNK:",
      "Giới thiệu các mặt hàng XNK chủ yếu tại thị trường Việt Nam",
    ],
  },
  {
    id: "bai2",
    title: "Bài 2: Giới thiệu về hoạt động Logistics",
    subItems: [
      "Khái niệm Logistics",
      "Các hoạt động Logistics thông thường và các hoạt động Logistics trong XNK",
      "Ý nghĩa hoạt động Logistics",
      "Các thuật ngữ chuyên ngành",
      "Tìm hiểu các thiết bị có trong ngành & các phương thức giao nhận.",
    ],
  },
  {
    id: "bai3",
    title: "Bài 3: Incoterms 2020",
  },
  {
    id: "bai4",
    title: "Bài 4: Thanh Toán và Giao Dịch Quốc Tế",
    subItems: [
      "Lựa chọn phương thức nào để thanh toán (giới thiệu về các phương thức thanh toán TT, LC, DA, DP,...)",
      "Lựa chọn ngân hàng để thực hiện giao dịch (những điều cần lưu ý khi lựa chọn ngân hàng phù hợp)",
      "Các thông tin cần thiết khi chuyển, nhận tiền",
      "Rủi ro trong thanh toán giao dịch quốc tế (Case + Solution)",
    ],
  },
  {
    id: "bai5",
    title: "Bài 5: Chứng Từ trong Xuất Nhập Khẩu",
    description:
      "Tìm hiểu bản chất của từng loại chứng từ (cách đọc thông tin và cách chuẩn bị một số chứng từ)",
  },
  {
    id: "bai6",
    title: "Bài 6: Chứng Từ Logistics Trong Xuất Nhập Khẩu",
    description:
      "Tìm hiểu bản chất của từng loại chứng từ (cách đọc thông tin và cách chuẩn bị một số chứng từ) (Booking, SLVGM, Bill of Lading, Pre-Alert, Arrival Notice (AN), Manifest, Delivery Order,...)",
  },
  {
    id: "bai7",
    title: "Bài 7: Quy Trình Logistics Xuất Khẩu",
  },
  {
    id: "bai8",
    title: "Bài 8: HScode và Biểu Thuế XNK",
  },
  {
    id: "bai9",
    title:
      "Bài 9: Hải Quan Việt Nam + Thủ tục HQ Xuất Khẩu và Các Nghiệp Vụ Tại Cảng",
    subItems: [
      "Tìm hiểu các văn bản pháp lý",
      "Tìm hiểu cơ quan HQ + chức năng",
      "Thủ tục HQ Xuất khẩu",
    ],
  },
  {
    id: "bai10",
    title: "Bài 10: Quy Trình Logistics Nhập Khẩu",
  },
  {
    id: "bai11",
    title: "Bài 11: Thủ Tục Hải Quan Nhập Khẩu",
  },
  {
    id: "bai12",
    title: "Bài 12: Hướng Dẫn Truyền Tờ Khai HQ Xuất Khẩu cơ bản",
  },
  {
    id: "bai13",
    title: "Bài 13: Hướng Dẫn Truyền Tờ Khai HQ Nhập Khẩu cơ bản",
  },
  {
    id: "bai14",
    title: "Bài 14: Tổng Hợp Các Loại Chi Phí XNK và Logistics",
  },
]

const CourseOutline: React.FC = () => {
  return (
    <div className="bg-white mx-auto mt-10">
      {" "}
      <Title
        level={2}
        className="!text-2xl md:!text-3xl !font-bold !text-blue-600 text-center mb-2">
        Nội Dung Khóa Học Xuất Nhập Khẩu & Logistics Tổng hợp
      </Title>
      <div className="flex justify-center mb-6">
        <div className="h-1 w-24 bg-yellow-400"></div>{" "}
      </div>
      <div className="space-y-6">
        {courseData.map((lesson) => (
          <div key={lesson.id} className="mb-4">
            <Title
              level={4}
              className="!text-red-600 !font-bold !text-base md:!text-lg">
              {lesson.title}
            </Title>
            {lesson.description && (
              <Paragraph className="text-gray-700 mt-1 md:text-base">
                {lesson.description}
              </Paragraph>
            )}
            {lesson.subItems && lesson.subItems.length > 0 && (
              <ol className="list-disc list-inside pl-4 mt-2 space-y-1 text-gray-700 md:text-base">
                {lesson.subItems.map((item, index) => (
                  <li className="list-decimal" key={index}>
                    {item}
                  </li>
                ))}
              </ol>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseOutline
