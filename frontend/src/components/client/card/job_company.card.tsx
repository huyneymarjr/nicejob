import { callFetchJobsByCompanyId } from "@/config/api";
import { convertSlug, getLocationName, getTimeAgo } from "@/config/utils";
import { IJob } from "@/types/backend";
import { EnvironmentOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { Card, Col, Empty, Row, Spin } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "styles/client.module.scss";

const JobCard = () => {
  const [displayJob, setDisplayJob] = useState<IJob[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const id = params?.get("id");
  useEffect(() => {
    const fetchJobs = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const res = await callFetchJobsByCompanyId(id); // Fetch all jobs for the company
          if (res?.data) {
            setDisplayJob(res.data); // Set job list
            console.log(res.data)
          } else {
            setDisplayJob([]); // Handle empty data
          }
        } catch (error) {
          console.error("Error fetching jobs:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchJobs();
  }, [id]);

  const handleViewDetailJob = (item: IJob) => {
    const slug = convertSlug(item.name);
    navigate(`/job/${slug}?id=${item._id}`);
  };

  return (
    <div className={`${styles["card-job-section"]}`}>
      <div className={`${styles["job-content"]} overflow-y h-[500px]`}
      >
        {/* Thanh cuộn hỗ trợ bằng class `overflow-auto h-[500px]` */}
        <Spin spinning={isLoading} tip="Loading...">
          <Row gutter={[20, 20]}>
            {displayJob?.map((item) => (
              <Col span={24} key={item._id}>
                <Card
                  size="small"
                  title={null}
                  hoverable
                  onClick={() => handleViewDetailJob(item)}
                  className="hover:scale-[1.05] transition-transform duration-500 hover:z-20"
                >
                  <div className={styles["card-job-content"]}>
                    <div className={styles["card-job-left"]}>
                      <img
                        alt="company logo"
                        src={`${
                          import.meta.env.VITE_BACKEND_URL
                        }/images/company/${item?.company?.logo}`}
                        className="object-contain max-h-[80px]"
                      />
                    </div>
                    <div className={styles["card-job-right"]}>
                      <div className={styles["job-title"]}>{item.name}</div>
                      <div className={styles["job-location"]}>
                        <EnvironmentOutlined style={{ color: "#58aaab" }} />
                        &nbsp;
                        {getLocationName(item.location)}
                      </div>
                      <div>
                        <ThunderboltOutlined style={{ color: "orange" }} />
                        &nbsp;
                        {(item.salary + "")?.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )}{" "}
                        đ
                      </div>
                      <div className={"block float-right text-[#919191]"}>
                        {getTimeAgo(item.updatedAt)}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            ))}

            {!isLoading && (!displayJob || displayJob.length === 0) && (
              <div className={styles["empty"]}>
                <Empty description="Không có dữ liệu" />
              </div>
            )}
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default JobCard;
