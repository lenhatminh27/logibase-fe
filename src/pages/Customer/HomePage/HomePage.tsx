import { FaAddressCard, FaBook, FaCartShopping } from "react-icons/fa6"
import banner from "../../../assets/banner.jpg"
import IntroCard from "./IntroCard"
import { HiAcademicCap } from "react-icons/hi"
import { MdDiamond } from "react-icons/md"
import PromoRegisterForm from "./PromoRegisterForm"
import CourseOutline from "./CourseOutline"
import WhyChooseLogibase from "./WhyChooseLogibase"

function HomePage() {
  return (
    <div>
      <img
        src={banner}
        className="absolute -z-10 w-screen h-9/10 object-cover"
      />
      <main className="container">
        <div className="mt-[180px]">
          <h1 className="text-amber-400 !text-[80px]">KHOÁ HỌC XUẤT KHẨU</h1>
          <h1 className="text-white !text-[80px]">& LOGISTICS TỔNG HỢP</h1>
          <p className="text-white mt-[20px] text-[20px] !font-semibold">
            Bạn đã sẵn sàng để bắt đầu
          </p>
          <button className="flex items-center cursor-pointer mt-[30px] hover:scale-105">
            <FaCartShopping
              className="text-white border-2 border-white p-2"
              size={40}
            />
            <div className="bg-white h-full px-10 py-2">ĐĂNG KÝ</div>
          </button>
        </div>
        <div className="mt-[150px] px-10 flex mx-auto">
          <IntroCard
            icon={HiAcademicCap}
            title="Khoá học"
            description="Các khoá học tại Logibase đều được xây dựng dựa trên những kinh nghiệm thực tế giúp học viên tiếp thu hiệu quả nhất"
            bgColor="bg-green-500"
          />
          <IntroCard
            icon={FaBook}
            title="Thư viện"
            description="Được kiểm định bởi những chuyên gia, giảng viên có kinh nghiệm trong ngành xác thực."
            bgColor="bg-yellow-500"
          />
          <IntroCard
            icon={MdDiamond}
            title="PHƯƠNG PHÁP GIẢNG"
            description="Với tinh thần nhiệt huyết của đội ngũ, Logibase hi vọng truyền tải, chia sẻ kiến thức một cách cô đọng và dễ hiểu qua phương pháp giảng dạy độc đáo."
            bgColor="bg-blue-500"
          />
          <IntroCard
            icon={FaAddressCard}
            title="HỖ TRỢ"
            description="Đội ngũ Logibase cam kết sẽ hỗ trợ hết mình trong quá trình học tập để việc tiếp thu kiến thức hiệu quả nhất."
            bgColor="bg-purple-500"
          />
        </div>
        <PromoRegisterForm />
        <CourseOutline />
        <WhyChooseLogibase />
      </main>
    </div>
  )
}

export default HomePage
