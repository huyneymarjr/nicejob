import { callFetchJob } from "@/config/api"
import {
    LOCATION_LIST,
    convertSlug,
    getLocationName,
    getTimeAgo,
} from "@/config/utils"
import { IJob } from "@/types/backend"
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons"
import { Card, Col, ConfigProvider, Empty, Pagination, Row, Spin } from "antd"
import { useState, useEffect } from "react"
import { isMobile } from "react-device-detect"
import { Link, useLocation, useNavigate } from "react-router-dom"
import styles from "styles/client.module.scss"
import dayjs from "dayjs"

interface IProps {
    showPagination?: boolean
}

const JobCard = (props: IProps) => {
    const { showPagination = false } = props

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const checkHome = useLocation()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(checkHome.pathname === "/" ? 6 : 8)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt")
    const navigate = useNavigate()
    const location = useLocation()
    useEffect(() => {
        fetchJob()
    }, [current, pageSize, filter, sortQuery, location.search])

    const fetchJob = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const searchParams = new URLSearchParams(location.search)
        const skills = searchParams.get("skills")
        const locations = searchParams.get("location")

        if (skills) {
            query += `&skills=${skills}`
        }
        if (locations) {
            query += `&location=${locations}`
        }
        const res = await callFetchJob(query)
        if (res && res.data) {
            setDisplayJob(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }

    const handleOnchangePage = (pagination: {
        current: number
        pageSize: number
    }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    }

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name)
        navigate(`/job/${slug}?id=${item._id}`)
    }

    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row gutter={[20, 20]}>
                        <Col span={24}>
                            <div
                                className={"flex justify-between items-center"}
                            >
                                <span className={"text-[20px] font-bold"}>
                                    Công Việc Mới Nhất
                                </span>
                                {!showPagination && (
                                    <Link
                                        to="job"
                                        className="text-[16px] hover:underline button-all-link-job"
                                    >
                                        Xem tất cả
                                    </Link>
                                )}
                            </div>
                        </Col>

                        {displayJob
                            ?.filter((item) => item.isActive)
                            .map((item) => {
                                return (
                                    <Col span={24} md={12} key={item._id}>
                                        <Card
                                            size="small"
                                            title={null}
                                            hoverable
                                            onClick={() =>
                                                handleViewDetailJob(item)
                                            }
                                            className="hover:scale-[1.05] transition-transform duration-500 hover:z-20 card-detail-job"
                                        >
                                            <div
                                                className={
                                                    styles["card-job-content"]
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles["card-job-left"]
                                                    }
                                                >
                                                    <img
                                                        alt="example"
                                                        src={`${
                                                            import.meta.env
                                                                .VITE_BACKEND_URL
                                                        }/images/company/${
                                                            item?.company?.logo
                                                        }`}
                                                        className="object-contain max-h-[80px]"
                                                    />
                                                </div>
                                                <div
                                                    className={
                                                        styles["card-job-right"]
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles["job-title"]
                                                        }
                                                    >
                                                        {item.name}
                                                    </div>
                                                    <div
                                                        className={
                                                            styles[
                                                                "job-location"
                                                            ]
                                                        }
                                                    >
                                                        <EnvironmentOutlined
                                                            style={{
                                                                color: "#58aaab",
                                                            }}
                                                        />
                                                        &nbsp;
                                                        {getLocationName(
                                                            item.location
                                                        )}
                                                    </div>
                                                    <div>
                                                        <ThunderboltOutlined
                                                            style={{
                                                                color: "orange",
                                                            }}
                                                        />
                                                        &nbsp;
                                                        {(
                                                            item.salary + ""
                                                        )?.replace(
                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                            ","
                                                        )}{" "}
                                                        đ
                                                    </div>
                                                    <div
                                                        className={
                                                            "block float-right text-[#919191]"
                                                        }
                                                    >
                                                        {getTimeAgo(
                                                            item.updatedAt
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </Col>
                                )
                            })}

                        {(!displayJob ||
                            (displayJob && displayJob.length === 0)) &&
                            !isLoading && (
                                <div className={styles["empty"]}>
                                    <Empty description="Không có dữ liệu" />
                                </div>
                            )}
                    </Row>
                    {showPagination && (
                        <>
                            <Row
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                                className="my-[30px]"
                            >
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(p: number, s: number) =>
                                        handleOnchangePage({
                                            current: p,
                                            pageSize: s,
                                        })
                                    }
                                />
                            </Row>
                        </>
                    )}
                </Spin>
            </div>
        </div>
    )
}

export default JobCard
