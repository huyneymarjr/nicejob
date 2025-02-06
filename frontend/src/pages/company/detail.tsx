import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { ICompany } from "@/types/backend"
import { callFetchCompanyById, callFetchJobById } from "@/config/api"
import styles from "styles/client.module.scss"
import parse from "html-react-parser"
import { Col, Divider, Row, Skeleton } from "antd"
import { EnvironmentOutlined } from "@ant-design/icons"
import JobCard from "@/components/client/card/job_company.card"
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api"
import axios from "axios"
import Title from "antd/es/typography/Title"
// const GOOGLE_MAPS_API_KEY = "AIzaSyBljdjg7mst5vF0CMr5ZWWt4IBtlWE9urU";
const ClientCompanyDetailPage = (props: any) => {
    const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSticky, setIsSticky] = useState<boolean>(true)
    //   const [coordinates, setCoordinates] = useState<{
    //     lat: number;
    //     lng: number;
    //   } | null>(null);

    let location = useLocation()
    let params = new URLSearchParams(location.search)
    const id = params?.get("id") // job id\

    const mapContainerStyle = {
        width: "100%",
        height: "400px",
    }
    const defaultCenter = { lat: 10.8231, lng: 106.6297 }

    useEffect(() => {
        const init = async () => {
            if (id) {
                setIsLoading(true)
                try {
                    // Fetch company details
                    const res = await callFetchCompanyById(id)
                    if (res?.data) {
                        setCompanyDetail(res.data)

                        // Fetch coordinates using Geocoding API
                        // if (res.data.address) {
                        //   const geocodeRes = await axios.get(
                        //     `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                        //       res.data.address
                        //     )}&key=${GOOGLE_MAPS_API_KEY}`
                        //   );

                        //   if (geocodeRes.data.status === "OK") {
                        //     const location = geocodeRes.data.results[0].geometry.location;
                        //     setCoordinates({ lat: location.lat, lng: location.lng });
                        //   } else {
                        //     console.error(
                        //       "Geocoding API error:",
                        //       geocodeRes.data.error_message
                        //     );
                        //   }
                        //}
                    }
                } catch (error) {
                    console.error(
                        "Error fetching company details or geocoding:",
                        error
                    )
                } finally {
                    setIsLoading(false)
                }
            }
        }
        init()
    }, [id])
    // useEffect(() => {
    //   const handleScroll = () => {
    //     const scrollThreshold = 300; // Set your desired scroll threshold
    //     const currentScroll = window.pageYOffset;

    //     // Make the element sticky if the current scroll position is past the threshold
    //     setIsSticky(currentScroll > scrollThreshold);
    //   };

    //   window.addEventListener("scroll", handleScroll);
    //   return () => {
    //     window.removeEventListener("scroll", handleScroll);
    //   };
    // }, []);

    return (
        <div
            className={`${styles["container"]} ${styles["detail-job-section"]}`}
            style={{ marginBottom: "20px" }}
        >
            {isLoading ? (
                <Skeleton />
            ) : (
                <Row gutter={[20, 0]}>
                    {companyDetail && companyDetail._id && (
                        <>
                            <Col span={24} md={24}>
                                <div className="flex h-[250px] items-center gap-4 bg-gradient-to-r from-[#222831] to-[#3A506B] p-5 rounded-xl">
                                    {/* Hình ảnh công ty */}
                                    <img
                                        alt="company logo"
                                        src={`${
                                            import.meta.env.VITE_BACKEND_URL
                                        }/images/company/${
                                            companyDetail?.logo
                                        }`}
                                        className="h-[170px] w-[170px]  object-contain  rounded-xl shadow-xl p-2 bg-white"
                                    />

                                    {/* Thông tin công ty */}
                                    <div className="flex flex-col text-white">
                                        <div className="text-2xl font-bold mb-2">
                                            {companyDetail.name}
                                        </div>
                                        <div
                                            className={`${styles["location"]} text-gray-400 text-lg`}
                                        >
                                            <EnvironmentOutlined
                                                style={{ color: "#58aaab" }}
                                            />
                                            &nbsp;{companyDetail?.address}
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                            </Col>
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <Col
                                    span={24}
                                    md={16}
                                    className="bg-white !px-0 !rounded-xl"
                                >
                                    <span className="text-xl text-white font-bold block py-2 pl-3 bg-gradient-to-r from-[#222831] to-[#3A506B] w-full !rounded-t-xl">
                                        Giới thiệu công ty
                                    </span>
                                    <div className="px-5 pb-5">
                                        {" "}
                                        {parse(
                                            companyDetail?.description ?? ""
                                        )}
                                    </div>

                                    {/* <div className="text-xl font-bold">
                                    <span className="mb-5">Địa chỉ</span>
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8805173558035!2d105.78079297695278!3d21.03746628061397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab355cc2239b%3A0x9ae247114fb38da3!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBTxrAgUGjhuqFtIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1732985123580!5m2!1svi!2s"
                                        width="100%"
                                        height="450"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div> */}
                                </Col>

                                <Col
                                    span={24}
                                    md={8}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        height: "50%",
                                    }}
                                    className="bg-white !px-0 !rounded-xl"
                                >
                                    <span className="text-xl text-white font-bold block py-2 pl-3 bg-gradient-to-r from-[#222831] to-[#3A506B] w-full !rounded-t-xl">
                                        Công việc đang tuyển dụng
                                    </span>
                                    <div
                                        className="scrollable-section !p-1"
                                        style={{
                                            // Set the maximum height
                                            flexGrow: 1,
                                            overflowY: "auto", // Enable vertical scrolling
                                            overflowX: "hidden",

                                        }}
                                    >
                                        <div className="flex flex-col">
                                            <JobCard />
                                        </div>
                                    </div>
                                </Col>
                            </div>
                            <Col
                                span={24}
                                md={16}
                                className="bg-white !px-0 rounded-xl mt-5"
                            >
                                <div className="text-xl font-bold">
                                    <span className="text-xl text-white font-bold block py-2 pl-3 bg-gradient-to-r from-[#222831] to-[#3A506B] w-full !rounded-t-xl ">
                                        Địa chỉ
                                    </span>
                                    <div className="px-3 py-3">
                                        <iframe
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.8805173558035!2d105.78079297695278!3d21.03746628061397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab355cc2239b%3A0x9ae247114fb38da3!2zVHLGsOG7nW5nIMSQ4bqhaSBI4buNYyBTxrAgUGjhuqFtIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1732985123580!5m2!1svi!2s"
                                            width="100%"
                                            height="450"
                                            style={{ border: 0 }}
                                            allowFullScreen
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </Col>
                        </>
                    )}
                </Row>
            )}
        </div>
    )
}
export default ClientCompanyDetailPage
