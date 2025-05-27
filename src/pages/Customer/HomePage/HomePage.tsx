import React, { useEffect, useState } from "react"
import { Button, Menu, Modal, Form, Input, Avatar, Carousel, Card } from "antd"
import {
  UserOutlined,
  BookOutlined,
  RightOutlined,
  LeftOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons"
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaGraduationCap,
  FaBriefcase,
  FaSyncAlt,
  FaHeadset,
  FaCertificate,
  FaLaptopCode,
} from "react-icons/fa"
import banner from "../../../assets/banner.jpg"
import { type CourseResponse } from "../../../shared/types/course"
import { instance } from "../../../config/axios"
import { useNavigate } from "react-router-dom"

const HomePage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [courses, setCourse] = useState<CourseResponse[]>([])
  const [form] = Form.useForm()

  const coursesMenu = (
    <Menu>
      <Menu.Item key="all">Tất cả khóa học</Menu.Item>
      <Menu.Item key="xuatkhau">Khóa học Xuất Khẩu</Menu.Item>
      <Menu.Item key="logistics">Khóa học Logistics</Menu.Item>
      <Menu.Item key="incoterms">Incoterms</Menu.Item>
      <Menu.Item key="customs">Thủ tục Hải quan</Menu.Item>
    </Menu>
  )

  const navigate = useNavigate()

  const getCourses = async () => {
    try {
      const response = await instance.get("/api/course")
      setCourse(response.data.data.content)
    } catch (error) {}
  }

  useEffect(() => {
    getCourses()
  }, [])

  const showModal = () => setIsModalVisible(true)
  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log("Form values:", values)
        form.resetFields()
        setIsModalVisible(false)
        Modal.success({
          content: "Đăng ký tư vấn thành công! Chúng tôi sẽ liên hệ bạn sớm.",
        })
      })
      .catch((info) => {
        console.log("Validate Failed:", info)
      })
  }
  const handleCancel = () => setIsModalVisible(false)

  return (
    <div className="font-sans text-gray-800">
      {/* 2. Hero Section */}
      <section
        className="bg-cover bg-center py-20 md:py-32 text-white"
        style={{
          backgroundImage: `url(${banner})`,
        }}>
        <div className="container mx-auto px-4 text-center bg-black bg-opacity-50 p-8 rounded-lg">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            NẮM VỮNG NGHIỆP VỤ XUẤT KHẨU & LOGISTICS TOÀN DIỆN
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Từ A-Z kiến thức thực chiến, cập nhật mới nhất, sẵn sàng cho sự
            nghiệp bứt phá trong ngành xuất khẩu và logistics.
          </p>
          <Button
            onClick={() => navigate("/courses")}
            type="primary"
            size="large"
            className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600">
            XEM CÁC KHÓA HỌC <ArrowRightOutlined />
          </Button>
          <div className="mt-10 grid grid-cols-3 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
            <div className="flex items-center justify-center space-x-2">
              <FaGraduationCap className="text-orange-400 text-xl" />
              <span>Giảng viên đầu ngành</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <FaBriefcase className="text-orange-400 text-xl" />
              <span>Kiến thức thực tế</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <FaHeadset className="text-orange-400 text-xl" />
              <span>Hỗ trợ 24/7</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Tại Sao Chọn Chúng Tôi? */}
      <section id="why-choose-us" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            VÌ SAO HÀNG NGÀN HỌC VIÊN TIN CHỌN CHÚNG TÔI?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <FaGraduationCap className="text-blue-600 text-4xl mb-3" />
                ),
                title: "Giảng Viên Chuyên Gia",
                desc: "Đội ngũ giảng viên là chuyên gia nhiều năm kinh nghiệm thực chiến trong ngành.",
              },
              {
                icon: <FaBriefcase className="text-blue-600 text-4xl mb-3" />,
                title: "Kiến Thức Thực Chiến",
                desc: "Chương trình học tập trung vào case study thực tế, áp dụng ngay vào công việc.",
              },
              {
                icon: <FaSyncAlt className="text-blue-600 text-4xl mb-3" />,
                title: "Nội Dung Cập Nhật",
                desc: "Giáo trình luôn được cập nhật theo những thay đổi mới nhất của luật pháp và thị trường.",
              },
              {
                icon: <FaHeadset className="text-blue-600 text-4xl mb-3" />,
                title: "Hỗ Trợ Tận Tâm",
                desc: "Hỗ trợ học viên nhiệt tình trước, trong và sau khóa học.",
              },
              {
                icon: <FaLaptopCode className="text-blue-600 text-4xl mb-3" />,
                title: "Học Linh Hoạt",
                desc: "Học online mọi lúc mọi nơi, phù hợp với người đi làm.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow">
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Lời Kêu Gọi Hành Động Lớn */}
      <section id="cta" className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            SẴN SÀNG NÂNG TẦM SỰ NGHIỆP TRONG NGÀNH XUẤT KHẨU & LOGISTICS?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Đừng bỏ lỡ cơ hội cập nhật kiến thức và kỹ năng cần thiết để thành
            công. Chọn khóa học phù hợp với bạn ngay hôm nay!
          </p>
          <Button
            type="primary"
            size="large"
            className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600 mr-4"
            onClick={() => {
              navigate("/courses")
            }}>
            TÌM KHÓA HỌC CỦA BẠN
          </Button>
          <Button
            type="default"
            size="large"
            className="bg-white text-blue-600 hover:bg-gray-100"
            onClick={showModal}>
            ĐĂNG KÝ TƯ VẤN MIỄN PHÍ
          </Button>
        </div>
      </section>

      {/* Modal Đăng Ký Tư Vấn */}
      <Modal
        title="Đăng Ký Tư Vấn Miễn Phí"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Gửi Đăng Ký"
        cancelText="Hủy">
        <Form form={form} layout="vertical" name="consultation_form">
          <Form.Item
            name="name"
            label="Họ và Tên"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
            <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số Điện Thoại"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
            ]}>
            <Input prefix={<PhoneOutlined />} placeholder="09xxxxxxxx" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email không hợp lệ!" }]}>
            <Input prefix={<MailOutlined />} placeholder="example@email.com" />
          </Form.Item>
          <Form.Item name="notes" label="Nhu Cầu Tư Vấn (nếu có)">
            <Input.TextArea
              rows={3}
              placeholder="Ví dụ: Tôi muốn tìm hiểu về khóa học Logistics..."
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 9. Footer */}
      <footer id="contact" className="bg-gray-800 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                XNK LOGISTICS MASTER
              </h3>
              <p className="text-sm">
                Nâng tầm kiến thức, vững bước thành công trong ngành Xuất Nhập
                Khẩu và Logistics.
              </p>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaLinkedinIn size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <FaYoutube size={20} />
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Khóa Học
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Logistics Cơ Bản
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Thủ Tục Hải Quan
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Incoterms 2020
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Vận Tải Quốc Tế
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">
                Liên Kết Nhanh
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-white">
                    Về Chúng Tôi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Chính Sách Bảo Mật
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Điều Khoản Sử Dụng
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Câu Hỏi Thường Gặp (FAQ)
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Liên Hệ</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <EnvironmentOutlined className="mr-2 mt-1 text-blue-400" /> Số
                  123, Đường ABC, Quận XYZ, TP. HCM
                </li>
                <li className="flex items-center">
                  <PhoneOutlined className="mr-2 text-blue-400" /> (028) 3800
                  0000
                </li>
                <li className="flex items-center">
                  <MailOutlined className="mr-2 text-blue-400" />{" "}
                  info@xnklogisticsmaster.vn
                </li>
                <li className="flex items-center">
                  <GlobalOutlined className="mr-2 text-blue-400" />{" "}
                  www.xnklogisticsmaster.vn
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm">
            <p>
              © {new Date().getFullYear()} XNK LOGISTICS MASTER. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
