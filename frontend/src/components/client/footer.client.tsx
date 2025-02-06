import { Divider } from "antd";
import { Link } from "react-router-dom";
import myLogo from "@/assets/Images/logo3.png";
import {
  FacebookOutlined,
  TwitterOutlined,
  YoutubeOutlined,
  LinkedinOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";

const Footer = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1201); // Cập nhật trạng thái mobile
    };

    window.addEventListener("resize", handleResize);
    handleResize(); 

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <footer id="footer" className="flex flex-col bg-[#222831] text-white py-4 w-full mx-auto">
      {/* Top section */}
      <div className="flex flex-wrap justify-between container mx-auto px-4 max-w-[1230px] mt-2">
        <div
          className={`w-full ${
            isMobile ? "flex flex-col items-center" : "sm:w-1/2 lg:w-1/5"
          } mb-4`}
        >
          <ul>
            <li className="mb-1 text-[#A7A7A7]">
              <img
                src={myLogo}
                alt="My Logo"
                className="flex justify-center"
                title="Nhóm 3"
                style={{ height: "40px" }}
              />
            </li>
            <li className="pl-10 text-white text-[#DEDEDE]">Việc làm tốt</li>
            <li className="mt-2 flex gap-4 pl-7">
              <FacebookOutlined className="text-[#a7a7a7] text-2xl cursor-pointer hover:text-white" />
              <TwitterOutlined className="text-[#a7a7a7] text-2xl cursor-pointer hover:text-white" />
              <YoutubeOutlined className="text-[#a7a7a7] text-2xl cursor-pointer hover:text-white" />
            </li>
          </ul>
        </div>
        {/* Menu items */}
        {isMobile ? (
          <>
            {/* About Section */}
            <div className="w-full mb-2">
              <button
                onClick={() => toggleMenu("about")}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Về chúng tôi
                <span >{openMenu === "about" ? "-" : "+"}</span>
              </button>
              {openMenu === "about" && (
                <ul className="mt-2 space-y-2 text-sm text-[#A7A7A7]">
                  <li>
                    <Link to="/" className="hover:text-white">
                      Trang chủ
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-white">
                      Giới thiệu
                    </Link>
                  </li>
                  <li>
                    <Link to="/services" className="hover:text-white">
                      Dịch vụ
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Programs Section */}
            <div className="w-full mb-2">
              <button
                onClick={() => toggleMenu("programs")}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Chương trình
                <span>{openMenu === "programs" ? "-" : "+"}</span>
              </button>
              {openMenu === "programs" && (
                <ul className="mt-2 space-y-2 text-sm text-[#A7A7A7]">
                  <li>
                    <Link to="/job" className="hover:text-gray-300">
                      Chuyên IT
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-gray-300">
                      Cuộc thi viết
                    </Link>
                  </li>
                  <li>
                    <Link to="/job" className="hover:text-gray-300">
                      Việc làm IT
                    </Link>
                  </li>
                  <li>
                    <Link to="/survey" className="hover:text-gray-300">
                      Khảo sát thường niên
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Policies Section */}
            <div className="w-full mb-2">
              <button
                onClick={() => toggleMenu("policies")}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Điều khoản
                <span>{openMenu === "policies" ? "-" : "+"}</span>
              </button>
              {openMenu === "policies" && (
                <ul className="mt-2 space-y-2 text-sm text-[#A7A7A7]">
                  <li>
                    <Link to="/privacy" className="hover:text-gray-300">
                      Quy định bảo mật
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:text-gray-300">
                      Quy chế hoạt động
                    </Link>
                  </li>
                  <li>
                    <Link to="/complaint" className="hover:text-gray-300">
                      Giải quyết khiếu nại
                    </Link>
                  </li>
                  <li>
                    <Link to="/agreement" className="hover:text-gray-300">
                      Thoả thuận sử dụng
                    </Link>
                  </li>
                </ul>
              )}
            </div>

            {/* Contact Section */}
            <div className="w-full mb-5">
              <button
                onClick={() => toggleMenu("contact")}
                className="flex justify-between items-center w-full text-left font-bold"
              >
                Liên hệ
              </button>
                <ul className="mt-2 space-y-2 text-sm">
                  <li className="mb-1 text-[#A7A7A7]">Hà Nội: 0904 031 397</li>
                  <li className="mb-1 text-[#A7A7A7]">
                    Email:{" "}
                    <a
                      href="mailto:cntt@hnue.edu.vn"
                      className="hover:text-gray-300"
                    >
                      cntt@hnue.edu.vn
                    </a>
                  </li>
                </ul>
            </div>
          </>
        ) : (
          <>
            {/* Column 1: About */}
            <div className="w-full sm:w-1/2 lg:w-1/5 mb-4">
              <h4 className="font-bold text-lg mb-2 text-[#DEDEDE]">
                Về chúng tôi
              </h4>
              <ul>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/" className="hover:text-white">
                    Trang chủ
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/about" className="hover:text-white">
                    Giới thiệu
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/services" className="hover:text-white">
                    Dịch vụ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Programs */}
            <div className="w-full sm:w-1/2 lg:w-1/5 mb-4">
              <h4 className="font-bold text-lg mb-2 text-[#DEDEDE]">
                Chương trình
              </h4>
              <ul>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/job" className="hover:text-white">
                    Chuyên IT
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/blog" className="hover:text-white">
                    Cuộc thi viết
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/job" className="hover:text-white">
                    Việc làm IT
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/survey" className="hover:text-white">
                    Khảo sát thường niên
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Policies */}
            <div className="w-full sm:w-1/2 lg:w-1/5 mb-4">
              <h4 className="font-bold text-lg mb-2 text-[#DEDEDE]">
                Điều khoản
              </h4>
              <ul>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/privacy" className="hover:text-white">
                    Quy định bảo mật
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/terms" className="hover:text-white">
                    Quy chế hoạt động
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/complaint" className="hover:text-white">
                    Giải quyết khiếu nại
                  </Link>
                </li>
                <li className="mb-1 text-[#A7A7A7]">
                  <Link to="/agreement" className="hover:text-white">
                    Thoả thuận sử dụng
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact Info */}
            <div className="w-full sm:w-1/2 lg:w-1/5 mb-4">
              <h4 className="font-bold text-lg mb-2 text-[#DEDEDE]">Liên hệ</h4>
              <ul>
                <li className="mb-1 text-[#A7A7A7]">Hà Nội: 0904 031 397</li>
                <li className="mb-1 text-[#A7A7A7]">
                  Email:{" "}
                  <a
                    href="mailto:cntt@hnue.edu.vn"
                    className="hover:text-white"
                  >
                    cntt@hnue.edu.vn
                  </a>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>

      {/* Bottom section */}
      <Divider style={{ borderColor: "#A7A7A7" }} />

      <div className="text-center text-sm text-[#A7A7A7] mt-0 mb-1">
        Copyright © Nhóm 3 Chuyên đề Dự án CNPM. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
