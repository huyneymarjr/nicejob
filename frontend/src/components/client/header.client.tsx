import { useState, useEffect } from "react"
import {
    HomeOutlined,
    ThunderboltOutlined,
    BankOutlined,
    ToolOutlined,
    CalculatorOutlined,
    DollarOutlined,
    BellOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    ContactsOutlined,
    DashboardOutlined,
    CloseOutlined,
    SolutionOutlined,
    AppstoreOutlined,
    LayoutOutlined,
    GlobalOutlined,
    FileTextOutlined,
} from "@ant-design/icons"
import { Avatar, Drawer, Dropdown, MenuProps, Space, message } from "antd"
import { Menu, ConfigProvider, notification, Form } from "antd"
import styles from "@/styles/client.module.scss"
import { isMobile } from "react-device-detect"
import { FaReact } from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { callLogout } from "@/config/api"
import { setLogoutAction } from "@/redux/slice/accountSlide"
import ManageAccount from "./modal/manage.account"
import myLogo from "@/assets/Images/logo3.png"
import { callUpdateResumeStatus, callFetchNotification } from "@/config/api"
import dayjs from "dayjs"
import { INotification } from "@/types/backend"

const Header = (props: any) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const isAuthenticated = useAppSelector(
        (state) => state.account.isAuthenticated
    )
    const user = useAppSelector((state) => state.account.user)
    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false)
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [current, setCurrent] = useState("home")
    const location = useLocation()

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false)

    const [dataInit, setDataInit] = useState(null)
    const [isSubmit, setIsSubmit] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1201) // Cập nhật trạng thái mobile
        }

        window.addEventListener("resize", handleResize)
        handleResize() // Gọi hàm ngay lập tức để thiết lập trạng thái ban đầu

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    useEffect(() => {
        setCurrent(location.pathname)
    }, [location])

    // const handleChangeStatus = async () => {
    //   setIsSubmit(true);

    //   const status = form.getFieldValue("status");
    //   const res = await callUpdateResumeStatus(dataInit?._id, status);
    //   if (res.data) {
    //     message.success("Cập nhật trạng thái hồ sơ thành công!");
    //     const currentTime = dayjs().format("DD-MM-YYYY HH:mm:ss");
    //     openNotification(dataInit?._id, currentTime);
    //     setDataInit(null);
    //     onClose(false);
    //     reloadTable();
    //   } else {
    //     notification.error({
    //       message: "Có lỗi xảy ra",
    //       description: res.message,
    //     });
    //   }

    //   setIsSubmit(false);
    // };
    const items: MenuProps["items"] = [
        {
            label: <Link to={"/"}>Trang Chủ</Link>,
            key: "/",
            icon: <GlobalOutlined />,
        },
        {
            label: <Link to={"/job"}>Top việc làm</Link>,
            key: "/job",
            icon: <SolutionOutlined />,
        },
        {
            label: <Link to={"/company"}>Top công ty</Link>,
            key: "/company",
            icon: <BankOutlined />,
        },
        {
            label: <label style={{ cursor: "pointer" }}>Công cụ</label>,
            key: "/tools",
            icon: <ToolOutlined />,
            children: [
                {
                    label: (
                        <Link to={"/calculate-personal-income-tax"}>
                            Tính thuế thu nhập cá nhân
                        </Link>
                    ),
                    key: "/calculate-personal-income-tax",
                    icon: <DollarOutlined />,
                },
                {
                    label: <Link to={"/cv-maker"}>Tạo CV</Link>,
                    key: "/cv-maker",
                    icon: <FileTextOutlined />,
                },
            ],
        },
    ]

    const onClick: MenuProps["onClick"] = (e) => {
        setCurrent(e.key)
    }

    const handleLogout = async () => {
        const res = await callLogout()
        if (res && res.data) {
            dispatch(setLogoutAction({}))
            message.success("Đăng xuất thành công")
            navigate("/")
        }
    }

    const itemsDropdown = [
        {
            label: (
                <label
                    style={{ cursor: "pointer", display: "block" }}
                    onClick={() => setOpenManageAccount(true)}
                >
                    Quản lý tài khoản
                </label>
            ),
            key: "manage-account",
            icon: <ContactsOutlined />,
        },
        ...(user?.role.name === "NORMAL_USER"
            ? []
            : [
                  {
                      label: (
                          <Link
                              style={{ display: "block" }}
                              to={
                                  user.role.name == "SUPER_ADMIN"
                                      ? "/admin"
                                      : "/admin/job"
                              }
                          >
                              Trang Quản Trị
                          </Link>
                      ),
                      key: "admin",
                      icon: <DashboardOutlined />,
                  },
              ]),
        {
            label: (
                <label
                    style={{ cursor: "pointer", display: "block" }}
                    onClick={() => handleLogout()}
                >
                    Đăng xuất
                </label>
            ),
            key: "logout",
            icon: <LogoutOutlined />,
        },
    ]

    const itemsMobiles = [...items, ...itemsDropdown]
    return (
        <>
            <div style={{ paddingTop: "64px" }}>
                <div
                    className={styles["header-section"]}
                    style={{
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        maxWidth: "100%",
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        zIndex: 999,
                        backgroundColor: "#222831",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                >
                    <div
                        className={styles["container"]}
                        style={{
                            width: "1260px",
                            maxWidth: "100%",
                            margin: "0 auto",
                        }}
                    >
                        {!isMobile ? (
                            <div
                                style={{
                                    display: "flex",
                                    gap: 30,
                                    alignItems: "center",
                                    width: "100%",
                                }}
                            >
                                {/* Giao diện desktop */}
                                <div className={styles["brand"]}>
                                    <Link to="/">
                                        <img
                                            src={myLogo}
                                            alt="My Logo"
                                            className="flex justify-center"
                                            title="Nhóm 3"
                                            style={{
                                                cursor: "pointer",
                                                height: "25px",
                                            }}
                                        />
                                    </Link>
                                </div>
                                <div className={styles["top-menu"]}>
                                    <ConfigProvider
                                        theme={{
                                            token: {
                                                colorPrimary: "#fff",
                                                colorBgContainer: "#222831",
                                                colorText: "#a7a7a7",
                                            },
                                            components: {
                                                Menu: {
                                                    itemSelectedBg: "#393e46",
                                                },
                                            },
                                        }}
                                    >
                                        <Menu
                                            selectedKeys={[current]}
                                            mode="horizontal"
                                            items={items}
                                            style={{ flexWrap: "wrap" }}
                                        />
                                    </ConfigProvider>
                                    <div className={styles["extra"]}>
                                        {isAuthenticated === false ? (
                                            <Link to={"/login"}>Đăng Nhập</Link>
                                        ) : (
                                            <Dropdown
                                                menu={{ items: itemsDropdown }}
                                                trigger={["click"]}
                                            >
                                                <Space
                                                    style={{
                                                        cursor: "pointer",
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                        textOverflow:
                                                            "ellipsis",
                                                    }}
                                                >
                                                    <span>
                                                        Xin chào {user?.name}
                                                    </span>
                                                    <Avatar>
                                                        {user?.name
                                                            ?.substring(0, 2)
                                                            ?.toUpperCase()}
                                                    </Avatar>
                                                </Space>
                                            </Dropdown>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div
                                className={styles["header-mobile"]}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "0 16px",
                                    width: "100%",
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    zIndex: 1000,
                                }}
                            >
                                {/* MenuFold ở góc trái với khoảng cách */}
                                <div style={{ flexShrink: 0 }}>
                                    <MenuFoldOutlined
                                        onClick={() => setOpenMobileMenu(true)}
                                    />
                                </div>

                                {/* Logo nằm chính giữa với giới hạn kích thước */}
                                <div
                                    className={styles["brand"]}
                                    style={{
                                        flexGrow: 1,
                                        textAlign: "center",
                                        maxWidth: "200px", // Giới hạn độ rộng logo
                                    }}
                                >
                                    <Link to="/">
                                        <img
                                            src={myLogo}
                                            alt="My Logo"
                                            style={{ height: "25px" }}
                                        />
                                    </Link>
                                </div>

                                {/* Avatar ở góc phải với khoảng cách */}
                                <div style={{ flexShrink: 0 }}>
                                    <Avatar>
                                        {user?.name
                                            ?.substring(0, 2)
                                            ?.toUpperCase()}
                                    </Avatar>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <Drawer
                    title={
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            <span>Menu</span>
                            <CloseOutlined
                                style={{
                                    fontSize: "18px",
                                    cursor: "pointer",
                                    color: "#a7a7a7",
                                }}
                                onClick={() => setOpenMobileMenu(false)}
                            />
                        </div>
                    }
                    placement="left"
                    closable={false} // Tắt nút close mặc định
                    onClose={() => setOpenMobileMenu(false)}
                    open={openMobileMenu}
                >
                    <Menu
                        onClick={onClick}
                        selectedKeys={[current]}
                        mode="inline"
                        items={itemsMobiles}
                    />
                </Drawer>
                <ManageAccount
                    open={openMangeAccount}
                    onClose={setOpenManageAccount}
                />
            </div>
        </>
    )
}

export default Header
