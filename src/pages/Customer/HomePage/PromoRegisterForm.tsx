import React from "react"
import { Form, Input, Button, Typography, Select, Row, Col } from "antd"
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ReadOutlined,
} from "@ant-design/icons"

const { Title, Paragraph } = Typography
const { Option } = Select

const PromoRegisterForm: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log("Form values:", values)
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <Row gutter={[0, 0]} className="shadow-xl rounded-xl overflow-hidden">
        {/* Left Column - Promotional Text */}
        <Col
          xs={24}
          md={12}
          className="bg-teal-700 p-8 md:p-12 flex flex-col justify-center items-center text-center">
          <Title
            level={2}
            className="!text-white !font-extrabold !mb-5 !text-3xl md:!text-4xl">
            ĐĂNG KÝ ƯU ĐÃI
          </Title>
          <Paragraph className="!text-amber-300 !text-xl !font-semibold !mb-3">
            <span className="text-white font-bold text-2xl">GIẢM GIÁ 30%</span>{" "}
            <br className="sm:hidden" /> CHO HỌC VIÊN MỚI
          </Paragraph>
          <div className="w-24 h-1.5 bg-amber-400 my-6 rounded-full"></div>
          <Title
            level={3}
            className="!text-white !font-bold !text-2xl md:!text-3xl">
            CHỈ CÒN VÀI SUẤT!
          </Title>
        </Col>

        {/* Right Column - Form */}
        <Col xs={24} md={12} className="bg-white p-8 md:p-12">
          <Title
            level={3}
            className="text-center !font-bold !text-teal-800 mb-10 !text-2xl md:!text-3xl">
            THÔNG TIN LIÊN HỆ
          </Title>
          <Form
            form={form}
            name="promo_register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
            size="large">
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              className="!mb-6">
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Họ và tên"
                className="!rounded-md focus:!border-teal-500 focus:!shadow-outline-teal" // Custom focus
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ email!" },
                { type: "email", message: "Địa chỉ email không hợp lệ!" },
              ]}
              className="!mb-6">
              <Input
                prefix={
                  <MailOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Địa chỉ email"
                className="!rounded-md focus:!border-teal-500 focus:!shadow-outline-teal"
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
              className="!mb-6">
              <Input
                prefix={
                  <PhoneOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Số điện thoại"
                className="!rounded-md focus:!border-teal-500 focus:!shadow-outline-teal"
              />
            </Form.Item>

            <Form.Item
              name="courseSelection"
              rules={[{ required: true, message: "Vui lòng chọn lớp!" }]}
              className="!mb-8">
              <Select
                placeholder="Chọn lớp học phù hợp"
                suffixIcon={
                  <ReadOutlined className="site-form-item-icon text-gray-400" />
                }
                className="custom-select-rounded" // AntD v5+ should allow direct rounding
                popupClassName="rounded-md"
                // Add focus styling similar to inputs if desired via global CSS or AntD theme config
              >
                <Option value="class_mon_wed_fri">Lớp tối Thứ 2-4-6</Option>
                <Option value="class_tue_thu">Lớp tối Thứ 3-5</Option>
                <Option value="class_weekend">Lớp cuối tuần</Option>
                <Option value="class_intensive">Lớp cấp tốc hàng ngày</Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full !h-12 !text-base !font-semibold !bg-teal-600 hover:!bg-teal-700 !border-teal-600 hover:!border-teal-700 !rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                GỬI ĐĂNG KÝ
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}
// Add this to your global CSS for focus styles if not using AntD theme provider:
// .focus\:\!border-teal-500:focus { border-color: #0d9488 !important; }
// .focus\:\!shadow-outline-teal:focus { box-shadow: 0 0 0 2px rgba(13, 148, 136, 0.2) !important; }

export default PromoRegisterForm
