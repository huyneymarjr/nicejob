import {
    callFetchCompany,
    callFetchCompanyTotalJobs,
    callFetchLocationsJobs,
    callFetchSkillsJobs,
} from "@/config/api"
import { convertSlug } from "@/config/utils"
import { ICompany, IJob } from "@/types/backend"
import {
    Card,
    Col,
    ConfigProvider,
    Divider,
    Empty,
    Pagination,
    Row,
    Spin,
    Skeleton,
    Tag,
} from "antd"
import { RightOutlined, EnvironmentOutlined } from "@ant-design/icons"
import { useState, useEffect, useRef } from "react"
import { isMobile } from "react-device-detect"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"

interface IProps {
    showPagination?: boolean
}
const { Meta } = Card

const CompanyCard = (props: IProps) => {
    const { showPagination = false } = props

    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(
        null
    )
    const [jobCounts, setJobCounts] = useState<Record<string, number>>({})
    const [jobLocations, setLocations] = useState<Record<string, string[]>>({})
    const [jobSkills, setSkills] = useState<Record<string, string[]>>({})
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const checkHome = useLocation()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(checkHome.pathname === "/" ? 6 : 6)
    const [total, setTotal] = useState(0)
    const [filter, setFilter] = useState("")
    const [sortQuery, setSortQuery] = useState("sort=-updatedAt")
    const navigate = useNavigate()
    const hasFetchedDetails = useRef(false)
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1201)
        }

        window.addEventListener("resize", handleResize)
        handleResize()

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    const fetchCompany = async () => {
        setIsLoading(true)
        let query = `current=${current}&pageSize=${pageSize}`
        if (filter) {
            query += `&${filter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }

        const res = await callFetchCompany(query)
        if (res && res.data) {
            setDisplayCompany(res.data.result)
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }
    useEffect(() => {
        fetchCompany()
    }, [current, pageSize, filter, sortQuery])

    useEffect(() => {
        if (
            !displayCompany ||
            displayCompany.length === 0
            // ||
            // hasFetchedDetails.current
        )
            return
        // hasFetchedDetails.current = true
        fetchJobDetails(displayCompany)
    }, [displayCompany])

    const fetchJobDetails = async (companies: ICompany[]) => {
        const counts: Record<string, number> = {}
        const locations: Record<string, string[]> = {}
        const skills: Record<string, string[]> = {} // Ad
        const jobTitles: Record<string, Set<string>> = {}
        const locationMapping: Record<string, string> = {
            HANOI: "Hà Nội",
            HOCHIMINH: "Hồ Chí Minh",
            DANANG: "Đà Nẵng",
            OTHER: "Others",
        }

        try {
            // Sử dụng Promise.all để xử lý các API đồng thời
            const promises = companies.map(async (company) => {
                if (!company._id) return
                try {
                    const [jobCountRes, locationsRes, skillsRes] =
                        await Promise.all([
                            callFetchCompanyTotalJobs(company._id),
                            callFetchLocationsJobs(company._id),
                            callFetchSkillsJobs(company._id),
                        ])
                    //count job
                    counts[company._id] = jobCountRes?.data?.totalJobs || 0

                    const uniqueLocations = Array.from(
                        new Set(locationsRes?.data || [])
                    )
                    const formattedLocations = uniqueLocations.map(
                        (loc: string) => locationMapping[loc] || loc
                    )

                    if (formattedLocations.length > 3) {
                        locations[company._id] = [
                            ...formattedLocations.slice(0, 2),
                            "Others",
                        ]
                    } else {
                        locations[company._id] = formattedLocations
                    }

                    //skills job
                    const flattenedSkills = skillsRes?.data?.flat() || []
                    skills[company._id] = Array.from(new Set(flattenedSkills))
                    const jobTitle = skills[company._id]
                    jobTitles[company._id] = new Set([
                        ...(jobTitles[company._id] || []),
                        ...jobTitle,
                    ])
                } catch (err) {
                    console.error(
                        `Error fetching data for company ${company._id}:`,
                        err
                    )
                }
            })

            await Promise.all(promises)
            setJobCounts(counts)
            setLocations(locations)
            setSkills(skills)
        } catch (error) {
            console.error("Error in fetchJobDetails:", error)
        }
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

    const handleViewDetailJob = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name)
            navigate(`/company/${slug}?id=${item._id}`)
        }
    }

    return (
        <div className={"w-full"}>
            <div className={""}>
                <Spin spinning={isLoading} tip="Loading...">
                    <Row className={"flex flex-col gap-5"}>
                        <Col>
                            <div
                                className={"flex justify-between items-center"}
                            >
                                <span className={"text-[20px] font-bold"}>
                                    Nhà tuyển dụng hàng đầu
                                </span>
                                {!showPagination && (
                                    <Link
                                        to="company"
                                        className="text-[16px] hover:underline button-all-link"
                                    >
                                        Xem tất cả
                                    </Link>
                                )}
                            </div>
                        </Col>
                        <div
                            className={`flex ${
                                isMobile
                                    ? "flex-col"
                                    : "grid grid-cols-1 md:grid-cols-3"
                            } gap-5 w-full`}
                        >
                            {displayCompany?.map((item) => {
                                return (
                                    <Col key={item._id} className="w-full">
                                        <ConfigProvider
                                            theme={{
                                                token: {
                                                    padding: 0,
                                                    paddingLG: 0,
                                                },
                                            }}
                                        >
                                            <Card
                                                onClick={() =>
                                                    handleViewDetailJob(item)
                                                }
                                                className="card-detail w-full cursor-pointer hover:scale-[1.05] transition-transform duration-500 border-[#dfdfdf] max-h-[400px] h-[400px] flex flex-col justify-between"
                                                hoverable
                                                cover={
                                                    <div
                                                        className={
                                                            "rounded-lg "
                                                        }
                                                    >
                                                        <div className="relative max-h-[150px] h-[150px] w-[150px] object-contain mx-auto my-4 shadow-lg rounded-md bg-white">
                                                            <img
                                                                alt="example"
                                                                src={`${
                                                                    import.meta
                                                                        .env
                                                                        .VITE_BACKEND_URL
                                                                }/images/company/${
                                                                    item?.logo
                                                                }`}
                                                                className=" object-contain absolute w-[100px] h-[100px]"
                                                                style={{
                                                                    top: "50%",
                                                                    left: "50%",
                                                                    transform:
                                                                        "translate(-50%, -50%)",
                                                                }} // Đặt hình ảnh ở giữa
                                                            />
                                                        </div>
                                                        <Meta
                                                            title={item.name}
                                                            className="text-center"
                                                        />{" "}
                                                        <div className="flex flex-wrap justify-center gap-2 p-5">
                                                            {jobSkills[
                                                                item._id ?? ""
                                                            ] ? (
                                                                jobSkills[
                                                                    item._id ??
                                                                        ""
                                                                ]?.map(
                                                                    (
                                                                        skill,
                                                                        index
                                                                    ) => (
                                                                        <Tag
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="skill-badge bg-[#F7F7F7] rounded-xl px-2"
                                                                        >
                                                                            {
                                                                                skill
                                                                            }
                                                                        </Tag>
                                                                    )
                                                                )
                                                            ) : (
                                                                <Skeleton.Input
                                                                    active
                                                                    size="small"
                                                                    style={{
                                                                        width: 100,
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                }
                                            >
                                                <div className="flex justify-between items-center p-4 rounded-md bg-gradient-to-r from-[#f7f7f7] to-whitesmoke">
                                                    <span className="font-medium">
                                                        <EnvironmentOutlined
                                                            style={{
                                                                color: "#ff4d4f",
                                                            }}
                                                        />{" "}
                                                        {jobLocations[
                                                            item._id ?? ""
                                                        ] ? (
                                                            jobLocations[
                                                                item._id ?? ""
                                                            ]
                                                                ?.slice(0, 3)
                                                                .join(" - ") ||
                                                            "Không có địa điểm"
                                                        ) : (
                                                            <Skeleton.Input
                                                                active
                                                                size="small"
                                                                style={{
                                                                    width: 100,
                                                                }}
                                                            />
                                                        )}{" "}
                                                    </span>
                                                    <span className="font-medium">
                                                        {jobCounts[
                                                            item._id ?? ""
                                                        ] !== undefined ? (
                                                            <>
                                                                {jobCounts[
                                                                    item._id ??
                                                                        ""
                                                                ] || 0}{" "}
                                                                Việc làm{" "}
                                                                <RightOutlined />
                                                            </>
                                                        ) : (
                                                            <Skeleton.Input
                                                                active
                                                                size="small"
                                                                style={{
                                                                    width: 50,
                                                                }}
                                                            />
                                                        )}
                                                    </span>
                                                </div>
                                            </Card>
                                        </ConfigProvider>
                                    </Col>
                                )
                            })}
                        </div>
                        {(!displayCompany ||
                            (displayCompany && displayCompany.length === 0)) &&
                            !isLoading && (
                                <div className={""}>
                                    <Empty description="Không có dữ liệu" />
                                </div>
                            )}
                    </Row>
                    {showPagination && (
                        <>
                            <Row className="flex justify-center  my-5">
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

export default CompanyCard
