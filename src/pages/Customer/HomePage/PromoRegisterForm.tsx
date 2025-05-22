// src/components/PromoRegisterForm.tsx
import React from "react"
import { Form, Input, Button, Typography, Select, Row, Col } from "antd"
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ReadOutlined,
} from "@ant-design/icons" // Added ReadOutlined for class

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const PromoRegisterForm: React.FC = () => {
  const [form] = Form.useForm()

  const onFinish = (values: any) => {
    console.log("Form values:", values)
    // Handle promo registration submission (e.g., send to CRM, mailing list)
  }

  // Custom Tailwind classes for input styles if needed, or rely on AntD defaults
  // The image shows very flat inputs. AntD v5 default inputs are fairly flat.
  // If more specific styling is needed, you might add classes like:
  // const inputClasses = "bg-gray-100 border-0 border-b-2 border-gray-300 focus:border-blue-500 focus:ring-0";

  return (
    <div className="w-full mx-auto mt-10">
      {" "}
      {/* Container for the component */}
      <Row gutter={[0, 0]} className="shadow-xl rounded-lg overflow-hidden">
        {" "}
        {/* Use Row for two columns */}
        {/* Left Column - Promotional Text */}
        <Col
          xs={24}
          md={12}
          className="bg-yellow-400 p-8 md:p-12 flex flex-col justify-center items-center text-center">
          <Title level={2} className="!text-white !font-bold !mb-4">
            NHANH TAY ĐĂNG KÝ
          </Title>
          <Paragraph className="!text-white !text-xl !font-semibold !mb-2">
            <span className="text-black">GIẢM GIÁ 30%</span> CHO NGƯỜI MỚI
          </Paragraph>
          <div className="w-20 h-1 bg-white my-4"></div> {/* Separator line */}
          <Title level={3} className="!text-white !font-bold">
            KHUYẾN MÃI CÓ HẠN!!!
          </Title>
        </Col>
        {/* Right Column - Form */}
        <Col xs={24} md={12} className="bg-white p-8 md:p-12">
          <Title
            level={3}
            className="text-center !font-bold !text-gray-800 mb-8">
            THÔNG TIN ĐĂNG KÝ
          </Title>
          <Form
            form={form}
            name="promo_register"
            onFinish={onFinish}
            layout="vertical"
            requiredMark={false}
            size="large">
            <Form.Item
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
              className="!mb-5">
              <Input
                prefix={
                  <UserOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Họ và tên"
                // className={inputClasses} // Apply custom classes if defined
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập địa chỉ email!" },
                { type: "email", message: "Địa chỉ email không hợp lệ!" },
              ]}
              className="!mb-5">
              <Input
                prefix={
                  <MailOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Địa chỉ email..."
                // className={inputClasses}
              />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
              className="!mb-5">
              <Input
                prefix={
                  <PhoneOutlined className="site-form-item-icon text-gray-400" />
                }
                placeholder="Điện thoại..."
                // className={inputClasses}
              />
            </Form.Item>

            <Form.Item
              name="courseSelection"
              rules={[{ required: true, message: "Vui lòng chọn lớp!" }]}
              className="!mb-6">
              <Select
                placeholder="Lớp tối 3-5 hàng tuần"
                suffixIcon={
                  <ReadOutlined className="site-form-item-icon text-gray-400" />
                } // Example icon
                // className={inputClasses} // Select might need different styling for background
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
                className="w-full !h-12 !text-base !font-semibold bg-blue-500 hover:bg-blue-600" // Adjusted button color
              >
                ĐĂNG KÝ NGAY!
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  )
}

export default PromoRegisterForm
